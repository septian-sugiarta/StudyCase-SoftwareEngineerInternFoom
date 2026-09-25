const { calculateDiscount } = require('../utils/discountCalculator');

class PromoService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllPromos() {
    return await this.repository.findAll();
  }

  async getPromoById(id) {
    return await this.repository.findById(id);
  }

  async createPromo(payload) {
    return await this.repository.create(payload);
  }

  async updatePromo(id, payload) {
    return await this.repository.update(id, payload);
  }

  async deletePromo(id) {
    return await this.repository.delete(id);
  }

  async calculatePromoDiscount(id, quantity, unitPrice) {
    const promo = await this.repository.findById(id);
    if (!promo) {
      return null;
    }

    const calculation = calculateDiscount(quantity, unitPrice, promo.tiers);
    return {
      promoId: promo.id,
      productName: promo.productName,
      ...calculation
    };
  }
}

module.exports = PromoService;
