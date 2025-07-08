import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useTranslatedToast = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const showSuccess = (titleKey: string, descriptionKey?: string) => {
    toast({
      title: t(titleKey),
      description: descriptionKey ? t(descriptionKey) : undefined,
    });
  };

  const showError = (titleKey: string, descriptionKey?: string) => {
    toast({
      title: t(titleKey),
      description: descriptionKey ? t(descriptionKey) : undefined,
      variant: "destructive",
    });
  };

  const showMessage = (titleKey: string, descriptionKey?: string, variant?: "default" | "destructive") => {
    toast({
      title: t(titleKey),
      description: descriptionKey ? t(descriptionKey) : undefined,
      variant,
    });
  };

  return {
    showSuccess,
    showError,
    showMessage,
    toast, // For custom usage
    t
  };
};