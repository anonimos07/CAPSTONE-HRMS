import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">TechStaffHub</h1>
          <h2 className="text-2xl font-semibold text-purple-700">Welcome Back</h2>
        </div>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-purple-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-purple-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-purple-600 hover:text-purple-800 text-sm">
              Forgot password?
            </Link>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-800">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;