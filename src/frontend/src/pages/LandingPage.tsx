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

  const handleQuickFill = () => {
    setUsername("Classio1");
    setPassword("Classio@11");
    toast.success("Admin credentials filled!");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark high-tech gradient */}
      <div
        className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0a3c 70%, #0a1628 100%)",
        }}
      >
        {/* Glowing orb accents */}
        <div
          className="absolute top-10 left-10 w-48 h-48 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute bottom-16 right-8 w-64 h-64 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* High-tech illustration */}
          <div
            className="rounded-2xl mb-8 shadow-2xl w-full overflow-hidden"
            style={{
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow:
                "0 0 40px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="/assets/generated/login-hero.dim_800x900.jpg"
              alt="Adaptive learning technology"
              className="w-full object-cover"
              style={{ maxHeight: "340px" }}
            />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Welcome to Classio
          </h2>
          <p
            className="text-lg font-semibold mb-3"
            style={{
              background: "linear-gradient(90deg, #06b6d4, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learn and Lead
          </p>
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "rgba(165,180,252,0.8)" }}
          >
            Unlock your reading potential with intelligent assessments and
            personalised learning pathways.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-5 justify-center">
            {[
              "Adaptive Tests",
              "Voice Analysis",
              "Smart Reports",
              "Grade 1–10",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo + brand */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/uploads/Classio_logo_reel-1.jpeg"
              alt="Classio"
              className="w-12 h-12 rounded-xl object-cover shadow"
            />
            <span className="text-2xl font-bold text-gray-800">Classio</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1 mt-4">
            Hello! Let's Get Started
          </h1>
          <p className="text-gray-500 text-sm mb-8">Learn and Lead</p>

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
                className="bg-blue-50 border-blue-100 focus:border-blue-400 h-12 rounded-xl"
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
                  className="bg-blue-50 border-blue-100 focus:border-blue-400 h-12 rounded-xl pr-12"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleQuickFill}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5 px-0"
                data-ocid="login.secondary_button"
              >
                <Zap className="w-4 h-4" />
                Quick Fill (Admin)
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold h-12 rounded-full text-base shadow-md"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
              }}
              disabled={loading}
              data-ocid="login.submit_button"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
