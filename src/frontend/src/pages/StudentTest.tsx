import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronLeft,
  Info,
  Loader2,
  Mic,
  MicOff,
  Music,
  Pause,
  Play,
  Square,
  TrendingUp,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import {
  ReportingIndicatorsPanel,
  ScoreOverviewPanel,
  SkillCard,
  StarRating,
} from "../components/ReportCardLayout";
import { useAuth } from "../context/AuthContext";
import { type MCQ, getPassageMCQs } from "../data/passageMCQs";
import { getPassageForLevel } from "../data/passages";
import { useProficiencySearch } from "../hooks/useProficiencySearch";
import {
  useMyEffectiveLevel,
  useMyResults,
  useSubmitTestWithSkills,
} from "../hooks/useQueries";

interface StudentTestProps {
  onNavigate: (page: string) => void;
}

interface SkillScores {
  rhythm: number;
  intonation: number;
  chunking: number;
  pronunciation: number;
}

interface Segment {
  text: string;
  time: number;
}

// ── Subject badge colours ──────────────────────────────────────────────────────

function subjectBadgeClass(subject: string): string {
  const s = subject.toLowerCase();
  if (s === "science") return "bg-teal-100 text-teal-700 border-teal-200";
  if (s === "history") return "bg-amber-100 text-amber-700 border-amber-200";
  if (s === "geography") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
}

// ── Skill Scoring ─────────────────────────────────────────────────────────────

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreSkills(
  transcript: string,
  passageText: string,
  durationSeconds: number,
  segments: Segment[],
): SkillScores {
  const transcriptWords = normalizeWords(transcript);
  const passageWords = normalizeWords(passageText);

  let matchCount = 0;
  for (const word of transcriptWords) {
    if (passageWords.includes(word)) matchCount++;
  }
  const wordMatchRatio =
    passageWords.length > 0 ? matchCount / passageWords.length : 0;
  const pronunciation = Math.max(
    1,
    Math.min(5, Math.round(wordMatchRatio * 5)),
  );

  let rhythm = 1;
  if (durationSeconds > 0 && transcriptWords.length > 0) {
    const actualWPM = (transcriptWords.length / durationSeconds) * 60;
    const deviation = Math.abs(actualWPM - 120) / 120;
    if (deviation <= 0.2) rhythm = 5;
    else if (deviation <= 0.35) rhythm = 4;
    else if (deviation <= 0.5) rhythm = 3;
    else if (deviation <= 0.65) rhythm = 2;
    else rhythm = 1;
  }

  const punctuationCount = (passageText.match(/[,.]/g) || []).length;
  let chunking = 2;
  if (segments.length > 0 && punctuationCount > 0) {
    if (segments.length >= punctuationCount) chunking = 5;
    else if (segments.length >= punctuationCount * 0.75) chunking = 4;
    else if (segments.length >= punctuationCount * 0.5) chunking = 3;
    else if (segments.length >= punctuationCount * 0.25) chunking = 2;
    else chunking = 1;
  }

  const passageSentences = passageText
    .split(".")
    .filter((s) => s.trim().length > 0).length;
  let intonation = 1;
  if (passageSentences > 0) {
    const ratio = Math.min(segments.length / passageSentences, 1);
    intonation = Math.max(1, Math.min(5, Math.round(ratio * 5)));
  }

  return { rhythm, intonation, chunking, pronunciation };
}

// ── Speech Recognition Hook ────────────────────────────────────────────────────

function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setIsSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript;
          setTranscript((prev) => (prev ? `${prev} ${text}` : text));
          setSegments((prev) => [...prev, { text, time: Date.now() }]);
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = rec;
  }, []);

  const start = () => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setInterimText("");
    setSegments([]);
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return {
    transcript,
    interimText,
    isListening,
    segments,
    isSupported,
    start,
    stop,
  };
}

// ── Audio Recorder Hook ────────────────────────────────────────────────────────

function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        for (const track of stream.getTracks()) track.stop();
      };
      mr.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access denied. Please allow microphone access.");
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return {
    isRecording,
    audioUrl,
    seconds,
    formatTime,
    start,
    stop,
    playing,
    togglePlayback,
    audioRef,
    setPlaying,
  };
}

// DonutChart imported from ReportCardLayout
// ProficiencyBadge, StarRating imported from ReportCardLayout

// ── Level badge (no downgrade) ─────────────────────────────────────────────────

const LEVEL_BADGES = [
  {
    min: 4.5,
    label: "⭐ Master Reader",
    cls: "bg-violet-100 text-violet-800 border-violet-200",
  },
  {
    min: 4.0,
    label: "🏆 Advanced",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    min: 3.0,
    label: "📈 Developing",
    cls: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    min: 2.0,
    label: "🌱 Growing",
    cls: "bg-amber-500/20 text-amber-300 border-amber-200",
  },
  {
    min: 0,
    label: "🔰 Beginner",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
];

// ── Adaptive Banner ────────────────────────────────────────────────────────────

// ── New Report Card ────────────────────────────────────────────────────────────

// ── Main Component ─────────────────────────────────────────────────────────────

export function StudentTest({ onNavigate }: StudentTestProps) {
  const { user } = useAuth();
  const [computedScores, setComputedScores] = useState<SkillScores | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showMCQ, setShowMCQ] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<number[]>([]);
  const [_autoRetrying, setAutoRetrying] = useState(false);
  const startTimeRef = useRef<number>(0);
  const levelActionFiredRef = useRef(false);

  const userId = user?.userId ?? "";
  const enrolledGrade = user?.grade ? Number(user.grade) : 1;

  const proficiency = useProficiencySearch(userId, enrolledGrade);
  const {
    attemptsMade,
    currentTestLevel,
    levelFound,
    foundLevel: _foundLevel,
    passLevel,
    failLevel,
    reset,
  } = proficiency;

  const { data: results } = useMyResults(userId);
  useMyEffectiveLevel(userId);
  const submitTest = useSubmitTestWithSkills();
  const recorder = useAudioRecorder();
  const speech = useSpeechRecognition();

  // Determine passage based on current proficiency search level
  const passage = useMemo(() => {
    const testsTaken = results?.length ?? 0;
    return getPassageForLevel(currentTestLevel, testsTaken);
  }, [currentTestLevel, results?.length]);

  const handleStartRecording = async () => {
    startTimeRef.current = Date.now();
    await recorder.start();
    speech.start();
  };

  const handleStopRecording = () => {
    const duration = (Date.now() - startTimeRef.current) / 1000;
    setRecordingDuration(duration);
    recorder.stop();
    speech.stop();
  };

  useEffect(() => {
    if (
      !recorder.isRecording &&
      recorder.audioUrl &&
      speech.transcript &&
      passage
    ) {
      const scores = scoreSkills(
        speech.transcript,
        passage.content,
        recordingDuration,
        speech.segments,
      );
      setComputedScores(scores);
      setShowMCQ(true);
      localStorage.setItem(
        `classio_skills_${userId}`,
        JSON.stringify({
          rhythm: scores.rhythm,
          intonation: scores.intonation,
          chunking: scores.chunking,
          pronunciation: scores.pronunciation,
        }),
      );
    }
  }, [
    recorder.isRecording,
    recorder.audioUrl,
    speech.transcript,
    speech.segments,
    passage,
    recordingDuration,
    userId,
  ]);

  const handleSubmit = async (adjustedScores?: SkillScores) => {
    if (!passage) return;
    const scores = adjustedScores ??
      computedScores ?? {
        rhythm: 1,
        intonation: 1,
        chunking: 1,
        pronunciation: 1,
      };
    try {
      await submitTest.mutateAsync({
        userId,
        passageId: BigInt(passage.id),
        skillScores: {
          rhythm: BigInt(scores.rhythm),
          intonation: BigInt(scores.intonation),
          chunking: BigInt(scores.chunking),
          pronunciation: BigInt(scores.pronunciation),
        },
        audioBlobId: null,
      });
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  };

  // Compute previous score from last result
  const _previousScore = useMemo(() => {
    if (!results || results.length === 0) return 0;
    const last = results[results.length - 1] as any;
    if (last?.skillScores) {
      const s = last.skillScores;
      return (
        Number(s.rhythm ?? 0) +
        Number(s.intonation ?? 0) +
        Number(s.chunking ?? 0) +
        Number(s.pronunciation ?? 0)
      );
    }
    return 0;
  }, [results]);

  const _gradeLevel = user?.grade ? Number(user.grade) : 1;

  // After submit: compute pass/fail and update proficiency search
  const avgScore = computedScores
    ? (computedScores.rhythm +
        computedScores.intonation +
        computedScores.chunking +
        computedScores.pronunciation) /
      4
    : 0;
  const passed = avgScore >= 4;

  useEffect(() => {
    if (
      submitTest.isSuccess &&
      computedScores &&
      !levelActionFiredRef.current &&
      !levelFound
    ) {
      levelActionFiredRef.current = true;
      if (passed) {
        passLevel();
      } else {
        failLevel();
      }
    }
  }, [
    submitTest.isSuccess,
    computedScores,
    levelFound,
    passed,
    passLevel,
    failLevel,
  ]);

  const handleRetry = () => {
    levelActionFiredRef.current = false;
    reset();
    onNavigate("/student/test");
  };

  // Auto level-down: automatically retry at lower level after a brief transition
  // biome-ignore lint/correctness/useExhaustiveDependencies: handleRetry is stable
  useEffect(() => {
    if (submitTest.isSuccess && computedScores && !passed && !levelFound) {
      setAutoRetrying(true);
      const timer = setTimeout(() => {
        setAutoRetrying(false);
        setShowMCQ(false);
        setMcqAnswers([]);
        handleRetry();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitTest.isSuccess, computedScores, passed, levelFound]);

  // MCQ screen - appears after recording is done
  if (showMCQ && !submitTest.isSuccess && passage) {
    const mcqs = getPassageMCQs(passage.id);
    const allAnswered =
      mcqs.length > 0 &&
      mcqAnswers.length === mcqs.length &&
      mcqAnswers.every((a) => a !== -1);

    const handleMCQSubmit = () => {
      if (!allAnswered || !computedScores) return;
      const mcqScore = mcqAnswers.filter(
        (ans, i) => ans === mcqs[i].correctIndex,
      ).length;
      const mcqPercent = mcqScore / mcqs.length;
      const adjustedScores: SkillScores = {
        ...computedScores,
        intonation: Math.max(
          1,
          Math.min(
            5,
            Math.round(computedScores.intonation * 0.7 + mcqPercent * 5 * 0.3),
          ),
        ),
        chunking: Math.max(
          1,
          Math.min(
            5,
            Math.round(computedScores.chunking * 0.7 + mcqPercent * 5 * 0.3),
          ),
        ),
      };
      setComputedScores(adjustedScores);
      void handleSubmit(adjustedScores);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Reading Comprehension Check" />
        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Passage card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-base font-bold text-gray-900">
                  {passage.title}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${subjectBadgeClass(passage.subject)}`}
                >
                  {passage.subject}
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto pr-1">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {passage.content}
                </p>
              </div>
            </div>
          </motion.div>

          {/* MCQ section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-sm font-semibold text-indigo-600 mb-4">
              Answer these {mcqs.length} questions about the passage:
            </p>
            <div className="space-y-4">
              {mcqs.map((mcq, qi) => (
                <div
                  key={mcq.question}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    <span className="text-indigo-500 mr-1.5">Q{qi + 1}.</span>
                    {mcq.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mcq.options.map((opt, oi) => {
                      const isSelected = mcqAnswers[qi] === oi;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const updated = [...mcqAnswers];
                            updated[qi] = oi;
                            setMcqAnswers(updated);
                          }}
                          className={`text-left px-3 py-2 rounded-lg border text-sm transition-all duration-150 ${
                            isSelected
                              ? "bg-indigo-100 border-indigo-500 text-indigo-800 font-medium"
                              : "bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-gray-900"
                          }`}
                        >
                          <span className="font-bold text-xs text-indigo-500 mr-1.5">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pb-8 flex justify-end">
              <Button
                size="lg"
                disabled={!allAnswered || submitTest.isPending}
                onClick={handleMCQSubmit}
                className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-10 disabled:opacity-50"
                data-ocid="test.submit_button"
              >
                {submitTest.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {submitTest.isPending ? "Submitting..." : "Submit Answers"}
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (submitTest.isSuccess) {
    if (computedScores) {
      // If level not yet found (still searching), show "try next level" screen
      // (levelFound becomes true after failLevel() if already at level 1)
      // We check the local state: after failLevel, levelFound may be true (at level 1) or false
      // We determine: if originally passed OR (after failLevel, levelFound is true) → show report
      // else show try next level
      if (!passed && !levelFound) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-sm w-full text-center bg-white border border-gray-200 rounded-3xl p-10 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Creating Your Learning Journey...
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                We&apos;re building the perfect path for you
              </p>
              <div className="space-y-3 text-left">
                {[
                  {
                    icon: "📚",
                    label: "Vocab Builder",
                    sub: "Building your word power",
                    delay: 0,
                  },
                  {
                    icon: "📖",
                    label: "Practice Reading",
                    sub: "Read and record sessions",
                    delay: 0.3,
                  },
                  {
                    icon: "📝",
                    label: "Weekly Assessment",
                    sub: "Test your progress",
                    delay: 0.6,
                  },
                  {
                    icon: "📊",
                    label: "Progress Reports",
                    sub: "Track your growth",
                    delay: 0.9,
                  },
                ].map((step) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay, duration: 0.4 }}
                    className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3"
                  >
                    <span className="text-xl">{step.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500">{step.sub}</p>
                    </div>
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-indigo-400"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.2,
                        delay: step.delay,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Level found (passed or reached bottom) → show simple success screen (report comes after weekly test)
      const avgScoreForBadge = computedScores
        ? (computedScores.pronunciation +
            computedScores.rhythm +
            computedScores.intonation +
            computedScores.chunking) /
          4
        : 0;
      const earnedBadge =
        LEVEL_BADGES.find((b) => avgScoreForBadge >= b.min) ??
        LEVEL_BADGES[LEVEL_BADGES.length - 1];
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-col items-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mb-4"
              >
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Your Learning Journey is Ready! 🎉
              </h2>
              <div className="mt-2 mb-2">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${earnedBadge.cls}`}
                >
                  {earnedBadge.label}
                </span>
              </div>
              <p className="text-gray-500 text-sm text-center mt-1 max-w-xs">
                We&apos;ve personalised your learning path. Here&apos;s what
                your journey looks like:
              </p>
            </div>

            <div className="flex items-start justify-between gap-2 mb-8">
              {[
                {
                  icon: "📚",
                  title: "Vocab Builder",
                  sub: "Week 1–2",
                  color: "border-indigo-200",
                },
                {
                  icon: "📖",
                  title: "Practice Tests",
                  sub: "Week 2–3",
                  color: "border-violet-200",
                },
                {
                  icon: "📝",
                  title: "Weekly Assess.",
                  sub: "Week 3–4",
                  color: "border-sky-200",
                },
                {
                  icon: "📊",
                  title: "Progress Reports",
                  sub: "Ongoing",
                  color: "border-emerald-200",
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {i < 3 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 z-0" />
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="flex flex-col items-center z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${step.color} bg-white flex items-center justify-center text-lg mb-1`}
                    >
                      {step.icon}
                    </div>
                    <p className="text-xs font-semibold text-gray-900 text-center leading-tight">
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.sub}</p>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => onNavigate("/student")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md transition-all duration-200"
              data-ocid="test.primary_button"
            >
              Start My Learning Journey →
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="Test Complete" />
        <main
          className="max-w-xl mx-auto px-6 py-16 text-center"
          data-ocid="test.success_state"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-100">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            Test Submitted!
          </h2>
          <p className="text-gray-400 mb-8">
            Your recording has been submitted and your skills have been
            assessed.
          </p>
          <Button
            onClick={() => onNavigate("/student")}
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-8"
            data-ocid="test.primary_button"
          >
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Reading Test" />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("/student")}
            className="gap-1.5"
            data-ocid="test.button"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Reading Proficiency Test
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-gray-400">
                Grade {user?.grade?.toString()} — Read the passage aloud and
                record yourself
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold">
                Attempt {attemptsMade}/{enrolledGrade}
              </span>
            </div>
          </div>
        </div>

        {!passage ? (
          <Card
            className="rounded-xl bg-white border border-gray-200"
            data-ocid="test.error_state"
          >
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="font-medium">Loading your passage...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {/* 1. Passage */}
            <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-transparent">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <CardTitle className="text-lg">{passage.title}</CardTitle>
                  <div className="flex items-center gap-2 shrink-0">
                    {passage.subject && (
                      <Badge
                        className={`text-xs border ${subjectBadgeClass(passage.subject)}`}
                      >
                        {passage.subject}
                      </Badge>
                    )}
                    <Badge className="bg-indigo-500/20 text-primary border-0">
                      Grade {passage.gradeLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-base leading-8 text-gray-800 whitespace-pre-wrap">
                  {passage.content}
                </p>
              </CardContent>
            </Card>

            {/* 2. Recording */}
            <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Record Your Reading
                  {recorder.audioUrl && (
                    <Badge className="ml-auto bg-green-500/20 text-green-300 dark:text-green-400 border-0 gap-1">
                      <CheckCircle className="w-3 h-3" /> Recorded
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-sm text-gray-400">
                  Read the passage aloud. The system will listen and
                  automatically score your{" "}
                  <strong>
                    rhythm, intonation, chunking, and pronunciation
                  </strong>
                  .
                </p>

                {!speech.isSupported && (
                  <div className="flex items-start gap-2 text-sm p-3 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-200">
                    <MicOff className="w-4 h-4 shrink-0 mt-0.5" />
                    Voice analysis not available in this browser. Recording
                    only.
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {!recorder.audioUrl && !recorder.isRecording && (
                    <Button
                      onClick={handleStartRecording}
                      className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      data-ocid="test.button"
                    >
                      <Mic className="w-4 h-4" /> Start Recording
                    </Button>
                  )}
                  {recorder.isRecording && (
                    <>
                      <Button
                        onClick={handleStopRecording}
                        variant="outline"
                        className="gap-2 border-destructive text-destructive"
                        data-ocid="test.button"
                      >
                        <Square className="w-4 h-4" /> Stop —{" "}
                        {recorder.formatTime(recorder.seconds)}
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        Recording... {recorder.formatTime(recorder.seconds)}
                      </div>
                    </>
                  )}
                </div>

                {recorder.audioUrl && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={recorder.togglePlayback}
                      data-ocid="test.toggle"
                    >
                      {recorder.playing ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      {recorder.playing ? "Pause" : "Play Recording"}
                    </Button>
                    {/* biome-ignore lint/a11y/useMediaCaption: recorded user audio */}
                    <audio
                      ref={recorder.audioRef}
                      src={recorder.audioUrl}
                      onEnded={() => recorder.setPlaying(false)}
                      className="hidden"
                    />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ Recording saved
                    </span>
                  </div>
                )}

                <AnimatePresence>
                  {(recorder.isRecording || recorder.audioUrl) &&
                    speech.isSupported && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Live Transcript
                          </p>
                          <p className="text-sm leading-relaxed min-h-[2rem]">
                            <span>{speech.transcript}</span>
                            {speech.interimText && (
                              <span className="text-gray-400/60 italic">
                                {" "}
                                {speech.interimText}
                              </span>
                            )}
                            {!speech.transcript &&
                              !speech.interimText &&
                              recorder.isRecording && (
                                <span className="text-gray-400/50 text-xs">
                                  Listening...
                                </span>
                              )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* 3. Score Preview */}
            <AnimatePresence>
              {computedScores && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-200 pb-4 bg-transparent">
                      <CardTitle className="text-base">
                        Skill Score Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            key: "rhythm" as const,
                            label: "Rhythm",
                            emoji: "🎵",
                          },
                          {
                            key: "intonation" as const,
                            label: "Intonation",
                            emoji: "🎶",
                          },
                          {
                            key: "chunking" as const,
                            label: "Chunking",
                            emoji: "📋",
                          },
                          {
                            key: "pronunciation" as const,
                            label: "Pronunciation",
                            emoji: "🗣️",
                          },
                        ].map((skill) => {
                          const score = computedScores[skill.key];
                          const colorMap: Record<number, string> = {
                            5: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                            4: "bg-teal-100 text-teal-700 border-teal-200",
                            3: "bg-blue-100 text-blue-700 border-blue-200",
                            2: "bg-amber-100 text-amber-700 border-amber-200",
                            1: "bg-red-500/20 text-red-300 border-red-200",
                          };
                          const colorCls = colorMap[score] || colorMap[1];
                          return (
                            <div
                              key={skill.key}
                              className={`rounded-lg border p-3 text-center ${colorCls}`}
                            >
                              <p className="text-xs font-semibold mb-1">
                                {skill.label}
                              </p>
                              <p className="text-xl font-bold text-gray-900">
                                {score}
                                <span className="text-xs">/5</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="flex items-center justify-between pb-8">
              <p className="text-sm text-gray-400">
                {recorder.audioUrl ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Ready to submit
                  </span>
                ) : (
                  "Record yourself reading the passage to submit."
                )}
              </p>
              {computedScores ? (
                <span className="text-indigo-300 text-sm font-medium animate-pulse">
                  ✨ Comprehension questions loading...
                </span>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-8"
                  disabled={!recorder.audioUrl || submitTest.isPending}
                  onClick={() => void handleSubmit()}
                  data-ocid="test.submit_button"
                >
                  {submitTest.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {submitTest.isPending ? "Submitting..." : "Submit Test"}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
