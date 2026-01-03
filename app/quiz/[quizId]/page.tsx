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
  questions: Question[];
}

export default function QuizPage() {
  const { quizId } = useParams();
  const router = useRouter();

  // -- State --
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // -- Helpers --

  /**
   * Normalizes the correct answer to handle both full text answers and single letter answers (A, B, C, D).
   */
  const getCorrectAnswerText = (question: Question) => {
    const isLetterAnswer =
      question.correctAnswer.length === 1 &&
      question.correctAnswer >= "A" &&
      question.correctAnswer <= "Z";
      
    if (isLetterAnswer) {
      const index = question.correctAnswer.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1
      return question.options[index];
    }
    
    return question.correctAnswer;
  };

  const isAnswerCorrect = (question: Question, answer: string) => {
    return answer === getCorrectAnswerText(question);
  };

  const calculateStars = (currentScore: number, totalQuestions: number) => {
    if (totalQuestions === 0) return 0;
    const percentage = (currentScore / totalQuestions) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 50) return 2;
    return 1;
  };

  // -- Effects --

  // 1. Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`/api/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        alert("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // 2. Handle Auto-Submission when finished
  const isQuizCompleted =
    quiz && quiz.questions.length > 0 &&
    Object.keys(selectedAnswers).length === quiz.questions.length;

  useEffect(() => {
    if (isQuizCompleted && quiz && !isSubmitting) {
      const submitQuizResults = async () => {
        setIsSubmitting(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          await axios.post(
            `/api/quiz/${quizId}/submit`,
            {
              score,
              responses: selectedAnswers,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error: any) {
          console.error("Error submitting quiz results:", error.response?.data || error);
        }
      };

      submitQuizResults();
    }
  }, [isQuizCompleted, quiz, quizId, score, selectedAnswers, isSubmitting]);

  // -- Handlers --

  const handleOptionSelect = (questionId: number, option: string) => {
    // Prevent changing answer once selected
    if (selectedAnswers[questionId]) return;

    // Check correctness immediately to update local score
    const question = quiz?.questions.find((q) => q.id === questionId);
    if (question && isAnswerCorrect(question, option)) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // -- Render States --

  if (loading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
          <p className="text-gray-400 animate-pulse">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (isQuizCompleted) {
    const stars = calculateStars(score, quiz.questions.length);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-gray-900/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-gray-700 text-center max-w-lg w-full transform transition-all hover:scale-105">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Quiz Completed!
          </h1>
          
          <div className="text-7xl mb-8 animate-bounce delay-150">
            {"⭐".repeat(stars)}
          </div>
          
          <div className="mb-8 space-y-2">
            <p className="text-gray-400 text-lg">Final Score</p>
            <p className="text-6xl font-bold text-white tracking-tight">
              {score} <span className="text-2xl text-gray-500 font-normal">/ {quiz.questions.length}</span>
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 transform hover:-translate-y-1 active:translate-y-0"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // -- Main Render --
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white p-4 md:p-8 relative font-sans">
      
      {/* Floating Score Badge */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-500/30 flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Current Score</span>
          <span className="text-2xl font-bold text-indigo-400">{score}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-16 pb-24">
        <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          {quiz.topic}
        </h1>

        <div className="space-y-10">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id];
            const isAnswered = !!userAnswer;
            const correctAnswer = getCorrectAnswerText(question);
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div 
                key={question.id} 
                className="bg-gray-900/60 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/30"
              >
                <h3 className="font-medium mb-8 text-xl md:text-2xl text-gray-100 leading-relaxed">
                  <span className="text-indigo-400 font-bold mr-3">{index + 1}.</span> 
                  {question.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, optIndex) => {
                    const isSelected = userAnswer === option;
                    const isThisCorrect = option === correctAnswer;

                    // Determine button styling based on state
                    let buttonStyles = "relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
                    
                    if (isAnswered) {
                      if (isThisCorrect) {
                        buttonStyles += "bg-green-500/10 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                      } else if (isSelected) {
                        buttonStyles += "bg-red-500/10 border-red-500 text-red-100";
                      } else {
                        buttonStyles += "bg-gray-800/30 border-gray-700/30 text-gray-500 opacity-50";
                      }
                    } else {
                      buttonStyles += "bg-gray-800/50 border-gray-700 hover:bg-gray-700/80 hover:border-indigo-500 hover:shadow-indigo-500/10 text-gray-300 hover:text-white transform hover:-translate-y-0.5 active:translate-y-0";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleOptionSelect(question.id, option)}
                        disabled={isAnswered}
                        className={buttonStyles}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                              isAnswered && isThisCorrect ? 'bg-green-500 text-white' :
                              isAnswered && isSelected ? 'bg-red-500 text-white' :
                              'bg-gray-700 text-gray-400 group-hover:bg-indigo-500 group-hover:text-white'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="text-base md:text-lg">{option}</span>
                          </div>
                          
                          {isAnswered && isThisCorrect && <span className="text-xl">✅</span>}
                          {isAnswered && isSelected && !isThisCorrect && <span className="text-xl">❌</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Section */}
                {isAnswered && (
                  <div
                    className={`mt-6 p-5 rounded-2xl text-center border animate-in fade-in slide-in-from-top-2 duration-300 ${
                      isCorrect
                        ? "bg-green-500/10 text-green-300 border-green-500/20"
                        : "bg-red-500/10 text-red-300 border-red-500/20"
                    }`}
                  >
                    {isCorrect ? (
                      <span className="flex items-center justify-center gap-2 font-bold text-lg">
                        🎉 Correct Answer!
                      </span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-lg">Wrong Answer</span>
                        <span className="text-sm opacity-90">
                          The correct answer was: <span className="font-bold text-white">{correctAnswer}</span>
                        </span>
                      </div>
                    )}
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
