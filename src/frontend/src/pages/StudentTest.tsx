import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePassageForGrade, useSubmitTest } from "../hooks/useQueries";

interface StudentTestProps {
  onNavigate: (page: string) => void;
}

const SKILLS = ["Rhythm", "Intonation", "Chunking", "Pronunciation"];

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

export function StudentTest({ onNavigate }: StudentTestProps) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const { data: passage, isLoading: passageLoading } = usePassageForGrade(
    user?.grade,
  );
  const submitTest = useSubmitTest();
  const recorder = useAudioRecorder();

  const handleSubmit = async () => {
    if (!passage) return;
    try {
      await submitTest.mutateAsync({
        passageId: passage.id,
        answers: [],
        audioBlobId: null,
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  };

  // ── Result screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Test Complete" />
        <main
          className="max-w-xl mx-auto px-6 py-16 text-center"
          data-ocid="test.success_state"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-500/15">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Test Submitted!</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your teacher will review your recording and assess your{" "}
            <span className="font-medium text-foreground">
              rhythm, intonation, chunking, and pronunciation
            </span>
            .
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

  // ── Main test screen ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Reading Test" />
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Header row */}
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
              Grade {user?.grade?.toString()} — Read the passage and record
              yourself
            </p>
          </div>
        </div>

        {/* Loading state */}
        {passageLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="test.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !passage ? (
          // No-passage error state
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
            {/* 1. Reading Passage */}
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

            {/* 2. Skills Evaluated */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base">Skills Evaluated</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your teacher will assess these skills from your recording.
                </p>
              </CardContent>
            </Card>

            {/* 3. Audio Recording */}
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Audio Recording
                  {recorder.audioUrl && (
                    <Badge className="ml-auto bg-green-500/15 text-green-700 dark:text-green-400 border-0 gap-1">
                      <CheckCircle className="w-3 h-3" /> Recorded
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Read the passage aloud and record yourself. Focus on rhythm,
                  intonation, chunking, and pronunciation.
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {!recorder.audioUrl && !recorder.isRecording && (
                    <Button
                      onClick={recorder.start}
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
                        onClick={recorder.stop}
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
                  <div className="mt-4 flex items-center gap-3">
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
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-between pb-8">
              <p className="text-sm text-muted-foreground">
                {recorder.audioUrl ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Recording complete
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
