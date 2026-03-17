# Classio - Reading Comprehension Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Master admin account (hardcoded credentials: id=Siddiqui, password=Siddiqui11)
- Teacher account management: admin can create teacher accounts (username/password)
- Student account management: teachers can create student accounts with grade (1-10)
- Reading comprehension proficiency test flow for students:
  - Display a reading passage (grade-appropriate)
  - Audio recording of the student reading aloud (using microphone)
  - 5 multiple-choice comprehension questions
  - Score calculation and result storage
- Role-based dashboards: Admin, Teacher, Student
- Admin dashboard: list/create teacher accounts
- Teacher dashboard: list/create student accounts, view student test results
- Student dashboard: take proficiency test, view past results

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Stable storage for teachers, students, test passages, questions, results
2. Backend: Admin auth (hardcoded), teacher/student auth with hashed passwords
3. Backend: CRUD APIs for teachers, students, passages, questions, results
4. Backend: Audio blob storage for student recordings
5. Frontend: Login page (auto-detects role)
6. Frontend: Admin dashboard - create/list teachers
7. Frontend: Teacher dashboard - create/list students with grade, view results
8. Frontend: Student dashboard - take test (passage + audio record + 5 MCQ questions)
9. Frontend: Test result view
