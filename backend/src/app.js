const express = require('express');
const cors = require('cors');
const PromoRepository = require('./repositories/promoRepository');
const PromoService = require('./services/promoService');
const PromoController = require('./controllers/promoController');
const createPromoRouter = require('./routes/promoRoutes');
const errorHandler = require('./middlewares/errorHandler');

function createApp(options = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const repository = options.repository || new PromoRepository(options.storagePath);
  const service = new PromoService(repository);
  const controller = new PromoController(service);

  app.use('/promos', createPromoRouter(controller));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
