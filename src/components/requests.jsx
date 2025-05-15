import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ResponseDisplay from './response';
import UrlBar from './urlBar';
import Tabs from './tabs';
import QueryParams from './queryParams';
import Headers from './headers';
import Json from './jsonBody';

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
  const [activeTab, setActiveTab] = useState('params'); 
  const [urlError, setUrlError] = useState('');
  const [methodError, setMethodError] = useState('');
  
  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.request) {
      const { method, url, headers, body } = location.state.request;
      setMethod(method);
      setUrl(url);
      
      if (headers) {
        const headerPairs = Object.entries(headers).map(([key, value]) => ({ key, value }));
        setHeaders(headerPairs.length ? headerPairs : [{ key: '', value: '' }]);
      }
      
      if (body) {
        setBody(JSON.stringify(body, null, 2));
      }
      
      if (url && url.includes('?')) {
        const queryString = url.split('?')[1];
        const params = new URLSearchParams(queryString);
        const paramPairs = Array.from(params.entries()).map(([key, value]) => ({ key, value }));
        setQueryParams(paramPairs.length ? paramPairs : [{ key: '', value: '' }]);
      }
    }
  }, [location.state]);
  
  const validateUrl = (url) => {
    if (!url.trim()) {
      setUrlError('URL is required');
      return false;
    }
    
    try {
      // Check if it's a valid URL structure
      new URL(url);
      setUrlError('');
      return true;
    } catch (err) {
      // Try to see if it would be valid with http:// prefix
      try {
        new URL(`http://${url}`);
        setUrl(`http://${url}`);
        setUrlError('');
        return true;
      } catch (err) {
        setUrlError('Invalid URL format');
        return false;
      }
    }
  };
  
  const validateMethod = (method) => {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(method)) {
      setMethodError('Invalid HTTP method');
      return false;
    }
    setMethodError('');
    return true;
  };
  
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
    let fullUrl = url;
    const validParams = queryParams.filter(param => param.key.trim() !== '');
    if (validParams.length > 0) {
      const hasQueryString = url.includes('?');
      fullUrl += hasQueryString ? '&' : '?';
      fullUrl += validParams
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&');
    }
    return fullUrl;
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (newUrl.trim()) {
      // Clear error if user is typing
      setUrlError('');
    }
  };
  
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    validateMethod(newMethod);
  };
  
  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    // Validate before sending
    const isUrlValid = validateUrl(url);
    const isMethodValid = validateMethod(method);
    
    if (!isUrlValid || !isMethodValid) {
      return;
    }
    
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
      
      const response = await api.post('/api/requests/send', {
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
  
  const renderTableView = (data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data) && data.length === 0) {
      return <div className="text-gray-500 italic">No structured data available for table view</div>;
    }
    
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
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
        <UrlBar
          method={method}
          setMethod={handleMethodChange}
          url={url}
          setUrl={handleUrlChange}
          loading={loading}
          urlError={urlError}
          methodError={methodError}
        />
        <Tabs
          method={method}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'params' && (
          <QueryParams
            queryParams={queryParams}
            onAdd={handleAddQueryParam}
            onRemove={handleRemoveQueryParam}
            onChange={handleQueryParamChange}
          />
        )}
        {activeTab === 'headers' && (
          <Headers
            headers={headers}
            onAdd={handleAddHeader}
            onRemove={handleRemoveHeader}
            onChange={handleHeaderChange}
          />
        )}
        {(method === 'POST' || method === 'PUT' || method === 'DELETE') && activeTab === 'json' && (
          <Json body={body} setBody={setBody} />
        )}
      </form>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      {response && (
        <ResponseDisplay
          response={response}
          viewFormat={viewFormat}
          setViewFormat={setViewFormat}
          renderTableView={renderTableView}
        />
      )}
    </div>
  );
};

export default RequestForm;
