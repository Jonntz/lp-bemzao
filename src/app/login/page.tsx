// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions"; // <--- MUDAR AQUI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setLoading(true);

        // Chama a Server Action
        const success = await loginAction(formData);

        if (success) {
            toast.success("Acesso autorizado!");
            router.push("/admin"); // Redireciona para o admin
        } else {
            toast.error("Senha incorreta.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <CardTitle>Área Administrativa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Senha de Acesso</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className="text-center text-lg"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? "Verificando..." : "Entrar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}