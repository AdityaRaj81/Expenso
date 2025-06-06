import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react'
import { fetchDashboardData } from '../store/slices/transactionSlice'
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/helpers'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { dashboardData, loading } = useSelector((state) => state.transactions)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const { totalIncome, totalExpenses, balance, recentTransactions, monthlyData, categoryData } = dashboardData

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

  const COLORS = ['#008080', '#1A237E', '#FF6D00', '#43A047', '#E53935', '#9C27B0', '#FF9800', '#2196F3']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-dark-text">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-text-secondary dark:text-gray-300 mt-1">
            Here's your financial overview for this month
          </p>
        </div>
        <Link
          to="/add-transaction"
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-mono font-bold mt-2">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-mono font-bold text-success mt-2">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="w-4 h-4 text-success mr-1" />
            <span className="text-success font-medium">+12.5%</span>
            <span className="text-text-secondary dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-mono font-bold text-error mt-2">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-error" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDownRight className="w-4 h-4 text-error mr-1" />
            <span className="text-error font-medium">+8.2%</span>
            <span className="text-text-secondary dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
              Monthly Trend
            </h3>
            <div className="flex items-center space-x-2 text-sm text-text-secondary dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#43A047" 
                strokeWidth={3}
                dot={{ fill: '#43A047', strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#E53935" 
                strokeWidth={3}
                dot={{ fill: '#E53935', strokeWidth: 2, r: 4 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
              Expense Categories
            </h3>
            <button className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80">
              <Filter className="w-4 h-4" />
              <span>This month</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [formatCurrency(value), 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
            Recent Transactions
          </h3>
          <Link
            to="/transactions"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-text-secondary dark:text-gray-400" />
            </div>
            <p className="text-text-secondary dark:text-gray-400 mb-4">No transactions yet</p>
            <Link to="/add-transaction" className="btn-primary">
              Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-surface/50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'INCOME' ? 'bg-success/10' : 'bg-error/10'
                  }`}>
                    <span className="text-lg">
                      {getCategoryIcon(transaction.category, allCategories)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary dark:text-dark-text">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                      {formatDate(transaction.date)} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${
                    transaction.type === 'INCOME' ? 'text-success' : 'text-error'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard