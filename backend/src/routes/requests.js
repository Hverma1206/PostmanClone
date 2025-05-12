const express = require('express');
const axios = require('axios');
const { RequestEntity } = require('../models/Request');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { method, url, headers, body } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: 'Invalid HTTP method' });
  }
  
  const startTime = Date.now();
  
  try {
    const response = await axios({
      method: method || 'GET',
      url,
      headers: headers || {},
      data: method !== 'GET' ? body : undefined,
      timeout: 10000,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const responseBodyString = JSON.stringify(response.data);
    const responseSize = new TextEncoder().encode(responseBodyString).length;
    
    const requestEntity = new RequestEntity();
    requestEntity.method = method || 'GET';
    requestEntity.url = url;
    requestEntity.headers = headers || {};
    requestEntity.body = body || {};
    requestEntity.responseStatus = response.status;
    requestEntity.responseTime = responseTime;
    requestEntity.responseSize = responseSize;
    requestEntity.responseBody = response.data;
    
    await req.em.persistAndFlush(requestEntity);
    
    return res.status(200).json({
      data: response.data,
      status: response.status,
      headers: response.headers,
      responseTime,
      responseSize,
      id: requestEntity.id,
    });
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const requestEntity = new RequestEntity();
    requestEntity.method = method || 'GET';
    requestEntity.url = url;
    requestEntity.headers = headers || {};
    requestEntity.body = body || {};
    requestEntity.responseStatus = error.response?.status || 500;
    requestEntity.responseTime = responseTime;
    requestEntity.responseBody = error.response?.data || { error: error.message };
    
    await req.em.persistAndFlush(requestEntity);
    
    return res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data,
      status: error.response?.status,
      responseTime,
    });
  }
});

module.exports = router;
