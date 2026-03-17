# Classio

## Current State
StudentTest shows a reading passage, an audio recording section, and comprehension questions (MCQ). Submit scores answers automatically.

## Requested Changes (Diff)

### Add
- 4 individual skill assessment sections: Rhythm, Intonation, Chunking, Pronunciation
- Each section has a short spoken prompt and a dedicated microphone recorder
- Submit enabled only when all 4 recordings are made

### Modify
- Remove reading passage card entirely
- Remove comprehension questions MCQ section
- Change test title to "Speaking Proficiency Test"
- Change submit to submit all recordings (audioBlobId = null for now, local blobs tracked)
- Result screen updated to say "Speaking Test Submitted" and show teacher-review message

### Remove
- Reading passage display
- MCQ comprehension questions
- Dependency on passage content/questions backend calls for display purposes

## Implementation Plan
1. Rewrite StudentTest.tsx to show 4 skill recording cards
2. Each card: skill name, instructions with short spoken prompt, record/stop/playback controls
3. Submit when all 4 recordings are done; call submitTest with empty answers array
4. Update result screen messaging to reflect speaking test
