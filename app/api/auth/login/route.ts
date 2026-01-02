import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; // ⚠️ Change this later!

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,
      { expiresIn: "1h" } // token valid for 1 hour
    );

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
