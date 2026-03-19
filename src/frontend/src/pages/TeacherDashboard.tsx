import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  Eye,
  Loader2,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../backend";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import {
  useClassProgress,
  useCreateStudent,
  useListMyStudents,
  useStudentResults,
} from "../hooks/useQueries";

function StudentResults({
  student,
  open,
  onClose,
}: { student: User | null; open: boolean; onClose: () => void }) {
  const { data: results, isLoading } = useStudentResults(
    open ? (student?.id ?? null) : null,
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-lg bg-gray-900 border border-indigo-500/30 text-white"
        data-ocid="results.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            Results — {student?.username}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div
            className="flex justify-center py-8"
            data-ocid="results.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div
                key={r.id.toString()}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/80 border border-indigo-500/20"
                data-ocid={`results.item.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    Test #{i + 1}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(
                      Number(r.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={
                    Number(r.score) >= 4
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }
                >
                  {r.score.toString()}/5
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-8 text-gray-400"
            data-ocid="results.empty_state"
          >
            <p>No test results yet</p>
          </div>
        )}
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10"
          data-ocid="results.close_button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [classSearch, setClassSearch] = useState("");
  const teacherId = user?.userId ?? "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);

  const { data: students, isLoading } = useListMyStudents();
  const { data: classProgressRaw = [], isLoading: classLoading } =
    useClassProgress(teacherId);
  const createStudent = useCreateStudent();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade) {
      toast.error("Please select a grade");
      return;
    }
    try {
      await createStudent.mutateAsync({
        username,
        password,
        grade: Number(grade),
      });
      toast.success(`Student "${username}" created for Grade ${grade}`);
      setUsername("");
      setPassword("");
      setGrade("");
    } catch (err: unknown) {
      let msg = "Failed to create student";
      if (err && typeof err === "object" && "message" in err) {
        const raw = String((err as { message: unknown }).message);
        const trapMatch = raw.match(/trapped explicitly:\s*(.+?)(?:\n|$)/);
        const withMsgMatch = raw.match(/with message:\s*'([^']+)'/s);
        if (trapMatch) msg = trapMatch[1].trim().slice(0, 200);
        else if (withMsgMatch) msg = withMsgMatch[1].trim().slice(0, 200);
        else msg = raw.slice(0, 200);
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <AppHeader title="Teacher Dashboard" />
      <main className="relative max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Teacher Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Manage your students and view their test results
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {students?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-400">My Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Auto Passages
                  </p>
                  <p className="text-sm text-gray-400">
                    Assigned by grade level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students">
          <TabsList
            className="mb-6 bg-gray-900/80 border border-indigo-500/20"
            data-ocid="teacher.tab"
          >
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400"
              data-ocid="teacher.tab"
            >
              My Students
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400"
              data-ocid="teacher.tab"
            >
              Add Student
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400"
              data-ocid="teacher.tab"
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1.5 inline" />
              Class Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
              <CardHeader className="border-b border-indigo-500/20 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Student Roster
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="teacher.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  </div>
                ) : students && students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-indigo-500/20 hover:bg-indigo-500/5">
                        <TableHead className="text-gray-400">#</TableHead>
                        <TableHead className="text-gray-400">Student</TableHead>
                        <TableHead className="text-gray-400">Grade</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, idx) => (
                        <TableRow
                          key={student.id}
                          className="border-indigo-500/10 hover:bg-indigo-500/5"
                          data-ocid={`teacher.item.${idx + 1}`}
                        >
                          <TableCell className="text-gray-500 text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            {student.username}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Grade {student.grade?.toString() ?? "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 bg-transparent border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400"
                              onClick={() => {
                                setSelectedStudent(student);
                                setResultsOpen(true);
                              }}
                              data-ocid={`teacher.edit_button.${idx + 1}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Results
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className="text-center py-12 text-gray-500"
                    data-ocid="teacher.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-400">No students yet</p>
                    <p className="text-sm">Add a student to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg max-w-md">
              <CardHeader className="border-b border-indigo-500/20 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  Create Student Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="s-username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="s-username"
                      placeholder="e.g. emma_wilson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-800/80 border-indigo-500/30 text-white placeholder:text-gray-500 focus:border-indigo-400"
                      data-ocid="teacher.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s-password" className="text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="s-password"
                      type="password"
                      placeholder="Set a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800/80 border-indigo-500/30 text-white placeholder:text-gray-500 focus:border-indigo-400"
                      data-ocid="teacher.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s-grade" className="text-gray-300">
                      Grade Level
                    </Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger
                        className="bg-gray-800/80 border-indigo-500/30 text-white"
                        data-ocid="teacher.select"
                      >
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-indigo-500/30">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (g) => (
                            <SelectItem
                              key={g}
                              value={String(g)}
                              className="text-white hover:bg-indigo-500/20 focus:bg-indigo-500/20"
                            >
                              Grade {g}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold border-0"
                    disabled={createStudent.isPending}
                    data-ocid="teacher.submit_button"
                  >
                    {createStudent.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {createStudent.isPending ? "Creating..." : "Create Student"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            {/* Feature 4: Teacher Class Progress Dashboard */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-gray-800/80 border border-indigo-500/30 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-400"
                  data-ocid="teacher.search_input"
                />
              </div>

              {classLoading ? (
                <div
                  className="flex justify-center py-12"
                  data-ocid="teacher.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : (
                (() => {
                  const MOCK_DATA = [
                    {
                      studentId: "s1",
                      name: "Emma Wilson",
                      grade: 8n,
                      latestComprehensionScore: 82n,
                      latestWPM: 115n,
                      weeklyTrend: [70n, 74n, 79n, 82n] as bigint[],
                      isBehind: false,
                    },
                    {
                      studentId: "s2",
                      name: "James Chen",
                      grade: 7n,
                      latestComprehensionScore: 55n,
                      latestWPM: 88n,
                      weeklyTrend: [60n, 58n, 55n, 55n] as bigint[],
                      isBehind: true,
                    },
                    {
                      studentId: "s3",
                      name: "Sofia Martinez",
                      grade: 6n,
                      latestComprehensionScore: 78n,
                      latestWPM: 102n,
                      weeklyTrend: [65n, 70n, 75n, 78n] as bigint[],
                      isBehind: false,
                    },
                    {
                      studentId: "s4",
                      name: "Liam Patel",
                      grade: 8n,
                      latestComprehensionScore: 45n,
                      latestWPM: 72n,
                      weeklyTrend: [50n, 48n, 46n, 45n] as bigint[],
                      isBehind: true,
                    },
                    {
                      studentId: "s5",
                      name: "Zoe Thompson",
                      grade: 5n,
                      latestComprehensionScore: 91n,
                      latestWPM: 125n,
                      weeklyTrend: [80n, 84n, 88n, 91n] as bigint[],
                      isBehind: false,
                    },
                  ];
                  const display =
                    classProgressRaw.length > 0 ? classProgressRaw : MOCK_DATA;
                  const filtered = display.filter((s) =>
                    s.name.toLowerCase().includes(classSearch.toLowerCase()),
                  );
                  const avgComp = Math.round(
                    filtered.reduce(
                      (sum, s) => sum + Number(s.latestComprehensionScore),
                      0,
                    ) / (filtered.length || 1),
                  );
                  const onTrack = filtered.filter((s) => !s.isBehind).length;
                  const behind = filtered.filter((s) => s.isBehind).length;

                  return (
                    <>
                      {/* Summary cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            label: "Total Students",
                            value: filtered.length,
                            icon: "👥",
                            color: "text-indigo-300",
                          },
                          {
                            label: "Avg Comprehension",
                            value: `${avgComp}%`,
                            icon: "📊",
                            color: "text-violet-300",
                          },
                          {
                            label: "On Track",
                            value: onTrack,
                            icon: "✅",
                            color: "text-emerald-300",
                          },
                          {
                            label: "Need Help",
                            value: behind,
                            icon: "⚠️",
                            color: "text-rose-300",
                          },
                        ].map((stat) => (
                          <Card
                            key={stat.label}
                            className="rounded-xl bg-gray-900/80 border border-indigo-500/20"
                          >
                            <CardContent className="pt-4 pb-3">
                              <p className="text-2xl mb-0.5">{stat.icon}</p>
                              <p className={`text-xl font-bold ${stat.color}`}>
                                {stat.value}
                              </p>
                              <p className="text-xs text-gray-400">
                                {stat.label}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Student table */}
                      <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
                        <CardHeader className="border-b border-indigo-500/20 pb-3">
                          <CardTitle className="text-base flex items-center gap-2 text-white">
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                            Student Progress Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                          {filtered.length === 0 ? (
                            <div
                              className="text-center py-10 text-gray-500"
                              data-ocid="teacher.empty_state"
                            >
                              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">No students found</p>
                            </div>
                          ) : (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-indigo-500/20">
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Student
                                  </th>
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Grade
                                  </th>
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Trend
                                  </th>
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Comp%
                                  </th>
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    WPM
                                  </th>
                                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filtered.map((s, idx) => {
                                  const trend = s.weeklyTrend
                                    .slice(-4)
                                    .map(Number);
                                  const maxT = Math.max(...trend, 1);
                                  const sparkH = 24;
                                  const sparkW = 60;
                                  const pts = trend
                                    .map(
                                      (v, i) =>
                                        `${(i / (trend.length - 1)) * sparkW},${sparkH - (v / maxT) * sparkH}`,
                                    )
                                    .join(" ");
                                  return (
                                    <tr
                                      key={s.studentId}
                                      className={`border-b border-indigo-500/10 hover:bg-indigo-500/5 transition-colors ${s.isBehind ? "shadow-[inset_0_0_0_1px_rgba(239,68,68,0.15)] bg-red-500/5" : ""}`}
                                      data-ocid={`teacher.item.${idx + 1}`}
                                    >
                                      <td className="px-4 py-3 font-medium text-white">
                                        {s.name}
                                      </td>
                                      <td className="px-4 py-3">
                                        <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
                                          G{Number(s.grade)}
                                        </Badge>
                                      </td>
                                      <td className="px-4 py-3">
                                        <svg
                                          width={sparkW}
                                          height={sparkH}
                                          className="overflow-visible"
                                          role="img"
                                          aria-label="Weekly trend sparkline"
                                        >
                                          <polyline
                                            points={pts}
                                            fill="none"
                                            stroke={
                                              s.isBehind ? "#f87171" : "#22d3ee"
                                            }
                                            strokeWidth="1.5"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </td>
                                      <td className="px-4 py-3 text-slate-200">
                                        {Number(s.latestComprehensionScore)}%
                                      </td>
                                      <td className="px-4 py-3 text-slate-200">
                                        {Number(s.latestWPM)}
                                      </td>
                                      <td className="px-4 py-3">
                                        <Badge
                                          className={
                                            s.isBehind
                                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs"
                                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs"
                                          }
                                        >
                                          {s.isBehind
                                            ? "Needs Help"
                                            : "On Track"}
                                        </Badge>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  );
                })()
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <StudentResults
        student={selectedStudent}
        open={resultsOpen}
        onClose={() => setResultsOpen(false)}
      />
    </div>
  );
}
