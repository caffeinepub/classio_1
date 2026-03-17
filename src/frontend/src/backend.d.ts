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
export type QuestionId = bigint;
export type ExternalBlobId = string;
export type ResultId = bigint;
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
export interface Question {
    id: QuestionId;
    correctIndex: bigint;
    questionText: string;
    passageId: PassageId;
    options: Array<string>;
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
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getMyResults(): Promise<Array<TestResult>>;
    getPassageForGrade(grade: bigint): Promise<Passage | null>;
    getQuestionsForPassage(passageId: PassageId): Promise<Array<Question>>;
    getStudentResults(studentId: UserId): Promise<Array<TestResult>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listMyStudents(): Promise<Array<User>>;
    listTeachers(): Promise<Array<User>>;
    login(username: string, password: string): Promise<LoginResponse>;
    logout(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTest(passageId: PassageId, answers: Array<bigint>, audioBlobId: ExternalBlobId | null): Promise<bigint>;
}
