import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { sites, collections, lists } from '@/api/apiClient';
import type { Link, Collection, UserList } from '@/types';

interface ApiComponentProps {
  type: 'sites' | 'collections' | 'lists';
  action: 'getAll' | 'getOne' | 'create' | 'update' | 'delete';
  id?: string | number;
  data?: any;
}

const ApiComponent: React.FC<ApiComponentProps> = ({ type = 'sites', action = 'getAll', id, data }) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: any;

      switch (action) {
        case 'getAll':
          response = await (type === 'sites' 
            ? sites.getAll() 
            : type === 'collections' 
              ? collections.getAll() 
              : lists.getAll());
          break;

        case 'getOne':
          if (!id) throw new Error('ID is required for getOne');
          response = await (type === 'sites' 
            ? sites.getOne(id as string) 
            : type === 'collections' 
              ? collections.getOne(id as string) 
              : lists.getOne(id as number));
          break;

        case 'create':
          if (!data) throw new Error('Data is required for create');
          response = await (type === 'sites' 
            ? sites.create(data as any) 
            : type === 'collections' 
              ? collections.create(data as any) 
              : lists.create(data as any));
          break;

        case 'update':
          if (!id || !data) throw new Error('ID and data are required for update');
          response = await (type === 'sites' 
            ? sites.update(id as string, data as any) 
            : type === 'collections' 
              ? collections.update(id as string, data as any) 
              : lists.update(id as number, data as any));
          break;

        case 'delete':
          if (!id) throw new Error('ID is required for delete');
          response = await (type === 'sites' 
            ? sites.delete(id as string) 
            : type === 'collections' 
              ? collections.delete(id as string) 
              : lists.delete(id as number));
          break;
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.data);
      toast.success(`Operation successful!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data when the component mounts if it's a getOne operation
    if (action === 'getOne') {
      handleApiCall();
    }
  }, [action, id]);

  // Ensure type and action are defined
  const displayType = type || 'sites';
  const displayAction = action || 'get';

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{displayType.charAt(0).toUpperCase() + displayType.slice(1)} {displayAction}</h2>
      
      {loading && (
        <div className="p-4 bg-gray-700 rounded mb-4">Loading...</div>
      )}

      {error && (
        <div className="p-4 bg-red-600 rounded mb-4 text-white">{error}</div>
      )}

      {result && (
        <div className="p-4 bg-gray-700 rounded mb-4">
          <pre className="text-sm text-gray-300">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <button 
        onClick={handleApiCall}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Fetch Data
      </button>
    </div>
  );
};

export default ApiComponent;
