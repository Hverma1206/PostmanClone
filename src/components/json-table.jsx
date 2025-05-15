import React from 'react';

const ResponseFormat = ({ viewFormat, setViewFormat }) => (
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
);

export default ResponseFormat;
