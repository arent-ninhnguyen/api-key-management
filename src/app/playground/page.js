'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateApiKey, getAndStoreApiKeyDetails } from '../../lib/api-keys';
import { isApiLimitExceeded } from '../../lib/utils';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState({ text: '', type: '' });
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const router = useRouter();

  // Check if API limit is exceeded
  useEffect(() => {
    setIsLimitExceeded(isApiLimitExceeded());
  }, []);

  // Clear validation message after 3 seconds
  useEffect(() => {
    if (validationMessage.text) {
      const timer = setTimeout(() => {
        setValidationMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setValidationMessage({ 
        text: 'Please enter a valid API key', 
        type: 'error' 
      });
      return;
    }

    setIsSubmitting(true);
    setValidationMessage({ text: '', type: '' });
    
    try {
      // Validate the API key with Supabase
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        // Get key details and store in localStorage
        await getAndStoreApiKeyDetails(apiKey);
        
        // Reset form and redirect to protected page immediately
        setApiKey('');
        router.push('/protected');
      } else {
        throw new Error('Invalid API key');
      }
    } catch (err) {
      setValidationMessage({
        text: 'Invalid API key',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If API limit is exceeded, show an error message
  if (isLimitExceeded) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">API Playground</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Validate your API key to check if it can access protected resources.
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">API Usage Limit Exceeded</h2>
            <p className="text-red-700 dark:text-red-400 mb-3">
              You have reached your monthly API request limit. The API Playground feature is currently disabled.
              Please wait until your limit resets or consider upgrading your plan.
            </p>
            <p className="text-red-700 dark:text-red-400 mb-6">
              Need help? Contact admin at <a href="mailto:ninh.nguye@arentvn.com" className="underline font-medium">ninh.nguye@arentvn.com</a> to renew your API limit.
            </p>
            <Link 
              href="/dashboards" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">API Playground</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Validate your API key to check if it can access protected resources.
          </p>
        </div>

        {/* Validation message notification */}
        {validationMessage.text && (
          <div className={`fixed top-4 right-4 flex items-center ${
            validationMessage.type === 'success' 
              ? 'bg-green-600' 
              : 'bg-red-600'
          } text-white px-4 py-3 rounded-md shadow-md z-50`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {validationMessage.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <p>{validationMessage.text}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Enter Your API Key</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                placeholder="Enter your API key here"
                disabled={isSubmitting}
                data-cy="api-key-input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                data-cy="validate-key-button"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 align-[-2px]"></span>
                    Validating...
                  </>
                ) : (
                  'Validate Key'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboards')}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Use one of my existing keys
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 