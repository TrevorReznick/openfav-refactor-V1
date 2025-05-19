import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ApiConsoleProps {
  logs: string[];
  errors: string[];
}

const ApiConsole: React.FC<ApiConsoleProps> = ({ logs, errors }) => {
  const [showConsole, setShowConsole] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <button
        onClick={() => setShowConsole(!showConsole)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {showConsole ? 'Hide Console' : 'Show Console'}
      </button>

      {showConsole && (
        <div className="bg-gray-800 text-white p-4 rounded-t-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">API Console</h3>
          <div className="max-h-[400px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="mb-2 p-2 rounded bg-gray-700"
              >
                {log}
              </div>
            ))}
            {errors.map((error, index) => (
              <div
                key={`error-${index}`}
                className="mb-2 p-2 rounded bg-red-700"
              >
                <span className="font-bold">Error:</span> {error}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConsole;
