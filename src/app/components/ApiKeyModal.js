'use client';

import { useEffect, useRef } from 'react';

export default function ApiKeyModal({ 
  show, 
  onClose, 
  onSave, 
  isEditing,
  formData,
  setFormData
}) {
  const keyNameInputRef = useRef(null);

  useEffect(() => {
    if (show && keyNameInputRef.current) {
      keyNameInputRef.current.focus();
    }
  }, [show]);

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
            onClick={onSave}
            className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 