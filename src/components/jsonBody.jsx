import React from 'react';

const Json = ({ body, setBody }) => (
  <div className="mb-4">
    <div className="mb-2">
      <h3 className="text-lg font-semibold">Request Body (JSON)</h3>
    </div>
    <textarea
      value={body}
      onChange={e => setBody(e.target.value)}
      rows={5}
      className="w-full p-2 border rounded-md font-mono text-sm"
      placeholder='{\n  "key": "value"\n}'
    />
  </div>
);

export default Json;
