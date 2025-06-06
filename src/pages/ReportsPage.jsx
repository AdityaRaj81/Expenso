import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { fetchDashboardData } from '../store/slices/transactionSlice'
import { formatCurrency, formatDate, getDateRange } from '../utils/helpers'
import { DATE_RANGES, CHART_COLORS } from '../utils/constants'
import LoadingSpinner from '../components/LoadingSpinner'

const ReportsPage = () => {
  const dispatch = useDispatch()
  const { dashboardData, loading } = useSelector((state) => state.transactions)
  const [dateRange, setDateRange] = useState(DATE_RANGES.THIS_MONTH)
  const [chartType, setChartType] = useState('line')

  useEffect(() => {
    dispatch(fetchDashboardData())
  }, [dispatch, dateRange])

  const { totalIncome, totalExpenses, balance, monthlyData, categoryData } = dashboardData

  // Mock data for different chart types
  const weeklyData = [
    { name: 'Mon', income: 120, expenses: 80 },
    { name: 'Tue', income: 200, expenses: 150 },
    { name: 'Wed', income: 180, expenses: 120 },
    { name: 'Thu', income: 250, expenses: 200 },
    { name: 'Fri', income: 300, expenses: 180 },
    { name: 'Sat', income: 150, expenses: 220 },
    { name: 'Sun', income: 100, expenses: 90 },
  ]

  const yearlyData = [
    { name: '2020', income: 48000, expenses: 42000 },
    { name: '2021', income: 52000, expenses: 45000 },
    { name: '2022', income: 58000, expenses: 48000 },
    { name: '2023', income: 62000, expenses: 52000 },
    { name: '2024', income: 68000, expenses: 55000 },
  ]

  const getChartData = () => {
    switch (dateRange) {
      case DATE_RANGES.THIS_WEEK:
        return weeklyData
      case DATE_RANGES.THIS_YEAR:
        return yearlyData
      default:
        return monthlyData
    }
  }

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const incomeGrowth = calculateGrowth(totalIncome, totalIncome * 0.9) // Mock previous period
  const expenseGrowth = calculateGrowth(totalExpenses, totalExpenses * 0.85) // Mock previous period

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-dark-text">
            Financial Reports
          </h1>
          <p className="text-text-secondary dark:text-gray-300 mt-1">
            Analyze your spending patterns and financial trends
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input text-sm"
          >
            <option value={DATE_RANGES.THIS_WEEK}>This Week</option>
            <option value={DATE_RANGES.THIS_MONTH}>This Month</option>
            <option value={DATE_RANGES.THIS_YEAR}>This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-surface dark:hover:bg-gray-700 transition-colors duration-200">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Net Worth</p>
              <p className="text-2xl font-mono font-bold mt-1">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Total Income</p>
              <p className="text-xl font-mono font-bold text-success mt-1">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm">
            <TrendingUp className="w-4 h-4 text-success mr-1" />
            <span className="text-success font-medium">+{incomeGrowth.toFixed(1)}%</span>
            <span className="text-text-secondary dark:text-gray-400 ml-2">vs last period</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Total Expenses</p>
              <p className="text-xl font-mono font-bold text-error mt-1">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-error" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm">
            <TrendingUp className="w-4 h-4 text-error mr-1" />
            <span className="text-error font-medium">+{expenseGrowth.toFixed(1)}%</span>
            <span className="text-text-secondary dark:text-gray-400 ml-2">vs last period</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Savings Rate</p>
              <p className="text-xl font-mono font-bold text-primary mt-1">
                {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm">
            <span className="text-text-secondary dark:text-gray-400">
              {formatCurrency(balance)} saved
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
              Income vs Expenses Trend
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface dark:hover:bg-gray-700'}`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface dark:hover:bg-gray-700'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Legend />
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
            ) : (
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Legend />
                <Bar dataKey="income" fill="#43A047" name="Income" />
                <Bar dataKey="expenses" fill="#E53935" name="Expenses" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
              Expense Categories
            </h3>
            <div className="flex items-center space-x-1 text-sm text-text-secondary dark:text-gray-400">
              <PieChartIcon className="w-4 h-4" />
              <span>Distribution</span>
            </div>
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
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Details */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text">
            Category Breakdown
          </h3>
          <span className="text-sm text-text-secondary dark:text-gray-400">
            {dateRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        
        <div className="space-y-4">
          {categoryData.map((category, index) => {
            const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0
            return (
              <div key={category.name} className="flex items-center justify-between p-4 bg-surface/50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="font-medium text-text-primary dark:text-dark-text">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-mono font-semibold text-text-primary dark:text-dark-text">
                      {formatCurrency(category.value)}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text mb-4">
            💡 Financial Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Your savings rate of {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}% is {balance / totalIncome > 0.2 ? 'excellent' : 'good'}. Keep it up!
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Your largest expense category is {categoryData[0]?.name || 'N/A'}. Consider reviewing these expenses.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Income has grown by {incomeGrowth.toFixed(1)}% compared to the previous period.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-dark-text mb-4">
            🎯 Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Try to maintain your current savings rate or increase it by 2-3%.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Consider setting a budget limit for your top expense categories.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-text-secondary dark:text-gray-300">
                Review your monthly subscriptions and cancel unused services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage