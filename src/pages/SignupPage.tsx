
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslatedToast } from '@/hooks/useTranslatedToast';

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { signUp, signInWithGoogle, signInWithGitHub, user } = useAuth();
  const { showSuccess, showError, t } = useTranslatedToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      showError("errors.generic", error.message);
    } else {
      showSuccess("auth.signUp", "Account created successfully! Please check your email to verify your account.");
      navigate('/');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    const { error } = await signInWithGoogle();
    if (error) {
      showError("errors.generic", error.message);
    }
    setOauthLoading(null);
  };

  const handleGitHubSignIn = async () => {
    setOauthLoading('github');
    const { error } = await signInWithGitHub();
    if (error) {
      showError("errors.generic", error.message);
    }
    setOauthLoading(null);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="elegant-card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join EasyHall to book beautiful venues for your events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name" className="block text-sm font-medium mb-1">First name</Label>
                <Input 
                  id="first-name" 
                  type="text" 
                  placeholder="First name"
                  className="elegant-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last-name" className="block text-sm font-medium mb-1">Last name</Label>
                <Input 
                  id="last-name" 
                  type="text" 
                  placeholder="Last name"
                  className="elegant-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Your email address"
                className="elegant-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium mb-1">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password"
                className="elegant-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <Label htmlFor="account-type" className="block text-sm font-medium mb-1">Account type</Label>
              <select 
                id="account-type" 
                className="elegant-input"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
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
                required
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
            
            <Button 
              type="submit" 
              className="w-full bg-blush-400 hover:bg-blush-500 text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'google' ? 'Connecting...' : 'Google'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGitHubSignIn}
                disabled={oauthLoading !== null}
              >
                {oauthLoading === 'github' ? 'Connecting...' : 'GitHub'}
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
