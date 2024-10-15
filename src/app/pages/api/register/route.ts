import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email dan password diperlukan" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Registrasi berhasil" }, { status: 201 });
  } catch (error) {
    console.error("Registrasi gagal:", error);
    return NextResponse.json({ message: "Registrasi gagal" }, { status: 500 });
  }
}
