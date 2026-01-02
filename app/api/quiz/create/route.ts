import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { topic, numberOfQuestions, difficulty } = await req.json();

    // ✅ Validation
    if (
      !topic ||
      typeof topic !== "string" ||
      numberOfQuestions < 5 ||
      numberOfQuestions > 20
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // 1️⃣ Create quiz (NO USER)
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        difficulty,
        totalQs: numberOfQuestions,
      },
    });

    // 2️⃣ AI Prompt (STRICT JSON ONLY)
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

    // 3️⃣ Save questions
    for (const q of questions) {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        !q.correctAnswer
      ) {
        continue; // skip invalid question
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

    // 4️⃣ Success
    return NextResponse.json({ quizId: quiz.id });
  } catch (err) {
    console.error("QUIZ CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Quiz creation failed" },
      { status: 500 }
    );
  }
}
