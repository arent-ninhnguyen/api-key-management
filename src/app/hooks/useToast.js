'use client';

import { useState, useEffect } from 'react';

export default function useToast() {
  const [toast, setToast] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ 
      show: true, 
      message, 
      type 
    });
  };

  const hideToast = () => {
    setToast({ 
      show: false, 
      message: '', 
      type: 'success' 
    });
  };

  return {
    toast,
    showToast,
    hideToast
  };
} 