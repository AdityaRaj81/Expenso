import { signupUser, loginUser } from '../api/authApi'

const authService = {
  async login(credentials) {
    const response = await loginUser(credentials)
    return response.data
  },

  async register(userData) {
    const response = await signupUser(userData)
    return response.data
  },

  // You can later implement these if your backend supports them
  async logout() {
    return { message: 'Logout functionality not implemented yet.' }
  },

  async refreshToken() {
    return { message: 'Refresh token not implemented yet.' }
  },

  async forgotPassword() {
    return { message: 'Forgot password not implemented yet.' }
  },

  async resetPassword() {
    return { message: 'Reset password not implemented yet.' }
  },

  async updateProfile() {
    return { message: 'Update profile not implemented yet.' }
  },

  async changePassword() {
    return { message: 'Change password not implemented yet.' }
  },
}

export default authService
