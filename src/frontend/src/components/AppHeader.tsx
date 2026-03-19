import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Indigo accent bar at top */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500" />
      <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/Classio_logo_reel-1.jpeg"
            alt="Classio"
            className="h-9 w-9 object-cover rounded-lg ring-1 ring-indigo-100"
          />
          <span className="font-bold text-indigo-700 text-lg leading-none">
            Classio
          </span>
          {title && (
            <>
              <span className="text-gray-300 mx-1">/</span>
              <span className="text-sm font-semibold text-indigo-600">
                {title}
              </span>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Welcome,{" "}
              <span className="font-semibold text-indigo-600">
                {user.username}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
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
