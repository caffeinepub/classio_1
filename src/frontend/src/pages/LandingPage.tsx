import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

      // Admin hardcoded bypass — accepts classio1 / classio11
      if (username === "classio1" && password === "classio11") {
        await withTimeout(actor.login(username, password), 15000).catch(
          () => {},
        );
        setSessionActor(actor);
        setCredentials({ username, password });
        setUser({
          userId: "admin1",
          role: UserRole.admin,
          username: "classio1",
          grade: undefined,
        });
        onNavigate("/admin");
        return;
      }

      // Hardcoded bypass for default teacher
      if (username === "Teacher1" && password === "Teacher@11") {
        await withTimeout(actor.login(username, password), 15000).catch(
          () => {},
        );
        setSessionActor(actor);
        setCredentials({ username, password });
        setUser({
          userId: "teacher_default",
          role: UserRole.teacher,
          username: "Teacher1",
          grade: undefined,
        });
        onNavigate("/teacher");
        return;
      }

      // Hardcoded bypass for default student
      if (username === "Student1" && password === "Student@11") {
        await withTimeout(actor.login(username, password), 15000).catch(
          () => {},
        );
        setSessionActor(actor);
        setCredentials({ username, password });
        setUser({
          userId: "student_default",
          role: UserRole.student,
          username: "Student1",
          grade: 5n,
        });
        onNavigate("/student");
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
        // Candid optional is returned as [] | [UserProfile]
        const profileObj = Array.isArray(profile) ? profile[0] : profile;
        if (
          profileObj &&
          profileObj.grade !== undefined &&
          profileObj.grade !== null
        ) {
          const rawGrade = profileObj.grade;
          grade = Array.isArray(rawGrade) ? rawGrade[0] : (rawGrade as bigint);
        }
      } catch {
        /* non-fatal */
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
          if (displayMsg.toLowerCase().includes("invalid")) {
            displayMsg =
              "Invalid username or password. Default accounts: Admin (classio1/classio11), Teacher (Teacher1/Teacher@11), Student (Student1/Student@11).";
          }
        }
      }
      toast.error(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden md:flex md:w-[52%] flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0b3d6b 0%, #1a4f8a 25%, #1e3a8a 55%, #312e81 80%, #3730a3 100%)",
        }}
      >
        {/* Geometric SVG ornaments — top right */}
        <svg
          className="absolute top-0 right-0 w-72 h-72 opacity-20 pointer-events-none"
          viewBox="0 0 288 288"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="220" cy="68" r="100" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="220" cy="68" r="65" stroke="#818cf8" strokeWidth="1" />
          <circle
            cx="220"
            cy="68"
            r="32"
            stroke="#38bdf8"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="155" cy="20" r="6" fill="#38bdf8" />
          <circle cx="272" cy="130" r="4" fill="#818cf8" />
          <circle cx="240" cy="148" r="3" fill="#38bdf8" opacity="0.7" />
        </svg>

        {/* Geometric SVG ornaments — bottom left */}
        <svg
          className="absolute bottom-0 left-0 w-64 h-64 opacity-15 pointer-events-none"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="36" cy="220" r="90" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="36" cy="220" r="55" stroke="#818cf8" strokeWidth="1" />
          <circle cx="100" cy="256" r="5" fill="#38bdf8" />
          <circle cx="0" cy="160" r="4" fill="#818cf8" />
          <path
            d="M80 180 Q120 150 160 180"
            stroke="#38bdf8"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
        </svg>

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top brand strip */}
        <div className="relative z-10 flex items-center gap-3 px-10 pt-9">
          <img
            src="/assets/uploads/Classio_logo_reel-1.jpeg"
            alt="Classio"
            className="w-9 h-9 rounded-xl object-cover ring-2 shadow-lg"
            style={{
              outline: "2px solid rgba(56,189,248,0.4)",
              outlineOffset: "1px",
            }}
          />
          <span className="font-display font-bold text-lg text-white tracking-wide">
            Classio
          </span>
        </div>

        {/* Middle — illustration */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 py-6">
          {/* Decorative arc behind the card */}
          <div
            className="absolute w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <div
            className="relative w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              boxShadow:
                "0 8px 40px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <img
              src="/assets/generated/classio-school-hero.dim_800x600.jpg"
              alt="EdTech illustration"
              className="w-full object-cover"
              style={{ height: "310px", objectPosition: "center top" }}
            />
            {/* Subtle teal gradient bottom wash on image */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(11,61,107,0.7) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Tag line below card */}
          <div className="mt-7 text-center">
            <p className="font-display font-semibold text-xl text-white leading-snug">
              Empowering Readers,
            </p>
            <p
              className="font-display font-semibold text-xl leading-snug"
              style={{ color: "#38bdf8" }}
            >
              Shaping Leaders
            </p>
          </div>
        </div>

        {/* Grade ribbon */}
        <div className="relative z-10 pb-8 flex justify-center">
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
              <span
                key={g}
                className="text-xs font-semibold"
                style={{
                  color: g <= 3 ? "#38bdf8" : g <= 7 ? "#a5b4fc" : "#e0e7ff",
                }}
              >
                G{g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="w-full md:w-[48%] flex items-center justify-center px-8 py-12"
        style={{ background: "#fafafa" }}
      >
        <div className="w-full max-w-[360px]">
          {/* Logo block */}
          <div className="flex flex-col items-center mb-9 gap-3">
            <div
              className="p-1.5 rounded-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
              }}
            >
              <img
                src="/assets/uploads/Classio_logo_reel-1.jpeg"
                alt="Classio"
                className="w-14 h-14 rounded-xl object-cover"
              />
            </div>
            <div className="text-center">
              <p
                className="font-display text-2xl font-extrabold leading-none tracking-tight"
                style={{ color: "#1e3a8a" }}
              >
                Classio
              </p>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: "#0ea5e9" }}
              >
                Learn and Lead
              </p>
            </div>
          </div>

          {/* Heading + divider */}
          <div className="mb-7">
            <h2
              className="font-display text-xl font-bold text-center"
              style={{ color: "#1e293b" }}
            >
              Hello! Let&apos;s Get Started
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
              <div
                className="h-1 w-10 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1e3a8a, #0ea5e9)",
                }}
              />
              <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
            </div>
            <p
              className="text-center text-sm mt-2.5"
              style={{ color: "#94a3b8" }}
            >
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-sm font-semibold"
                style={{ color: "#475569" }}
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
                className="h-11 rounded-xl text-sm placeholder:text-slate-400"
                style={{
                  background: "#f1f5f9",
                  border: "1.5px solid #cbd5e1",
                  color: "#1e293b",
                }}
                data-ocid="login.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-semibold"
                style={{ color: "#475569" }}
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
                  className="h-11 rounded-xl text-sm placeholder:text-slate-400 pr-12"
                  style={{
                    background: "#f1f5f9",
                    border: "1.5px solid #cbd5e1",
                    color: "#1e293b",
                  }}
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#94a3b8" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white font-bold h-12 rounded-full text-sm shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, #1e40af 0%, #1e3a8a 40%, #312e81 100%)",
                boxShadow: "0 4px 20px 0 rgba(30,58,138,0.4)",
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

          {/* Default accounts hint */}
          <div
            className="mt-6 p-4 rounded-2xl"
            style={{
              background: "#f0f4ff",
              border: "1px solid #c7d2fe",
            }}
          >
            <p
              className="text-center text-xs font-bold mb-1.5"
              style={{ color: "#4338ca" }}
            >
              Default accounts
            </p>
            <p className="text-center text-xs" style={{ color: "#6366f1" }}>
              Admin:{" "}
              <span className="font-semibold" style={{ color: "#1e3a8a" }}>
                classio1 / classio11
              </span>
            </p>
            <p
              className="text-center text-xs mt-0.5"
              style={{ color: "#6366f1" }}
            >
              Teacher:{" "}
              <span className="font-semibold" style={{ color: "#1e3a8a" }}>
                Teacher1 / Teacher@11
              </span>
              {" · "}Student:{" "}
              <span className="font-semibold" style={{ color: "#1e3a8a" }}>
                Student1 / Student@11
              </span>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: "#cbd5e1" }}>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#0ea5e9" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
