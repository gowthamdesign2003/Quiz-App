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


  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-4">{quiz.topic}</h1>

      {quiz.questions.map((q: any, i: number) => (
        <div key={i} className="mb-6">
          <p className="font-semibold">{i + 1}. {q.question}</p>
          {q.options.map((opt: string, idx: number) => (
            <p key={idx}>• {opt}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
