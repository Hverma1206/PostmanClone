import React from 'react';

const QueryParams = ({ queryParams, onAdd, onRemove, onChange }) => (
  <div className="mb-4">
    <div className="mb-2 flex justify-between items-center">
      <h3 className="text-lg font-semibold">Query Parameters</h3>
      <button
        type="button"
        onClick={onAdd}
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
          onChange={e => onChange(index, 'key', e.target.value)}
          placeholder="Key"
          className="flex-1 p-2 border rounded-md mr-2"
        />
        <input
          type="text"
          value={param.value}
          onChange={e => onChange(index, 'value', e.target.value)}
          placeholder="Value"
          className="flex-1 p-2 border rounded-md mr-2"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
        >
          X
        </button>
      </div>
    ))}
  </div>
);

export default QueryParams;
