import { useState, useEffect } from 'react';
import {
  getTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
} from '../api/transactionApi';
import TransactionForm from '../components/TransactionForm';
import type { Transaction, CreateTransactionData, Category, PaymentMethod } from '../types';
import toast from 'react-hot-toast';
import {
  HiOutlinePlusCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [page, startDate, endDate]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await getTransactionsApi(page, 10, startDate || undefined, endDate || undefined);
      setTransactions(result.transactions);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateTransactionData) => {
    try {
      await createTransactionApi(data);
      toast.success('Transaction added!');
      loadTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
      throw error;
    }
  };

  const handleUpdate = async (data: CreateTransactionData) => {
    if (!editingTransaction) return;
    try {
      await updateTransactionApi(editingTransaction.id, data);
      toast.success('Transaction updated!');
      setEditingTransaction(null);
      loadTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update transaction');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransactionApi(id);
      toast.success('Transaction deleted');
      loadTransactions();
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-amber-500/15 text-amber-400',
      'Transportation': 'bg-blue-500/15 text-blue-400',
      'Shopping': 'bg-pink-500/15 text-pink-400',
      'Bills & Utilities': 'bg-red-500/15 text-red-400',
      'Entertainment': 'bg-purple-500/15 text-purple-400',
      'Healthcare': 'bg-emerald-500/15 text-emerald-400',
      'Education': 'bg-cyan-500/15 text-cyan-400',
      'Rent': 'bg-orange-500/15 text-orange-400',
      'Groceries': 'bg-lime-500/15 text-lime-400',
      'Other': 'bg-gray-500/15 text-gray-400',
    };
    return colors[category] || 'bg-gray-500/15 text-gray-400';
  };

  const getPaymentBadge = (method: string) => {
    const styles: Record<string, string> = {
      'Cash': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Online Payment': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Net Banking': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      'Credit Card': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Debit Card': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'UPI': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };
    return styles[method] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-dark-400 mt-1">{total} total transactions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              showFilters ? 'bg-primary-600/20 text-primary-300' : 'bg-dark-800/50 text-dark-300 hover:bg-dark-700/50'
            }`}
          >
            <HiOutlineFunnel className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold hover:from-primary-500 hover:to-primary-400 transition-all duration-200 shadow-lg shadow-primary-600/25"
            id="add-transaction-btn"
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-light rounded-3xl p-8 animate-fade-in flex items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-2.5 text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              id="filter-start-date"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-300 mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-2.5 text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              id="filter-end-date"
            />
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 rounded-xl bg-dark-700/50 text-dark-300 text-sm font-medium hover:bg-dark-700 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="glass-light rounded-3xl overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-dark-500">
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">Click "Add Transaction" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Description</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Category</th>
                  <th className="text-left px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Payment</th>
                  <th className="text-right px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-8 py-5 text-sm font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className="border-b border-dark-700/30 hover:bg-dark-800/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="px-8 py-5 text-sm text-dark-300">
                      {new Date(txn.transaction_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-8 py-5 text-sm text-dark-100 font-medium max-w-[200px] truncate">
                      {txn.description || '—'}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getCategoryColor(txn.category)}`}>
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getPaymentBadge(txn.payment_method)}`}>
                        {txn.payment_method}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-accent-rose text-right">
                      -{formatCurrency(txn.amount)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingTransaction(txn)}
                          className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="p-2 rounded-lg text-dark-400 hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700/50">
            <p className="text-sm text-dark-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {editingTransaction && (
        <TransactionForm
          onSubmit={handleUpdate}
          onClose={() => setEditingTransaction(null)}
          initialData={{
            amount: editingTransaction.amount,
            category: editingTransaction.category as Category,
            paymentMethod: editingTransaction.payment_method as PaymentMethod,
            description: editingTransaction.description,
            transactionDate: editingTransaction.transaction_date.split('T')[0],
          }}
          isEdit
        />
      )}
    </div>
  );
}
