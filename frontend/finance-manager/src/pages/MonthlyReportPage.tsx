import { useState, useEffect } from 'react';
import { getCategoryBreakdownApi, getMonthlySummaryApi } from '../api/dashboardApi';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';
import type { CategoryBreakdown, MonthlySummary } from '../types';
import {
  HiOutlineTrophy,
  HiOutlineChartBar,
  HiOutlineArrowTrendingDown,
} from 'react-icons/hi2';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlyReportPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catData, monthData] = await Promise.all([
        getCategoryBreakdownApi(selectedYear, selectedMonth),
        getMonthlySummaryApi(selectedYear),
      ]);
      setCategoryData(catData);
      setMonthlySummaries(monthData);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const totalExpense = categoryData.reduce((sum, d) => sum + d.total, 0);
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const totalTransactions = categoryData.reduce((sum, d) => sum + d.count, 0);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-primary-500 to-primary-700',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-green-700',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-700',
      'from-violet-500 to-purple-700',
      'from-sky-500 to-indigo-600',
      'from-pink-500 to-rose-700',
      'from-teal-500 to-emerald-700',
      'from-gray-500 to-gray-700',
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Monthly Report</h1>
          <p className="text-dark-400 mt-1">Analyze your spending patterns</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-2.5 text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            id="month-selector"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-2.5 text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            id="year-selector"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="glass-light rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <HiOutlineArrowTrendingDown className="w-5 h-5 text-white" />
            </div>
            <p className="text-dark-400 text-sm font-medium">Total Expenses</p>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatCurrency(totalExpense)}</h3>
          <p className="text-dark-500 text-xs mt-1">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </p>
        </div>

        <div className="glass-light rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-amber to-orange-600 flex items-center justify-center">
              <HiOutlineTrophy className="w-5 h-5 text-white" />
            </div>
            <p className="text-dark-400 text-sm font-medium">Top Category</p>
          </div>
          <h3 className="text-3xl font-bold text-white">{topCategory?.category || 'N/A'}</h3>
          <p className="text-accent-amber text-sm font-medium mt-1">
            {topCategory ? formatCurrency(topCategory.total) : '₹0.00'}
          </p>
        </div>

        <div className="glass-light rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-emerald to-green-700 flex items-center justify-center">
              <HiOutlineChartBar className="w-5 h-5 text-white" />
            </div>
            <p className="text-dark-400 text-sm font-medium">Transactions</p>
          </div>
          <h3 className="text-3xl font-bold text-white">{totalTransactions}</h3>
          <p className="text-dark-500 text-xs mt-1">
            across {categoryData.length} categories
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <MonthlyBarChart data={categoryData} />
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-light rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="px-8 py-6 border-b border-dark-700/50">
          <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
          <p className="text-dark-400 text-sm mt-0.5">Detailed spending by category</p>
        </div>

        {categoryData.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <p className="text-lg">No data for this month</p>
            <p className="text-sm mt-1">Add some transactions to see the report</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700/30">
            {categoryData.map((cat, index) => {
              const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
              return (
                <div
                  key={cat.category}
                  className="flex items-center px-8 py-6 hover:bg-dark-800/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(index)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-dark-100">{cat.category}</span>
                        <span className="text-sm font-bold text-white">{formatCurrency(cat.total)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(index)} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 text-right min-w-[80px]">
                    <span className="text-sm text-dark-400">{percentage.toFixed(1)}%</span>
                    <p className="text-xs text-dark-500">{cat.count} txns</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Yearly Monthly Summary */}
      {monthlySummaries.length > 0 && (
        <div className="glass-light rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="px-8 py-6 border-b border-dark-700/50">
            <h3 className="text-lg font-semibold text-white">Yearly Overview — {selectedYear}</h3>
            <p className="text-dark-400 text-sm mt-0.5">Month-by-month spending summary</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left px-8 py-4 text-sm font-semibold text-dark-400 uppercase tracking-wider">Month</th>
                  <th className="text-right px-8 py-4 text-sm font-semibold text-dark-400 uppercase tracking-wider">Total Spent</th>
                  <th className="text-right px-8 py-4 text-sm font-semibold text-dark-400 uppercase tracking-wider">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummaries.map((m) => {
                  const monthNum = parseInt(m.month.split('-')[1]);
                  return (
                    <tr
                      key={m.month}
                      className={`border-b border-dark-700/20 hover:bg-dark-800/30 transition-colors ${
                        monthNum === selectedMonth ? 'bg-primary-600/10' : ''
                      }`}
                    >
                      <td className="px-8 py-5 text-sm text-dark-100 font-medium">
                        {MONTH_NAMES[monthNum - 1]}
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-white text-right">
                        {formatCurrency(m.total)}
                      </td>
                      <td className="px-8 py-5 text-sm text-dark-400 text-right">
                        {m.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
