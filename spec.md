# Classio Reading Comprehension Master

## Current State
Classio is a hierarchical adaptive reading platform (admin > teacher > student) for grades 1–10. The platform supports proficiency tests with voice recording, adaptive passages, vocabulary building activities, weekly tests, and report cards. The student dashboard has three tabs: My Courses, My Reports, and Achievements. Teacher dashboard allows creating and viewing students. All data persists via stable storage. Dark high-tech theme applied across all pages.

## Requested Changes (Diff)

### Add
1. **Reading Growth Timeline** – Line chart showing student comprehension and fluency scores week-by-week over time, visible to both student (in My Reports) and teacher (in student detail view).
2. **Words Per Minute (WPM) Tracker** – Chart tracking fluency speed (wpm) over test attempts; displayed in student reports and teacher view.
3. **Vocabulary Mastery Map** – Grid/table showing which words the student has mastered vs. still learning, organized by grade level; visible in student My Reports.
4. **Teacher Progress Dashboard** – Class-wide view in TeacherDashboard showing each student's current reading level, weekly score trend (sparkline), and a flag indicator for students falling behind (score < 60%). 
5. **Comprehension Accuracy Trend** – Separate trend chart for MCQ/comprehension scores over time, distinct from fluency, shown in student reports.
6. **Monthly Progress Report (PDF-style printable view)** – A printable/shareable summary page accessible in My Reports showing starting level, current level, skills mastered, and areas still developing.
7. **Skill-Specific Progress Bars** – For each of the 4 skills (Pronunciation, Rhythm, Intonation, Fluency), show a progress bar indicating how close the student is to the next badge level, displayed in My Courses and the proficiency badge card.

### Modify
- **StudentDashboard (My Reports tab)**: Add Reading Growth Timeline, WPM Tracker, Vocabulary Mastery Map, Comprehension Accuracy Trend, and Monthly Progress Report sections.
- **StudentDashboard (My Courses tab)**: Add Skill-Specific Progress Bars to the proficiency badge card.
- **TeacherDashboard**: Add a new "Class Progress" tab with the Teacher Progress Dashboard (student table with level, trend sparkline, flag).
- **Backend**: Add data types and query functions for storing/retrieving weekly score history, wpm history, vocab mastery, and monthly progress summaries.

### Remove
- Nothing removed.

## Implementation Plan
1. Update Motoko backend:
   - Add `ScoreHistory` record: `{ week: Nat; comprehensionScore: Float; fluencyScore: Float; wpm: Float; pronunciationScore: Float; rhythmScore: Float }`
   - Add `VocabMastery` record: `{ word: Text; grade: Nat; mastered: Bool }`
   - Add stable storage for `scoreHistories: HashMap<UserId, [ScoreHistory]>` and `vocabMasteries: HashMap<UserId, [VocabMastery]>`
   - Add functions: `addScoreHistory`, `getScoreHistory`, `updateVocabMastery`, `getVocabMastery`, `getClassProgress` (returns all students with latest scores for a teacher)
   - Update `postupgrade`/`preupgrade` to persist new maps
2. Frontend - StudentDashboard My Reports:
   - Reading Growth Timeline: recharts LineChart with weeks on X-axis, comprehension + fluency lines
   - WPM Tracker: recharts BarChart or LineChart for wpm per attempt
   - Vocab Mastery Map: color-coded grid (green=mastered, amber=in-progress, gray=not started)
   - Comprehension Accuracy Trend: separate LineChart for MCQ scores
   - Monthly Progress Report: printable panel with window.print() button
3. Frontend - StudentDashboard My Courses:
   - Add 4 skill progress bars below the proficiency badge
4. Frontend - TeacherDashboard:
   - Add "Class Progress" tab with a table: student name, grade, reading level badge, weekly trend sparkline, flag icon if behind
5. Seed mock historical data in frontend for demonstration when no real data exists yet
