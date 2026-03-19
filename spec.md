# Classio

## Current State
All student-facing pages (StudentTest, StudentDashboard, PracticeTest, VocabActivity, WeeklyTest, WeeklyReport) use a dark high-tech space theme: `bg-gray-950`, `bg-gray-900/80`, indigo/purple glow orbs, white text on dark backgrounds, glass-morphism dark cards.

After the proficiency test, when the system is searching for the student's level (score < 80%, still stepping down), it shows a dark loader screen with:
- "Adjusting to your level..."
- "Finding the perfect passage for you..."
- Spinning loader

When the level is found, it shows a success screen then navigates to the dashboard.

## Requested Changes (Diff)

### Add
- After proficiency test level is found, instead of just a success screen, show a "Your Learning Journey is Ready!" screen that previews the learning path: Vocab Building -> Practice Tests -> Weekly Test -> Report. Include a CTA button "Start My Learning Journey" that navigates to the dashboard My Courses tab.
- The learning journey preview should show the course structure with donut-style progress indicators for each stage.

### Modify
- Replace the dark theme (bg-gray-950, bg-gray-900, deep space backgrounds, dark glass cards) with a light theme across all student-facing pages:
  - Use white/light gray backgrounds (bg-white, bg-gray-50, bg-slate-50)
  - Use indigo/violet/blue as accent colors on light backgrounds
  - Cards: white with subtle shadows and light borders
  - Text: dark gray/slate on light backgrounds
  - Keep the brand identity (indigo/blue accents) but on a clean light canvas
- Replace the "Adjusting to your level... Finding the perfect passage for you..." loader screen with: "Creating Your Learning Journey..." with a light-themed animated screen showing the journey stages being set up (Vocab Builder, Practice Tests, Weekly Assessment, Progress Reports)
- The level-found success screen should transition smoothly into the learning journey preview before navigating to My Courses
- Apply light theme to: StudentTest, StudentDashboard, PracticeTest, VocabActivity, WeeklyTest, WeeklyReport, ReportCardLayout, SkillProgressBars, ReadingGrowthCharts, VocabMasteryMap, MonthlyProgressReport

### Remove
- Dark glow orb decorations (fixed bg-indigo-500/10 blur-3xl divs) from student-facing pages
- bg-gray-950, bg-gray-900/80, bg-gray-800 backgrounds on student pages

## Implementation Plan
1. Update index.css or global styles if needed for light theme base
2. Restyle StudentTest.tsx:
   - Main test container: light background
   - Cards: white with border-gray-200 shadows
   - Replace dark loader screen with light "Creating Your Learning Journey" animated screen
   - Replace dark level-found screen with a light learning journey preview showing: Vocab Builder -> Practice Test -> Weekly Assessment -> Report (with small donut progress circles)
3. Restyle StudentDashboard.tsx to light theme
4. Restyle PracticeTest.tsx to light theme
5. Restyle VocabActivity.tsx to light theme
6. Restyle WeeklyTest.tsx to light theme
7. Restyle WeeklyReport.tsx to light theme (keep donut charts, make them pop on white background)
8. Restyle shared components: ReportCardLayout, SkillProgressBars, ReadingGrowthCharts, VocabMasteryMap, MonthlyProgressReport
