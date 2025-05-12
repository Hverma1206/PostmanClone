const { EntitySchema } = require('@mikro-orm/core');

class RequestEntity {
  constructor() {
    this.id = undefined;
    this.method = 'GET';
    this.url = '';
    this.headers = {};
    this.body = {};
    this.responseStatus = null;
    this.responseTime = null;
    this.responseSize = null;
    this.responseBody = null;
    this.createdAt = new Date();
  }
}

const requestEntitySchema = new EntitySchema({
  class: RequestEntity,
  tableName: 'requests',
  properties: {
    id: { primary: true, type: 'number', autoincrement: true },
    method: { type: 'string', default: 'GET' },
    url: { type: 'string' },
    headers: { type: 'json', nullable: true },
    body: { type: 'json', nullable: true },
    responseStatus: { type: 'number', nullable: true },
    responseTime: { type: 'number', nullable: true },
    responseSize: { type: 'number', nullable: true },
    responseBody: { type: 'json', nullable: true },
    createdAt: { type: 'Date', defaultRaw: 'CURRENT_TIMESTAMP' }
  }
});

module.exports = { RequestEntity, requestEntitySchema };
