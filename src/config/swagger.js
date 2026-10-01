import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import openapi from './openapi.js';

const options = {
  definition: openapi,
  // The OpenAPI document is maintained in config/openapi.js. Keeping this empty
  // prevents legacy controller comments from creating duplicate or invalid paths.
  apis: [],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
