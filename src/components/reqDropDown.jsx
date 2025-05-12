import React from 'react';
import UrlBar from './urlBar';

const ReqDropDown = ({ method, setMethod, url, setUrl, loading }) => {
  return (
    <div>
      <UrlBar
        method={method}
        setMethod={setMethod}
        url={url}
        setUrl={setUrl}
        loading={loading}
      />
    </div>
  );
};

export default ReqDropDown;