import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">HRMS</h1>
          <h2 className="text-2xl font-semibold text-blue-700">Welcome Back</h2>
        </div>
        
        <form className="space-y-6">
          {/* Form fields remain the same */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
              Forgot password?
            </Link>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-blue-800">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;