'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MainLayoutClient({ children }) {
  const { status } = useSession(); // Get session status
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold">API Key Manager</h1>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              {/* Overview link - always enabled */}
              <Link 
                href="/" 
                className="flex items-center px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards" 
                className={`flex items-center px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  !isAuthenticated ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
                }`}
                aria-disabled={!isAuthenticated}
                tabIndex={!isAuthenticated ? -1 : undefined}
                onClick={(e) => !isAuthenticated && e.preventDefault()} // Prevent navigation if disabled
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                API Keys
              </Link>
            </li>
            <li>
              <Link 
                href="/playground" 
                className={`flex items-center px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  !isAuthenticated ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
                }`}
                aria-disabled={!isAuthenticated}
                tabIndex={!isAuthenticated ? -1 : undefined}
                onClick={(e) => !isAuthenticated && e.preventDefault()} // Prevent navigation if disabled
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API Playground
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 