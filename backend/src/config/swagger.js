const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tuition Institute Management System API',
            version: '1.0.0',
            description: 'API documentation for the Tuition Institute Management System',
            contact: {
                name: 'API Support',
                email: 'support@tuitionapp.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
