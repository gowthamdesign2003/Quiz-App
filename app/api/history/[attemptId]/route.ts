import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await params;
    const id = Number(attemptId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 });
    }

    // @ts-expect-error - quizAttempt type missing in generated client but exists at runtime
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: id,
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Verify ownership
    if (attempt.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("FETCH ATTEMPT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempt details" },
      { status: 500 }
    );
  }
}
