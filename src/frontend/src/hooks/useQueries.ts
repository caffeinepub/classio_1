import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserId } from "../backend";
import { useActor } from "./useActor";

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

export function useQuestionsForPassage(passageId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["questions", passageId?.toString()],
    queryFn: async () => {
      if (!actor || passageId === undefined) return [];
      return actor.getQuestionsForPassage(passageId);
    },
    enabled: !!actor && !isFetching && passageId !== undefined,
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
