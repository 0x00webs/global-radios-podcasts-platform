import React from 'react';

/**
 * Library Page - TODO Phase 2
 * Will display user's favorite stations
 * Requires authentication implementation
 */
export const LibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Library</h1>
        
        <div className="card p-8 text-center">
          <span className="text-6xl mb-4 block">📚</span>
          <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Save your favorite stations and access them here.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            This feature will be available in Phase 2 with user authentication.
          </p>
        </div>
      </div>
    </div>
  );
};
