"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const password = formData.get("password");

    if (password === process.env.ADMIN_PASSWORD) {
        const user = { role: "admin" };
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas
        const session = await encrypt({ user, expires });

        // Define o cookie no servidor
        (await cookies()).set("session", session, { expires, httpOnly: true });

        return true;
    }
    return false;
}

export async function logoutAction() {
    // Destrói o cookie
    (await cookies()).set("session", "", { expires: new Date(0) });

    // Redireciona para login (feito no servidor)
    redirect("/login");
}