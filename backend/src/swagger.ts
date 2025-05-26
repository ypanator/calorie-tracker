import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Calorie Tracker API',
    version: '1.0.0',
    description: 'API for calorie tracking application'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string' },
          weight: { type: 'number' },
          height: { type: 'number' },
          age: { type: 'integer' },
          sex: { type: 'string', enum: ['male', 'female'] }
        }
      },
      UserAttributes: {
        type: 'object',
        properties: {
          weight: { type: 'number' },
          height: { type: 'number' },
          age: { type: 'integer' },
          sex: { type: 'string', enum: ['male', 'female'] }
        }
      },
      Food: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          calories: { type: 'integer' },
          count: { type: 'integer' },
          unit: { type: 'string' }
        }
      },
      Exercise: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          calories: { type: 'integer' },
          duration: { type: 'integer' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          message: { type: 'string' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

export default swaggerJSDoc({ swaggerDefinition, apis: ['./src/**/*.ts'] });