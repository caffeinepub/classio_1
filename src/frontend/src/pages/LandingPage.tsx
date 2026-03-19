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

  const quickFillRoles = [
    { label: "Admin", username: "Classio1", password: "Classio@11" },
    { label: "Teacher", username: "Teacher1", password: "Teacher@11" },
    { label: "Student", username: "Student1", password: "Student@11" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — professional indigo gradient */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800">
        {/* Subtle circuit grid overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Subtle glow accent */}
        <div className="absolute top-16 right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-8 w-56 h-56 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <img
            src="/assets/uploads/Classio_logo_reel-1.jpeg"
            alt="Classio"
            className="w-20 h-20 rounded-2xl object-cover shadow-xl mb-6 ring-4 ring-white/20"
          />
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Welcome to Classio
          </h2>
          <p className="text-indigo-100 text-base leading-relaxed mb-6">
            Unlock your reading potential with intelligent assessments and
            personalised learning pathways.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Adaptive Tests",
              "Voice Analysis",
              "Smart Reports",
              "Grade 1–10",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full font-medium bg-white/15 border border-white/25 text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Decorative stat row */}
          <div className="flex gap-6 mt-10 border-t border-white/20 pt-6 w-full justify-center">
            {[
              { value: "10", label: "Grade Levels" },
              { value: "4", label: "Skills Tracked" },
              { value: "100%", label: "Adaptive" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-indigo-200 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — white login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <img
              src="/assets/uploads/Classio_logo_reel-1.jpeg"
              alt="Classio"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-gray-900">Classio</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Hello! Let's Get Started
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="border-gray-300 bg-gray-50 focus:border-indigo-500 h-11 rounded-lg"
                data-ocid="login.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-gray-700 font-medium">
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
                  className="border-gray-300 bg-gray-50 focus:border-indigo-500 h-11 rounded-lg pr-12"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Fill buttons */}
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
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
                    className="flex-1 text-xs py-1.5 px-2 rounded-md border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 font-medium transition-colors"
                    data-ocid="login.secondary_button"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Default accounts — available after each deployment
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-lg text-base"
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
