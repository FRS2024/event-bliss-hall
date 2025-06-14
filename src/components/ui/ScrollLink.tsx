
import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';

interface ScrollLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const ScrollLink: React.FC<ScrollLinkProps> = ({ to, children, className, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Navigate to the new route
    navigate(to);
    
    // Scroll to top after a brief delay to ensure the route has changed
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollLink;
