
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const SignupPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="elegant-card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join EasyHall to book beautiful venues for your events</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium mb-1">First name</label>
                <input 
                  id="first-name" 
                  type="text" 
                  placeholder="First name"
                  className="elegant-input" 
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium mb-1">Last name</label>
                <input 
                  id="last-name" 
                  type="text" 
                  placeholder="Last name"
                  className="elegant-input" 
                />
              </div>
            </div>
            
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
                placeholder="Create a password"
                className="elegant-input" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="account-type" className="block text-sm font-medium mb-1">Account type</label>
              <select 
                id="account-type" 
                className="elegant-input"
              >
                <option value="guest">Guest (Book venues)</option>
                <option value="host">Host (List venues)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-champagne-300 text-blush-500 focus:ring-blush-400 dark:border-champagne-700 dark:focus:ring-blush-600"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button className="w-full bg-blush-400 hover:bg-blush-500 text-white">
              Create Account
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
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupPage;
