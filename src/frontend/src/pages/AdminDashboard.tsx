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
    <div className="min-h-screen bg-slate-50">
      <AppHeader title="Admin Dashboard" />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Manage teacher accounts for your school
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {teachers?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Total Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    Grades 1–10
                  </p>
                  <p className="text-sm text-gray-500">Supported Levels</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Badge className="text-xs bg-indigo-600 text-white border-0">
                    Admin
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Classio1
                  </p>
                  <p className="text-sm text-gray-500">Master Account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teachers">
          <TabsList
            className="mb-6 bg-white border border-gray-200 shadow-sm"
            data-ocid="admin.tab"
          >
            <TabsTrigger
              value="teachers"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600"
              data-ocid="admin.tab"
            >
              Teachers
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-600"
              data-ocid="admin.tab"
            >
              Create Teacher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            <Card className="rounded-xl bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                  <Users className="w-4 h-4 text-indigo-600" />
                  All Teachers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="admin.loading_state"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  </div>
                ) : teachers && teachers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100 hover:bg-slate-50">
                        <TableHead className="text-gray-500">#</TableHead>
                        <TableHead className="text-gray-500">
                          Username
                        </TableHead>
                        <TableHead className="text-gray-500">ID</TableHead>
                        <TableHead className="text-gray-500">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher, idx) => (
                        <TableRow
                          key={teacher.id}
                          className="border-gray-100 hover:bg-indigo-50/50"
                          data-ocid={`admin.item.${idx + 1}`}
                        >
                          <TableCell className="text-gray-400 text-sm">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {teacher.username}
                          </TableCell>
                          <TableCell className="text-gray-400 font-mono text-xs">
                            {teacher.id}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-100">
                              Teacher
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className="text-center py-12 text-gray-400"
                    data-ocid="admin.empty_state"
                  >
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-500">No teachers yet</p>
                    <p className="text-sm">
                      Create a teacher account to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="rounded-xl bg-white border border-gray-200 shadow-sm max-w-md">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Create Teacher Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="t-username" className="text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="t-username"
                      placeholder="e.g. mrs_anderson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="t-password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="t-password"
                      type="password"
                      placeholder="Set a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400"
                      data-ocid="admin.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border-0"
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
