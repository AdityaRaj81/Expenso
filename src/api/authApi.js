import axios from 'axios'

// ✅ Corrected baseURL
const API = axios.create({
  baseURL: 'https://expenso-back-x26o.onrender.com/api/auth',
})

// ✅ Updated endpoint names to match backend
export const signupUser = (userData) => API.post('/signup', userData)
export const loginUser = (credentials) => API.post('/login', credentials)
