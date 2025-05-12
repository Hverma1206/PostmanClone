import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  
  const navigate = useNavigate();
  
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/history', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          method: methodFilter,
        },
      });
      setRequests(response.data.requests);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (err) {
      setError('Failed to load request history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, methodFilter]);
  
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchHistory();
  };
  
  const handleRequestClick = (request) => {
    navigate('/', { state: { request } });
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Request History</h2>
      
      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by URL"
          className="flex-1 p-2 border rounded-md"
        />
        
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="p-2 border rounded-md w-28"
        >
          <option value="">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Request List */}
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No requests found</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr 
                      key={request.id}
                      onClick={() => handleRequestClick(request)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium
                          ${request.method === 'GET' ? 'bg-blue-100 text-blue-800' : ''}
                          ${request.method === 'POST' ? 'bg-green-100 text-green-800' : ''}
                          ${request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${request.method === 'DELETE' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {request.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 overflow-hidden overflow-ellipsis max-w-xs">
                        {request.url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${request.responseStatus < 400 ? 'text-green-600' : 'text-red-600'}`}>
                          {request.responseStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.responseTime}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestHistory;
