const express = require('express');
const { RequestEntity } = require('../models/Request');

const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchTerm = req.query.search || '';
  const method = req.query.method || '';
  
  const skip = (page - 1) * limit;
  
  try {
    const qb = req.em.createQueryBuilder(RequestEntity);
    
    if (searchTerm) {
      qb.where({ url: { $like: `%${searchTerm}%` } });
    }
    
    if (method) {
      qb.andWhere({ method });
    }
    
    const total = await qb.clone().count();
    
    const requests = await qb
      .orderBy({ createdAt: 'DESC' })
      .limit(limit)
      .offset(skip)
      .getResult();
    
    return res.status(200).json({
      requests,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to fetch request history' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await req.em.findOne(RequestEntity, { id: req.params.id });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    return res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    return res.status(500).json({ error: 'Failed to fetch request details' });
  }
});

module.exports = router;
