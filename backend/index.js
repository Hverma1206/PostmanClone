const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MikroORM } = require('@mikro-orm/core');
const ormConfig = require('./src/mikro-orm.config');
const requestRoutes = require('./src/routes/requests');
const historyRoutes = require('./src/routes/history');

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize MikroORM
(async () => {
  try {
    const orm = await MikroORM.init(ormConfig);
    
    // Create database schema if it doesn't exist
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    
    console.log('Connected to the database');
    
    // Set MikroORM instance to be accessible in routes
    app.use((req, res, next) => {
      req.em = orm.em.fork();
      next();
    });
    
    // Routes
    app.use('/api/requests', requestRoutes);
    app.use('/api/history', historyRoutes);
    
    // Error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
})();
