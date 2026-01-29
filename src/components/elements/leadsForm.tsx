/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SuccessModal } from "./successModal";

const WORDPRESS_API_URL = "https://bemzao.com/wp-json/wp/v2/posts";

interface WordPressPost {
    id: number;
    title: {
        rendered: string;
    };
    link: string;
}

const formSchema = z.object({
    firstName: z.string().min(2, "Mínimo de 2 caracteres"),
    lastName: z.string().min(2, "Mínimo de 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(14, "Telefone incompleto").max(15, "Telefone inválido"),
    wordpressPostId: z.string().optional(),
    isOver18: z.literal(true, {
        message: "Você precisa confirmar que é maior de 18 anos.",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function LeadForm() {
    const [posts, setPosts] = useState<WordPressPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Estado simples apenas para controlar se o modal está visível
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "", lastName: "", email: "", phone: "",
            wordpressPostId: "",
            isOver18: true,
        }
    });

    useEffect(() => {
        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                const response = await fetch(WORDPRESS_API_URL);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                }
            } catch (error) {
                console.error("Erro ao buscar posts do WP:", error);
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchPosts();
    }, []);

    const normalizePhone = (value: string) => {
        return value.replace(/[\D]/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})(\d+?)/, '$1');
    }

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const responseData = await res.json();

            if (!res.ok) throw new Error(responseData.message || "Erro desconhecido");

            reset();
            setShowSuccessModal(true); // Ativa o modal isolado

        } catch (error: any) {
            toast.error("Erro ao cadastrar", { description: error.message });
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <div className="text-2xl font-bold text-[var(--ast-color-0)]">
                    Garanta sua doação agora
                </div>
                <div className="text-gray-500">
                    Preencha seus dados abaixo. É rápido e seguro.
                </div>
            </div>

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
                            register("phone").onChange(e);
                        }}
                        className={errors.phone ? "border-red-500" : ""}
                        maxLength={15}
                    />
                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                </div>

                <div className="space-y-2">
                    <Label>Interesse em qual campanha? (Opcional)</Label>
                    <Select onValueChange={(val) => setValue("wordpressPostId", val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingPosts ? "Carregando campanhas..." : "Selecione uma campanha..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {posts.map((post) => (
                                <SelectItem key={post.id} value={String(post.id)}>
                                    <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                </SelectItem>
                            ))}
                            {posts.length === 0 && !loadingPosts && (
                                <SelectItem value="none" disabled>Nenhum artigo encontrado</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="pt-2">
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="isOver18"
                            {...register("isOver18")}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--ast-color-0)] focus:ring-[var(--ast-color-0)] cursor-pointer accent-[var(--ast-color-0)]"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="isOver18"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
                            >
                                Sou maior de 18 anos e concordo com os termos.
                            </label>
                            <p className="text-xs text-muted-foreground">
                                É necessário ser maior de idade para participar.
                            </p>
                        </div>
                    </div>
                    {errors.isOver18 && (
                        <p className="text-red-500 text-xs mt-1 ml-7">
                            {errors.isOver18.message}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--ast-color-0)] hover:bg-[var(--ast-color-1)] text-white font-bold h-12 text-lg mt-4">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Inscrição Gratuita"}
                </Button>
            </form>

            {/* --- COMPONENTE SEPARADO AQUI --- */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
        </div>
    );
}