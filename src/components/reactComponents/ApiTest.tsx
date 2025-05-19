import React, { useState, useEffect } from 'react';
import { makeRequest } from '@/api/apiBuilder';
import type { ApiResponse, Link, Collection, UserList, LinkFormData, CollectionFormData, CreateListData } from '@/types/newRestType';

type QueryType = 'sites' | 'collections' | 'lists';
const endpoint = 'api/v1/main/doQueries'

type ApiExample = {
  name: string;
  type: QueryType;
  action: string;
  body?: string;
};

interface ApiMethods {
  getAll: () => Promise<ApiResponse<any>>;
  getOne: (id: string | number) => Promise<ApiResponse<any>>;
  create: (data: any) => Promise<ApiResponse<any>>;
}

const api: Record<QueryType, ApiMethods> = {
  sites: {
    getAll: () => makeRequest<Link[]>(endpoint, { type: 'getSites' }),
    getOne: (id: string | number) => makeRequest<Link>(endpoint, { type: 'getLink', id }),
    create: (data: LinkFormData) => makeRequest<Link>(endpoint, { type: 'createLink', ...data }, 'POST'),
  },
  collections: {
    getAll: () => makeRequest<Collection[]>(endpoint, { type: 'getCollections' }),
    getOne: (id: string | number) => makeRequest<Collection>(endpoint, { type: 'getCollection', id }),
    create: (data: CollectionFormData) => makeRequest<Collection>(endpoint, { type: 'createCollection', ...data }, 'POST'),
  },
  lists: {
    getAll: () => makeRequest<UserList[]>(endpoint, { type: 'getLists' }),
    getOne: (id: string | number) => makeRequest<UserList>(endpoint, { type: 'getList', id }),
    create: (data: CreateListData) => makeRequest<UserList>(endpoint, { type: 'createList', ...data }, 'POST'),
  }
};

const apiExamples: ApiExample[] = [
  // Sites Operations
  {
    name: 'Get All Sites',
    type: 'sites',
    action: 'getAll'
  },
  {
    name: 'Get Site by ID',
    type: 'sites',
    action: 'getOne',
    body: '1'
  },
  {
    name: 'Create New Site',
    type: 'sites',
    action: 'create',
    body: JSON.stringify({
      title: 'Test Site',
      url: 'https://example.com',
      description: 'Test site created via API'
    }, null, 2)
  },

  // Collections Operations
  {
    name: 'Get All Collections',
    type: 'collections',
    action: 'getAll'
  },
  {
    name: 'Get Collection by ID',
    type: 'collections',
    action: 'getOne',
    body: '1'
  },
  {
    name: 'Create New Collection',
    type: 'collections',
    action: 'create',
    body: JSON.stringify({
      title: 'Test Collection',
      description: 'Test collection created via API'
    }, null, 2)
  },

  // Lists Operations
  {
    name: 'Get All Lists',
    type: 'lists',
    action: 'getAll'
  },
  {
    name: 'Get List by ID',
    type: 'lists',
    action: 'getOne',
    body: '1'
  },
  {
    name: 'Create New List',
    type: 'lists',
    action: 'create',
    body: JSON.stringify({
      title: 'Test List',
      description: 'Test list created via API'
    }, null, 2)
  }
];

interface RequestHistoryItem {
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime: string;
  request: string;
  response: ApiResponse<any>;
}

const ApiTest: React.FC = () => {
  const [type, setType] = useState<QueryType>('sites');
  const [action, setAction] = useState<string>('getAll');
  const [body, setBody] = useState<string>('');
  const [responseData, setResponseData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('examples');
  const [consoleOutput, setConsoleOutput] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResponseData('');

    try {
      const startTime = performance.now();
      let response: ApiResponse<any> | undefined = undefined;

      switch (type) {
        case 'sites':
          if (action === 'getAll') {
            response = await api.sites.getAll();
          } else if (action === 'getOne') {
            response = await api.sites.getOne(body);
          } else if (action === 'create') {
            response = await api.sites.create(JSON.parse(body) as LinkFormData);
          }
          break;

        case 'collections':
          if (action === 'getAll') {
            response = await api.collections.getAll();
          } else if (action === 'getOne') {
            response = await api.collections.getOne(body);
          } else if (action === 'create') {
            response = await api.collections.create(JSON.parse(body) as CollectionFormData);
          }
          break;

        case 'lists':
          if (action === 'getAll') {
            response = await api.lists.getAll();
          } else if (action === 'getOne') {
            response = await api.lists.getOne(parseInt(body));
          } else if (action === 'create') {
            response = await api.lists.create(JSON.parse(body) as CreateListData);
          }
          break;
      }

      if (!response) {
        throw new Error('No response received from API');
      }

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      setResponseData(JSON.stringify(response, null, 2));

      setRequestHistory([
        {
          timestamp: new Date().toLocaleTimeString(),
          method: action === 'getAll' ? 'GET' : action === 'getOne' ? 'GET' : 'POST',
          endpoint: `main/doQueries`,
          status: response.status || 0,
          responseTime: `${responseTime}ms`,
          request: body,
          response: response
        },
        ...requestHistory.slice(0, 9)
      ]);

      setConsoleOutput(prev => 
        `${prev}\n[${new Date().toLocaleTimeString()}] ${JSON.stringify(response, null, 2)}
      `);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API Error:', err);
      setConsoleOutput(prev => 
        `${prev}\n[${new Date().toLocaleTimeString()}] Error: ${err instanceof Error ? err.message : 'An error occurred'}
      `);
    } finally {
      setLoading(false);
    }
  };

  const runExample = (example: ApiExample) => {
    setType(example.type)
    setAction(example.action)
    setBody(example.body || '')
    handleSubmit(new Event('submit') as any)
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container">
      <h1>API Test Page</h1>

      <div className="card">
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'examples' ? 'active' : ''}`} 
            onClick={() => handleTabChange('examples')}
            data-tab="examples"
          >
            API Examples
          </div>
          <div 
            className={`tab ${activeTab === 'custom' ? 'active' : ''}`} 
            onClick={() => handleTabChange('custom')}
            data-tab="custom"
          >
            Custom Request
          </div>
          <div 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => handleTabChange('history')}
            data-tab="history"
          >
            Request History
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'examples' ? 'active' : ''}`} id="examples">
          <div className="example-buttons">
            {apiExamples.map((example) => (
              <button
                key={example.name}
                className="example-btn"
                onClick={() => runExample(example)}
              >
                {example.action.toUpperCase()} {example.name}
              </button>
            ))}
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'custom' ? 'active' : ''}`} id="custom">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="type">Resource Type:</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as QueryType)}
              >
                <option value="sites">Sites</option>
                <option value="links">Links</option>
                <option value="collections">Collections</option>
                <option value="lists">Lists</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="action">Action:</label>
              <select
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="getAll">Get All</option>
                <option value="getOne">Get One</option>
                <option value="create">Create</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="body">Body:</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Send Request'}
            </button>
          </form>
        </div>

        <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`} id="history">
          <div id="request-history">
            {requestHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-header" onClick={() => {
                  const details = document.getElementById(`history-details-${index}`);
                  if (details) {
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                  }
                }}>
                  <span className={`method ${item.method.toLowerCase()}`}>{item.method}</span>
                  <span className="endpoint">{item.endpoint}</span>
                  <span className="status">{item.status}</span>
                  <span className="time">{item.responseTime}</span>
                  <span className="timestamp">{item.timestamp}</span>
                </div>
                <div className="history-details" id={`history-details-${index}`} style={{ display: 'none' }}>
                  <div className="request-details">
                    <h4>Request:</h4>
                    <pre>{item.request}</pre>
                  </div>
                  <div className="response-details">
                    <h4>Response:</h4>
                    <pre>{JSON.stringify(item.response, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="status-bar">
          {loading ? (
            <div className="status-item">
              <div className="loader"></div>
              <span className="value">Loading...</span>
            </div>
          ) : (
            <>
              <div className="status-item">
                <span className="label">Last Request:</span>
                <span className="value">{requestHistory[0]?.timestamp || 'N/A'}</span>
              </div>
              <div className="status-item">
                <span className="label">Status:</span>
                <span className={`value status-${requestHistory[0]?.status >= 200 && requestHistory[0]?.status < 300 ? 'success' : 'error'}`}>
                  {requestHistory[0]?.status || 'N/A'}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Response Time:</span>
                <span className="value">{requestHistory[0]?.responseTime || 'N/A'}</span>
              </div>
            </>
          )}
        </div>

        {error && <div className="error">{error}</div>}
        {responseData && (
          <div className="form-group">
            <label>Response</label>
            <pre>{responseData}</pre>
          </div>
        )}
      </div>

      <div className="card mt-4">
        <h2>Console Output</h2>
        <pre className="console">{consoleOutput}</pre>
      </div>

      <div className="card mt-4">
        <h2>API Response</h2>
        <pre className="response">{responseData}</pre>
      </div>
    </div>
  );
};

export default ApiTest;
