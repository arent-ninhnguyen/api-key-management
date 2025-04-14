'use client';

import { useState, useEffect } from 'react';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey, generateApiKey } from '../../lib/api-keys';

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API keys on hook initialization
  useEffect(() => {
    loadApiKeys();
  }, []);

  // Load API keys
  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      const keys = await getApiKeys();
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      setError('Failed to load API keys. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new API key
  const addApiKey = async (keyData) => {
    try {
      const newKey = await createApiKey({
        name: keyData.name,
        key: keyData.key,
        usageLimit: keyData.usageLimit,
        limitValue: keyData.limitValue
      });
      
      setApiKeys([newKey, ...apiKeys]);
      return { success: true, data: newKey };
    } catch (err) {
      console.error('Failed to create API key:', err);
      return { success: false, error: 'Failed to create API key. Please try again later.' };
    }
  };

  // Update an existing API key
  const editApiKey = async (id, keyData) => {
    try {
      const updatedKey = await updateApiKey(id, {
        name: keyData.name,
        usageLimit: keyData.usageLimit,
        limitValue: keyData.limitValue
      });
      
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...updatedKey } : key
      ));
      
      return { success: true, data: updatedKey };
    } catch (err) {
      console.error('Failed to update API key:', err);
      return { success: false, error: 'Failed to update API key. Please try again later.' };
    }
  };

  // Delete an API key
  const removeApiKey = async (id) => {
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete API key:', err);
      return { success: false, error: 'Failed to delete API key. Please try again later.' };
    }
  };

  // Generate a new API key string
  const generateNewKey = () => {
    return generateApiKey();
  };

  // Calculate total usage
  const getTotalUsage = () => {
    return apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  };

  return {
    apiKeys,
    isLoading,
    error,
    loadApiKeys,
    addApiKey,
    editApiKey,
    removeApiKey,
    generateNewKey,
    getTotalUsage
  };
} 