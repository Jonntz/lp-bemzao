import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Criar novo Lead
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, cep, street, number, city, state, campaignId } = body;

        // Validação básica de unicidade
        const existingLead = await prisma.lead.findUnique({
            where: { email },
        });

        if (existingLead) {
            return NextResponse.json({ message: "Este e-mail já está cadastrado." }, { status: 409 });
        }

        // Criação do Lead
        const lead = await prisma.lead.create({
            data: {
                firstName, lastName, email, phone,
                cep, street, number, city, state,
                campaignId: Number(campaignId) // Assumindo ID numérico
            }
        });

        return NextResponse.json(lead, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar lead:", error);
        return NextResponse.json({ message: "Erro interno no servidor." }, { status: 500 });
    }
}

// GET: Listar Leads (Com filtro)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');

    const where = campaignId ? { campaignId: Number(campaignId) } : {};

    try {
        const leads = await prisma.lead.findMany({
            where,
            include: { campaign: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar leads" }, { status: 500 });
    }
}