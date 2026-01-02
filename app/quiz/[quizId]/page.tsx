"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await axios.get(`/api/quiz/${quizId}`);
      setQuiz(res.data);
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.topic}</h1>

      {quiz.questions.map((q: any, i: number) => (
        <div key={q.id} className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="font-semibold mb-2">
            {i + 1}. {q.question}
          </h3>
          <ul className="space-y-1">
            {q.options.map((opt: string, idx: number) => (
              <li key={idx} className="bg-gray-700 p-2 rounded">
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
