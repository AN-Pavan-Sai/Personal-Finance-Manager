import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyExpense } from '../../types';

interface DailyExpenseChartProps {
  data: DailyExpense[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl">
        <p className="text-dark-400 text-xs font-medium">{label}</p>
        <p className="text-white text-lg font-bold mt-1">
          ₹{parseFloat(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-dark-400 text-xs mt-0.5">{payload[0].payload.count} transactions</p>
      </div>
    );
  }
  return null;
}

export default function DailyExpenseChart({ data }: DailyExpenseChartProps) {
  const formattedData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }));

  return (
    <div className="glass-light rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <h3 className="text-lg font-semibold text-white mb-1">Daily Expenses</h3>
      <p className="text-dark-400 text-sm mb-6">Day-by-day spending this month</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-dark-500 text-sm">
          No expenses recorded this month
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#1e293b' }}
              activeDot={{ r: 6, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
