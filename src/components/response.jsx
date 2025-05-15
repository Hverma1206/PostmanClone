import React from 'react';
import ResponseFormatSwitcher from './json-table';

const ResponseDisplay = ({ response, viewFormat, setViewFormat, renderTableView }) => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-gray-200 p-3 flex justify-between items-center">
      <h3 className="text-lg font-semibold">Response</h3>
      <div className="flex items-center">
        <div className="flex space-x-4 text-sm mr-4">
          <div>
            Status:{' '}
            <span className={`font-bold ${response.status < 400 ? 'text-green-600' : 'text-red-600'}`}>
              {response.status}
            </span>
          </div>
          <div>
            Time: <span className="font-bold">{response.responseTime}ms</span>
          </div>
          {response.responseSize && (
            <div>
              Size: <span className="font-bold">{(response.responseSize / 1024).toFixed(2)} KB</span>
            </div>
          )}
        </div>
        <ResponseFormatSwitcher viewFormat={viewFormat} setViewFormat={setViewFormat} />
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
);

export default ResponseDisplay;
