/**
 * Check if the API usage limit is exceeded
 * @returns {boolean} True if the API limit is exceeded
 */
export function isApiLimitExceeded() {
  // Retrieve total usage and limit from localStorage
  try {
    const totalUsage = localStorage.getItem('totalApiUsage') 
      ? parseInt(localStorage.getItem('totalApiUsage')) 
      : 0;
    
    // Using default limit of 10000 if not set
    const usageLimit = localStorage.getItem('apiUsageLimit') 
      ? parseInt(localStorage.getItem('apiUsageLimit')) 
      : 10000;
    
    return totalUsage >= usageLimit;
  } catch (error) {
    console.error('Error checking API limit', error);
    return false; // Default to not exceeded in case of error
  }
}

/**
 * Store the total API usage and limit in localStorage
 * @param {number} totalUsage - Total API usage
 * @param {number} usageLimit - API usage limit
 */
export function storeApiUsage(totalUsage, usageLimit) {
  try {
    localStorage.setItem('totalApiUsage', totalUsage.toString());
    localStorage.setItem('apiUsageLimit', usageLimit.toString());
  } catch (error) {
    console.error('Error storing API usage data', error);
  }
} 