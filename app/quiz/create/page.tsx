"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

// -- Components --

export default function CreateQuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // -- Params --

  const topic = searchParams.get("topic");
  const count = searchParams.get("count");
  const difficulty = searchParams.get("difficulty");

  // -- Effects --

  useEffect(() => {
    // If missing params, do nothing (or redirect back)
    if (!topic || !count || !difficulty) {
      // router.replace("/dashboard"); // Optional: redirect if params missing
      return;
    }

    const generateQuiz = async () => {
      try {
        const res = await axios.post("/api/quiz/create", {
          topic,
          numberOfQuestions: Number(count),
          difficulty,
        });

        // Redirect to the newly created quiz
        router.replace(`/quiz/${res.data.quizId}`);
      } catch (err) {
        console.error("Quiz generation failed:", err);
        alert("Quiz generation failed. Returning to dashboard.");
        router.replace("/dashboard");
      }
    };

    generateQuiz();
  }, [topic, count, difficulty, router]);

  // -- Render --

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white">
      <div className="flex flex-col items-center gap-6 p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl">
        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-b-4 border-indigo-500"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-indigo-500/30"></div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Generating your quiz...
          </h2>
          <p className="text-gray-400 text-sm">
            Our AI is crafting challenging questions for you
          </p>
        </div>
      </div>
    </div>
  );
}
