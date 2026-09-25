function findApplicableTier(quantity, tiers) {
  if (!Array.isArray(tiers) || tiers.length === 0 || typeof quantity !== 'number' || quantity < 0) {
    return null;
  }

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (quantity >= tiers[i].minQty) {
      return tiers[i];
    }
  }

  return null;
}

function getDiscountTier(quantity, tiers) {
  const tier = findApplicableTier(quantity, tiers);
  return tier ? tier.discountPercent : 0;
}

function calculateDiscount(quantity, unitPrice, tiers) {
  const tier = findApplicableTier(quantity, tiers);
  const discountPercent = tier ? tier.discountPercent : 0;
  const subtotal = quantity * unitPrice;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalPrice = subtotal - discountAmount;

  return {
    quantity,
    unitPrice,
    appliedTier: tier || { minQty: 0, discountPercent: 0 },
    discountPercent,
    subtotal,
    discountAmount,
    finalPrice
  };
}

module.exports = {
  findApplicableTier,
  getDiscountTier,
  calculateDiscount
};
