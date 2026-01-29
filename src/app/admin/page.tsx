/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Importação da lib de Excel
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Import do Input
import { Button } from "@/components/ui/button"; // Import do Button
import { toast } from "sonner";
import { Download, Search, Filter } from "lucide-react"; // Ícones para UX

interface Lead {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    wordpressPostId?: string;
    createdAt: string;
}

interface WordPressPost {
    id: number;
    title: {
        rendered: string;
    };
    link: string;
}

export default function AdminPage() {
    const WORDPRESS_API_URL = "https://bemzao.com/wp-json/wp/v2/posts";

    // Estados para dados
    const [allLeads, setAllLeads] = useState<Lead[]>([]); // Todos os leads do banco
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]); // Leads exibidos na tela
    const [posts, setPosts] = useState<WordPressPost[]>([]);

    // Estados para filtros
    const [campaignFilter, setCampaignFilter] = useState("all");
    const [phoneFilter, setPhoneFilter] = useState("");

    // 1. Buscar Leads (Traz todos para filtrar no front)
    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads'); // Removemos o filtro da URL para filtrar localmente
            const data = await res.json();
            setAllLeads(data);
            setFilteredLeads(data); // Inicialmente mostra tudo
        } catch (error) {
            console.error(error);
            toast.error("Erro ao buscar leads.");
        }
    };

    // 2. Buscar Campanhas do WP
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(WORDPRESS_API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                }
            } catch (error) {
                toast.error("Não foi possível carregar a lista de campanhas.");
            }
        };

        fetchPosts();
        fetchLeads();
    }, []);

    // 3. Lógica de Filtragem (Executa sempre que os filtros ou os dados mudam)
    useEffect(() => {
        let result = allLeads;

        // Filtro de Campanha
        if (campaignFilter && campaignFilter !== "all") {
            result = result.filter(lead => lead.wordpressPostId === campaignFilter);
        }

        // Filtro de Telefone
        if (phoneFilter) {
            const search = phoneFilter.replace(/\D/g, ""); // Remove formatação (parenteses, traços) para busca
            result = result.filter(lead => {
                const cleanPhone = lead.phone.replace(/\D/g, "");
                return cleanPhone.includes(search);
            });
        }

        setFilteredLeads(result);
    }, [campaignFilter, phoneFilter, allLeads]);

    // Helper para pegar nome da campanha pelo ID
    const getCampaignName = (id?: string) => {
        if (!id) return "Geral (Sem campanha)";
        const post = posts.find(p => String(p.id) === id);
        // Remove tags HTML do título que vem do WP
        return post ? post.title.rendered.replace(/<[^>]*>?/gm, "") : `${id}`;
    };

    // 4. Função de Exportar Excel
    const handleExportExcel = () => {
        if (filteredLeads.length === 0) {
            toast.warning("Nenhum dado para exportar.");
            return;
        }

        // Formata os dados para o Excel (Deixa bonito, com cabeçalhos em PT-BR)
        const dataToExport = filteredLeads.map(lead => ({
            "Nome Completo": `${lead.firstName} ${lead.lastName}`,
            "E-mail": lead.email,
            "Telefone": lead.phone,
            "Campanha": getCampaignName(lead.wordpressPostId),
            "Data de Cadastro": new Date(lead.createdAt).toLocaleDateString('pt-BR') + ' ' + new Date(lead.createdAt).toLocaleTimeString('pt-BR')
        }));

        // Cria a planilha
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

        // Ajusta largura das colunas (Opcional, mas fica melhor)
        const wscols = [
            { wch: 30 }, // Nome
            { wch: 30 }, // Email
            { wch: 20 }, // Telefone
            { wch: 40 }, // Campanha
            { wch: 20 }, // Data
        ];
        worksheet['!cols'] = wscols;

        // Gera o arquivo
        XLSX.writeFile(workbook, `leads_export_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success("Download iniciado!");
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <Card className="max-w-7xl mx-auto shadow-md">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-2xl font-bold text-gray-800">Gestão de Leads</CardTitle>

                        <Button
                            onClick={handleExportExcel}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                        >
                            <Download size={16} />
                            Exportar Excel ({filteredLeads.length})
                        </Button>
                    </div>

                    {/* Área de Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-gray-100 p-4 rounded-lg">

                        {/* Filtro Campanha */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Filter size={14} /> Campanha
                            </label>
                            <Select onValueChange={setCampaignFilter} defaultValue="all">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Todas as campanhas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as campanhas</SelectItem>
                                    {posts.map((post) => (
                                        <SelectItem key={post.id} value={String(post.title.rendered)}>
                                            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro Telefone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Search size={14} /> Buscar Telefone
                            </label>
                            <Input
                                placeholder="Ex: 1199999..."
                                value={phoneFilter}
                                onChange={(e) => setPhoneFilter(e.target.value)}
                                className="bg-white"
                            />
                        </div>

                        {/* Contador Visual */}
                        <div className="flex items-end pb-2">
                            <span className="text-sm text-gray-500">
                                Mostrando <strong>{filteredLeads.length}</strong> de <strong>{allLeads.length}</strong> cadastros.
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>Campanha</TableHead>
                                    <TableHead>Data</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead) => (
                                        <TableRow key={lead.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">{lead.firstName} {lead.lastName}</TableCell>
                                            <TableCell>{lead.email}</TableCell>
                                            <TableCell>{lead.phone}</TableCell>
                                            <TableCell className="text-[var(--ast-color-0)]">
                                                {/* Agora usamos a função auxiliar para mostrar o nome real */}
                                                {getCampaignName(lead.wordpressPostId)}
                                            </TableCell>
                                            <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Nenhum resultado encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}