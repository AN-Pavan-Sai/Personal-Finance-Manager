import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CategoryBreakdown } from '../../types';

interface MonthlyBarChartProps {
  data: CategoryBreakdown[];
}

const COLORS = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e',
  '#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6', '#a3a3a3',
];

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white text-sm font-medium">{payload[0].payload.category}</p>
        <p className="text-lg font-bold text-primary-400 mt-1">
          ₹{parseFloat(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-dark-400 text-xs mt-0.5">{payload[0].payload.count} transactions</p>
      </div>
    );
  }
  return null;
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const formattedData = data.map((d, i) => ({
    ...d,
    shortName: d.category.length > 12 ? d.category.substring(0, 10) + '...' : d.category,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="glass-light rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-1">Category Spending</h3>
      <p className="text-dark-400 text-sm mb-6">Spending by category</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-dark-500 text-sm">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis
              dataKey="shortName"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            >
              {formattedData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
