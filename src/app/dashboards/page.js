'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey, generateApiKey } from '../../lib/api-keys';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [formData, setFormData] = useState({ name: '', key: '', usageLimit: false, limitValue: 1000 });
  const [visibleKeys, setVisibleKeys] = useState({});
  const keyNameInputRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch API keys on component mount
  useEffect(() => {
    async function fetchApiKeys() {
      try {
        setIsLoading(true);
        const keys = await getApiKeys();
        setApiKeys(keys);
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
        setError('Failed to load API keys. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApiKeys();
  }, []);

  useEffect(() => {
    if (showModal && keyNameInputRef.current) {
      keyNameInputRef.current.focus();
    }
  }, [showModal]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCreateKey = () => {
    setCurrentKey(null);
    setFormData({ 
      name: '', 
      key: generateApiKey(),
      usageLimit: false,
      limitValue: 1000
    });
    setShowModal(true);
  };

  const handleEditKey = (key) => {
    setCurrentKey(key);
    setFormData({ 
      name: key.name, 
      key: key.key,
      usageLimit: key.usage_limit || false,
      limitValue: key.limit_value || 1000
    });
    setShowModal(true);
  };

  const handleDeleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      // Also remove from visible keys if it exists
      if (visibleKeys[id]) {
        const newVisibleKeys = { ...visibleKeys };
        delete newVisibleKeys[id];
        setVisibleKeys(newVisibleKeys);
      }
      
      // Show success toast with delete type
      setToast({
        show: true,
        message: 'API key deleted successfully',
        type: 'delete'
      });
    } catch (err) {
      console.error('Failed to delete API key:', err);
      setToast({
        show: true,
        message: 'Failed to delete API key. Please try again later.',
        type: 'error'
      });
    }
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setToast({ 
          show: true, 
          message: 'Copied API Key to clipboard',
          type: 'success'
        });
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  const handleSaveKey = async () => {
    try {
      if (currentKey) {
        // Update existing key
        const updatedKey = await updateApiKey(currentKey.id, {
          name: formData.name,
          usageLimit: formData.usageLimit,
          limitValue: formData.limitValue
        });
        
        setApiKeys(apiKeys.map(key => 
          key.id === currentKey.id ? { ...updatedKey } : key
        ));
        
        // Show success toast for update
        setToast({
          show: true,
          message: 'API key updated successfully',
          type: 'success'
        });
      } else {
        // Create new key
        const newKey = await createApiKey({
          name: formData.name,
          key: formData.key,
          usageLimit: formData.usageLimit,
          limitValue: formData.limitValue
        });
        
        setApiKeys([newKey, ...apiKeys]);
        
        // Show success toast for creation
        setToast({
          show: true,
          message: 'New API key created successfully',
          type: 'success'
        });
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save API key:', err);
      setToast({
        show: true,
        message: 'Failed to save API key. Please try again later.',
        type: 'error'
      });
    }
  };

  // Get toast background color based on type
  const getToastBgColor = () => {
    switch (toast.type) {
      case 'delete':
        return 'bg-red-600';
      case 'error':
        return 'bg-red-600';
      case 'success':
      default:
        return 'bg-green-600';
    }
  };

  // Total usage and limit
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const usageLimit = 1000;

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Overview</h1>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Toast notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 flex items-center ${getToastBgColor()} text-white px-4 py-3 rounded-md shadow-md z-50`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>{toast.message}</p>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="ml-4 text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Current Plan Card with Gradient */}
        <div className="rounded-lg overflow-hidden mb-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-4">
                CURRENT PLAN
              </div>
              <h2 className="text-4xl font-bold mb-6">Researcher</h2>
            </div>
            <button className="bg-white/20 text-white text-sm px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
              Manage Plan
            </button>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span>API Limit</span>
                <span className="rounded-full bg-white/20 w-5 h-5 flex items-center justify-center text-xs">?</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full mb-2">
              <div 
                className="h-full bg-white rounded-full" 
                style={{ width: `${(totalUsage / usageLimit) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm">{totalUsage}/{usageLimit} Requests</div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">API Keys</h2>
            <button
              onClick={handleCreateKey}
              className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-500">Loading API keys...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            {apiKeys.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No API keys found. Create your first one by clicking the "+" button above.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{key.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{key.usage || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-mono">
                          {visibleKeys[key.id] 
                            ? key.key 
                            : `${key.key.substring(0, 5)}••••••••`
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className={`${visibleKeys[key.id] ? 'text-blue-500' : 'text-gray-400'} hover:text-gray-600 dark:hover:text-gray-300`}
                            title={visibleKeys[key.id] ? "Hide key" : "View key"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditKey(key)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">
              {currentKey ? 'Edit API Key' : 'Create a new API key'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Enter a name and limit for the new API key.
            </p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  placeholder="Key Name"
                  ref={keyNameInputRef}
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    id="limitUsage"
                    type="checkbox"
                    checked={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="limitUsage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Limit monthly usage*
                  </label>
                </div>
                
                <input
                  type="number"
                  value={formData.limitValue}
                  onChange={(e) => setFormData({ ...formData, limitValue: parseInt(e.target.value) })}
                  disabled={!formData.usageLimit}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md ${formData.usageLimit ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                />
                
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleSaveKey}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {currentKey ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 