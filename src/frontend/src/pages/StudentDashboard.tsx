import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2, Play, Trophy } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { useMyResults } from "../hooks/useQueries";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const { data: results, isLoading } = useMyResults();

  const avg =
    results && results.length > 0
      ? Math.round(
          (results.reduce((s, r) => s + Number(r.score), 0) / results.length) *
            10,
        ) / 10
      : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Student Dashboard" />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">My Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Grade <strong>{user?.grade?.toString() ?? "—"}</strong> • Reading
            Comprehension Tests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{results?.length ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Tests Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {avg !== null ? `${avg}/5` : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    G{user?.grade?.toString()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Grade {user?.grade?.toString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Take test CTA */}
        <Card className="rounded-2xl shadow-card-lg border-border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">
                Ready for a Reading Test?
              </h3>
              <p className="text-muted-foreground text-sm">
                Read a passage, record your voice, and answer 5 comprehension
                questions.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-classio-blue hover:bg-classio-blue/90 text-white gap-2 shrink-0"
              onClick={() => onNavigate("/student/test")}
              data-ocid="student.primary_button"
            >
              <Play className="w-4 h-4" />
              Take Test
            </Button>
          </div>
        </Card>

        {/* Results history */}
        <Card className="rounded-xl shadow-card border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              My Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div
                className="flex justify-center py-10"
                data-ocid="student.loading_state"
              >
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : results && results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((r, i) => (
                  <div
                    key={r.id.toString()}
                    className="flex items-center justify-between px-5 py-4"
                    data-ocid={`student.item.${i + 1}`}
                  >
                    <div>
                      <p className="text-sm font-medium">Test #{i + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(r.timestamp) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        Number(r.score) >= 4
                          ? "bg-accent/20 text-accent border-0"
                          : Number(r.score) >= 2
                            ? "bg-primary/10 text-primary border-0"
                            : "bg-destructive/10 text-destructive border-0"
                      }
                    >
                      {r.score.toString()}/5
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="student.empty_state"
              >
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No tests taken yet</p>
                <p className="text-sm">
                  Take your first test to see results here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
