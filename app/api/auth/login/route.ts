import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return Response.json({ error: "Invalid password" }, { status: 401 });

  const token = generateToken(user.id);

  return Response.json({ success: true, token });
}
