import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

interface StudentHomeProps {
  onNavigate: (page: string) => void;
}

export function StudentHome({ onNavigate }: StudentHomeProps) {
  const { user } = useAuth();
  const grade = user?.grade ? Number(user.grade) : 1;
  const username = user?.userId ?? "Student";

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader title="Welcome" />

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-indigo-600">{username}</span>!
          </h1>
          <p className="text-gray-500 mt-1 text-lg">Grade {grade} Student</p>
        </motion.div>

        {/* Proficiency test hero card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-lg border border-indigo-100 p-8 flex flex-col items-center"
          data-ocid="student.proficiency.card"
        >
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 border-2 border-indigo-200">
            <span className="text-5xl" role="img" aria-label="proficiency test">
              🎯
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Proficiency Assessment
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6 leading-relaxed">
            This one-time assessment helps us understand your current reading
            level so we can personalise your learning journey.
          </p>

          {/* Key info chips */}
          <div className="w-full space-y-2 mb-8">
            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-2.5 border border-indigo-100">
              <span className="text-lg">📖</span>
              <span className="text-sm font-medium text-indigo-800">
                Grade {grade} Reading Passage
              </span>
            </div>
            <div className="flex items-center gap-3 bg-teal-50 rounded-xl px-4 py-2.5 border border-teal-100">
              <span className="text-lg">🎙️</span>
              <span className="text-sm font-medium text-teal-800">
                All 4 skills assessed in one recording
              </span>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-2.5 border border-purple-100">
              <span className="text-lg">✍️</span>
              <span className="text-sm font-medium text-purple-800">
                5 comprehension questions after reading
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md"
            onClick={() => onNavigate("/student/test")}
            data-ocid="student.proficiency.primary_button"
          >
            Begin Proficiency Test
          </Button>
        </motion.div>

        {/* Subtle bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-400 mt-8"
        >
          You only need to complete this once. Your personalised course unlocks
          right after.
        </motion.p>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-indigo-500"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
