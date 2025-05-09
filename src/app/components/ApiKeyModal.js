'use client';

import { useEffect, useRef, useState } from 'react';

export default function ApiKeyModal({ 
  show, 
  onClose, 
  onSave, 
  isEditing,
  formData,
  setFormData,
  newApiKey
}) {
  const keyNameInputRef = useRef(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (show && keyNameInputRef.current) {
      keyNameInputRef.current.focus();
    }
    
    // Reset validation errors when modal opens
    setValidationErrors({});
  }, [show]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Key name is required';
    }
    
    if (formData.usageLimit && (formData.limitValue <= 0 || isNaN(formData.limitValue))) {
      errors.limitValue = 'Usage limit must be a positive number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  const handleLimitValueChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData({ ...formData, limitValue: value });
    
    // Clear error when user fixes the value
    if (value > 0) {
      setValidationErrors({ ...validationErrors, limitValue: undefined });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">
          {isEditing ? 'Edit API Key' : 'Create a new API key'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Enter a name and limit for the new API key.
        </p>
        
        {!newApiKey ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Key Name — A unique name to identify this key
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md`}
                placeholder="Key Name"
                ref={keyNameInputRef}
                data-cy="api-key-name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <input
                  id="limitUsage"
                  type="checkbox"
                  checked={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  data-cy="usage-limit-checkbox"
                />
                <label htmlFor="limitUsage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Limit monthly usage*
                </label>
              </div>
              
              <input
                type="number"
                value={formData.limitValue}
                onChange={handleLimitValueChange}
                disabled={!formData.usageLimit}
                className={`w-full px-3 py-2 border ${
                  validationErrors.limitValue 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                } rounded-md ${
                  formData.usageLimit 
                    ? 'bg-white dark:bg-gray-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
                data-cy="usage-limit-value"
              />
              
              {validationErrors.limitValue && formData.usageLimit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.limitValue}</p>
              )}
              
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                * If the combined usage of all your keys exceeds your plan{'\''}s limit, all requests will be rejected.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your New API Key (copy it now)
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={newApiKey}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md font-mono text-sm"
                  data-cy="new-api-key"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(newApiKey);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  data-cy="copy-key-button"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Important: This key will only be shown once. Please copy it now!
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center gap-4">
          {!newApiKey ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                data-cy="save-key-button"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                data-cy="cancel-button"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              data-cy="close-button"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 