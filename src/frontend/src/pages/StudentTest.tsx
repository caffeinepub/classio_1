import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronLeft,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { getPassageForLevel } from "../data/passages";
import { useMyResults, useSubmitTestWithSkills } from "../hooks/useQueries";

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

function subjectBadgeClass(subject: string): string {
  const s = subject.toLowerCase();
  if (s === "science") return "bg-teal-100 text-teal-700 border-teal-200";
  if (s === "history") return "bg-amber-100 text-amber-700 border-amber-200";
  if (s === "geography") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-gray-100 text-gray-500 border-gray-200";
}

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

  // If no transcript captured (speech API unavailable), use duration-based scoring
  const hasSpeech = transcriptWords.length > 0;

  let matchCount = 0;
  for (const word of transcriptWords) {
    if (passageWords.includes(word)) matchCount++;
  }
  const wordMatchRatio =
    hasSpeech && passageWords.length > 0
      ? matchCount / passageWords.length
      : durationSeconds > 10
        ? 0.6
        : 0.3; // fallback based on recording duration
  const pronunciation = Math.max(
    1,
    Math.min(5, Math.round(wordMatchRatio * 5)),
  );

  let rhythm = 2;
  if (durationSeconds > 5) {
    const wordCount = hasSpeech ? transcriptWords.length : passageWords.length;
    const actualWPM = (wordCount / durationSeconds) * 60;
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
  } else if (durationSeconds > 10) {
    chunking = 3; // reasonable default if no segments
  }

  const passageSentences = passageText
    .split(".")
    .filter((s) => s.trim().length > 0).length;
  let intonation = 2;
  if (passageSentences > 0) {
    const ratio = hasSpeech
      ? Math.min(segments.length / passageSentences, 1)
      : durationSeconds > 10
        ? 0.5
        : 0.3;
    intonation = Math.max(1, Math.min(5, Math.round(ratio * 5)));
  }

  return { rhythm, intonation, chunking, pronunciation };
}

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
    cls: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    min: 0,
    label: "🔰 Beginner",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
];

export function StudentTest({ onNavigate }: StudentTestProps) {
  const { user } = useAuth();
  const [computedScores, setComputedScores] = useState<SkillScores | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startTimeRef = useRef<number>(0);
  const submitFiredRef = useRef(false);

  const userId = user?.userId ?? "";
  const enrolledGrade = user?.grade ? Number(user.grade) : 1;

  const { data: results } = useMyResults(userId);
  const submitTest = useSubmitTestWithSkills();
  const recorder = useAudioRecorder();
  const speech = useSpeechRecognition();

  const passage = useMemo(() => {
    const testsTaken = results?.length ?? 0;
    return getPassageForLevel(enrolledGrade, testsTaken);
  }, [enrolledGrade, results?.length]);

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

  // Auto-score and submit once recording stops (works with or without speech transcript)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only triggers on recording state changes
  useEffect(() => {
    if (
      !recorder.isRecording &&
      recorder.audioUrl &&
      !submitFiredRef.current &&
      passage
    ) {
      submitFiredRef.current = true;
      const scores = scoreSkills(
        speech.transcript,
        passage.content,
        recordingDuration,
        speech.segments,
      );
      setComputedScores(scores);
      void doSubmit(scores);
      localStorage.setItem(`classio_skills_${userId}`, JSON.stringify(scores));
    }
  }, [recorder.isRecording, recorder.audioUrl]);

  const doSubmit = async (scores: SkillScores) => {
    if (!passage) return;
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
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit test. Please try again.");
      submitFiredRef.current = false; // allow retry
    }
  };

  // Manual submit button (fallback if auto-submit didn't fire)
  const handleManualSubmit = () => {
    if (submitFiredRef.current) return;
    submitFiredRef.current = true;
    const scores = passage
      ? scoreSkills(
          speech.transcript,
          passage.content,
          recordingDuration,
          speech.segments,
        )
      : { rhythm: 2, intonation: 2, chunking: 2, pronunciation: 2 };
    setComputedScores(scores);
    void doSubmit(scores);
  };

  // Auto-navigate after success
  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => onNavigate("/student"), 3000);
      return () => clearTimeout(t);
    }
  }, [submitted, onNavigate]);

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted && computedScores) {
    const avg =
      (computedScores.rhythm +
        computedScores.intonation +
        computedScores.chunking +
        computedScores.pronunciation) /
      4;
    const badge =
      LEVEL_BADGES.find((b) => avg >= b.min) ??
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
              Proficiency Level Set! 🎉
            </h2>
            <p className="text-sm text-gray-500 text-center mb-3">
              Your reading level has been assessed. Your learning journey is
              ready.
            </p>
            <div className="mt-1 mb-2">
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${badge.cls}`}
              >
                {badge.label}
              </span>
            </div>
          </div>

          {/* Skill scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { key: "rhythm" as const, label: "Rhythm", emoji: "🎵" },
              { key: "intonation" as const, label: "Intonation", emoji: "🎶" },
              { key: "chunking" as const, label: "Chunking", emoji: "📋" },
              {
                key: "pronunciation" as const,
                label: "Pronunciation",
                emoji: "🗣️",
              },
            ].map((skill) => {
              const score = computedScores[skill.key];
              const colorMap: Record<number, string> = {
                5: "bg-emerald-100 text-emerald-700 border-emerald-200",
                4: "bg-teal-100 text-teal-700 border-teal-200",
                3: "bg-blue-100 text-blue-700 border-blue-200",
                2: "bg-amber-100 text-amber-700 border-amber-200",
                1: "bg-red-100 text-red-700 border-red-200",
              };
              return (
                <div
                  key={skill.key}
                  className={`rounded-lg border p-3 text-center ${colorMap[score] ?? colorMap[1]}`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {skill.emoji} {skill.label}
                  </p>
                  <p className="text-xl font-bold">
                    {score}
                    <span className="text-xs font-normal">/5</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Learning journey roadmap */}
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
          >
            Start My Learning Journey →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Submitting spinner
  if (submitTest.isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Analysing your reading...</p>
          <p className="text-sm text-gray-400 mt-1">
            This will only take a moment
          </p>
        </div>
      </div>
    );
  }

  // ── Main test screen ──────────────────────────────────────────────────────────
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
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Reading Proficiency Test
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Grade {user?.grade?.toString()} — Read the passage aloud and
              record yourself
            </p>
          </div>
        </div>

        {!passage ? (
          <Card className="rounded-xl bg-white border border-gray-200">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="font-medium">Loading your passage...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {/* Passage */}
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
                    <Badge className="bg-indigo-100 text-indigo-700 border-0">
                      Grade {passage.gradeLevel}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (isReading) {
                        window.speechSynthesis.cancel();
                        setIsReading(false);
                      } else {
                        const utt = new SpeechSynthesisUtterance(
                          passage.content,
                        );
                        utt.onend = () => setIsReading(false);
                        window.speechSynthesis.speak(utt);
                        setIsReading(true);
                      }
                    }}
                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-50 gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isReading ? "⏹ Stop" : "🔊 Listen"}
                  </Button>
                </div>
                <p className="text-base leading-8 text-gray-800 whitespace-pre-wrap">
                  {passage.content}
                </p>
              </CardContent>
            </Card>

            {/* Recording */}
            <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Record Your Reading
                  {recorder.audioUrl && (
                    <Badge className="ml-auto bg-green-100 text-green-700 border-0 gap-1">
                      <CheckCircle className="w-3 h-3" /> Recorded
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-sm text-gray-500">
                  Read the passage aloud. The system will score your{" "}
                  <strong>
                    rhythm, intonation, chunking, and pronunciation
                  </strong>
                  .
                </p>

                {!speech.isSupported && (
                  <div className="flex items-start gap-2 text-sm p-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    <MicOff className="w-4 h-4 shrink-0 mt-0.5" />
                    Voice analysis not available in this browser. Recording will
                    still be scored.
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  {!recorder.audioUrl && !recorder.isRecording && (
                    <Button
                      onClick={handleStartRecording}
                      className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Mic className="w-4 h-4" /> Start Recording
                    </Button>
                  )}
                  {recorder.isRecording && (
                    <>
                      <Button
                        onClick={handleStopRecording}
                        variant="outline"
                        className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <Square className="w-4 h-4" /> Stop —{" "}
                        {recorder.formatTime(recorder.seconds)}
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
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
                    <span className="text-xs text-green-600 font-medium">
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
                              <span className="text-gray-400 italic">
                                {" "}
                                {speech.interimText}
                              </span>
                            )}
                            {!speech.transcript &&
                              !speech.interimText &&
                              recorder.isRecording && (
                                <span className="text-gray-400 text-xs">
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

            {/* Score preview after recording */}
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
                            5: "bg-emerald-100 text-emerald-700 border-emerald-200",
                            4: "bg-teal-100 text-teal-700 border-teal-200",
                            3: "bg-blue-100 text-blue-700 border-blue-200",
                            2: "bg-amber-100 text-amber-700 border-amber-200",
                            1: "bg-red-100 text-red-700 border-red-200",
                          };
                          return (
                            <div
                              key={skill.key}
                              className={`rounded-lg border p-3 text-center ${colorMap[score] ?? colorMap[1]}`}
                            >
                              <p className="text-xs font-semibold mb-1">
                                {skill.emoji} {skill.label}
                              </p>
                              <p className="text-xl font-bold">
                                {score}
                                <span className="text-xs font-normal">/5</span>
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
              <p className="text-sm text-gray-500">
                {recorder.audioUrl ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Ready to submit
                  </span>
                ) : (
                  "Record yourself reading the passage to submit."
                )}
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-8"
                disabled={
                  !recorder.audioUrl ||
                  submitTest.isPending ||
                  submitFiredRef.current
                }
                onClick={handleManualSubmit}
              >
                {submitTest.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {submitTest.isPending ? "Submitting..." : "Submit Test"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
