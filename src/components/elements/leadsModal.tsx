/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

// 1. Definição do Esquema de Validação
const formSchema = z.object({
    firstName: z.string().min(2, "Mínimo de 2 caracteres"),
    lastName: z.string().min(2, "Mínimo de 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(14, "Telefone incompleto").max(15, "Telefone inválido"), // (11) 99999-9999
    cep: z.string().min(9, "CEP inválido"), // 00000-000
    street: z.string().min(3, "Endereço obrigatório"),
    number: z.string().min(1, "Número obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(2, "UF obrigatória"),
    campaignId: z.string()
});

type FormData = z.infer<typeof formSchema>;

export function LeadModal() {
    const [open, setOpen] = useState(false);

    // 2. Configuração do React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "", lastName: "", email: "", phone: "",
            cep: "", street: "", number: "", city: "", state: "",
            campaignId: "1"
        }
    });

    // Funções de Máscara (Formatação Visual)
    const normalizePhone = (value: string) => {
        return value.replace(/[\D]/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})(\d+?)/, '$1');
    }

    const normalizeCep = (value: string) => {
        return value.replace(/\D/g, "")
            .replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
    }

    // Busca de CEP Automática
    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setValue("street", data.logradouro);
                    setValue("city", data.localidade);
                    setValue("state", data.uf);
                    // Move o foco para o número (UX)
                    document.getElementById("number")?.focus();
                    toast.success("Endereço encontrado!");
                } else {
                    toast.error("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            }
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const responseData = await res.json();

            if (!res.ok) throw new Error(responseData.message || "Erro desconhecido");

            toast.success("Cadastro realizado com sucesso!", {
                description: "Nossa equipe entrará em contato em breve.",
            });
            setOpen(false);
            reset(); // Limpa o formulário
        } catch (error: any) {
            toast.error("Erro ao cadastrar", { description: error.message });
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Nome</Label>
                            <Input
                                id="firstName"
                                placeholder="João"
                                {...register("firstName")}
                                className={errors.firstName ? "border-red-500" : ""}
                            />
                            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Sobrenome</Label>
                            <Input
                                id="lastName"
                                placeholder="Silva"
                                {...register("lastName")}
                                className={errors.lastName ? "border-red-500" : ""}
                            />
                            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="joao@empresa.com"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input
                            id="phone"
                            placeholder="(11) 99999-9999"
                            {...register("phone")}
                            onChange={(e) => {
                                e.target.value = normalizePhone(e.target.value);
                            }}
                            className={errors.phone ? "border-red-500" : ""}
                            maxLength={15}
                        />
                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1 space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                                id="cep"
                                placeholder="00000-000"
                                {...register("cep")}
                                onChange={(e) => {
                                    e.target.value = normalizeCep(e.target.value);
                                }}
                                onBlur={handleCepBlur}
                                maxLength={9}
                                className={errors.cep ? "border-red-500" : ""}
                            />
                            {errors.cep && <span className="text-red-500 text-xs">{errors.cep.message}</span>}
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="street">Rua</Label>
                            <Input
                                id="street"
                                {...register("street")}
                                className={`bg-gray-50 ${errors.street ? "border-red-500" : ""}`}
                            />
                            {errors.street && <span className="text-red-500 text-xs">{errors.street.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="number">Número</Label>
                            <Input
                                id="number"
                                {...register("number")}
                                className={errors.number ? "border-red-500" : ""}
                            />
                            {errors.number && <span className="text-red-500 text-xs">{errors.number.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                                id="city"
                                {...register("city")}
                                readOnly
                                className="bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">UF</Label>
                            <Input
                                id="state"
                                {...register("state")}
                                readOnly
                                className="bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Select de Campanha integrado ao React Hook Form */}
                    <div className="hidden">
                        <Input {...register("campaignId")} value="1" type="hidden" />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--ast-color-0)] hover:bg-[var(--ast-color-1)] text-white font-bold h-12 text-lg mt-4">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Inscrição Gratuita"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}