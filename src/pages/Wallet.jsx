import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet as WalletIcon, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const Wallet = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lifetrack_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    localStorage.setItem('lifetrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      category,
      description,
      date,
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  const deleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const calculateStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfCurrMonth = startOfMonth(new Date());
    const endOfCurrMonth = endOfMonth(new Date());

    let dailyExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    transactions.forEach((t) => {
      const tDate = parseISO(t.date);
      const isThisMonth = isWithinInterval(tDate, { start: startOfCurrMonth, end: endOfCurrMonth });

      if (t.date === today && t.type === 'expense') {
        dailyExpense += t.amount;
      }

      if (isThisMonth) {
        if (t.type === 'income') {
          monthlyIncome += t.amount;
        } else {
          monthlyExpense += t.amount;
        }
      }
    });

    return { dailyExpense, monthlyIncome, monthlyExpense, balance: monthlyIncome - monthlyExpense };
  };

  const stats = calculateStats();

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Wallet Tracker</h2>
        <p className="text-slate-500">Track your income, expenses, and stay on top of your budget.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Monthly Income</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">${stats.monthlyIncome.toFixed(2)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 text-rose-600 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Monthly Expense</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">${stats.monthlyExpense.toFixed(2)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Today's Expense</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">${stats.dailyExpense.toFixed(2)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-indigo-600 p-6 rounded-3xl border border-indigo-500 shadow-lg text-white"
        >
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <WalletIcon className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Net Balance</span>
          </div>
          <p className="text-2xl font-bold">${stats.balance.toFixed(2)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Form */}
        <div className="lg:col-span-1">
          <form onSubmit={addTransaction} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Add Transaction</h3>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Income
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories[type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                  required
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (Optional)"
                  rows="2"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-colors ${
                type === 'expense' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Plus className="w-5 h-5" />
              Add {type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Recent Transactions
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
              {transactions.length}
            </span>
          </h3>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">No transactions yet. Start tracking your budget!</p>
                </motion.div>
              ) : (
                transactions.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{t.category}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{format(parseISO(t.date), 'MMM d, yyyy')}</span>
                          {t.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[150px]">{t.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
