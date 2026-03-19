# Classio

## Current State
- All dashboards (Admin, Teacher, Student) use a dark gray-950 background with indigo/purple/cyan glow effects
- AppHeader is dark (bg-gray-950/95)
- Login page has dark left panel with space theme and light right panel
- Teacher and student accounts are lost on every fresh canister deployment because `seedAdmin()` only runs in postupgrade (not on fresh init)
- Only admin credentials are hardcoded bypass; teacher/student credentials are stored in the mutable users map which starts empty

## Requested Changes (Diff)

### Add
- Default seeded teacher account: username `Teacher1`, password `Teacher@11` (grade-agnostic)
- Default seeded student account: username `Student1`, password `Student@11`, grade 5, assigned to Teacher1
- `system func init()` in backend to seed admin + default accounts on fresh deployment
- Light professional high-tech theme: white/light-gray backgrounds, indigo/blue accents, subtle blue tech grid/gradient, clean card shadows
- Quick Fill buttons on login for Teacher1 and Student1 credentials (in addition to admin)

### Modify
- Backend `postupgrade` to also call `seedDefaultAccounts()` so default accounts are always present
- AppHeader: light background (white/gray-50), dark text, indigo accents
- AdminDashboard: light theme (white cards, gray-50 background, indigo accents)
- TeacherDashboard: same light theme
- StudentDashboard: already partially light, ensure consistency
- LandingPage: redesign both panels to light professional look with tech grid pattern

### Remove
- Dark (gray-950, gray-900) backgrounds from all dashboards and AppHeader
- Dark glass-morphism effects (bg-gray-900/80) from cards
- Fixed ambient glow orbs (indigo-500/10 blurs) from dashboards

## Implementation Plan
1. Update `src/backend/main.mo`: add `seedDefaultAccounts()`, add `system func init()` calling both seed functions, call `seedDefaultAccounts()` in `postupgrade`
2. Update frontend: apply light professional high-tech theme to AppHeader, AdminDashboard, TeacherDashboard, StudentDashboard, and LandingPage; add credential hint text and quick-fill buttons for default accounts
