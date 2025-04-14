'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateApiKey } from '../../lib/api-keys';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState({ text: '', type: '' });
  const router = useRouter();

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
        // Show success message
        setValidationMessage({
          text: 'Valid api key, /protected can be accessed',
          type: 'success'
        });
        // Reset form after successful validation
        setApiKey('');
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
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
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