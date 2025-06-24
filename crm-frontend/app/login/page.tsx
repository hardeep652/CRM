'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Building2 } from 'lucide-react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams();
    params.append('username', formData.username);
    params.append('password', formData.password);

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
      body: params, // send as form data
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); 
      window.location.href = '/dashboard';
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Login failed');
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
    console.error('Login error:', err);
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Unique animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with glow */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/25 to-teal-400/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]"></div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-500"></div>
        
        {/* Curved light streaks */}
        <div className="absolute top-0 left-1/4 w-px h-3/4 bg-gradient-to-b from-blue-400/50 via-cyan-400/30 to-transparent rotate-12"></div>
        <div className="absolute top-1/4 right-1/4 w-px h-2/3 bg-gradient-to-b from-purple-400/40 via-pink-400/20 to-transparent -rotate-12"></div>
        
        {/* Hexagonal pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
      </div>

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CRM Portal</h1>
          <p className="text-white/70">Welcome back! Please sign in to continue</p>
        </div>

        {/* Login form */}
        <div className="bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl p-8 rounded-3xl border border-white/30 shadow-2xl shadow-black/25">
          <div className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block drop-shadow-sm">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/30 border border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm shadow-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block drop-shadow-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/80 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 bg-white text-cyan-500 focus:ring-cyan-400 focus:ring-2 shadow-sm"
                />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-cyan-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-white/70 mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
