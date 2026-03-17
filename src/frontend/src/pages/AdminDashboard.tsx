import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "../components/AppHeader";
import { useCreateTeacher, useListTeachers } from "../hooks/useQueries";

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { data: teachers, isLoading } = useListTeachers();
  const createTeacher = useCreateTeacher();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeacher.mutateAsync({ username, password });
      toast.success(`Teacher "${username}" created successfully`);
      setUsername("");
      setPassword("");
    } catch {
      toast.error("Failed to create teacher");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Admin Dashboard" />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage teacher accounts for your school
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teachers?.length ?? 0}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Teachers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Grades 1–10</p>
                  <p className="text-sm text-muted-foreground">
                    Supported Levels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-card border-border">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Badge className="text-xs bg-primary">Admin</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold">Siddiqui</p>
                  <p className="text-sm text-muted-foreground">
                    Master Account
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teachers">
          <TabsList className="mb-6" data-ocid="admin.tab">
            <TabsTrigger value="teachers" data-ocid="admin.tab">
              Teachers
            </TabsTrigger>
            <TabsTrigger value="create" data-ocid="admin.tab">
              Create Teacher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            <Card className="rounded-xl shadow-card border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  All Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : teachers && teachers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher, idx) => (
                        <TableRow
                          key={teacher.id}
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <TableCell className="text-muted-foreground text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {teacher.id}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                              Teacher
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No teachers yet</p>
                    <p className="text-sm">
                      Create a teacher account to get started
                    </p>
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
                  Create Teacher Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="t-username">Username</Label>
                    <Input
                      id="t-username"
                      placeholder="e.g. mrs_anderson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t-password">Password</Label>
                    <Input
                      id="t-password"
                      type="password"
                      placeholder="Set a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-classio-blue hover:bg-classio-blue/90 text-white"
                    disabled={createTeacher.isPending}
                    data-ocid="admin.submit_button"
                  >
                    {createTeacher.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {createTeacher.isPending ? "Creating..." : "Create Teacher"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
