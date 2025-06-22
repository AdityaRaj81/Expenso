import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { fetchTransactions, deleteTransaction, setFilters, clearFilters } from '../store/slices/transactionSlice'
import { formatCurrency, formatDate, getCategoryIcon, getCategoryName } from '../utils/helpers'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES } from '../utils/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const TransactionsPage = () => {
  const dispatch = useDispatch()
  const { transactions, loading, pagination, filters } = useSelector((state) => state.transactions)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

  useEffect(() => {
    dispatch(fetchTransactions({
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
      sortBy,
      sortOrder
    }))
  }, [dispatch, pagination.page, pagination.limit, filters, sortBy, sortOrder])

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransaction(id)).unwrap()
        toast.success('Transaction deleted successfully')
      } catch {
        toast.error('Failed to delete transaction')
      }
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handlePageChange = (page) => {
    dispatch(fetchTransactions({
      page,
      limit: pagination.limit,
      ...filters,
      sortBy,
      sortOrder
    }))
  }

  if (loading && transactions.length === 0) {
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
            Transactions
          </h1>
          <p className="text-text-secondary dark:text-gray-300 mt-1">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-surface dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-surface dark:hover:bg-gray-700 transition-colors duration-200">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <Link to="/add-transaction" className="btn-primary inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value={TRANSACTION_TYPES.INCOME}>Income</option>
                <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="form-input text-sm"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-dark-text"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-text-secondary dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary dark:text-dark-text mb-2">
              No transactions found
            </h3>
            <p className="text-text-secondary dark:text-gray-400 mb-6">
              Start by adding your first transaction
            </p>
            <Link to="/add-transaction" className="btn-primary">
              Add Transaction
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface/50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center space-x-1 text-sm font-medium text-text-primary dark:text-dark-text hover:text-primary"
                      >
                        <span>Date</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-primary dark:text-dark-text">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-primary dark:text-dark-text">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('amount')}
                        className="flex items-center space-x-1 text-sm font-medium text-text-primary dark:text-dark-text hover:text-primary"
                      >
                        <span>Amount</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-primary dark:text-dark-text">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-text-primary dark:text-dark-text">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-surface/30 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-sm text-text-secondary dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === 'INCOME' ? 'bg-success/10' : 'bg-error/10'
                            }`}>
                            <span className="text-sm">
                              {getCategoryIcon(transaction.category, allCategories)}
                            </span>
                          </div>
                          <span className="font-medium text-text-primary dark:text-dark-text">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary dark:text-gray-400">
                        {getCategoryName(transaction.category, allCategories)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-semibold ${transaction.type === 'INCOME' ? 'text-success' : 'text-error'
                          }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'INCOME'
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                          }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/edit-transaction/${transaction.id}`}
                            className="p-2 text-text-secondary dark:text-gray-400 hover:text-primary hover:bg-surface dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-text-secondary dark:text-gray-400 hover:text-error hover:bg-surface dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="bg-surface/50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'INCOME' ? 'bg-success/10' : 'bg-error/10'
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
                          {getCategoryName(transaction.category, allCategories)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${transaction.type === 'INCOME' ? 'text-success' : 'text-error'
                        }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'INCOME'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                      }`}>
                      {transaction.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/edit-transaction/${transaction.id}`}
                        className="p-2 text-text-secondary dark:text-gray-400 hover:text-primary hover:bg-surface dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-text-secondary dark:text-gray-400 hover:text-error hover:bg-surface dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-text-secondary dark:text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">
                    {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage