import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 border-b border-indigo-500/20 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-md rounded" />
            <img
              src="/assets/uploads/Classio_logo_reel-1.jpeg"
              alt="Classio"
              className="relative h-10 w-auto object-contain rounded"
            />
          </div>
          {title && (
            <>
              <span className="text-indigo-400/60 mx-1">/</span>
              <span className="text-sm font-medium text-indigo-300">
                {title}
              </span>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              Welcome,{" "}
              <span className="font-semibold text-indigo-300">
                {user.username}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200 hover:border-indigo-400"
              data-ocid="nav.button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
