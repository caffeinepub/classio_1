import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { UserRole } from "./backend";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { LandingPage } from "./pages/LandingPage";
import { PracticeTest } from "./pages/PracticeTest";
import { StudentDashboard } from "./pages/StudentDashboard";
import { StudentTest } from "./pages/StudentTest";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { VocabActivity } from "./pages/VocabActivity";
import { WeeklyReport } from "./pages/WeeklyReport";
import { WeeklyTest } from "./pages/WeeklyTest";

const queryClient = new QueryClient();

function AppRoutes() {
  const [page, setPage] = useState<string>("/");
  const { user } = useAuth();

  const navigate = (p: string) => setPage(p);

  if (!user) {
    return <LandingPage onNavigate={navigate} />;
  }

  if (user.role === UserRole.admin) {
    return <AdminDashboard />;
  }

  if (user.role === UserRole.teacher) {
    return <TeacherDashboard />;
  }

  if (page === "/student/test") {
    return <StudentTest onNavigate={navigate} />;
  }

  if (page === "/student/vocab") {
    return <VocabActivity onNavigate={navigate} />;
  }

  if (page === "/student/practice") {
    return <PracticeTest onNavigate={navigate} />;
  }

  if (page === "/student/weekly-test") {
    return <WeeklyTest onNavigate={navigate} />;
  }

  if (page === "/student/weekly-report") {
    return <WeeklyReport onNavigate={navigate} />;
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
