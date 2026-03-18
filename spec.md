# Classio

## Current State
Student proficiency test endpoints (`getPassageForTest`, `getMyEffectiveLevel`, `submitTestWithSkills`, `getMyResults`) authenticate via ICP `caller` principal session lookup. Since the app uses username/password auth (not Internet Identity), all browser sessions share the same anonymous principal, causing session conflicts when multiple roles are used — the passage query silently fails and shows "No passage available for your grade level". The teacher dashboard has a misleading "Available for assignment" card implying teacher-controlled passage assignment.

## Requested Changes (Diff)

### Add
- Student endpoints accept `userId: Text` parameter for direct user lookup (bypassing broken principal-based session)

### Modify
- `getPassageForTest()` → `getPassageForStudent(userId)` — look up student by ID, no caller session required
- `getMyEffectiveLevel()` → `getStudentEffectiveLevel(userId)` — same pattern
- `submitTestWithSkills(...)` → add `userId` as first param
- `getMyResults()` → `getResultsForStudent(userId)` — same pattern
- Frontend hooks pass `user.userId` from AuthContext to all student endpoints
- Teacher dashboard: remove "Available for assignment" card and any passage-assignment-related wording; make clear passages are auto-assigned by grade

### Remove
- `caller`-based session lookup in student-facing endpoints
- Misleading teacher passage assignment UI/copy

## Implementation Plan
1. Update backend: change all student endpoints to accept userId param, look up user by ID
2. Update frontend hooks: pass userId from auth context to student endpoint calls
3. Update StudentTest and StudentDashboard to pass userId to hooks
4. Clean up TeacherDashboard: remove assignment wording, update stats card
