'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    // Check if there's a valid API key in localStorage
    const storedKey = localStorage.getItem('validApiKey');
    
    if (!storedKey) {
      // Redirect to home if no valid API key is found
      router.push('/');
      return;
    }
    
    // User is authorized
    setIsAuthorized(true);
  }, [router]);
  
  if (isAuthorized === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthorized === false) {
    // Should never see this since we redirect, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">You do not have permission to access this page.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Protected Area</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-3 py-1 text-sm bg-blue-700 dark:bg-blue-900 rounded hover:bg-blue-800 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
} 