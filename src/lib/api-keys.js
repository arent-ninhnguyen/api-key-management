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