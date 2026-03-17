import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Classio
          </span>
          {title && (
            <>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-base font-medium text-muted-foreground">
                {title}
              </span>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome,{" "}
              <span className="font-semibold text-foreground">
                {user.username}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5"
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
