import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScoreRecord } from "../backend";

const MOCK_DATA = [
  { week: "Wk 1", comprehension: 58, fluency: 62, wpm: 85 },
  { week: "Wk 2", comprehension: 64, fluency: 67, wpm: 93 },
  { week: "Wk 3", comprehension: 70, fluency: 72, wpm: 100 },
  { week: "Wk 4", comprehension: 75, fluency: 78, wpm: 108 },
  { week: "Wk 5", comprehension: 82, fluency: 85, wpm: 118 },
];

function toChartData(records: ScoreRecord[]) {
  if (!records || records.length === 0) return MOCK_DATA;
  return records.map((r) => ({
    week: `Wk ${Number(r.weekNumber)}`,
    comprehension: Number(r.comprehensionScore),
    fluency: Number(r.fluencyScore),
    wpm: Number(r.wpm),
  }));
}

const chartTooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  color: "#1e293b",
};

interface Props {
  records: ScoreRecord[];
}

export function ReadingGrowthTimeline({ records }: Props) {
  const data = toChartData(records);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📈</span> Reading Growth Timeline
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.2)" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Line
            type="monotone"
            dataKey="comprehension"
            stroke="#a78bfa"
            strokeWidth={2.5}
            dot={{ fill: "#a78bfa", r: 4 }}
            name="Comprehension"
          />
          <Line
            type="monotone"
            dataKey="fluency"
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={{ fill: "#22d3ee", r: 4 }}
            name="Fluency"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 justify-center">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-3 h-0.5 bg-violet-400 inline-block rounded" />{" "}
          Comprehension
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" />{" "}
          Fluency
        </span>
      </div>
    </div>
  );
}

export function WPMTracker({ records }: Props) {
  const data = toChartData(records);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>⚡</span> Reading Speed (WPM)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.2)" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar
            dataKey="wpm"
            fill="url(#wpmGradient)"
            radius={[4, 4, 0, 0]}
            name="Words/min"
          />
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ComprehensionAccuracyTrend({ records }: Props) {
  const data = toChartData(records);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🧠</span> Comprehension Accuracy Trend
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="compGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.2)" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Area
            type="monotone"
            dataKey="comprehension"
            stroke="#a78bfa"
            strokeWidth={2.5}
            fill="url(#compGradient)"
            name="Comprehension %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
