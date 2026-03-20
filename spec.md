# Classio

## Current State
- Login page uses `/assets/generated/edtech-hero.dim_800x900.png` as background on the left panel
- After student login, App.tsx routes directly to `StudentDashboard` which shows full tabs (My Courses, My Reports, Achievements)
- Proficiency test lives at `/student/test` route; after completion the success screen has a button "Start My Learning Journey" that calls `onNavigate('/student')` but students report it being stuck
- Progress values in StudentDashboard (vocab lessons, RCA count "2/5") are partly hardcoded
- `lessonPlan` days 1-5 (vocab) all share the same `vocabDone` flag from today's localStorage key, so all 5 appear done/not-done together

## Requested Changes (Diff)

### Add
- `StudentHome.tsx`: A simple post-login home page that shows only a large Proficiency Test card/icon if proficiency is not yet complete. This replaces the immediate StudentDashboard for first-time students.
- Auto-navigate logic: after proficiency success screen, auto-redirect to StudentDashboard after 2 seconds (or immediately on button click) without requiring manual interaction

### Modify
- `LandingPage.tsx`: Replace left panel background image with new `/assets/generated/edtech-login-bg.dim_900x1000.png`
- `App.tsx`: After student login, check localStorage `classio_proficiency_search_{userId}?.levelFound`; if false → render `StudentHome`; if true → render `StudentDashboard`
- `StudentTest.tsx`: On the success screen, after a 1.5s delay, auto-navigate to `/student` so student doesn't get stuck. Keep the manual button too.
- `StudentDashboard.tsx`: Fix real progress tracking:
  - Track each vocab lesson day separately using `classio_vocab_day_{userId}_{grade}_{day}` keys
  - Compute lesson completion per-day so each of the 8 days in lessonPlan has its own accurate done state
  - The "Go to Vocabulary" row should show `vocabLessonsCompleted / 6` (days 1-5 vocab + quiz = 6 items) using real completion count
  - The RCA row count should show actual practice tests completed from localStorage rather than hardcoded "2/5"
  - Lesson plan items: each vocab lesson day has its own localStorage key; quiz has its own key; practice and weekly already have their own keys
  - `firstActiveLessonDay` should be locked behind proficiency: if proficiency not done, only the proficiency test card shows (via StudentHome), otherwise the first incomplete lesson is active

### Remove
- Nothing removed

## Implementation Plan
1. Update `LandingPage.tsx` left panel `<img src>` to use the new generated image path
2. Create `src/frontend/src/pages/StudentHome.tsx` — shows Classio header, a welcome message, and a single large centered card with 🎯 proficiency test icon, grade info, and a "Begin Proficiency Test" button. Uses teal/indigo theme matching existing light design.
3. Update `App.tsx` `AppRoutes`: after student login, read `localStorage.getItem('classio_proficiency_search_' + userId)` to get `levelFound`; route to `<StudentHome>` if not found, `<StudentDashboard>` if found
4. Update `StudentTest.tsx` success screen: add `useEffect` with 1.5s `setTimeout` to auto-call `onNavigate('/student')` after level is found
5. Update `StudentDashboard.tsx` lesson progress keys:
   - Use per-day vocab keys: `classio_vocab_day_{userId}_{grade}_{dayNum}` for days 1-5
   - Use quiz key: `classio_vocab_quiz_{userId}_{grade}` for day 6
   - Practice key already correct: `classio_practice_{userId}_{todayKey}`
   - Weekly key already correct: `classio_weekly_{userId}_{weekNum}`
   - Count `vocabLessonsCompleted` = number of vocab day keys that exist
   - Show "X / 6 lessons completed" using real count
   - `VocabActivity.tsx` should save per-day key when completing a vocab lesson (add saving logic)
