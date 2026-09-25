function validatePromoPayload(req, res, next) {
  const { productName, tiers } = req.body;
  const errors = [];

  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    errors.push('productName is required and must be a non-empty string.');
  }

  if (!Array.isArray(tiers) || tiers.length === 0) {
    errors.push('tiers is required and must be a non-empty array of tier rules.');
  } else {
    let prevMinQty = -1;

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];

      if (typeof tier !== 'object' || tier === null) {
        errors.push(`tiers[${i}] must be an object containing minQty and discountPercent.`);
        continue;
      }

      const { minQty, discountPercent } = tier;

      if (typeof minQty !== 'number' || isNaN(minQty) || minQty < 0 || !Number.isInteger(minQty)) {
        errors.push(`tiers[${i}].minQty must be a non-negative integer.`);
      }

      if (typeof discountPercent !== 'number' || isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        errors.push(`tiers[${i}].discountPercent must be a number between 0 and 100.`);
      }

      if (typeof minQty === 'number' && !isNaN(minQty)) {
        if (i === 0 && minQty < 0) {
          errors.push(`tiers[${i}].minQty cannot be negative.`);
        } else if (i > 0 && minQty <= prevMinQty) {
          errors.push(
            `Tier rules must be strictly ascending by minQty without duplicates. Tier at index ${i} (minQty: ${minQty}) must be strictly greater than preceding minQty (${prevMinQty}).`
          );
        }
        prevMinQty = minQty;
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
}

function validateCalculatePayload(req, res, next) {
  const { quantity, unitPrice } = req.body;
  const errors = [];

  if (quantity === undefined || typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
    errors.push('quantity is required and must be a positive number greater than 0.');
  }

  if (unitPrice === undefined || typeof unitPrice !== 'number' || isNaN(unitPrice) || unitPrice <= 0) {
    errors.push('unitPrice is required and must be a positive number greater than 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
}

module.exports = {
  validatePromoPayload,
  validateCalculatePayload
};
