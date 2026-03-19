import { useCallback, useState } from "react";

interface ProficiencySearchState {
  attemptsMade: number;
  currentTestLevel: number;
  levelFound: boolean;
  foundLevel: number | null;
}

function storageKey(userId: string) {
  return `classio_proficiency_search_${userId}`;
}

function loadState(
  userId: string,
  enrolledGrade: number,
): ProficiencySearchState {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw) as ProficiencySearchState;
  } catch {
    // ignore
  }
  return {
    attemptsMade: 0,
    currentTestLevel: enrolledGrade,
    levelFound: false,
    foundLevel: null,
  };
}

export function useProficiencySearch(userId: string, enrolledGrade: number) {
  const [state, setState] = useState<ProficiencySearchState>(() =>
    loadState(userId, enrolledGrade),
  );

  const save = useCallback(
    (next: ProficiencySearchState) => {
      setState(next);
      localStorage.setItem(storageKey(userId), JSON.stringify(next));
    },
    [userId],
  );

  const passLevel = useCallback(() => {
    setState((prev) => {
      const next: ProficiencySearchState = {
        ...prev,
        levelFound: true,
        foundLevel: prev.currentTestLevel,
      };
      localStorage.setItem(storageKey(userId), JSON.stringify(next));
      return next;
    });
  }, [userId]);

  const failLevel = useCallback(() => {
    setState((prev) => {
      const newAttempts = prev.attemptsMade + 1;
      const newLevel = Math.max(1, prev.currentTestLevel - 1);
      // If we'd go below 1, settle at level 1
      if (prev.currentTestLevel <= 1) {
        const next: ProficiencySearchState = {
          ...prev,
          attemptsMade: newAttempts,
          currentTestLevel: 1,
          levelFound: true,
          foundLevel: 1,
        };
        localStorage.setItem(storageKey(userId), JSON.stringify(next));
        return next;
      }
      const next: ProficiencySearchState = {
        ...prev,
        attemptsMade: newAttempts,
        currentTestLevel: newLevel,
      };
      localStorage.setItem(storageKey(userId), JSON.stringify(next));
      return next;
    });
  }, [userId]);

  const reset = useCallback(() => {
    localStorage.removeItem(storageKey(userId));
    const defaults = loadState(userId, enrolledGrade);
    setState(defaults);
    save(defaults);
  }, [userId, enrolledGrade, save]);

  return {
    attemptsMade: state.attemptsMade,
    currentTestLevel: state.currentTestLevel,
    levelFound: state.levelFound,
    foundLevel: state.foundLevel,
    passLevel,
    failLevel,
    reset,
  };
}
