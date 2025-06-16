import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import transactionService from '../../services/transactionService'
import api from '../../services/api'

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactions(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions/add', transactionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionService.updateTransaction(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction')
    }
  }
)

export const fetchDashboardData = createAsyncThunk(
  'transactions/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getDashboardData()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data')
    }
  }
)

const initialState = {
  transactions: [],
  dashboardData: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: [],
    monthlyData: [],
    categoryData: [],
  },
  currentTransaction: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  },
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        search: '',
      }
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.transactions
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transactions.unshift(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })

      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload)
      })

      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardData = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setFilters, clearFilters, setCurrentTransaction } = transactionSlice.actions
export default transactionSlice.reducer