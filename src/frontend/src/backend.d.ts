import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    username: string;
    userId: UserId;
    role: UserRole;
    grade?: bigint;
    effectiveLevel?: bigint;
}
export interface StudentProgressSummary {
    studentId: UserId;
    name: string;
    latestComprehensionScore: bigint;
    latestWPM: bigint;
    weeklyTrend: Array<bigint>;
    grade: bigint;
    isBehind: boolean;
}
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
export interface ScoreRecord {
    wpm: bigint;
    weekNumber: bigint;
    comprehensionScore: bigint;
    rhythmScore: bigint;
    fluencyScore: bigint;
    pronunciationScore: bigint;
}
export interface StudentLevel {
    enrolledGrade: bigint;
    effectiveLevel: bigint;
}
export interface LoginResponse {
    userId: string;
    role: UserRole;
}
export interface VocabMastery {
    mastered: boolean;
    word: string;
    grade: bigint;
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
    addScoreHistory(userId: UserId, record: ScoreRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createStudent(username: string, password: string, grade: bigint): Promise<UserId>;
    createStudentWithCreds(teacherUser: string, teacherPass: string, studentUsername: string, studentPassword: string, grade: bigint): Promise<UserId>;
    createTeacher(username: string, password: string): Promise<UserId>;
    createTeacherWithCreds(adminPass: string, teacherUsername: string, teacherPassword: string): Promise<UserId>;
    ensureClassio1Admin(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClassProgress(teacherId: UserId): Promise<Array<StudentProgressSummary>>;
    getPassageForGrade(grade: bigint): Promise<Passage | null>;
    getPassageForStudent(userId: UserId): Promise<PassageInfo | null>;
    getResultsForStudent(userId: UserId): Promise<Array<TestResult>>;
    getScoreHistory(userId: UserId): Promise<Array<ScoreRecord>>;
    getStudentEffectiveLevel(userId: UserId): Promise<StudentLevel>;
    getStudentResults(studentId: UserId): Promise<Array<TestResult>>;
    getStudentResultsWithCreds(teacherUser: string, teacherPass: string, studentId: UserId): Promise<Array<TestResult>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    getVocabMastery(userId: UserId): Promise<Array<VocabMastery>>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listMyStudents(): Promise<Array<User>>;
    listStudentsWithCreds(teacherUser: string, teacherPass: string): Promise<Array<User>>;
    listTeachers(): Promise<Array<User>>;
    listTeachersWithCreds(adminPass: string): Promise<Array<User>>;
    login(username: string, password: string): Promise<LoginResponse>;
    logout(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTest(userId: UserId, passageId: PassageId, answers: Array<bigint>, audioBlobId: ExternalBlobId | null): Promise<bigint>;
    submitTestWithSkills(userId: UserId, passageId: PassageId, skillScores: SkillScores, audioBlobId: ExternalBlobId | null): Promise<bigint>;
    updateVocabMastery(userId: UserId, word: string, grade: bigint, mastered: boolean): Promise<void>;
}
