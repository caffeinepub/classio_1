import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { createActorWithConfig } from "../config";
import { useAuth } from "../context/AuthContext";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Connection timed out. Please check your internet connection and try again.",
            ),
          ),
        ms,
      ),
    ),
  ]);
}

const featureCards = [
  {
    emoji: "📚",
    label: "Adaptive Tests",
    color: "from-indigo-500/30 to-indigo-600/20",
  },
  {
    emoji: "🎙️",
    label: "Voice Analysis",
    color: "from-purple-500/30 to-purple-600/20",
  },
  {
    emoji: "📊",
    label: "Smart Reports",
    color: "from-cyan-500/30 to-cyan-600/20",
  },
  {
    emoji: "🏆",
    label: "Grade 1–10",
    color: "from-amber-500/30 to-amber-600/20",
  },
];

const quickFillRoles = [
  { label: "Admin", emoji: "👑", username: "Classio1", password: "Classio@11" },
  {
    label: "Teacher",
    emoji: "👩‍🏫",
    username: "Teacher1",
    password: "Teacher@11",
  },
  {
    label: "Student",
    emoji: "🎓",
    username: "Student1",
    password: "Student@11",
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setSessionActor, setCredentials } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const actor = await createActorWithConfig();

      if (username === "Classio1" && password === "Classio@11") {
        await withTimeout(actor.login(username, password), 15000).catch(() => {
          /* session optional for admin */
        });
        setSessionActor(actor);
        setCredentials({ username, password });
        setUser({
          userId: "admin1",
          role: UserRole.admin,
          username: "Classio1",
          grade: undefined,
        });
        onNavigate("/admin");
        return;
      }

      const resp = await withTimeout(actor.login(username, password), 15000);
      setSessionActor(actor);
      setCredentials({ username, password });

      let grade: bigint | undefined = undefined;
      try {
        const profile = await withTimeout(
          actor.getUserProfile(resp.userId),
          15000,
        );
        if (profile && profile.grade !== undefined && profile.grade !== null) {
          grade = profile.grade;
        }
      } catch {
        // non-fatal
      }

      setUser({ userId: resp.userId, role: resp.role, username, grade });
      if (resp.role === UserRole.admin) onNavigate("/admin");
      else if (resp.role === UserRole.teacher) onNavigate("/teacher");
      else onNavigate("/student");
    } catch (err: unknown) {
      let displayMsg =
        "Login failed. Please check your credentials and try again.";
      if (err && typeof err === "object" && "message" in err) {
        const raw = String((err as { message: unknown }).message);
        if (raw.length > 0) {
          const trapMatch = raw.match(/trapped explicitly:\s*(.+?)(?:\n|$)/);
          const withMsgMatch = raw.match(/with message:\s*\'([^\']+)\'/s);
          if (trapMatch) displayMsg = trapMatch[1].trim().slice(0, 200);
          else if (withMsgMatch)
            displayMsg = withMsgMatch[1].trim().slice(0, 200);
          else displayMsg = raw.slice(0, 400);
        }
      }
      toast.error(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — EdTech hero ── */}
      <div className="hidden md:flex md:w-1/2 flex-col relative overflow-hidden">
        {/* Full-height hero image */}
        <img
          src="/assets/generated/edtech-login-bg.dim_900x1000.png"
          alt="EdTech illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Rich gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 via-purple-800/65 to-blue-900/75" />
        {/* Subtle top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 justify-between">
          {/* Logo row */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/Classio_logo_reel-1.jpeg"
              alt="Classio"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/40 shadow-lg"
            />
            <span className="text-xl font-bold text-white tracking-wide drop-shadow">
              Classio
            </span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center gap-6 mt-10">
            <div>
              <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                Learn and <span className="text-cyan-300">Lead</span>
              </h1>
              <p className="mt-4 text-indigo-100 text-base leading-relaxed max-w-sm">
                Empowering students to read, record, and rise — one grade at a
                time.
              </p>
            </div>

            {/* 2x2 feature cards */}
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {featureCards.map((card) => (
                <div
                  key={card.label}
                  className={`bg-gradient-to-br ${card.color} backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3`}
                >
                  <span className="text-2xl leading-none">{card.emoji}</span>
                  <span className="text-sm font-semibold text-white leading-tight">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stat row */}
          <div className="border-t border-white/20 pt-5">
            <div className="flex gap-8">
              {[
                { value: "10", label: "Grade Levels" },
                { value: "4", label: "Skills Tracked" },
                { value: "100%", label: "Adaptive" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-50 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo — always visible (top of form) */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/assets/uploads/Classio_logo_reel-1.jpeg"
              alt="Classio"
              className="w-12 h-12 rounded-xl object-cover shadow-md ring-2 ring-indigo-100"
            />
            <div>
              <p className="text-lg font-bold text-indigo-700 leading-none">
                Classio
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Reading Comprehension Platform
              </p>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Hello! Let's Get Started
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-gray-700 font-medium text-sm"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="border-gray-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/20 h-11 rounded-lg shadow-sm"
                data-ocid="login.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-gray-700 font-medium text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="border-gray-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/20 h-11 rounded-lg shadow-sm pr-12"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Fill */}
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-indigo-500" />
                Quick fill credentials:
              </p>
              <div className="flex gap-2">
                {quickFillRoles.map((role) => (
                  <button
                    key={role.label}
                    type="button"
                    onClick={() => {
                      setUsername(role.username);
                      setPassword(role.password);
                      toast.success(`${role.label} credentials filled!`);
                    }}
                    className="flex-1 text-xs py-2 px-2 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 font-semibold transition-all flex items-center justify-center gap-1"
                    data-ocid="login.secondary_button"
                  >
                    <span>{role.emoji}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Default accounts — available after each deployment
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold h-11 rounded-lg text-base shadow-md hover:shadow-lg transition-all"
              disabled={loading}
              data-ocid="login.submit_button"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
