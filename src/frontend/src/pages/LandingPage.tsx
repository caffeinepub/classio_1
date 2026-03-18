import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Info,
  Loader2,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

const TEACHERS = [
  "Mrs. Anderson — Grade 3-5",
  "Mr. Thompson — Grade 6-8",
  "Ms. Rivera — Grade 9-10",
];

const STUDENTS = [
  "Emma W. — Grade 4 — 5/5",
  "Liam T. — Grade 4 — 4/5",
  "Sophia K. — Grade 5 — 5/5",
];

const ROLES = [
  {
    icon: Users,
    title: "Admin",
    desc: "Create & manage teacher accounts, oversee school-wide performance",
    color: "bg-primary",
  },
  {
    icon: GraduationCap,
    title: "Teacher",
    desc: "Enroll students by grade, assign tests, and review comprehension results",
    color: "bg-accent",
  },
  {
    icon: BookOpen,
    title: "Student",
    desc: "Read passages, record your voice, and answer comprehension questions",
    color: "bg-classio-dark",
  },
];

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { actor } = useActor();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connecting to backend...");
      return;
    }
    setLoading(true);
    try {
      // login() is an update call that creates the session
      // We do NOT call getUserProfile() right after because it's a query
      // call that may not yet see the session committed by login()
      const resp = await actor.login(username, password);
      setUser({
        userId: resp.userId,
        role: resp.role,
        username,
        grade: undefined,
      });
      if (resp.role === UserRole.admin) onNavigate("/admin");
      else if (resp.role === UserRole.teacher) onNavigate("/teacher");
      else onNavigate("/student");
    } catch {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername("Classio1");
    setPassword("Classio@11");
    toast.success("Admin credentials filled in!");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.977 0.005 241) 0%, oklch(0.92 0.06 248 / 0.4) 40%, oklch(0.94 0.04 163 / 0.3) 100%)",
      }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Classio
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#roles"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              For Schools
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoginOpen(true)}
              data-ocid="nav.button"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => setLoginOpen(true)}
              className="bg-classio-dark text-white hover:bg-classio-dark/90"
              data-ocid="nav.primary_button"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Welcome to Classio
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
            Enhance Reading
            <br />
            <span className="text-classio-blue">Comprehension</span>{" "}
            <span className="text-classio-green">with Classio</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            A complete reading proficiency platform for schools. Manage
            teachers, students, and track comprehension progress — all in one
            place.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => setLoginOpen(true)}
              className="bg-classio-blue hover:bg-classio-blue/90 text-white gap-2 px-6"
              data-ocid="hero.primary_button"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLoginOpen(true)}
              className="gap-2 px-6 border-classio-green text-classio-green hover:bg-classio-green/10"
              data-ocid="hero.secondary_button"
            >
              Login to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="rounded-2xl shadow-card-lg border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Admin Panel</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage teachers & school settings
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-2">
                  {TEACHERS.map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <span className="text-sm font-medium">{t}</span>
                      <span className="text-xs text-muted-foreground">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-card-lg border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Teacher Panel</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Track student progress & results
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-2">
                  {STUDENTS.map((s) => (
                    <div
                      key={s}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <span className="text-sm font-medium">{s}</span>
                      <span className="text-xs text-accent font-medium">
                        Passed
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-card-lg border-border overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Student Test Interface
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reading passage + audio recording + comprehension questions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                    Reading Passage
                  </p>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                    Grade-appropriate passages covering nature, science,
                    history, and literature topics...
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                    Audio Recording
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <span className="text-sm font-medium">
                      Record your reading
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                    5 Questions
                  </p>
                  <p className="text-sm text-foreground">
                    Multiple choice comprehension assessment per passage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-16 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Designed for Every Role</h2>
          <p className="text-muted-foreground mb-10">
            A unified platform connecting administrators, teachers, and
            students.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-card border border-border shadow-card text-left"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold">Classio</span>
            <span className="text-muted-foreground text-sm">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Terms
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Contact
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="login.dialog">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <DialogTitle className="text-xl">Login to Classio</DialogTitle>
            </div>
          </DialogHeader>

          {/* Default Admin Credentials Hint */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-700 mb-1.5">
                Default Admin Login
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-blue-600">
                <span className="font-medium text-blue-500">Username</span>
                <span className="font-mono font-semibold text-blue-800">
                  Classio1
                </span>
                <span className="font-medium text-blue-500">Password</span>
                <span className="font-mono font-semibold text-blue-800">
                  Classio@11
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleQuickFill}
              className="shrink-0 h-7 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 gap-1"
              data-ocid="login.secondary_button"
            >
              <Zap className="w-3 h-3" />
              Quick Fill
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-1">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                data-ocid="login.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                data-ocid="login.input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
              disabled={loading}
              data-ocid="login.submit_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
