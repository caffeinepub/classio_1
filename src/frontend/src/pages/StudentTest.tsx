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

// ── Fluency range by grade ─────────────────────────────────────────────────────

function fluencyRange(grade: number): [number, number] {
  if (grade <= 2) return [50, 70];
  if (grade <= 4) return [70, 100];
  if (grade <= 6) return [100, 120];
  if (grade <= 8) return [120, 150];
  return [150, 180];
}

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
    cls: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    min: 0,
    label: "🔰 Beginner",
    cls: "bg-red-100 text-red-800 border-red-200",
  },
];

function LevelBadge({ avgScore }: { avgScore: number }) {
  const badge =
    LEVEL_BADGES.find((b) => avgScore >= b.min) ??
    LEVEL_BADGES[LEVEL_BADGES.length - 1];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${
        badge.cls
      }`}
    >
      {badge.label}
    </span>
  );
}

// ── Adaptive Banner ────────────────────────────────────────────────────────────

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
          Keep Practicing!
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
          You are building your skills — your next passage will help you improve
          steadily!
        </p>
      </div>
    </motion.div>
  );
}

// ── New Report Card ────────────────────────────────────────────────────────────

function ReportCard({
  scores,
  studentName,
  grade,
  enrolledGrade,
  effectiveLevel,
  transcript,
  passageContent,
  recordingDuration,
  gradeLevel,
  previousScore,
  onBack,
  onNavigate,
  foundLevel,
}: {
  scores: SkillScores;
  studentName: string;
  grade: string;
  enrolledGrade: bigint | undefined;
  effectiveLevel: bigint | undefined;
  transcript: string;
  passageContent: string;
  recordingDuration: number;
  gradeLevel: number;
  previousScore: number;
  onBack: () => void;
  onNavigate?: (page: string) => void;
  foundLevel?: number | null;
}) {
  const total =
    scores.rhythm + scores.intonation + scores.chunking + scores.pronunciation;
  const overallAvg = total / 4;
  const readingAvg = (scores.rhythm + scores.chunking) / 2;
  const comprehensionAvg = (scores.intonation + scores.pronunciation) / 2;

  const passageWords = normalizeWords(passageContent);
  const transcriptWords = normalizeWords(transcript);
  const passageSet = new Set(passageWords);
  const transcriptSet = new Set(transcriptWords);
  const correctWords = transcriptWords.filter((w) => passageSet.has(w)).length;
  const mispronounced = Math.min(
    transcriptWords.filter((w) => !passageSet.has(w)).length,
    passageWords.length,
  );
  const missedWords = passageWords.filter((w) => !transcriptSet.has(w)).length;

  const wpm =
    recordingDuration > 0
      ? Math.round((transcriptWords.length / recordingDuration) * 60)
      : 0;
  const [rangeMin, rangeMax] = fluencyRange(gradeLevel);

  const rhythmIntonationAvg = (scores.rhythm + scores.intonation) / 2;
  const indicators = [
    { label: "Overall", avg: overallAvg },
    { label: "Reading", avg: readingAvg },
    { label: "Comprehension", avg: comprehensionAvg },
  ];

  const journeyLevel = foundLevel ?? gradeLevel;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Reading Report Card" />
      <main
        className="max-w-5xl mx-auto px-4 py-8"
        data-ocid="test.success_state"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AdaptiveBanner
            total={total}
            enrolledGrade={enrolledGrade}
            effectiveLevel={effectiveLevel}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Reading Report Card</h2>
              <p className="text-sm text-muted-foreground">
                {studentName} · Grade {grade}
              </p>
            </div>
            <LevelBadge avgScore={overallAvg} />
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <ScoreOverviewPanel
              readingCurrent={readingAvg}
              readingPrevious={previousScore > 0 ? previousScore / 4 : null}
              compCurrent={comprehensionAvg}
              compPrevious={previousScore > 0 ? previousScore / 4 : null}
              max={5}
            />
            <ReportingIndicatorsPanel
              indicators={indicators.map((ind) => ({
                label: ind.label,
                score: ind.avg,
                max: 5,
              }))}
            />
            <div className="flex flex-col gap-4">
              <SkillCard
                color="emerald"
                title="Pronunciation"
                icon={<Volume2 className="w-4 h-4 text-emerald-700" />}
              >
                <StarRating value={scores.pronunciation} max={5} />
                <div className="space-y-1 text-xs mt-2">
                  <p className="text-emerald-700 font-medium">
                    ✓ Correct Pronounced Words — {correctWords}
                  </p>
                  <p className="text-amber-700 font-medium">
                    ⚠ Mispronounced Words — {mispronounced}
                  </p>
                  <p className="text-red-700 font-medium">
                    ✗ Missed Words — {missedWords}
                  </p>
                </div>
              </SkillCard>
              <SkillCard
                color="rose"
                title="Rhythm & Intonation"
                icon={<Music className="w-4 h-4 text-rose-700" />}
              >
                <StarRating value={rhythmIntonationAvg} max={5} />
                <p className="text-xs text-rose-700 mt-2">
                  Rhythm: {scores.rhythm}/5 · Intonation: {scores.intonation}/5
                </p>
              </SkillCard>
              <SkillCard
                color="sky"
                title="Fluency"
                icon={<Zap className="w-4 h-4 text-sky-700" />}
              >
                <p className="text-lg font-bold text-sky-800">
                  {wpm} words/min
                </p>
                <p className="text-xs text-sky-600 mt-0.5">
                  Grade target: {rangeMin}–{rangeMax} words/min
                </p>
              </SkillCard>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {onNavigate && (
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 gap-2"
                onClick={() => onNavigate("/student/vocab")}
                data-ocid="test.secondary_button"
              >
                🚀 Start Learning Journey from Grade {journeyLevel} →
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
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

// ── Try Next Level Screen ──────────────────────────────────────────────────────

function TryNextLevelScreen({
  scores,
  currentTestLevel,
  newLevel,
  attemptsMade,
  enrolledGrade,
  transcript,
  passageContent,
  recordingDuration,
  gradeLevel,
  previousScore,
  onRetry,
  onBack,
}: {
  scores: SkillScores;
  currentTestLevel: number;
  newLevel: number;
  attemptsMade: number;
  enrolledGrade: number;
  transcript: string;
  passageContent: string;
  recordingDuration: number;
  gradeLevel: number;
  previousScore: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const total =
    scores.rhythm + scores.intonation + scores.chunking + scores.pronunciation;
  const overallAvg = total / 4;
  const readingAvg = (scores.rhythm + scores.chunking) / 2;
  const comprehensionAvg = (scores.intonation + scores.pronunciation) / 2;

  const passageWords = normalizeWords(passageContent);
  const transcriptWords = normalizeWords(transcript);
  const passageSet = new Set(passageWords);
  const transcriptSet = new Set(transcriptWords);
  const correctWords = transcriptWords.filter((w) => passageSet.has(w)).length;
  const mispronounced = Math.min(
    transcriptWords.filter((w) => !passageSet.has(w)).length,
    passageWords.length,
  );
  const missedWords = passageWords.filter((w) => !transcriptSet.has(w)).length;

  const wpm =
    recordingDuration > 0
      ? Math.round((transcriptWords.length / recordingDuration) * 60)
      : 0;
  const [rangeMin, rangeMax] = fluencyRange(gradeLevel);
  const rhythmIntonationAvg = (scores.rhythm + scores.intonation) / 2;
  const indicators = [
    { label: "Overall", avg: overallAvg },
    { label: "Reading", avg: readingAvg },
    { label: "Comprehension", avg: comprehensionAvg },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Keep Going!" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Encouragement Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-6 mb-6"
            data-ocid="test.panel"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-2xl">
                💪
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">
                    Keep Going!
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
                    Attempt {attemptsMade}/{enrolledGrade}
                  </span>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  Your pronunciation, rhythm, and speed show you are working
                  toward <strong>Grade {currentTestLevel} level</strong>. Let's
                  try a <strong>Grade {newLevel}</strong> passage next to find
                  your best starting point!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Score overview */}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Your Scores This Attempt
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <ScoreOverviewPanel
              readingCurrent={readingAvg}
              readingPrevious={previousScore > 0 ? previousScore / 4 : null}
              compCurrent={comprehensionAvg}
              compPrevious={previousScore > 0 ? previousScore / 4 : null}
              max={5}
            />
            <ReportingIndicatorsPanel
              indicators={indicators.map((ind) => ({
                label: ind.label,
                score: ind.avg,
                max: 5,
              }))}
            />
            <div className="flex flex-col gap-4">
              <SkillCard
                color="emerald"
                title="Pronunciation"
                icon={<Volume2 className="w-4 h-4 text-emerald-700" />}
              >
                <StarRating value={scores.pronunciation} max={5} />
                <div className="space-y-1 text-xs mt-2">
                  <p className="text-emerald-700 font-medium">
                    ✓ Correct — {correctWords}
                  </p>
                  <p className="text-amber-700 font-medium">
                    ⚠ Mispronounced — {mispronounced}
                  </p>
                  <p className="text-red-700 font-medium">
                    ✗ Missed — {missedWords}
                  </p>
                </div>
              </SkillCard>
              <SkillCard
                color="rose"
                title="Rhythm & Intonation"
                icon={<Music className="w-4 h-4 text-rose-700" />}
              >
                <StarRating value={rhythmIntonationAvg} max={5} />
                <p className="text-xs text-rose-700 mt-2">
                  Rhythm: {scores.rhythm}/5 · Intonation: {scores.intonation}/5
                </p>
              </SkillCard>
              <SkillCard
                color="sky"
                title="Fluency"
                icon={<Zap className="w-4 h-4 text-sky-700" />}
              >
                <p className="text-lg font-bold text-sky-800">
                  {wpm} words/min
                </p>
                <p className="text-xs text-sky-600 mt-0.5">
                  Target: {rangeMin}–{rangeMax} wpm
                </p>
              </SkillCard>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 gap-2"
              onClick={onRetry}
              data-ocid="test.primary_button"
            >
              📖 Try Grade {newLevel} Passage
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onBack}
              data-ocid="test.secondary_button"
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
  const levelActionFiredRef = useRef(false);

  const userId = user?.userId ?? "";
  const enrolledGrade = user?.grade ? Number(user.grade) : 1;

  const proficiency = useProficiencySearch(userId, enrolledGrade);
  const {
    attemptsMade,
    currentTestLevel,
    levelFound,
    foundLevel,
    passLevel,
    failLevel,
    reset,
  } = proficiency;

  const { data: results } = useMyResults(userId);
  const { data: levelData } = useMyEffectiveLevel(userId);
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
  const previousScore = useMemo(() => {
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

  const gradeLevel = user?.grade ? Number(user.grade) : 1;

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

  if (submitTest.isSuccess) {
    if (computedScores) {
      // If level not yet found (still searching), show "try next level" screen
      // (levelFound becomes true after failLevel() if already at level 1)
      // We check the local state: after failLevel, levelFound may be true (at level 1) or false
      // We determine: if originally passed OR (after failLevel, levelFound is true) → show report
      // else show try next level
      if (!passed && !levelFound) {
        return (
          <TryNextLevelScreen
            scores={computedScores}
            currentTestLevel={currentTestLevel + 1} // the level just tested
            newLevel={currentTestLevel}
            attemptsMade={attemptsMade}
            enrolledGrade={enrolledGrade}
            transcript={speech.transcript}
            passageContent={passage?.content ?? ""}
            recordingDuration={recordingDuration}
            gradeLevel={gradeLevel}
            previousScore={previousScore}
            onRetry={handleRetry}
            onBack={() => onNavigate("/student")}
          />
        );
      }

      // Level found (passed or reached bottom) → show report card with journey CTA
      return (
        <ReportCard
          scores={computedScores}
          studentName={user?.username ?? "Student"}
          grade={user?.grade?.toString() ?? "—"}
          enrolledGrade={levelData?.enrolledGrade}
          effectiveLevel={levelData?.effectiveLevel}
          transcript={speech.transcript}
          passageContent={passage?.content ?? ""}
          recordingDuration={recordingDuration}
          gradeLevel={gradeLevel}
          previousScore={previousScore}
          onBack={() => onNavigate("/student")}
          onNavigate={onNavigate}
          foundLevel={foundLevel ?? currentTestLevel}
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
            Your recording has been submitted and your skills have been
            assessed.
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
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-muted-foreground">
                Grade {user?.grade?.toString()} — Read the passage aloud and
                record yourself
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
                Attempt {attemptsMade}/{enrolledGrade}
              </span>
            </div>
          </div>
        </div>

        {!passage ? (
          <Card
            className="rounded-xl border-border"
            data-ocid="test.error_state"
          >
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Loading your passage...</p>
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
                        className={`text-xs border ${subjectBadgeClass(passage.subject)}`}
                      >
                        {passage.subject}
                      </Badge>
                    )}
                    <Badge className="bg-primary/10 text-primary border-0">
                      Grade {passage.gradeLevel}
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
                            5: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
                            4: "bg-teal-500/15 text-teal-700 border-teal-200",
                            3: "bg-blue-500/15 text-blue-700 border-blue-200",
                            2: "bg-amber-500/15 text-amber-700 border-amber-200",
                            1: "bg-red-500/15 text-red-700 border-red-200",
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
                              <p className="text-xl font-bold">
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
