const express = require('express');
const {
  validatePromoPayload,
  validateCalculatePayload
} = require('../middlewares/validateRequest');

function createPromoRouter(promoController) {
  const router = express.Router();

  router.post('/', validatePromoPayload, promoController.create);
  router.get('/', promoController.getAll);
  router.get('/:id', promoController.getById);
  router.put('/:id', validatePromoPayload, promoController.update);
  router.delete('/:id', promoController.delete);
  router.post('/:id/calculate', validateCalculatePayload, promoController.calculate);

  return router;
}

module.exports = createPromoRouter;
