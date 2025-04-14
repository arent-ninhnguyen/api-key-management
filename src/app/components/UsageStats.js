'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UsageStats({ totalUsage, usageLimit, isLimitExceeded }) {
  const [showLimitTooltip, setShowLimitTooltip] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden mb-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-8 text-white">
      {isLimitExceeded && (
        <div className="bg-red-600/80 rounded-lg p-4 mb-6 flex items-start">
          <svg className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-white font-medium">API Usage Limit Exceeded</h3>
            <p className="mt-1 text-white/90 text-sm">
              You have reached your monthly API request limit. The API Playground feature has been disabled. 
              Please wait until your limit resets or consider upgrading your plan.
            </p>
            <p className="mt-2 text-white/90 text-sm">
              Need help? Contact admin at <a href="mailto:ninh.nguye@arentvn.com" className="underline hover:text-white">ninh.nguye@arentvn.com</a> to renew your API limit.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6 px-4">
        <div>
          <div className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
            CURRENT PLAN
          </div>
          <h2 className="text-4xl font-bold mb-4">Researcher</h2>
        </div>
      </div>
      
      <div className="text-sm mb-8 leading-relaxed px-4" style={{ maxWidth: "80%" }}>
        <p className="mb-2">Your plan&apos;s API request limit resets monthly.</p>
        <p>This tracks how many API calls have been made with your keys. Exceeding your limit may result in rate limiting or additional charges.</p>
      </div>
      
      <div className="mt-8 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span>API Limit</span>
            <div className="relative">
              <span 
                className="rounded-full bg-white/20 w-5 h-5 flex items-center justify-center text-xs cursor-help"
                onMouseEnter={() => setShowLimitTooltip(true)}
                onMouseLeave={() => setShowLimitTooltip(false)}
              >
                ?
              </span>
              {showLimitTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  <div className="relative">
                    <p>Your plan&apos;s API request limit resets monthly. This tracks how many API calls have been made with your keys. Exceeding your limit may result in rate limiting or additional charges.</p>
                    <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full mb-2">
          <div 
            className={`h-full rounded-full ${isLimitExceeded ? 'bg-red-400' : 'bg-white'}`}
            style={{ width: `${Math.min((totalUsage / usageLimit) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-sm">{totalUsage}/{usageLimit} Requests</div>
      </div>
      
      <div className="mt-6 px-4 flex items-center">
        <Link 
          href={isLimitExceeded ? '#' : '/playground'}
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
            ${isLimitExceeded 
              ? 'bg-gray-500/50 cursor-not-allowed' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
          onClick={e => isLimitExceeded && e.preventDefault()}
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          API Playground
          {isLimitExceeded && <span className="ml-2 text-xs bg-red-600/80 px-2 py-0.5 rounded-full">Disabled</span>}
        </Link>
      </div>
    </div>
  );
} 