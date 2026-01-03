import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error - quizAttempt type missing in generated client but exists at runtime
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        quiz: {
          select: {
            topic: true,
            difficulty: true,
            totalQs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("FETCH HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
