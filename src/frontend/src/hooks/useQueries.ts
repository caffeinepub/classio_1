import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserId } from "../backend";
import { createActorWithConfig } from "../config";
import { useAuth } from "../context/AuthContext";
import { useActor } from "./useActor";

function unwrapOptional<T>(value: [] | [T] | T | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return (value as T[])[0] ?? null;
  return value as T;
}

function useEffectiveActor() {
  const { sessionActor } = useAuth();
  const { actor: anonymousActor, isFetching } = useActor();
  const actor = sessionActor ?? anonymousActor;
  return { actor, isFetching: !sessionActor && isFetching };
}

export function useListTeachers() {
  const { credentials } = useAuth();
  return useQuery({
    queryKey: ["teachers", credentials?.username],
    queryFn: async () => {
      if (!credentials) return [];
      const freshActor = await createActorWithConfig();
      return (freshActor as any).listTeachersWithCreds(credentials.password);
    },
    enabled: !!credentials,
  });
}

export function useCreateTeacher() {
  const { credentials } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!credentials) throw new Error("Not logged in. Please log in again.");
      const freshActor = await createActorWithConfig();
      return (freshActor as any).createTeacherWithCreds(
        credentials.password,
        username,
        password,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teachers"] }),
  });
}

export function useListMyStudents() {
  const { credentials } = useAuth();
  return useQuery({
    queryKey: ["myStudents", credentials?.username],
    queryFn: async () => {
      if (!credentials) return [];
      const freshActor = await createActorWithConfig();
      return (freshActor as any).listStudentsWithCreds(
        credentials.username,
        credentials.password,
      );
    },
    enabled: !!credentials,
  });
}

export function useCreateStudent() {
  const { credentials } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      password,
      grade,
    }: { username: string; password: string; grade: number }) => {
      if (!credentials) throw new Error("Not logged in. Please log in again.");
      const freshActor = await createActorWithConfig();
      return (freshActor as any).createStudentWithCreds(
        credentials.username,
        credentials.password,
        username,
        password,
        BigInt(grade),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myStudents"] }),
  });
}

export function useStudentResults(studentId: UserId | null) {
  const { actor, isFetching } = useEffectiveActor();
  const { credentials } = useAuth();
  return useQuery({
    queryKey: ["studentResults", studentId, credentials?.username],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      if (credentials) {
        try {
          return await (actor as any).getStudentResultsWithCreds(
            credentials.username,
            credentials.password,
            studentId,
          );
        } catch {
          return actor.getStudentResults(studentId);
        }
      }
      return actor.getStudentResults(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useMyResults(userId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["myResults", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getResultsForStudent(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function usePassageForTest(userId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["passageForTest", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const raw = await actor.getPassageForStudent(userId);
      return unwrapOptional<{
        id: bigint;
        title: string;
        content: string;
        gradeLevel: bigint;
        subject: string;
      }>(raw);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function usePassageForGrade(grade: bigint | undefined) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["passage", grade?.toString()],
    queryFn: async () => {
      if (!actor || grade === undefined) return null;
      return actor.getPassageForGrade(grade);
    },
    enabled: !!actor && !isFetching && grade !== undefined,
  });
}

export function useMyEffectiveLevel(userId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["effectiveLevel", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const raw = await actor.getStudentEffectiveLevel(userId);
      return unwrapOptional<{ enrolledGrade: bigint; effectiveLevel: bigint }>(
        raw,
      );
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export interface SkillScoresInput {
  rhythm: bigint;
  intonation: bigint;
  chunking: bigint;
  pronunciation: bigint;
}

export function useSubmitTestWithSkills() {
  const { actor } = useEffectiveActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      passageId,
      skillScores,
      audioBlobId,
    }: {
      userId: string;
      passageId: bigint;
      skillScores: SkillScoresInput;
      audioBlobId: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitTestWithSkills(
        userId,
        passageId,
        skillScores,
        audioBlobId,
      ) as Promise<bigint>;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["myResults", variables.userId] });
      qc.invalidateQueries({ queryKey: ["effectiveLevel", variables.userId] });
      qc.invalidateQueries({ queryKey: ["passageForTest", variables.userId] });
    },
  });
}

export function useSubmitTest() {
  const { actor } = useEffectiveActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      passageId,
      answers,
      audioBlobId,
    }: {
      userId: string;
      passageId: bigint;
      answers: bigint[];
      audioBlobId: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitTest(userId, passageId, answers, audioBlobId);
    },
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: ["myResults", variables.userId] }),
  });
}

// ─── New Feature Hooks ────────────────────────────────────────────────────────

export function useScoreHistory(userId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["scoreHistory", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        return await actor.getScoreHistory(userId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useVocabMastery(userId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["vocabMastery", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        return await actor.getVocabMastery(userId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useClassProgress(teacherId: string) {
  const { actor, isFetching } = useEffectiveActor();
  return useQuery({
    queryKey: ["classProgress", teacherId],
    queryFn: async () => {
      if (!actor || !teacherId) return [];
      try {
        return await actor.getClassProgress(teacherId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!teacherId,
  });
}
