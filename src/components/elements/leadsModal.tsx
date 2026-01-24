/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

export function LeadModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        cep: "", street: "", number: "", city: "", state: "",
        campaignId: "1"
    });

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        city: data.localidade,
                        state: data.uf
                    }));
                    toast.success("Endereço encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro desconhecido");

            toast.success("Cadastro realizado com sucesso!", {
                description: "Nossa equipe entrará em contato em breve.",
            });
            setOpen(false);
            setFormData({ ...formData, firstName: "", email: "" });
        } catch (error: any) {
            toast.error("Erro ao cadastrar", { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-auto py-4 px-8 bg-[var(--ast-color-0)] hover:bg-[var(--ast-color-1)] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group">
                    Cadastre-se em nossas campanhas
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-[var(--ast-color-0)]">
                        Garanta sua doação agora
                    </DialogTitle>
                    <DialogDescription>
                        Preencha seus dados abaixo. É rápido e seguro.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="João" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Silva" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="joao@empresa.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" required />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1 space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input id="cep" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} maxLength={9} required placeholder="00000-000" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="street">Rua</Label>
                            <Input id="street" name="street" value={formData.street} onChange={handleChange} required className="bg-gray-50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input id="number" name="number" value={formData.number} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleChange} readOnly className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">UF</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleChange} readOnly className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-[var(--ast-color-0)] hover:bg-[var(--ast-color-1)] text-white font-bold h-12 text-lg mt-4">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Inscrição Gratuita"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}