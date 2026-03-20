# Classio

## Current State
StudentDashboard has 3 tabs (My Courses, My Reports, Achievements) styled as flat underline border-bottom tabs in indigo. VocabActivity shows word-by-word learn+quiz flow. My Courses tab shows a course card and skill progress bars but lacks a structured week-by-week lesson plan. Tabs visually blend into the nav bar.

## Requested Changes (Diff)

### Add
- Complete structured lesson plan in My Courses: Week 1 with Day 1–5 (Vocab lessons 1–5), Vocab Quiz, Practice Reading Test, Weekly Assessment — each shown as clickable lesson rows with status (locked/active/done)
- VocabActivity gets a full lesson experience: word card with sentence example, image hint emoji, pronunciation tip, and audio record button per word — 6 words per lesson with meaningful content
- Each lesson day in the course list navigates to the relevant activity (vocab/practice/weekly test)

### Modify
- Tab design: replace underline border-bottom style with pill/capsule-shaped tabs with a new color palette (teal/emerald green accent instead of indigo, rounded-full pill style)
- Achievements tab: use a gradient card background per coin tier (gold gradient, silver gradient, etc.) for better visual distinction
- My Reports tab heading style refresh to match new color scheme
- Tab bar background: use a soft teal-tinted light background instead of plain white

### Remove
- Nothing removed

## Implementation Plan
1. Update tab navigation in StudentDashboard to use pill/capsule shaped tabs with teal/emerald palette
2. Build `WeekLessonPlan` section inside My Courses: a card listing Week 1 days with icons, status indicators (locked/active/completed), and onClick navigation
3. Enhance VocabActivity learn phase: show full word card (word, phonetic hint, definition, example sentence, emoji, pronunciation tip), improve visual layout
4. Apply new color accents (teal/emerald) to buttons, badges and borders in StudentDashboard and VocabActivity pages
