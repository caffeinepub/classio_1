# Classio — Voice Recognition & Consolidated Report

## Current State
- Student proficiency test shows a reading passage and lets students record audio.
- No voice recognition or automatic skill scoring exists.
- After submit, student is told teacher will review the recording.
- TestResult stores score (quiz answers), passageId, timestamp, audioBlobId — no skill scores.

## Requested Changes (Diff)

### Add
- Web Speech API integration in the test page to transcribe the student's reading in real time.
- Automated skill scoring engine (client-side) that computes scores (1–5) for:
  - Pronunciation: word-accuracy vs expected passage text
  - Rhythm: speaking pace consistency (words per minute)
  - Chunking: pauses at natural boundaries (commas, periods)
  - Intonation: sentence-completion confidence
- Consolidated skill report card shown to the student immediately after submission.
- Backend `SkillScores` type and updated `TestResult` to persist skill scores.
- `submitTest` now accepts optional skill scores.
- StudentDashboard results history shows per-skill badges on each past result.

### Modify
- `TestResult` type in Motoko: add `skillScores: ?SkillScores`.
- `submitTest` function: accept `skillScores: ?SkillScores` parameter.
- `StudentTest.tsx`: add speech recognition hook, compute scores, pass to submit, show report card.
- `StudentDashboard.tsx`: show skill score breakdown in result rows.

### Remove
- "Your teacher will review your recording" message on the success screen — replaced by the automated report.

## Implementation Plan
1. Update `main.mo`: add `SkillScores` record type; extend `TestResult` and `submitTest`.
2. Update `backend.d.ts` (TypeScript bindings) to reflect new types.
3. Rewrite `StudentTest.tsx`: add `useSpeechRecognition` hook; scoring logic; report card UI.
4. Update `StudentDashboard.tsx`: show skill scores per result row.
5. Validate (lint + typecheck + build) and fix any errors.
