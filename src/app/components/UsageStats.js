'use client';

import { useState } from 'react';

export default function UsageStats({ totalUsage, usageLimit }) {
  const [showLimitTooltip, setShowLimitTooltip] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden mb-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-8 text-white">
      <div className="flex justify-between items-start mb-6 pl-4">
        <div>
          <div className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-3">
            CURRENT PLAN
          </div>
          <h2 className="text-4xl font-bold mb-4">Researcher</h2>
        </div>
      </div>
      
      <div className="text-sm mb-8 leading-relaxed pl-4" style={{ maxWidth: "80%" }}>
        <p className="mb-2">Your plan&apos;s API request limit resets monthly.</p>
        <p>This tracks how many API calls have been made with your keys. Exceeding your limit may result in rate limiting or additional charges.</p>
      </div>
      
      <div className="mt-8 pl-4">
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
            className="h-full bg-white rounded-full" 
            style={{ width: `${(totalUsage / usageLimit) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm">{totalUsage}/{usageLimit} Requests</div>
      </div>
    </div>
  );
} 