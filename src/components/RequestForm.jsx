import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const RequestForm = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewFormat, setViewFormat] = useState('json');
  const [activeTab, setActiveTab] = useState('params'); // 'params', 'headers', or 'json'
  
  const location = useLocation();
  
  // Check for request data in location state (when coming from history)
  useEffect(() => {
    if (location.state?.request) {
      const { method, url, headers, body } = location.state.request;
      setMethod(method);
      setUrl(url);
      
      // Convert headers object to array of key-value pairs
      if (headers) {
        const headerPairs = Object.entries(headers).map(([key, value]) => ({ key, value }));
        setHeaders(headerPairs.length ? headerPairs : [{ key: '', value: '' }]);
      }
      
      // Set body if it exists
      if (body) {
        setBody(JSON.stringify(body, null, 2));
      }
      
      // Extract query parameters from URL
      if (url && url.includes('?')) {
        const queryString = url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const paramPairs = Array.from(params.entries()).map(([key, value]) => ({ key, value }));
        setQueryParams(paramPairs.length ? paramPairs : [{ key: '', value: '' }]);
      }
    }
  }, [location.state]);
  
  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };
  
  const handleRemoveHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders.length ? newHeaders : [{ key: '', value: '' }]);
  };
  
  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };
  
  const handleAddQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };
  
  const handleRemoveQueryParam = (index) => {
    const newParams = [...queryParams];
    newParams.splice(index, 1);
    setQueryParams(newParams.length ? newParams : [{ key: '', value: '' }]);
  };
  
  const handleQueryParamChange = (index, field, value) => {
    const newParams = [...queryParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setQueryParams(newParams);
  };

  const getFullUrl = () => {
    // Start with the base URL
    let fullUrl = url;
    
    // If there are query parameters and the URL doesn't already have a query string
    const validParams = queryParams.filter(param => param.key.trim() !== '');
    if (validParams.length > 0) {
      // Check if the URL already contains a query string
      const hasQueryString = url.includes('?');
      
      // Start or append to the query string
      fullUrl += hasQueryString ? '&' : '?';
      
      // Add each valid query parameter
      fullUrl += validParams
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&');
    }
    
    return fullUrl;
  };

  const handleUrlChange = (e) => {
    const input = e.target.value;
    setUrl(input);
  };
  
  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    
    const fullUrl = getFullUrl();
    
    try {
      const headersObj = headers.reduce((acc, { key, value }) => {
        if (key.trim() && value.trim()) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {});
      
      let bodyData = null;
      if (body && method !== 'GET') {
        try {
          bodyData = JSON.parse(body);
        } catch (err) {
          setError('Invalid JSON in request body');
          setLoading(false);
          return;
        }
      }
      
      const response = await axios.post('/api/requests/send', {
        method,
        url: fullUrl,
        headers: headersObj,
        body: bodyData,
      });
      
      setResponse({
        data: response.data.data,
        status: response.data.status,
        headers: response.data.headers,
        responseTime: response.data.responseTime,
        responseSize: response.data.responseSize,
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      if (err.response?.data?.data) {
        setResponse({
          data: err.response.data.data,
          status: err.response.data.status,
          responseTime: err.response.data.responseTime,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Function to render data as a table
  const renderTableView = (data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data) && data.length === 0) {
      return <div className="text-gray-500 italic">No structured data available for table view</div>;
    }
    
    // Handle array of objects - show as a table with columns
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      // Get all unique keys from all objects in the array
      const allKeys = new Set();
      data.forEach(item => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });
      const keys = Array.from(allKeys);
      
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {keys.map(key => (
                  <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, idx) => (
                <tr key={idx}>
                  {keys.map(key => (
                    <td key={`${idx}-${key}`} className="px-3 py-2 text-sm">
                      {renderCellValue(item[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    // Handle simple object or array of primitives - show as key-value table
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(data) ? (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 text-sm font-medium">[{idx}]</td>
                  <td className="px-3 py-2 text-sm">{renderCellValue(item)}</td>
                </tr>
              ))
            ) : (
              Object.entries(data).map(([key, value], idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 text-sm font-medium">{key}</td>
                  <td className="px-3 py-2 text-sm">{renderCellValue(value)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Helper function to render appropriate cell value
  const renderCellValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'object') {
      return <span className="text-blue-600 hover:underline cursor-pointer" title={JSON.stringify(value)}>{Array.isArray(value) ? '[Array]' : '{Object}'}</span>;
    }
    return String(value);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">HTTP Request</h2>
      
      <form onSubmit={handleSendRequest} className="mb-8">
        <div className="flex mb-4">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mr-2 p-2 border rounded-md w-28"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL"
            required
            className="flex-1 p-2 border rounded-md"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('params')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'params' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Query Params
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'headers' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Headers
            </button>
            {method !== 'GET' && (
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'json' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                JSON
              </button>
            )}
          </div>
        </div>
        
        {/* Query Parameters Section */}
        {activeTab === 'params' && (
          <div className="mb-4">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Query Parameters</h3>
              <button
                type="button"
                onClick={handleAddQueryParam}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
              >
                Add Parameter
              </button>
            </div>
            {queryParams.map((param, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => handleQueryParamChange(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 p-2 border rounded-md mr-2"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => handleQueryParamChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-2 border rounded-md mr-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQueryParam(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Headers Section */}
        {activeTab === 'headers' && (
          <div className="mb-4">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Headers</h3>
              <button
                type="button"
                onClick={handleAddHeader}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300 text-sm"
              >
                Add Header
              </button>
            </div>
            {headers.map((header, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 p-2 border rounded-md mr-2"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-2 border rounded-md mr-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHeader(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* JSON Request Body (not for GET) */}
        {method !== 'GET' && activeTab === 'json' && (
          <div className="mb-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold">Request Body (JSON)</h3>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full p-2 border rounded-md font-mono text-sm"
              placeholder='{\n  "key": "value"\n}'
            />
          </div>
        )}
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Response Section */}
      {response && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-gray-200 p-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Response</h3>
            <div className="flex items-center">
              <div className="flex space-x-4 text-sm mr-4">
                <div>Status: <span className={`font-bold ${response.status < 400 ? 'text-green-600' : 'text-red-600'}`}>{response.status}</span></div>
                <div>Time: <span className="font-bold">{response.responseTime}ms</span></div>
                {response.responseSize && (
                  <div>Size: <span className="font-bold">{(response.responseSize / 1024).toFixed(2)} KB</span></div>
                )}
              </div>
              
              {/* Toggle between JSON and Table view */}
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setViewFormat('json')}
                  className={`px-4 py-1 text-sm font-medium border ${viewFormat === 'json' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-l-md`}
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('table')}
                  className={`px-4 py-1 text-sm font-medium border ${viewFormat === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-r-md`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 overflow-auto max-h-96">
            {viewFormat === 'json' ? (
              <pre className="text-sm font-mono">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            ) : (
              renderTableView(response.data)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
