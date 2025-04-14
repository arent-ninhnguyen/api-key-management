import { supabase } from './supabase';

/**
 * Get all API keys for the current user
 */
export async function getApiKeys() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
  
  return data;
}

/**
 * Create a new API key
 */
export async function createApiKey({ name, key, usageLimit, limitValue }) {
  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      { 
        name, 
        key, 
        usage: 0,
        status: 'Active',
        usage_limit: usageLimit,
        limit_value: usageLimit ? limitValue : null
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing API key
 */
export async function updateApiKey(id, { name, usageLimit, limitValue }) {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ 
      name, 
      usage_limit: usageLimit,
      limit_value: usageLimit ? limitValue : null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating API key:', error);
    throw error;
  }
  
  return data;
}

/**
 * Delete an API key
 */
export async function deleteApiKey(id) {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
  
  return true;
}

/**
 * Validate an API key
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<boolean>} - Whether the key is valid
 */
export async function validateApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  // Query the database to find the key
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, status, usage, limit_value, usage_limit')
    .eq('key', apiKey)
    .eq('status', 'Active')  // Only find active keys
    .maybeSingle();  // Returns null if not found instead of empty array
  
  if (error) {
    console.error('Error validating API key:', error);
    throw error;
  }
  
  // If key doesn't exist or is not active
  if (!data) {
    return false;
  }
  
  // Check if the key has hit its usage limit
  if (data.usage_limit && data.usage >= data.limit_value) {
    return false;
  }
  
  return true;
}

/**
 * Generate a random API key
 */
export function generateApiKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ninh-';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 