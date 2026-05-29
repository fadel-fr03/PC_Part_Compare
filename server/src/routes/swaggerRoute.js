const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const router = express.Router();

const specPath = path.join(__dirname, '../../docs/openapi.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(specPath, 'utf8'));

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'PC Part Compare API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
}));

module.exports = router;
