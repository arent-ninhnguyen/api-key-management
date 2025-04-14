'use client';

import { useEffect, useState } from 'react';

export default function ProtectedPage() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);

  useEffect(() => {
    // Get API key from localStorage
    const storedKey = localStorage.getItem('validApiKey');
    
    if (storedKey) {
      setApiKey(JSON.parse(storedKey));
    }
    
    setLoading(false);
    
    // Auto-hide success banner after 5 seconds
    const timer = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-500">Loading API key data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {showSuccessBanner && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
          <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">API Key Validated Successfully</h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">Your API key has been successfully validated and you now have access to protected resources.</p>
          </div>
          <button 
            onClick={() => setShowSuccessBanner(false)}
            className="ml-auto -mt-1 -mr-1 bg-green-50 dark:bg-green-900/50 text-green-500 rounded-full p-1 hover:bg-green-100 dark:hover:bg-green-800 focus:outline-none"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Granted!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your API key has been successfully validated</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">API Key Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Name:</span>
              <span className="font-medium text-gray-900 dark:text-white">{apiKey?.name || "Default Key"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Key:</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {apiKey?.key ? `${apiKey.key.substring(0, 5)}••••••••` : "Not available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Usage:</span>
              <span className="font-medium text-gray-900 dark:text-white">{apiKey?.usage || 0} requests</span>
            </div>
            {apiKey?.usage_limit && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Usage Limit:</span>
                <span className="font-medium text-gray-900 dark:text-white">{apiKey.limit_value} requests</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              This page represents a protected resource that can only be accessed with a valid API key. You can now use your API key to access all protected endpoints in this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 