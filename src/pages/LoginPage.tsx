
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const LoginPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="elegant-card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your EasyHall account</p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="Your email address"
                className="elegant-input" 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input 
                id="password" 
                type="password" 
                placeholder="Your password"
                className="elegant-input" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-champagne-300 text-blush-500 focus:ring-blush-400 dark:border-champagne-700 dark:focus:ring-blush-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
                Forgot password?
              </a>
            </div>
            
            <Button className="w-full bg-blush-400 hover:bg-blush-500 text-white">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-champagne-200 dark:border-champagne-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                GitHub
              </Button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
