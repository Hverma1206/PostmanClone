import React from 'react';

const UrlBar = ({ method, setMethod, url, setUrl, loading, urlError, methodError }) => (
  <div className="mb-4">
    <div className="flex">
      <div className={`mr-2 ${methodError ? 'relative' : ''}`}>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className={`p-2 border rounded-md w-28 ${methodError ? 'border-red-500' : ''}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        {methodError && (
          <div className="absolute text-red-500 text-xs mt-1">{methodError}</div>
        )}
      </div>
      <div className={`flex-1 ${urlError ? 'relative' : ''}`}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter URL (e.g. https://api.example.com/data)"
          required
          className={`w-full p-2 border rounded-md ${urlError ? 'border-red-500' : ''}`}
        />
        {urlError && (
          <div className="absolute text-red-500 text-xs mt-1">{urlError}</div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || urlError || methodError}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  </div>
);

export default UrlBar;
