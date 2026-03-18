import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { createActorWithConfig } from "../config";
import { useAuth } from "../context/AuthContext";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const freshActor = await createActorWithConfig();
      const resp = await freshActor.login(username, password);
      setUser({
        userId: resp.userId,
        role: resp.role,
        username,
        grade: undefined,
      });
      if (resp.role === UserRole.admin) onNavigate("/admin");
      else if (resp.role === UserRole.teacher) onNavigate("/teacher");
      else onNavigate("/student");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : null;
      if (msg && msg.length < 200) {
        toast.error(`Login failed: ${msg}`);
      } else {
        toast.error("Invalid username or password");
      }
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <img
        src="/assets/uploads/Classio_logo_reel-1.jpeg"
        alt="Classio"
        className="w-56 md:w-64 rounded-2xl mb-12 shadow-2xl"
      />

      {/* Buttons */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <Button
          size="lg"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-base tracking-wide rounded-xl h-12"
          onClick={() => setLoginOpen(true)}
          data-ocid="landing.primary_button"
        >
          Get Started
        </Button>
        <Button
          size="lg"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-base tracking-wide rounded-xl h-12"
          onClick={() => setLoginOpen(true)}
          data-ocid="landing.secondary_button"
        >
          Login to Dashboard
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="login.dialog">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <img
                src="/assets/uploads/Classio_logo_reel-1.jpeg"
                alt="Classio"
                className="w-8 h-8 rounded-md object-cover"
              />
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
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
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
