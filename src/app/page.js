'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApiKeys } from '../lib/api-keys';

export default function Home() {
  const [stats, setStats] = useState({
    totalKeys: 0,
    activeKeys: 0,
    totalUsage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const keys = await getApiKeys();
        
        const activeKeys = keys.filter(key => key.status === 'Active').length;
        const totalUsage = keys.reduce((sum, key) => sum + (key.usage || 0), 0);
        
        setStats({
          totalKeys: keys.length,
          activeKeys,
          totalUsage
        });
      } catch (error) {
        console.error('Failed to fetch API stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Management Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your API usage, manage keys, and access developer resources
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total API Keys</h3>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-semibold">{stats.totalKeys}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active API Keys</h3>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-semibold">{stats.activeKeys}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total API Requests</h3>
              {isLoading ? (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-semibold">{stats.totalUsage.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/dashboards" 
              className="flex flex-col items-center justify-center p-6 bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-sm"
            >
              <svg className="w-10 h-10 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="text-lg font-semibold text-white">Manage API Keys</span>
            </Link>
            
            <Link 
              href="/playground" 
              className="flex flex-col items-center justify-center p-6 bg-green-600 dark:bg-green-700 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-sm"
            >
              <svg className="w-10 h-10 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-lg font-semibold text-white">API Playground</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
