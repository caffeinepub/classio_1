import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserId } from "../backend";
import { useActor } from "./useActor";

// Unwrap Candid optional: backend returns [] | [T] for ?T
function unwrapOptional<T>(value: [] | [T] | T | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return (value as T[])[0] ?? null;
  return value as T;
}

export function useListTeachers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeachers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTeacher() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createTeacher(username, password);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useListMyStudents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myStudents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      password,
      grade,
    }: {
      username: string;
      password: string;
      grade: number;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createStudent(username, password, BigInt(grade));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myStudents"] }),
  });
}

export function useStudentResults(studentId: UserId | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studentResults", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getStudentResults(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useMyResults() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePassageForTest() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["passageForTest"],
    queryFn: async () => {
      if (!actor) return null;
      // biome-ignore lint/suspicious/noExplicitAny: new backend method not yet in generated types
      const raw = await (actor as any).getPassageForTest();
      // Candid returns ?T as [] | [T] — unwrap to null | T
      return unwrapOptional<{
        id: bigint;
        title: string;
        content: string;
        gradeLevel: bigint;
        subject: string;
      }>(raw);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePassageForGrade(grade: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["passage", grade?.toString()],
    queryFn: async () => {
      if (!actor || grade === undefined) return null;
      return actor.getPassageForGrade(grade);
    },
    enabled: !!actor && !isFetching && grade !== undefined,
  });
}

export function useMyEffectiveLevel() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["effectiveLevel"],
    queryFn: async () => {
      if (!actor) return null;
      // biome-ignore lint/suspicious/noExplicitAny: new backend method not yet in generated types
      const raw = await (actor as any).getMyEffectiveLevel();
      // May return the record directly (non-optional), but handle both cases
      return unwrapOptional<{
        enrolledGrade: bigint;
        effectiveLevel: bigint;
      }>(raw);
    },
    enabled: !!actor && !isFetching,
  });
}

export interface SkillScoresInput {
  rhythm: bigint;
  intonation: bigint;
  chunking: bigint;
  pronunciation: bigint;
}

export function useSubmitTestWithSkills() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passageId,
      skillScores,
      audioBlobId,
    }: {
      passageId: bigint;
      skillScores: SkillScoresInput;
      audioBlobId: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      // biome-ignore lint/suspicious/noExplicitAny: new backend method not yet in generated types
      return (actor as any).submitTestWithSkills(
        passageId,
        skillScores,
        audioBlobId ? [audioBlobId] : [],
      ) as Promise<bigint>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myResults"] });
      qc.invalidateQueries({ queryKey: ["effectiveLevel"] });
      qc.invalidateQueries({ queryKey: ["passageForTest"] });
    },
  });
}

export function useSubmitTest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passageId,
      answers,
      audioBlobId,
    }: {
      passageId: bigint;
      answers: bigint[];
      audioBlobId: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitTest(passageId, answers, audioBlobId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myResults"] }),
  });
}
