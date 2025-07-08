
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslatedToast } from '@/hooks/useTranslatedToast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
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

    const { error } = await signIn(email, password);

    if (error) {
      showError("errors.generic", error.message);
    } else {
      showSuccess("common.success", "Logged in successfully!");
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="elegant-card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground">{t('auth.signInDescription')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">{t('auth.email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('auth.emailPlaceholder')}
                className="elegant-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium mb-1">{t('auth.password')}</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={t('auth.passwordPlaceholder')}
                className="elegant-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                  {t('auth.rememberMe')}
                </label>
              </div>
              <a href="#" className="text-sm text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
                {t('auth.forgotPassword')}
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blush-400 hover:bg-blush-500 text-white"
              disabled={loading}
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-champagne-200 dark:border-champagne-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">{t('auth.orContinueWith')}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                {t('auth.google')}
              </Button>
              <Button variant="outline" className="w-full">
                {t('auth.github')}
              </Button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="font-medium text-blush-500 hover:text-blush-600 dark:text-blush-400 dark:hover:text-blush-300">
              {t('auth.signUpHere')}
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
