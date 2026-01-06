
import React from 'react';

interface DuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const DuoButton: React.FC<DuoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  // Use theme-based border-radius, border-width, and the custom btn-press class for dynamic 3D depth
  const baseStyles = "font-bold tracking-wider uppercase rounded-theme transition-all transform outline-none select-none flex items-center justify-center gap-2 py-3 px-6 btn-press shadow-theme";
  
  const variants = {
    primary: "bg-primary text-white border-primaryDark hover:brightness-110",
    secondary: "bg-secondary text-white border-secondaryDark hover:brightness-110",
    danger: "bg-danger text-white border-dangerDark hover:brightness-110",
    ghost: "bg-transparent text-textMain hover:bg-borderMain/20 border-transparent hover:border-borderMain/50 !border-b-0 shadow-none !translate-y-0"
  };

  const disabledStyles = "bg-borderMain border-textMuted text-textMuted cursor-not-allowed !translate-y-0 !border-b-[var(--border-width-btn)]";

  return (
    <button 
      className={`
        ${baseStyles} 
        ${disabled ? disabledStyles : variants[variant]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{ borderStyle: 'solid', borderColor: disabled ? 'var(--color-text-muted)' : undefined }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default DuoButton;
