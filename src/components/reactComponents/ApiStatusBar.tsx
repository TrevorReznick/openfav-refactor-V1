import React, { useState, useEffect } from 'react';

interface ApiStatusBarProps {
  apiResults?: {
    sites?: any[];
    lists?: any[];
    collections?: any[];
    errors?: string[];
  };
}

const ApiStatusBar: React.FC<ApiStatusBarProps> = ({ apiResults = { sites: [], lists: [], collections: [], errors: [] } }) => {
  const [status, setStatus] = useState({
    sites: (apiResults.sites || []).length,
    lists: (apiResults.lists || []).length,
    collections: (apiResults.collections || []).length,
    errors: (apiResults.errors || []).length,
  });

  useEffect(() => {
    setStatus({
      sites: apiResults.sites.length,
      lists: apiResults.lists.length,
      collections: apiResults.collections.length,
      errors: apiResults.errors.length,
    });
  }, [apiResults]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="bg-blue-500 px-3 py-1 rounded text-sm">Sites: {status.sites}</span>
          <span className="bg-green-500 px-3 py-1 rounded text-sm">Lists: {status.lists}</span>
          <span className="bg-purple-500 px-3 py-1 rounded text-sm">Collections: {status.collections}</span>
          {status.errors > 0 && (
            <span className="bg-red-500 px-3 py-1 rounded text-sm">
              Errors: {status.errors}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiStatusBar;
