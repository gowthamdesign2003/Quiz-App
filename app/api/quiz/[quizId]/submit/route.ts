import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    
    let user;
    try {
      user = getUserFromToken(req);
    } catch (tokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - No Token Found" },
        { status: 401 }
      );
    }

    
    const { quizId } = await params;
    const body = await req.json();
    const { score, responses } = body;

    
    // @ts-expect-error - quizAttempt type missing in generated client but exists at runtime
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.userId,
        quizId: Number(quizId),
        score,
        responses: responses ?? {}, 
      },
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("SUBMIT QUIZ ERROR:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
