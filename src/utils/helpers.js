import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths } from 'date-fns'
import { DATE_RANGES } from './constants'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

export const formatDateTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy HH:mm')
}

export const getDateRange = (range) => {
  const now = new Date()

  switch (range) {
    case DATE_RANGES.TODAY:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      }
    case DATE_RANGES.YESTERDAY: {
      const yesterday = subDays(now, 1)
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      }
    }
    case DATE_RANGES.THIS_WEEK:
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      }
    case DATE_RANGES.LAST_WEEK: {
      const lastWeek = subWeeks(now, 1)
      return {
        start: startOfWeek(lastWeek),
        end: endOfWeek(lastWeek),
      }
    }
    case DATE_RANGES.THIS_MONTH:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    case DATE_RANGES.LAST_MONTH: {
      const lastMonth = subMonths(now, 1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      }
    }
    case DATE_RANGES.THIS_YEAR:
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      }
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
  }
}

export const getCategoryIcon = (categoryId, categories) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.icon || '📦'
}

export const getCategoryName = (categoryId, categories) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.name || 'Other'
}

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const generateRandomColor = () => {
  const colors = [
    '#008080', '#1A237E', '#FF6D00', '#43A047', '#E53935',
    '#9C27B0', '#FF9800', '#2196F3', '#4CAF50', '#F44336'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return re.test(password)
}