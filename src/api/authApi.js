import axios from 'axios'

const API = axios.create({
  baseURL: 'https://expenso-back-x26o.onrender.com/api/v1/auth', // your backend Render URL
})

export const signupUser = (userData) => API.post('/signup', userData)
export const loginUser = (credentials) => API.post('/login', credentials)
