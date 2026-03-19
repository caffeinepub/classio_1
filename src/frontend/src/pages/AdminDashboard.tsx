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

function extractErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object" || !("message" in err))
    return "Failed to create teacher";
  const raw = String((err as { message: unknown }).message);
  const trapMatch = raw.match(/trapped explicitly:\s*(.+?)(?:\n|$)/);
  const withMsgMatch = raw.match(/with message:\s*\'([^\']+)\'/s);
  if (trapMatch) return trapMatch[1].trim().slice(0, 200);
  if (withMsgMatch) return withMsgMatch[1].trim().slice(0, 200);
  return raw.slice(0, 200);
}

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
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <AppHeader title="Admin Dashboard" />
      <main className="relative max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Manage teacher accounts for your school
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {teachers?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-400">Total Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Grades 1–10</p>
                  <p className="text-sm text-gray-400">Supported Levels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Badge className="text-xs bg-indigo-600 text-white border-0">
                    Admin
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Classio1</p>
                  <p className="text-sm text-gray-400">Master Account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teachers">
          <TabsList
            className="mb-6 bg-gray-900/80 border border-indigo-500/20"
            data-ocid="admin.tab"
          >
            <TabsTrigger
              value="teachers"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400"
              data-ocid="admin.tab"
            >
              Teachers
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-400"
              data-ocid="admin.tab"
            >
              Create Teacher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg">
              <CardHeader className="border-b border-indigo-500/20 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-indigo-400" />
                  All Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  </div>
                ) : teachers && teachers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-indigo-500/20 hover:bg-indigo-500/5">
                        <TableHead className="text-gray-400">#</TableHead>
                        <TableHead className="text-gray-400">
                          Username
                        </TableHead>
                        <TableHead className="text-gray-400">ID</TableHead>
                        <TableHead className="text-gray-400">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher, idx) => (
                        <TableRow
                          key={teacher.id}
                          className="border-indigo-500/10 hover:bg-indigo-500/5"
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <TableCell className="text-gray-500 text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="text-gray-400 font-mono text-xs">
                            {teacher.id}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30">
                              Teacher
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className="text-center py-12 text-gray-500"
                    data-ocid="admin.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-400">No teachers yet</p>
                    <p className="text-sm">
                      Create a teacher account to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="rounded-xl bg-gray-900/80 border border-indigo-500/20 shadow-lg max-w-md">
              <CardHeader className="border-b border-indigo-500/20 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  Create Teacher Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="t-username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="t-username"
                      placeholder="e.g. mrs_anderson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-800/80 border-indigo-500/30 text-white placeholder:text-gray-500 focus:border-indigo-400"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t-password" className="text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="t-password"
                      type="password"
                      placeholder="Set a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-800/80 border-indigo-500/30 text-white placeholder:text-gray-500 focus:border-indigo-400"
                      data-ocid="admin.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold border-0"
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
