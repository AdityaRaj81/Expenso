import api from './api'

const transactionService = {
  async getTransactions(params = {}) {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData)
    return response.data
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData)
    return response.data
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },

  async getDashboardData() {
    const response = await api.get('/dashboard')
    return response.data
  },

  async getReportsData(params = {}) {
    const response = await api.get('/reports', { params })
    return response.data
  },

  async getCategories() {
    const response = await api.get('/categories')
    return response.data
  },

  async exportTransactions(params = {}) {
    const response = await api.get('/transactions/export', { 
      params,
      responseType: 'blob'
    })
    return response.data
  },
}

export default transactionService