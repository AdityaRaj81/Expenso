import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Get detailed insights into your spending patterns with interactive charts and reports.',
    },
    {
      icon: PieChart,
      title: 'Category Tracking',
      description: 'Organize expenses by categories and see where your money goes.',
    },
    {
      icon: TrendingUp,
      title: 'Financial Goals',
      description: 'Set budgets and track your progress towards financial goals.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure with bank-level security.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your finances anywhere with our responsive design.',
    },
    {
      icon: Users,
      title: 'Multi-User',
      description: 'Perfect for individuals, families, and small businesses.',
    },
  ]

  const benefits = [
    'Track income and expenses effortlessly',
    'Categorize transactions automatically',
    'Generate detailed financial reports',
    'Set and monitor budgets',
    'Export data for tax purposes',
    'Mobile-responsive design',
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-cta rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-logo font-bold text-text-primary dark:text-dark-text">
                Expenso
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-text-primary dark:text-dark-text hover:text-primary font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary dark:text-dark-text mb-6">
              Take Control of Your
              <span className="text-transparent bg-clip-text bg-gradient-cta block">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-text-secondary dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Expenso helps you track expenses, manage budgets, and gain insights into your spending habits 
              with beautiful charts and detailed analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary dark:text-dark-text mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make personal finance management simple and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-text-primary dark:text-dark-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary dark:text-dark-text mb-6">
                Why Choose Expenso?
              </h2>
              <p className="text-lg text-text-secondary dark:text-gray-300 mb-8">
                Join thousands of users who have transformed their financial habits with our intuitive expense tracking platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-primary dark:text-dark-text">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">Monthly Overview</h3>
                    <span className="text-sm text-text-secondary dark:text-gray-400">December 2024</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-success/10 rounded-lg p-4">
                      <p className="text-sm text-text-secondary dark:text-gray-400">Income</p>
                      <p className="text-2xl font-mono font-bold text-success">$5,240</p>
                    </div>
                    <div className="bg-error/10 rounded-lg p-4">
                      <p className="text-sm text-text-secondary dark:text-gray-400">Expenses</p>
                      <p className="text-2xl font-mono font-bold text-error">$3,180</p>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-text-secondary dark:text-gray-400">Balance</p>
                    <p className="text-3xl font-mono font-bold text-primary">$2,060</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are already managing their money smarter with Expenso.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-cta rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-xl font-logo font-bold text-text-primary dark:text-dark-text">
                Expenso
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-text-secondary dark:text-gray-400 hover:text-primary">
                Login
              </Link>
              <Link to="/signup" className="text-text-secondary dark:text-gray-400 hover:text-primary">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-text-secondary dark:text-gray-400">
              © 2024 Expenso. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage