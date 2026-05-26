const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FinWatch API',
            version: '1.0.0',
            description: 'Real-time financial portfolio tracker and alert engine',
            contact: { name: 'Gaurav Sinha', url: 'https://github.com/GAVTIN' },
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development' },
            // { url: 'https://your-app.railway.app', description: 'Production' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],  // reads JSDoc from route files
};

module.exports = swaggerJsdoc(options);
