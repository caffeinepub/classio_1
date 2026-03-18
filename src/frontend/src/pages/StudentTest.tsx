import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Info,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import {
  useMyEffectiveLevel,
  usePassageForTest,
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
  if (s === "science") return "bg-teal-500/15 text-teal-700 border-teal-200";
  if (s === "history") return "bg-amber-500/15 text-amber-700 border-amber-200";
  if (s === "geography") return "bg-blue-500/15 text-blue-700 border-blue-200";
  return "bg-muted text-muted-foreground border-border";
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

  // Pronunciation: word match ratio
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

  // Rhythm: WPM deviation from 120
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

  // Chunking: segment count vs punctuation boundaries
  const punctuationCount = (passageText.match(/[,.]/g) || []).length;
  let chunking = 2;
  if (segments.length > 0 && punctuationCount > 0) {
    if (segments.length >= punctuationCount) chunking = 5;
    else if (segments.length >= punctuationCount * 0.75) chunking = 4;
    else if (segments.length >= punctuationCount * 0.5) chunking = 3;
    else if (segments.length >= punctuationCount * 0.25) chunking = 2;
    else chunking = 1;
  }

  // Intonation: recognized sentences vs passage sentences
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
  // biome-ignore lint/suspicious/noExplicitAny: SpeechRecognition not in all TS DOM libs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: cross-browser SpeechRecognition
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
    rec.lang = "en-US";

    // biome-ignore lint/suspicious/noExplicitAny: SpeechRecognitionEvent not in all TS DOM libs
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

    rec.onerror = () => {
      setIsListening(false);
    };

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

// ── Report Card ────────────────────────────────────────────────────────────────

const SKILL_META = [
  { key: "rhythm" as const, label: "Rhythm", emoji: "🎵" },
  { key: "intonation" as const, label: "Intonation", emoji: "🎶" },
  { key: "chunking" as const, label: "Chunking", emoji: "📋" },
  { key: "pronunciation" as const, label: "Pronunciation", emoji: "🗣️" },
];

const SCORE_COLORS: Record<number, string> = {
  5: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  4: "bg-teal-500/15 text-teal-700 border-teal-200",
  3: "bg-blue-500/15 text-blue-700 border-blue-200",
  2: "bg-amber-500/15 text-amber-700 border-amber-200",
  1: "bg-red-500/15 text-red-700 border-red-200",
};

const SCORE_FEEDBACK: Record<number, string> = {
  5: "Excellent!",
  4: "Good job!",
  3: "Keep practicing",
  2: "Needs improvement",
  1: "Practice more",
};

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 text-lg">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= score ? "text-amber-400" : "text-muted-foreground/30"}
        >
          {i <= score ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function AdaptiveBanner({
  total,
  enrolledGrade,
  effectiveLevel,
}: {
  total: number;
  enrolledGrade: bigint | undefined;
  effectiveLevel: bigint | undefined;
}) {
  const avg = total / 4;
  const isImproving =
    avg >= 4 &&
    enrolledGrade !== undefined &&
    effectiveLevel !== undefined &&
    effectiveLevel < enrolledGrade;

  if (isImproving) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 p-4 mb-5"
        data-ocid="test.success_state"
      >
        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Excellent! You are improving 🎉
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Your level is being raised back toward your enrolled grade.
          </p>
        </div>
      </motion.div>
    );
  }

  if (avg >= 4) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-800 p-4 mb-5"
        data-ocid="test.success_state"
      >
        <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
            Great job! Keep it up ✨
          </p>
          <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
            Your level is being maintained — you are reading at the right level.
          </p>
        </div>
      </motion.div>
    );
  }

  // Below 80% (total < 16)
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4 mb-5"
      data-ocid="test.error_state"
    >
      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
          Adjusting difficulty for you
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
          Your next passage will be slightly easier — keep practicing and you
          will level up soon!
        </p>
      </div>
    </motion.div>
  );
}

function ReportCard({
  scores,
  studentName,
  grade,
  enrolledGrade,
  effectiveLevel,
  onBack,
}: {
  scores: SkillScores;
  studentName: string;
  grade: string;
  enrolledGrade: bigint | undefined;
  effectiveLevel: bigint | undefined;
  onBack: () => void;
}) {
  const total =
    scores.rhythm + scores.intonation + scores.chunking + scores.pronunciation;
  const avg = Math.round((total / 4) * 10) / 10;
  const avgMsg =
    avg >= 4.5
      ? "Outstanding performance!"
      : avg >= 3.5
        ? "Great effort, keep it up!"
        : avg >= 2.5
          ? "Good start, keep practicing!"
          : "You're improving — practice daily!";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Reading Report" />
      <main
        className="max-w-2xl mx-auto px-6 py-10"
        data-ocid="test.success_state"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Adaptive notice banner */}
          <AdaptiveBanner
            total={total}
            enrolledGrade={enrolledGrade}
            effectiveLevel={effectiveLevel}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10 text-3xl">
              📊
            </div>
            <h2 className="text-3xl font-bold mb-1">Your Reading Report</h2>
            <p className="text-muted-foreground">
              {studentName} · Grade {grade}
            </p>
          </div>

          {/* 2×2 skill grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {SKILL_META.map((skill, idx) => {
              const score = scores[skill.key];
              const colorCls = SCORE_COLORS[score] || SCORE_COLORS[1];
              return (
                <motion.div
                  key={skill.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                >
                  <Card className={`rounded-xl border ${colorCls}`}>
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{skill.emoji}</span>
                          <span className="font-semibold text-sm">
                            {skill.label}
                          </span>
                        </div>
                        <Badge className={`text-xs border ${colorCls}`}>
                          {score}/5
                        </Badge>
                      </div>
                      <StarRating score={score} />
                      <p className="text-xs mt-2 font-medium">
                        {SCORE_FEEDBACK[score]}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Overall */}
          <Card className="rounded-xl border-border shadow-card mb-8">
            <CardContent className="pt-5 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Overall Average
              </p>
              <p className="text-4xl font-bold mb-2">
                {avg}
                <span className="text-xl text-muted-foreground">/5</span>
              </p>
              <p className="text-muted-foreground text-sm">{avgMsg}</p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-classio-blue hover:bg-classio-blue/90 text-white px-10"
              onClick={onBack}
              data-ocid="test.primary_button"
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function StudentTest({ onNavigate }: StudentTestProps) {
  const { user } = useAuth();
  const [computedScores, setComputedScores] = useState<SkillScores | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const startTimeRef = useRef<number>(0);

  const { data: passage, isLoading: passageLoading } = usePassageForTest();
  const { data: levelData } = useMyEffectiveLevel();
  const submitTest = useSubmitTestWithSkills();
  const recorder = useAudioRecorder();
  const speech = useSpeechRecognition();

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

  // Compute scores when recording stops and transcript is available
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
    }
  }, [
    recorder.isRecording,
    recorder.audioUrl,
    speech.transcript,
    speech.segments,
    passage,
    recordingDuration,
  ]);

  const handleSubmit = async () => {
    if (!passage) return;
    const scores = computedScores ?? {
      rhythm: 1,
      intonation: 1,
      chunking: 1,
      pronunciation: 1,
    };
    try {
      await submitTest.mutateAsync({
        passageId: passage.id,
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

  // Show report card after submission (with scores if available)
  if (submitTest.isSuccess) {
    if (computedScores) {
      return (
        <ReportCard
          scores={computedScores}
          studentName={user?.username ?? "Student"}
          grade={user?.grade?.toString() ?? "—"}
          enrolledGrade={levelData?.enrolledGrade}
          effectiveLevel={levelData?.effectiveLevel}
          onBack={() => onNavigate("/student")}
        />
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Test Complete" />
        <main
          className="max-w-xl mx-auto px-6 py-16 text-center"
          data-ocid="test.success_state"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-500/15">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Test Submitted!</h2>
          <p className="text-muted-foreground mb-8">
            Your teacher will review your recording and assess your skills.
          </p>
          <Button
            onClick={() => onNavigate("/student")}
            className="bg-classio-blue hover:bg-classio-blue/90 text-white px-8"
            data-ocid="test.primary_button"
          >
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Reading Test" />
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
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
            <h2 className="text-xl font-bold">Reading Proficiency Test</h2>
            <p className="text-sm text-muted-foreground">
              Grade {user?.grade?.toString()} — Read the passage aloud and
              record yourself
            </p>
          </div>
        </div>

        {passageLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="test.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !passage ? (
          <Card
            className="rounded-xl border-border"
            data-ocid="test.error_state"
          >
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="font-medium">
                No passage available for your grade level
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please ask your teacher to assign appropriate content.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => onNavigate("/student")}
                data-ocid="test.button"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {/* 1. Passage */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <CardTitle className="text-lg">{passage.title}</CardTitle>
                  <div className="flex items-center gap-2 shrink-0">
                    {passage.subject && (
                      <Badge
                        className={`text-xs border ${subjectBadgeClass(
                          passage.subject,
                        )}`}
                      >
                        {passage.subject}
                      </Badge>
                    )}
                    <Badge className="bg-primary/10 text-primary border-0">
                      Grade {passage.gradeLevel.toString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-base leading-8 text-foreground whitespace-pre-wrap">
                  {passage.content}
                </p>
              </CardContent>
            </Card>

            {/* 2. Recording */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Record Your Reading
                  {recorder.audioUrl && (
                    <Badge className="ml-auto bg-green-500/15 text-green-700 dark:text-green-400 border-0 gap-1">
                      <CheckCircle className="w-3 h-3" /> Recorded
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-sm text-muted-foreground">
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
                      <Mic className="w-4 h-4" />
                      Start Recording
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
                        <Square className="w-4 h-4" />
                        Stop — {recorder.formatTime(recorder.seconds)}
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

                {/* Live Transcript Panel */}
                <AnimatePresence>
                  {(recorder.isRecording || recorder.audioUrl) &&
                    speech.isSupported && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="rounded-lg border border-border bg-muted/40 p-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Live Transcript
                          </p>
                          <p className="text-sm leading-relaxed min-h-[2rem]">
                            <span>{speech.transcript}</span>
                            {speech.interimText && (
                              <span className="text-muted-foreground/60 italic">
                                {" "}
                                {speech.interimText}
                              </span>
                            )}
                            {!speech.transcript &&
                              !speech.interimText &&
                              recorder.isRecording && (
                                <span className="text-muted-foreground/50 text-xs">
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
                  <Card className="rounded-xl border-border shadow-card">
                    <CardHeader className="border-b border-border pb-4">
                      <CardTitle className="text-base">
                        Skill Score Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SKILL_META.map((skill) => {
                          const score = computedScores[skill.key];
                          const colorCls =
                            SCORE_COLORS[score] || SCORE_COLORS[1];
                          return (
                            <div
                              key={skill.key}
                              className={`rounded-lg border p-3 text-center ${colorCls}`}
                            >
                              <p className="text-xs font-semibold mb-1">
                                {skill.label}
                              </p>
                              <p className="text-xl font-bold">
                                {score}
                                <span className="text-xs">/5</span>
                              </p>
                              <p className="text-xs mt-1">
                                {SCORE_FEEDBACK[score]}
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
              <p className="text-sm text-muted-foreground">
                {recorder.audioUrl ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Ready to submit
                  </span>
                ) : (
                  "Record yourself reading the passage to submit."
                )}
              </p>
              <Button
                size="lg"
                className="bg-classio-blue hover:bg-classio-blue/90 text-white px-8"
                disabled={!recorder.audioUrl || submitTest.isPending}
                onClick={handleSubmit}
                data-ocid="test.submit_button"
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
