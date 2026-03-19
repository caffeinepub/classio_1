import type { VocabMastery } from "../backend";

const MOCK_VOCAB: VocabMastery[] = [
  { word: "hypothesis", grade: 8n, mastered: true },
  { word: "photosynthesis", grade: 8n, mastered: true },
  { word: "democracy", grade: 8n, mastered: false },
  { word: "metamorphosis", grade: 8n, mastered: true },
  { word: "precipitation", grade: 8n, mastered: false },
  { word: "civilization", grade: 8n, mastered: false },
  { word: "atmosphere", grade: 7n, mastered: true },
  { word: "biodiversity", grade: 7n, mastered: true },
  { word: "confederation", grade: 7n, mastered: false },
  { word: "migration", grade: 7n, mastered: true },
  { word: "legislature", grade: 6n, mastered: true },
  { word: "equator", grade: 6n, mastered: true },
  { word: "erosion", grade: 6n, mastered: true },
];

interface Props {
  words: VocabMastery[];
  grade: number;
}

export function VocabMasteryMap({ words, grade }: Props) {
  const display = words.length > 0 ? words : MOCK_VOCAB;

  // Group by grade
  const byGrade: Record<number, VocabMastery[]> = {};
  for (const w of display) {
    const g = Number(w.grade);
    if (!byGrade[g]) byGrade[g] = [];
    byGrade[g].push(w);
  }

  const grades = Object.keys(byGrade)
    .map(Number)
    .sort((a, b) => b - a);

  const masteredCount = display.filter((w) => w.mastered).length;
  const totalCount = display.length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <span>📝</span> Vocabulary Mastery Map
        </h3>
        <span className="text-xs text-gray-500">
          {masteredCount}/{totalCount} mastered
        </span>
      </div>

      <div className="flex gap-3 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block" />
          <span className="text-gray-500">Mastered</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400/70 inline-block" />
          <span className="text-gray-500">In Progress</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" />
          <span className="text-gray-500">Not Started</span>
        </span>
      </div>

      <div className="space-y-3">
        {grades.map((g) => (
          <div key={g}>
            <p className="text-xs font-semibold text-gray-400 mb-1.5">
              Grade {g} {g === grade ? "(Your Grade)" : ""}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {byGrade[g].map((w) => (
                <span
                  key={w.word}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    w.mastered
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
