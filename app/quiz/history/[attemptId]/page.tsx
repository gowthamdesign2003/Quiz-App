"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

// -- Types --

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: number;
  topic: string;
  difficulty: string;
  questions: Question[];
}

interface QuizAttempt {
  id: number;
  score: number;
  createdAt: string;
  responses: Record<string, string>; // questionId -> selectedOption
  quiz: Quiz;
}

export default function HistoryPage() {
  const { attemptId } = useParams();
  const router = useRouter();

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await axios.get(`/api/history/${attemptId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempt(res.data);
      } catch (error) {
        console.error("Failed to load attempt:", error);
        alert("Failed to load quiz history.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchAttempt();
    }
  }, [attemptId, router]);

  // -- Helpers --

  const getCorrectAnswerText = (question: Question) => {
    const isLetterAnswer =
      question.correctAnswer.length === 1 &&
      question.correctAnswer >= "A" &&
      question.correctAnswer <= "Z";
      
    if (isLetterAnswer) {
      const index = question.correctAnswer.charCodeAt(0) - 65;
      return question.options[index];
    }
    
    return question.correctAnswer;
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
          <p className="text-gray-400">Loading History...</p>
        </div>
      </div>
    );
  }

  const { quiz } = attempt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white p-4 md:p-8 relative font-sans">
      
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white flex items-center gap-2"
        >
          <span>←</span>
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto pt-16 pb-24">
        
        {/* Header Summary */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {quiz.topic}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span className="uppercase tracking-wider text-sm font-medium border px-3 py-1 rounded-full border-gray-700">
              {quiz.difficulty}
            </span>
            <span>•</span>
            <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="mt-8 inline-flex items-center gap-4 bg-gray-900/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-gray-700">
            <div className="text-right">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Your Score</p>
              <p className="text-3xl font-bold text-white">
                {attempt.score} <span className="text-gray-500 text-lg">/ {quiz.questions.length}</span>
              </p>
            </div>
            <div className="h-12 w-px bg-gray-700"></div>
            <button
              onClick={() => router.push(`/quiz/${quiz.id}`)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20"
            >
              Retake Quiz
            </button>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-10">
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.responses[question.id];
            const correctAnswer = getCorrectAnswerText(question);
            const isCorrect = userAnswer === correctAnswer;
            const isSkipped = !userAnswer;

            return (
              <div 
                key={question.id} 
                className="bg-gray-900/60 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-gray-700/50"
              >
                <h3 className="font-medium mb-8 text-xl md:text-2xl text-gray-100 leading-relaxed">
                  <span className="text-indigo-400 font-bold mr-3">{index + 1}.</span> 
                  {question.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, optIndex) => {
                    const isSelected = userAnswer === option;
                    const isThisCorrect = option === correctAnswer;

                    let buttonStyles = "relative w-full text-left p-4 rounded-xl border-2 font-medium ";
                    
                    if (isThisCorrect) {
                      buttonStyles += "bg-green-500/10 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                    } else if (isSelected) {
                      buttonStyles += "bg-red-500/10 border-red-500 text-red-100";
                    } else {
                      buttonStyles += "bg-gray-800/30 border-gray-700/30 text-gray-500 opacity-50";
                    }

                    return (
                      <div
                        key={optIndex}
                        className={buttonStyles}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              isThisCorrect ? 'bg-green-500 text-white' :
                              isSelected ? 'bg-red-500 text-white' :
                              'bg-gray-700 text-gray-400'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="text-base md:text-lg">{option}</span>
                          </div>
                          
                          {isThisCorrect && <span className="text-xl">✅</span>}
                          {isSelected && !isThisCorrect && <span className="text-xl">❌</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-gray-300 text-sm">
                    {isSkipped ? (
                      <p>You skipped this question.</p>
                    ) : (
                      <p>You selected: <span className="text-red-400 font-medium">{userAnswer}</span></p>
                    )}
                    <p className="mt-1">Correct answer: <span className="text-green-400 font-medium">{correctAnswer}</span></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
