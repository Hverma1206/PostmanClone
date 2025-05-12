import React from 'react';

const Tabs = ({ method, activeTab, setActiveTab }) => (
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
      {(method === 'POST' || method === 'PUT' || method === 'DELETE') && (
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
);

export default Tabs;
