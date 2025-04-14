'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApiKeyTable from '../components/ApiKeyTable';
import ApiKeyModal from '../components/ApiKeyModal';
import Toast from '../components/Toast';
import UsageStats from '../components/UsageStats';
import useApiKeys from '../hooks/useApiKeys';
import useToast from '../hooks/useToast';
import { storeApiUsage } from '../../lib/utils';

export default function Dashboard() {
  // Use custom hooks
  const { 
    apiKeys, 
    isLoading, 
    error, 
    addApiKey, 
    editApiKey, 
    removeApiKey, 
    generateNewKey, 
    getTotalUsage 
  } = useApiKeys();
  
  const { toast, showToast, hideToast } = useToast();

  // Component state
  const [showModal, setShowModal] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    key: '', 
    usageLimit: false, 
    limitValue: 1000 
  });

  // Constants
  const usageLimit = 300;
  const totalUsage = getTotalUsage();
  const isLimitExceeded = totalUsage >= usageLimit;

  // Store usage data in localStorage for other components to use
  useEffect(() => {
    storeApiUsage(totalUsage, usageLimit);
  }, [totalUsage, usageLimit]);

  // Handlers
  const handleCreateKey = () => {
    setCurrentKey(null);
    setFormData({ 
      name: '', 
      key: generateNewKey(),
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
    const result = await removeApiKey(id);
    
    if (result.success) {
      showToast('API key deleted successfully', 'delete');
    } else {
      showToast(result.error, 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Copied API Key to clipboard', 'success');
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  const handleSaveKey = async () => {
    let result;

    if (currentKey) {
      // Update existing key
      result = await editApiKey(currentKey.id, formData);
      
      if (result.success) {
        showToast('API key updated successfully', 'success');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      // Create new key
      result = await addApiKey(formData);
      
      if (result.success) {
        showToast('New API key created successfully', 'success');
      } else {
        showToast(result.error, 'error');
      }
    }

    if (result.success) {
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Overview</h1>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Operational</span>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />

        {/* Usage Stats */}
        <UsageStats 
          totalUsage={totalUsage} 
          usageLimit={usageLimit} 
          isLimitExceeded={isLimitExceeded}
        />

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

        {/* API Keys Table */}
        <ApiKeyTable 
          apiKeys={apiKeys}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditKey}
          onDelete={handleDeleteKey}
          onCopy={copyToClipboard}
        />
      </div>

      {/* Modal for creating/editing API keys */}
      <ApiKeyModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveKey}
        isEditing={!!currentKey}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
} 