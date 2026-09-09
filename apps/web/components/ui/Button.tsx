import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`btn btn-${variant} btn-${size} ${props.className ?? ''}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? 'กำลังดำเนินการ…' : children}
    </button>
  );
}
