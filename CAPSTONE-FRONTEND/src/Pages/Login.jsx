import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-purple-100">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to homepage</span>
        </button>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">TechStaffHub</h1>
          <h2 className="text-lg text-purple-600">HR Management Portal</h2>
        </div>
        
        {/* Form */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-400 transition-all"
                placeholder="employee@company.com"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-purple-700">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                className="block w-full pl-10 pr-3 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white placeholder-purple-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Sign In to Dashboard
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPage;