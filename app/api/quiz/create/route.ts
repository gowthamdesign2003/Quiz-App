import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";
import { getUserFromToken } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const user = getUserFromToken(req); // Link quiz to user if logged in
    const { topic, numberOfQuestions, difficulty } = await req.json();

    // 1. Validation
    if (
      !topic ||
      typeof topic !== "string" ||
      numberOfQuestions < 1 ||
      numberOfQuestions > 20
    ) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 }
      );
    }

    // 2. Create Quiz Record
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        difficulty,
        totalQs: numberOfQuestions,
        userId: user?.userId || null,
      },
    });

    // 3. AI Prompt (Request JSON format)
    const prompt = `
You are an API that returns ONLY valid JSON.
Do NOT include markdown.
Do NOT include backticks.

Return EXACTLY this structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}

Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${numberOfQuestions}
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = aiRes.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(content);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid AI JSON structure");
    }

    const questions = parsed.questions;

    // 4. Save Questions to Database
    // Use Promise.all for parallel creation if desired, or sequential loop
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
        continue; // Skip invalid questions
      }

      await prisma.question.create({
        data: {
          quizId: quiz.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        },
      });
    }

    // 5. Success Response
    return NextResponse.json({ quizId: quiz.id });
  } catch (err) {
    console.error("QUIZ CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Quiz creation failed" },
      { status: 500 }
    );
  }
}
