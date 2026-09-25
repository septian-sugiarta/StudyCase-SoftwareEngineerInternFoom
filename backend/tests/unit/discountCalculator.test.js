const {
  getDiscountTier,
  findApplicableTier,
  calculateDiscount
} = require('../../src/utils/discountCalculator');

describe('getDiscountTier', () => {
  const tiers = [
    { minQty: 0, discountPercent: 0 },
    { minQty: 50, discountPercent: 5 },
    { minQty: 200, discountPercent: 10 },
    { minQty: 500, discountPercent: 15 }
  ];

  test('should return 5% when quantity is exactly at the lower bound of tier (qty = 50)', () => {
    const result = getDiscountTier(50, tiers);
    expect(result).toBe(5);
  });

  test('should return 15% when quantity falls into the highest tier (qty = 1000)', () => {
    const result = getDiscountTier(1000, tiers);
    expect(result).toBe(15);
  });

  test('should return 0% when quantity does not meet any tier other than base tier (qty = 10)', () => {
    const result = getDiscountTier(10, tiers);
    expect(result).toBe(0);
  });

  test('should correctly handle lower and upper boundaries of all tiers', () => {
    expect(getDiscountTier(0, tiers)).toBe(0);
    expect(getDiscountTier(49, tiers)).toBe(0);
    expect(getDiscountTier(50, tiers)).toBe(5);
    expect(getDiscountTier(199, tiers)).toBe(5);
    expect(getDiscountTier(200, tiers)).toBe(10);
    expect(getDiscountTier(250, tiers)).toBe(10);
    expect(getDiscountTier(499, tiers)).toBe(10);
    expect(getDiscountTier(500, tiers)).toBe(15);
    expect(getDiscountTier(750, tiers)).toBe(15);
  });

  test('should return 0 for tiers without base tier when quantity is below first threshold', () => {
    const tiersWithoutBase = [
      { minQty: 50, discountPercent: 5 },
      { minQty: 200, discountPercent: 10 }
    ];
    expect(getDiscountTier(20, tiersWithoutBase)).toBe(0);
    expect(getDiscountTier(50, tiersWithoutBase)).toBe(5);
  });
});

describe('calculateDiscount', () => {
  const tiers = [
    { minQty: 0, discountPercent: 0 },
    { minQty: 50, discountPercent: 5 },
    { minQty: 200, discountPercent: 10 },
    { minQty: 500, discountPercent: 15 }
  ];

  test('should calculate correct final price for study case scenario (250 units @ Rp10.000)', () => {
    const result = calculateDiscount(250, 10000, tiers);

    expect(result).toEqual({
      quantity: 250,
      unitPrice: 10000,
      appliedTier: { minQty: 200, discountPercent: 10 },
      discountPercent: 10,
      subtotal: 2500000,
      discountAmount: 250000,
      finalPrice: 2250000
    });
  });
});
