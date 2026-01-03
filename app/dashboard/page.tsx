"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


interface QuizAttempt {
  id: number;
  quizId: number;
  score: number;
  createdAt: string;
  quiz: {
    topic: string;
    difficulty: "easy" | "medium" | "hard";
    totalQs: number;
  };
}

interface UserProfile {
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [countRange, setCountRange] = useState("5-10");
  const [difficulty, setDifficulty] = useState("easy");
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [userName, setUserName] = useState("");

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }


    const fetchData = async () => {
      try {
        const [historyRes, userRes] = await Promise.all([
          axios.get("/api/history", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        
        setHistory(historyRes.data);
        setUserName(userRes.data.name);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
       
      }
    };

    fetchData();
  }, [router]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };


  const getQuestionCount = (range: string): number => {
    const [min, max] = range.split("-").map(Number);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleCreateQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic for the quiz.");
      return;
    }

    setLoading(true);

    try {
      const numberOfQuestions = getQuestionCount(countRange);

      const res = await axios.post("/api/quiz/create", {
        topic,
        numberOfQuestions,
        difficulty,
      });

      // Redirect to the newly created quiz
      router.push(`/quiz/${res.data.quizId}`);
    } catch (err: any) {
      console.error("Quiz creation error:", err.response?.data || err);
      alert("Something went wrong while creating the quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "hard": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white font-sans">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Quiz Dashboard
              </h1>
              {userName && (
                <p className="text-gray-400 text-sm mt-1">
                  Welcome back, <span className="text-indigo-300 font-medium">{userName}</span>
                </p>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          
         
          <div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               Create New Quiz
              </h2>

              <div className="space-y-5">
              
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Modern React Patterns"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-gray-500"
                  />
                </div>

                {/* Question Count Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={countRange}
                    onChange={(e) => setCountRange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white"
                  >
                    <option value="1-5">1–5 Questions</option>
                    <option value="5-10">5–10 Questions</option>
                    <option value="10-15">10–15 Questions</option>
                    <option value="15-20">15–20 Questions</option>
                  </select>
                </div>

                {/* Difficulty Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCreateQuiz}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 mt-2 flex justify-center items-center ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="-ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </button>
              </div>
            </div>
          </div>

          
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               Past Quizzes
            </h2>
            
            {history.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-lg">No quizzes taken yet.</p>
                <p className="text-gray-500 mt-2">Create your first quiz to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {history.map((attempt) => (
                  <div
                    key={attempt.id}
                    onClick={() => router.push(`/quiz/history/${attempt.id}`)}
                    className="group bg-gray-900/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 cursor-pointer"
                  >
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white line-clamp-1" title={attempt.quiz.topic}>
                        {attempt.quiz.topic}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${getDifficultyColor(attempt.quiz.difficulty)}`}>
                        {attempt.quiz.difficulty}
                      </span>
                    </div>

                   
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Date</span>
                        <span className="text-gray-200">
                          {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Questions</span>
                        <span className="text-gray-200">{attempt.quiz.totalQs}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Score</span>
                        <span className="text-lg font-bold text-indigo-400">
                          {attempt.score} <span className="text-sm text-gray-500 font-normal">/ {attempt.quiz.totalQs}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
