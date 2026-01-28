import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Criar novo Lead
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, wordpressPostId } = body;

        const existingLead = await prisma.lead.findUnique({
            where: { email },
        });

        if (existingLead) {
            return NextResponse.json({ message: "Este e-mail já está cadastrado." }, { status: 409 });
        }

        const lead = await prisma.lead.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                wordpressPostId
            }
        });

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar lead:", error);
        return NextResponse.json({ message: "Erro interno no servidor." }, { status: 500 });
    }
}

// GET: Listar Leads
export async function GET() {
    // REMOVI A LÓGICA DE CAMPANHA POIS O CAMPO FOI REMOVIDO DO MODEL
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar leads" }, { status: 500 });
    }
}