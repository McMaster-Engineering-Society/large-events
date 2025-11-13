'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Login form configuration
 */
export interface LoginFormProps {
  /** Form title */
  title?: string;
  /** Login function from auth context */
  onLogin: (email: string) => Promise<boolean>;
  /** Custom validation function */
  validateEmail?: (email: string) => string | null;
  /** Success callback */
  onSuccess?: () => void;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the card */
  cardClassName?: string;
}

/**
 * Shared login form component
 * Configurable for both user and admin portals
 *
 * @example With useAuth hook
 * ```tsx
 * import { LoginForm } from '@large-event/web-components';
 * import { useAuth } from './contexts/AuthContext';
 *
 * export default function LoginPage() {
 *   const { login } = useAuth();
 *   return <LoginForm title="User Portal" onLogin={login} />;
 * }
 * ```
 */
export default function LoginForm({
  title = 'Large Event Portal',
  onLogin,
  validateEmail,
  onSuccess,
  className = 'flex flex-col items-center justify-center min-h-screen p-5 bg-bg-gray',
  cardClassName = 'card',
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate email
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Custom validation
    if (validateEmail) {
      const validationError = validateEmail(email);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
    }

    // Attempt login
    const success = await onLogin(email);
    if (!success) {
      setError('Login failed. Please check your email and try again.');
      setLoading(false);
    } else {
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div className={className}>
      <div className={cardClassName}>
        <h1 className="text-center mb-8 text-text-dark">{title}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            id="emailLogin"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="input-primary"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-error-red text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
