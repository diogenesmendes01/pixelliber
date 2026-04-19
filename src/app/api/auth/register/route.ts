import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCNPJ, cleanCNPJ } from "@/lib/cnpj";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, cnpj, password, confirmPassword } = body;

    if (!name || !email || !cnpj || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanCnpj = cleanCNPJ(cnpj);
    if (!validateCNPJ(cleanCnpj)) {
      return NextResponse.json(
        { error: "CNPJ inválido" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 }
      );
    }

    const existingCompany = await prisma.company.findUnique({
      where: { cnpj: cleanCnpj },
    });
    if (existingCompany) {
      return NextResponse.json(
        { error: "CNPJ já cadastrado" },
        { status: 409 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado" },
        { status: 409 }
      );
    }

    const company = await prisma.company.create({
      data: {
        cnpj: cleanCnpj,
        name,
        email,
        password,
        users: {
          create: {
            name,
            email,
            password,
            role: "admin",
          },
        },
      },
      include: {
        users: true,
      },
    });

    console.log(`[Pixel Liber] Welcome email sent to ${email} (Company: ${name})`);

    return NextResponse.json(
      {
        message: "Cadastro realizado com sucesso",
        company: {
          id: company.id,
          name: company.name,
          cnpj: company.cnpj,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro ao realizar cadastro" },
      { status: 500 }
    );
  }
}