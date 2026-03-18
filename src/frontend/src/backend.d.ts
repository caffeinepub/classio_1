import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Passage {
    id: PassageId;
    title: string;
    content: string;
    gradeLevel: bigint;
}
export interface User {
    id: UserId;
    username: string;
    password: string;
    role: UserRole;
    grade?: bigint;
    teacherId?: UserId;
}
export interface SkillScores {
    chunking: bigint;
    pronunciation: bigint;
    intonation: bigint;
    rhythm: bigint;
}
export interface PassageInfo {
    id: PassageId;
    title: string;
    content: string;
    subject: string;
    gradeLevel: bigint;
}
export type ResultId = bigint;
export type ExternalBlobId = string;
export interface TestResult {
    id: ResultId;
    studentId: UserId;
    answers: Array<bigint>;
    audioBlobId?: ExternalBlobId;
    score: bigint;
    timestamp: bigint;
    passageId: PassageId;
}
export type PassageId = bigint;
export type UserId = string;
export interface StudentLevel {
    enrolledGrade: bigint;
    effectiveLevel: bigint;
}
export interface LoginResponse {
    userId: string;
    role: UserRole;
}
export interface UserProfile {
    username: string;
    userId: UserId;
    role: UserRole;
    grade?: bigint;
    effectiveLevel?: bigint;
}
export enum UserRole {
    admin = "admin",
    teacher = "teacher",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createStudent(username: string, password: string, grade: bigint): Promise<UserId>;
    createTeacher(username: string, password: string): Promise<UserId>;
    ensureClassio1Admin(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getPassageForGrade(grade: bigint): Promise<Passage | null>;
    getPassageForStudent(userId: UserId): Promise<PassageInfo | null>;
    getResultsForStudent(userId: UserId): Promise<Array<TestResult>>;
    getStudentEffectiveLevel(userId: UserId): Promise<StudentLevel>;
    getStudentResults(studentId: UserId): Promise<Array<TestResult>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    getWeeklyReport(studentId: UserId): Promise<string>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listMyStudents(): Promise<Array<User>>;
    listTeachers(): Promise<Array<User>>;
    login(username: string, password: string): Promise<LoginResponse>;
    logout(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTest(userId: UserId, passageId: PassageId, answers: Array<bigint>, audioBlobId: ExternalBlobId | null): Promise<bigint>;
    submitTestWithSkills(userId: UserId, passageId: PassageId, skillScores: SkillScores, audioBlobId: ExternalBlobId | null): Promise<bigint>;
}
