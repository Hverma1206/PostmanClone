import React from 'react';

const Headers = ({ headers, onAdd, onRemove, onChange }) => (
  <div className="mb-4">
    <div className="mb-2 flex justify-between items-center">
      <h3 className="text-lg font-semibold">Headers</h3>
      <button
        type="button"
        onClick={onAdd}
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
          onChange={e => onChange(index, 'key', e.target.value)}
          placeholder="Key"
          className="flex-1 p-2 border rounded-md mr-2"
        />
        <input
          type="text"
          value={header.value}
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

export default Headers;
