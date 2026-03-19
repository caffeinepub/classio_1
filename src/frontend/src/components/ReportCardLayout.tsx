import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

// ── DonutChart ─────────────────────────────────────────────────────────────────
// Dual-ring SVG: outer ring = previous score (sky-400/60), inner ring = current (primary)

export function DonutChart({
  current,
  previous,
  label,
  max = 5,
}: {
  current: number | null;
  previous: number | null;
  label: string;
  max?: number;
}) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 48;
  const innerR = 36;
  const strokeW = 10;

  const toPercent = (v: number | null) =>
    v !== null ? Math.min(v / max, 1) : 0;
  const circumference = (r: number) => 2 * Math.PI * r;

  const prevPct = toPercent(previous);
  const currPct = toPercent(current);

  const outerCirc = circumference(outerR);
  const innerCirc = circumference(innerR);

  const outerDash = outerCirc * prevPct;
  const innerDash = innerCirc * currPct;

  const displayScore =
    current !== null ? `${Math.round((current / max) * 100)}%` : "—";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label} score chart`}
      >
        {/* Background rings */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeW}
          className="text-muted/30"
        />
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeW}
          className="text-muted/30"
        />
        {/* Previous score outer ring */}
        {prevPct > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={outerR}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${outerDash} ${outerCirc}`}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        )}
        {/* Current score inner ring */}
        {currPct > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${innerDash} ${innerCirc}`}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        )}
        {/* Center text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="700"
          fill="currentColor"
          className="fill-foreground"
        >
          {displayScore}
        </text>
      </svg>
      <p className="text-sm font-semibold text-foreground">{label}</p>
    </div>
  );
}

// ── ProficiencyBadge ──────────────────────────────────────────────────────────

export function ProficiencyBadge({
  score,
  max = 5,
}: {
  score: number | null;
  max?: number;
}) {
  if (score === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        N/A
      </span>
    );
  }
  const pct = score / max;
  if (pct >= 0.8) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200">
        Proficient
      </span>
    );
  }
  if (pct >= 0.6) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200">
        Developing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200">
      Beginning
    </span>
  );
}

// ── StarRating ────────────────────────────────────────────────────────────────

export function StarRating({
  value,
  max = 5,
}: {
  value: number | null;
  max?: number;
}) {
  const filled = value !== null ? Math.round((value / max) * 5) : 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-base leading-none ${
            n <= filled ? "text-amber-400" : "text-muted-foreground/30"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

const SKILL_CARD_STYLES = {
  emerald: {
    wrapper: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4",
    icon: "w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center",
    title: "text-sm font-semibold text-emerald-900",
  },
  rose: {
    wrapper: "rounded-2xl border border-rose-200 bg-rose-50 p-4",
    icon: "w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center",
    title: "text-sm font-semibold text-rose-900",
  },
  sky: {
    wrapper: "rounded-2xl border border-sky-200 bg-sky-50 p-4",
    icon: "w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center",
    title: "text-sm font-semibold text-sky-900",
  },
};

export function SkillCard({
  color,
  title,
  icon,
  children,
}: {
  color: "emerald" | "rose" | "sky";
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const styles = SKILL_CARD_STYLES[color];
  return (
    <div className={styles.wrapper}>
      <div className="flex items-center gap-2 mb-3">
        <div className={styles.icon}>{icon}</div>
        <span className={styles.title}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── ReportingIndicatorsPanel ──────────────────────────────────────────────────

export function ReportingIndicatorsPanel({
  indicators,
}: {
  indicators: { label: string; score: number | null; max?: number }[];
}) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Reporting Indicators
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="space-y-3">
          {indicators.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-sm font-medium w-28 shrink-0">
                {row.label}
              </span>
              <ProficiencyBadge score={row.score} max={row.max ?? 5} />
              <StarRating value={row.score} max={row.max ?? 5} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── ScoreOverviewPanel ────────────────────────────────────────────────────────

export function ScoreOverviewPanel({
  readingCurrent,
  readingPrevious,
  compCurrent,
  compPrevious,
  max = 5,
  emptyMessage,
}: {
  readingCurrent: number | null;
  readingPrevious: number | null;
  compCurrent: number | null;
  compPrevious: number | null;
  max?: number;
  emptyMessage?: string;
}) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Score Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-2">
        <div className="flex gap-6 justify-center">
          <DonutChart
            current={readingCurrent}
            previous={readingPrevious}
            label="Reading"
            max={max}
          />
          <DonutChart
            current={compCurrent}
            previous={compPrevious}
            label="Comprehension"
            max={max}
          />
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-sky-300" />
            Previous
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-primary" />
            Current
          </span>
        </div>
        {readingCurrent === null && compCurrent === null && emptyMessage && (
          <p
            className="text-xs text-muted-foreground text-center"
            data-ocid="report.empty_state"
          >
            {emptyMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
