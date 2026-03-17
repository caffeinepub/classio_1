import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UserRole } from "./backend";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useActor } from "./hooks/useActor";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LandingPage } from "./pages/LandingPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { StudentTest } from "./pages/StudentTest";
import { TeacherDashboard } from "./pages/TeacherDashboard";

const queryClient = new QueryClient();

function AppRoutes() {
  const [page, setPage] = useState<string>("/");
  const { user } = useAuth();
  const { actor } = useActor();

  const navigate = (p: string) => setPage(p);

  // Initialize system on fresh canisters, then ensure Classio1 admin exists
  useEffect(() => {
    if (actor) {
      actor.initializeSystem().catch(() => {
        // Already initialized — that's fine, just ensure Classio1 admin exists
        actor.ensureClassio1Admin().catch(() => {});
      });
    }
  }, [actor]);

  // Route guard
  if (!user) {
    return <LandingPage onNavigate={navigate} />;
  }

  if (user.role === UserRole.admin) {
    return <AdminDashboard />;
  }

  if (user.role === UserRole.teacher) {
    return <TeacherDashboard />;
  }

  // student
  if (page === "/student/test") {
    return <StudentTest onNavigate={navigate} />;
  }

  return <StudentDashboard onNavigate={navigate} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
