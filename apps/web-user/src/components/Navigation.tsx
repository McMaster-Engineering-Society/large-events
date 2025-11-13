'use client';

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Large Event Platform
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* User Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}