import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import { updateTransaction } from '../store/slices/transactionSlice'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES } from '../utils/constants'
import transactionService from '../services/transactionService'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const EditTransactionPage = () => {
  const { id } = useParams()
  const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.EXPENSE)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm()

  const categories = transactionType === TRANSACTION_TYPES.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const transaction = await transactionService.getTransaction(id)
        setTransactionType(transaction.type)
        reset({
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date.split('T')[0], // Format date for input
          notes: transaction.notes || '',
        })
      } catch (error) {
        toast.error('Failed to load transaction')
        navigate('/transactions')
      } finally {
        setInitialLoading(false)
      }
    }

    if (id) {
      fetchTransaction()
    }
  }, [id, reset, navigate])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await dispatch(updateTransaction({
        id,
        data: {
          ...data,
          amount: parseFloat(data.amount),
          type: transactionType,
        }
      })).unwrap()
      
      toast.success('Transaction updated successfully!')
      navigate('/transactions')
    } catch (error) {
      toast.error('Failed to update transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (type) => {
    setTransactionType(type)
    setValue('category', '') // Reset category when type changes
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/transactions"
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-surface dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-dark-text">
            Edit Transaction
          </h1>
          <p className="text-text-secondary dark:text-gray-300 mt-1">
            Update transaction details
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange(TRANSACTION_TYPES.INCOME)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  transactionType === TRANSACTION_TYPES.INCOME
                    ? 'border-success bg-success/10 text-success'
                    : 'border-gray-300 dark:border-gray-600 hover:border-success/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <span className="text-success">💰</span>
                  </div>
                  <span className="font-medium">Income</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange(TRANSACTION_TYPES.EXPENSE)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  transactionType === TRANSACTION_TYPES.EXPENSE
                    ? 'border-error bg-error/10 text-error'
                    : 'border-gray-300 dark:border-gray-600 hover:border-error/50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-error/20 rounded-lg flex items-center justify-center">
                    <span className="text-error">💸</span>
                  </div>
                  <span className="font-medium">Expense</span>
                </div>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-text-secondary dark:text-gray-400" />
              </div>
              <input
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than 0',
                  },
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Please enter a valid amount',
                  },
                })}
                type="number"
                step="0.01"
                className="form-input pl-10"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-error">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-text-secondary dark:text-gray-400" />
              </div>
              <input
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 3,
                    message: 'Description must be at least 3 characters',
                  },
                })}
                type="text"
                className="form-input pl-10"
                placeholder="Enter transaction description"
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-text-secondary dark:text-gray-400" />
              </div>
              <select
                {...register('category', {
                  required: 'Category is required',
                })}
                className="form-input pl-10"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-text-secondary dark:text-gray-400" />
              </div>
              <input
                {...register('date', {
                  required: 'Date is required',
                })}
                type="date"
                className="form-input pl-10"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-error">{errors.date.message}</p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="form-input resize-none"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small\" className="mr-2" />
                  Updating Transaction...
                </>
              ) : (
                'Update Transaction'
              )}
            </button>
            <Link
              to="/transactions"
              className="btn-secondary text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransactionPage