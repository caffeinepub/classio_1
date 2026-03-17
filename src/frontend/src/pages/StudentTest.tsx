import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Loader2,
  Mic,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import {
  usePassageForGrade,
  useQuestionsForPassage,
  useSubmitTest,
} from "../hooks/useQueries";

interface StudentTestProps {
  onNavigate: (page: string) => void;
}

function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
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

  return { isRecording, audioUrl, seconds, formatTime, start, stop };
}

export function StudentTest({ onNavigate }: StudentTestProps) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<bigint | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const { isRecording, audioUrl, seconds, formatTime, start, stop } =
    useAudioRecorder();

  const { data: passage, isLoading: passageLoading } = usePassageForGrade(
    user?.grade,
  );
  const { data: questions, isLoading: questionsLoading } =
    useQuestionsForPassage(passage ? passage.id : undefined);
  const submitTest = useSubmitTest();

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

  const handleSubmit = async () => {
    if (!passage) return;
    const answersArr = (questions ?? []).map((_, i) => BigInt(answers[i] ?? 0));
    try {
      const result = await submitTest.mutateAsync({
        passageId: passage.id,
        answers: answersArr,
        audioBlobId: null,
      });
      setScore(result);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  };

  const allAnswered = questions
    ? questions.length > 0 && Object.keys(answers).length === questions.length
    : false;

  if (submitted && score !== null) {
    const scoreNum = Number(score);
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Test Complete" />
        <main
          className="max-w-xl mx-auto px-6 py-16 text-center"
          data-ocid="test.success_state"
        >
          <div
            className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              scoreNum >= 4
                ? "bg-accent/20"
                : scoreNum >= 2
                  ? "bg-primary/10"
                  : "bg-destructive/10"
            }`}
          >
            <CheckCircle
              className={`w-10 h-10 ${scoreNum >= 4 ? "text-accent" : scoreNum >= 2 ? "text-primary" : "text-destructive"}`}
            />
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Here's how you did on today's reading comprehension test.
          </p>
          <div className="text-6xl font-extrabold mb-2">
            <span
              className={
                scoreNum >= 4
                  ? "text-accent"
                  : scoreNum >= 2
                    ? "text-primary"
                    : "text-destructive"
              }
            >
              {scoreNum}
            </span>
            <span className="text-muted-foreground text-4xl">/5</span>
          </div>
          <p className="text-muted-foreground mb-8">
            {scoreNum === 5
              ? "Perfect score! Outstanding work! 🎉"
              : scoreNum >= 4
                ? "Excellent work! Almost perfect! 🌟"
                : scoreNum >= 3
                  ? "Good effort! Keep practicing! 📚"
                  : scoreNum >= 2
                    ? "Keep reading to improve! 💪"
                    : "Don't give up — every try counts! 🌱"}
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
            <h2 className="text-xl font-bold">Reading Comprehension Test</h2>
            <p className="text-sm text-muted-foreground">
              Grade {user?.grade?.toString()} — Complete all sections
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
          <div className="space-y-6">
            {/* Passage */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{passage.title}</CardTitle>
                  <Badge className="shrink-0 bg-primary/10 text-primary border-0">
                    Grade {passage.gradeLevel.toString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-base leading-8 text-foreground whitespace-pre-wrap">
                  {passage.content}
                </p>
              </CardContent>
            </Card>

            {/* Audio Recording */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Audio Recording
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Record yourself reading the passage aloud.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {!isRecording ? (
                    <Button
                      onClick={start}
                      className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      disabled={!!audioUrl}
                      data-ocid="test.button"
                    >
                      <Mic className="w-4 h-4" />
                      {audioUrl ? "Recorded ✓" : "Start Recording"}
                    </Button>
                  ) : (
                    <Button
                      onClick={stop}
                      variant="outline"
                      className="gap-2 border-destructive text-destructive"
                      data-ocid="test.button"
                    >
                      <Square className="w-4 h-4" />
                      Stop Recording — {formatTime(seconds)}
                    </Button>
                  )}
                  {isRecording && (
                    <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                      Recording... {formatTime(seconds)}
                    </div>
                  )}
                </div>
                {audioUrl && (
                  <div className="mt-4 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={togglePlayback}
                      data-ocid="test.toggle"
                    >
                      {playing ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      {playing ? "Pause" : "Play Recording"}
                    </Button>
                    {/* biome-ignore lint/a11y/useMediaCaption: recorded user audio */}
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setPlaying(false)}
                      className="hidden"
                    />
                    <span className="text-xs text-muted-foreground">
                      Recording saved
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base">
                  Comprehension Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                {questionsLoading ? (
                  <div
                    className="flex justify-center py-8"
                    data-ocid="test.loading_state"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : questions && questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((q, qi) => (
                      <div
                        key={q.id.toString()}
                        className="space-y-3"
                        data-ocid={`test.item.${qi + 1}`}
                      >
                        <p className="font-medium text-sm">
                          <span className="text-muted-foreground mr-2">
                            {qi + 1}.
                          </span>
                          {q.questionText}
                        </p>
                        <RadioGroup
                          value={
                            answers[qi] !== undefined ? String(answers[qi]) : ""
                          }
                          onValueChange={(v) =>
                            setAnswers((prev) => ({ ...prev, [qi]: Number(v) }))
                          }
                        >
                          {q.options.map((opt, oi) => (
                            <div
                              key={opt}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                            >
                              <RadioGroupItem
                                value={String(oi)}
                                id={`q${qi}-o${oi}`}
                              />
                              <Label
                                htmlFor={`q${qi}-o${oi}`}
                                className="cursor-pointer text-sm flex-1"
                              >
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-muted-foreground text-sm"
                    data-ocid="test.empty_state"
                  >
                    No questions available for this passage.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-between pb-8">
              <p className="text-sm text-muted-foreground">
                {allAnswered ? (
                  <span className="text-accent font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> All questions answered
                  </span>
                ) : (
                  `${Object.keys(answers).length}/${questions?.length ?? 5} answered`
                )}
              </p>
              <Button
                size="lg"
                className="bg-classio-blue hover:bg-classio-blue/90 text-white px-8"
                disabled={!allAnswered || submitTest.isPending}
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
