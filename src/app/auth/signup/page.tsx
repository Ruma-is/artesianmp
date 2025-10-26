// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'buyer' | 'artisan'>('buyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      alert('Check your email for verification link!')
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#926829' }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-float">🎨</div>
          <div className="absolute bottom-20 right-20 text-9xl animate-float-delayed">✂️</div>
          <div className="absolute top-1/3 right-1/4 text-7xl animate-float-slow">🧵</div>
          <div className="absolute bottom-1/3 left-1/4 text-7xl animate-float-slow-delayed">🪡</div>
        </div>
        
        {/* Animated Content */}
        <div className="relative z-10 max-w-md text-center animate-slide-in-left">
          <h1 className="text-5xl font-bold mb-6 tracking-tight animate-fade-in">
            Artisan Marketplace
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-6 animate-expand"></div>
          <p className="text-xl font-light leading-relaxed opacity-90 animate-fade-in-delay-1">
            Join our community of skilled artisans and passionate buyers
          </p>
          <p className="mt-6 text-lg opacity-75 italic animate-fade-in-delay-2">
            Start your journey in traditional craftsmanship today
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#faf8f5' }}>
        <div className="w-full max-w-md animate-slide-in-right">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#926829' }}>
              Artisan Marketplace
            </h1>
            <div className="w-16 h-1 mx-auto animate-expand" style={{ backgroundColor: '#926829' }}></div>
          </div>

          <div className="rounded-2xl shadow-2xl p-8 border transform transition-all duration-300 hover:shadow-3xl animate-scale-in" style={{ backgroundColor: '#ffffff', borderColor: '#e8dfd0' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">Create Account</h2>
              <p className="text-gray-600 animate-fade-in-delay-1">Begin your artisan journey</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 animate-shake">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#926829] focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:scale-[1.02]"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#926829] focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:scale-[1.02]"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#926829] focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:scale-[1.02]"
                  placeholder="Create a strong password (min. 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  I am a:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'buyer' | 'artisan')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#926829] focus:outline-none transition-all duration-200 text-gray-900 hover:border-gray-300 focus:scale-[1.02]"
                >
                  <option value="buyer">Buyer - I want to purchase handcrafted items</option>
                  <option value="artisan">Artisan - I want to sell my crafts</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] animate-slide-up"
                style={{ 
                  backgroundColor: '#926829',
                  animationDelay: '0.3s'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#7a5621')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#926829')}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 text-center animate-fade-in-delay-2">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              
              <p className="text-gray-600">
                <Link 
                  href="/auth/login" 
                  className="font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                  style={{ color: '#926829' }}
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-center text-sm text-gray-500 animate-fade-in-delay-2">
            By signing up, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  )
}
