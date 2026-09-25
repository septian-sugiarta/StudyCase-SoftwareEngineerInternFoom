class PromoController {
  constructor(promoService) {
    this.promoService = promoService;
  }

  getAll = async (req, res, next) => {
    try {
      const promos = await this.promoService.getAllPromos();
      res.status(200).json({ data: promos });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const promo = await this.promoService.getPromoById(id);
      if (!promo) {
        return res.status(404).json({ error: 'Promo not found' });
      }
      res.status(200).json({ data: promo });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { productName, tiers } = req.body;
      const newPromo = await this.promoService.createPromo({ productName, tiers });
      res.status(201).json({ data: newPromo });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { productName, tiers } = req.body;
      const updatedPromo = await this.promoService.updatePromo(id, { productName, tiers });
      if (!updatedPromo) {
        return res.status(404).json({ error: 'Promo not found' });
      }
      res.status(200).json({ data: updatedPromo });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await this.promoService.deletePromo(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Promo not found' });
      }
      res.status(200).json({ message: 'Promo deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  calculate = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { quantity, unitPrice } = req.body;
      const result = await this.promoService.calculatePromoDiscount(id, quantity, unitPrice);
      if (!result) {
        return res.status(404).json({ error: 'Promo not found' });
      }
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PromoController;
