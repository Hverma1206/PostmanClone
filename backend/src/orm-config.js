const { TsMorphMetadataProvider } = require('@mikro-orm/core');
const { requestEntitySchema } = require('./entities/Request');

const config = {
  type: 'sqlite',
  dbName: 'rest_client.db',
  entities: [requestEntitySchema],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    glob: '!(*.d).{js,ts}',
  },
};

module.exports = config;
