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
import { Eye, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "../backend";
import { AppHeader } from "../components/AppHeader";
import {
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
      <DialogContent className="sm:max-w-lg" data-ocid="results.dialog">
        <DialogHeader>
          <DialogTitle>Results — {student?.username}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div
            className="flex justify-center py-8"
            data-ocid="results.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div
                key={r.id.toString()}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
                data-ocid={`results.item.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium">Test #{i + 1}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(r.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={
                    Number(r.score) >= 4
                      ? "bg-accent/20 text-accent border-0"
                      : "bg-destructive/10 text-destructive border-0"
                  }
                >
                  {r.score.toString()}/5
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="results.empty_state"
          >
            <p>No test results yet</p>
          </div>
        )}
        <Button
          variant="outline"
          onClick={onClose}
          data-ocid="results.close_button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function TeacherDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);

  const { data: students, isLoading } = useListMyStudents();
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
    } catch {
      toast.error("Failed to create student");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Teacher Dashboard" />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Teacher Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your students and view their test results
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students?.length ?? 0}</p>
                  <p className="text-sm text-muted-foreground">My Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">1–10</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Grade Levels</p>
                  <p className="text-sm text-muted-foreground">
                    Available for assignment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students">
          <TabsList className="mb-6" data-ocid="teacher.tab">
            <TabsTrigger value="students" data-ocid="teacher.tab">
              My Students
            </TabsTrigger>
            <TabsTrigger value="create" data-ocid="teacher.tab">
              Add Student
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Student Roster
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="teacher.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : students && students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, idx) => (
                        <TableRow
                          key={student.id}
                          data-ocid={`teacher.item.${idx + 1}`}
                        >
                          <TableCell className="text-muted-foreground text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.username}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              Grade {student.grade?.toString() ?? "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
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
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="teacher.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No students yet</p>
                    <p className="text-sm">Add a student to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="rounded-xl shadow-card border-border max-w-md">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Student Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="s-username">Username</Label>
                    <Input
                      id="s-username"
                      placeholder="e.g. emma_wilson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      data-ocid="teacher.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s-password">Password</Label>
                    <Input
                      id="s-password"
                      type="password"
                      placeholder="Set a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-ocid="teacher.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s-grade">Grade Level</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger data-ocid="teacher.select">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (g) => (
                            <SelectItem key={g} value={String(g)}>
                              Grade {g}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-classio-green hover:bg-classio-green/90 text-white"
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
