"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function CreateQuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topic = searchParams.get("topic");
  const count = searchParams.get("count");
  const difficulty = searchParams.get("difficulty");

  useEffect(() => {
    if (!topic || !count || !difficulty) return;

    const generateQuiz = async () => {
      try {
        const res = await axios.post("/api/quiz/create", {
          topic,
          numberOfQuestions: Number(count),
          difficulty,
        });

        // redirect to quiz page
        router.replace(`/quiz/${res.data.quizId}`);
      } catch (err) {
        alert("Quiz generation failed");
        router.replace("/dashboard");
      }
    };

    generateQuiz();
  }, [topic, count, difficulty, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Generating your quiz…
        </h2>
        <p className="text-gray-400">
          Please wait while AI creates questions
        </p>
      </div>
    </div>
  );
}
