"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const createQuiz = async () => {
  if (!topic || count < 5 || count > 20) {
    alert("Please enter valid quiz details");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post("/api/quiz/create", {
      topic,
      numberOfQuestions: count,
      difficulty,
    });

    router.push(`/quiz/${res.data.quizId}`);
  } catch (err: any) {
    console.error("CREATE QUIZ ERROR:", err.response?.data || err);
    alert("Failed to create quiz");
  } finally {
    setLoading(false);
  }
};







  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow">
        <h1 className="text-2xl font-bold text-indigo-400">
          Quiz Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <main className="p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">
          Create a New Quiz
        </h2>

        <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
          {/* Topic */}
          <div>
            <label className="block mb-1 text-gray-300">
              Quiz Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. JavaScript Basics"
              className="w-full p-2 rounded text-black"
            />
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block mb-1 text-gray-300">
              Number of Questions (5–20)
            </label>
            <input
              type="number"
              min={5}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-2 rounded text-black"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-1 text-gray-300">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 rounded text-black"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={createQuiz}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
          >
            {loading ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </div>
      </main>
    </div>
  );
}
