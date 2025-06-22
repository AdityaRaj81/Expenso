import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { loginUser, clearError } from '../store/slices/authSlice'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(loginUser(data)).unwrap()

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Login failed')
      // Error is handled by the slice and toast
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-cta rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-logo font-bold text-text-primary dark:text-dark-text">
              Expenso
            </span>
          </Link>

          <h2 className="text-3xl font-heading font-bold text-text-primary dark:text-dark-text">
            Welcome back
          </h2>
          <p className="mt-2 text-text-secondary dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-secondary dark:text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  className="form-input pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-dark-text mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-secondary dark:text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary dark:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary dark:text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small\" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="card bg-primary/5 dark:bg-primary/10 border-primary/20">
          <div className="text-center">
            <h3 className="text-sm font-medium text-text-primary dark:text-dark-text mb-2">
              Demo Credentials
            </h3>
            <p className="text-xs text-text-secondary dark:text-gray-300">
              Email: demo@expenso.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage