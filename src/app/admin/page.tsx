"use client"
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    campaign: { name: string };
    createdAt: string;
}

export default function AdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filter, setFilter] = useState("");

    const fetchLeads = async (campaignId?: string) => {
        const url = campaignId ? `/api/leads?campaignId=${campaignId}` : '/api/leads';
        const res = await fetch(url);
        const data = await res.json();
        setLeads(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchLeads(filter === "all" ? "" : filter);
        };
        fetchData();
    }, [filter]);

    return (
        <div className="p-8 min-h-screen bg-[var(--ast-color-5)]">
            <Card className="max-w-6xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestão de Leads</CardTitle>
                    <div className="w-64">
                        <Select onValueChange={setFilter} defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por Campanha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Campanhas</SelectItem>
                                <SelectItem value="1">Orgânico / Site</SelectItem>
                                <SelectItem value="2">Instagram Ads</SelectItem>
                                <SelectItem value="3">Google Search</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Campanha</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>{lead.phone}</TableCell>
                                    <TableCell className="font-medium text-[var(--ast-color-0)]">
                                        {lead.campaign?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}