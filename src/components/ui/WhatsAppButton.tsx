import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '+213',
  message = '',
  variant = 'outline',
  size = 'default',
  className,
  children
}) => {
  const handleClick = () => {
    // Format phone number (remove spaces and special chars except +)
    const formattedPhone = phoneNumber.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400',
        className
      )}
    >
      <MessageCircle className="w-4 h-4" />
      {children || 'WhatsApp'}
    </Button>
  );
};

export default WhatsAppButton;
