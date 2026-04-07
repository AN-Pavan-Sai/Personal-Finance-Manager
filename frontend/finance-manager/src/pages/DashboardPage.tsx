import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import KPICard from '../components/KPICard';
import DailyExpenseChart from '../components/Charts/DailyExpenseChart';
import CategoryPieChart from '../components/Charts/CategoryPieChart';
import { getDashboardSummaryApi, getDailyExpensesApi, getCategoryBreakdownApi } from '../api/dashboardApi';
import { getTransactionsApi } from '../api/transactionApi';
import type { DashboardSummary, DailyExpense, CategoryBreakdown, Transaction } from '../types';
import toast from 'react-hot-toast';
import {
  HiOutlineCurrencyRupee,
  HiOutlineCalendarDays,
  HiOutlineArrowTrendingUp,
  HiOutlineShoppingBag,
} from 'react-icons/hi2';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [summaryData, dailyData, categoryData, txnData] = await Promise.all([
        getDashboardSummaryApi(),
        getDailyExpensesApi(),
        getCategoryBreakdownApi(),
        getTransactionsApi(1, 5),
      ]);

      setSummary(summaryData);
      setDailyExpenses(dailyData);
      setCategoryBreakdown(categoryData);
      setRecentTransactions(txnData.transactions);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setHasError(true);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'text-amber-400',
      'Transportation': 'text-blue-400',
      'Shopping': 'text-pink-400',
      'Bills & Utilities': 'text-red-400',
      'Entertainment': 'text-purple-400',
      'Healthcare': 'text-emerald-400',
      'Education': 'text-cyan-400',
      'Rent': 'text-orange-400',
      'Groceries': 'text-lime-400',
      'Other': 'text-gray-400',
    };
    return colors[category] || 'text-gray-400';
  };

  const getPaymentBadge = (method: string) => {
    const styles: Record<string, string> = {
      'Cash': 'bg-emerald-500/15 text-emerald-400',
      'Online Payment': 'bg-blue-500/15 text-blue-400',
      'Net Banking': 'bg-violet-500/15 text-violet-400',
      'Credit Card': 'bg-amber-500/15 text-amber-400',
      'Debit Card': 'bg-cyan-500/15 text-cyan-400',
      'UPI': 'bg-pink-500/15 text-pink-400',
    };
    return styles[method] || 'bg-gray-500/15 text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center">
            <span className="text-accent-rose text-2xl">!</span>
          </div>
          <p className="text-dark-300 text-lg font-medium">Failed to load dashboard</p>
          <p className="text-dark-500 text-sm max-w-sm">Make sure the backend server is running and try again.</p>
          <button
            onClick={loadDashboard}
            className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/25"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-dark-400 mt-1">Here's your financial overview for today</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard
          title="Today's Expenses"
          value={formatCurrency(summary?.todayExpenses || 0)}
          icon={<HiOutlineCurrencyRupee className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-primary-500 to-primary-700"
          trend={`${summary?.todayTransactions || 0} transactions`}
          delay={0}
        />
        <KPICard
          title="Monthly Expenses"
          value={formatCurrency(summary?.monthlyExpenses || 0)}
          icon={<HiOutlineCalendarDays className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-accent-cyan to-blue-600"
          trend={`${summary?.monthlyTransactions || 0} transactions`}
          delay={100}
        />
        <KPICard
          title="Transactions"
          value={summary?.monthlyTransactions || 0}
          icon={<HiOutlineArrowTrendingUp className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-accent-emerald to-green-700"
          trend="This month"
          delay={200}
        />
        <KPICard
          title="Top Category"
          value={summary?.topCategory?.category || 'N/A'}
          icon={<HiOutlineShoppingBag className="w-6 h-6 text-white" />}
          gradient="bg-gradient-to-br from-accent-amber to-orange-600"
          trend={summary?.topCategory?.total ? formatCurrency(summary.topCategory.total) : '₹0'}
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DailyExpenseChart data={dailyExpenses} />
        </div>
        <div>
          <CategoryPieChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-light rounded-3xl p-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-xl font-semibold text-white mb-2">Recent Transactions</h3>
        <p className="text-dark-400 text-sm mb-5">Your latest 5 transactions</p>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <p className="text-lg">No transactions yet</p>
            <p className="text-sm mt-1">Start by adding your first expense!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between px-6 py-5 rounded-2xl bg-dark-800/30 hover:bg-dark-800/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-dark-700/50 flex items-center justify-center">
                    <span className={`text-sm font-bold ${getCategoryColor(txn.category)}`}>
                      {txn.category.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-100">
                      {txn.description || txn.category}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-dark-500">
                        {new Date(txn.transaction_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="text-dark-600">•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentBadge(txn.payment_method)}`}>
                        {txn.payment_method}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-accent-rose">
                  -{formatCurrency(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
