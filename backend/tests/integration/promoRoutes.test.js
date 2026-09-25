const request = require('supertest');
const createApp = require('../../src/app');
const PromoRepository = require('../../src/repositories/promoRepository');

describe('Promo API Endpoints', () => {
  let app;
  let repository;

  beforeEach(() => {
    repository = new PromoRepository(':memory:');
    app = createApp({ repository });
  });

  describe('POST /promos', () => {
    test('should create a new promo when payload is valid', async () => {
      const payload = {
        productName: 'Gaming Mouse',
        tiers: [
          { minQty: 0, discountPercent: 0 },
          { minQty: 10, discountPercent: 5 },
          { minQty: 50, discountPercent: 15 }
        ]
      };

      const res = await request(app).post('/promos').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.productName).toBe('Gaming Mouse');
      expect(res.body.data.tiers).toHaveLength(3);
    });

    test('should reject creation when tiers are not strictly ascending or duplicated', async () => {
      const payload = {
        productName: 'Invalid Promo',
        tiers: [
          { minQty: 10, discountPercent: 5 },
          { minQty: 10, discountPercent: 10 }
        ]
      };

      const res = await request(app).post('/promos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.messages.some((msg) => msg.includes('strictly ascending'))).toBe(true);
    });

    test('should reject creation when discountPercent is outside 0-100', async () => {
      const payload = {
        productName: 'Invalid Discount',
        tiers: [{ minQty: 0, discountPercent: 150 }]
      };

      const res = await request(app).post('/promos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.messages.some((msg) => msg.includes('between 0 and 100'))).toBe(true);
    });

    test('should reject creation when productName is empty', async () => {
      const payload = {
        productName: '   ',
        tiers: [{ minQty: 0, discountPercent: 5 }]
      };

      const res = await request(app).post('/promos').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.messages.some((msg) => msg.includes('productName'))).toBe(true);
    });
  });

  describe('GET /promos and GET /promos/:id', () => {
    test('should return all promos and single promo by ID', async () => {
      const created = await repository.create({
        productName: 'Mechanical Keyboard',
        tiers: [
          { minQty: 0, discountPercent: 0 },
          { minQty: 5, discountPercent: 10 }
        ]
      });

      const listRes = await request(app).get('/promos');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data).toHaveLength(1);

      const singleRes = await request(app).get(`/promos/${created.id}`);
      expect(singleRes.status).toBe(200);
      expect(singleRes.body.data.productName).toBe('Mechanical Keyboard');
    });

    test('should return 404 if promo ID is not found', async () => {
      const res = await request(app).get('/promos/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Promo not found');
    });
  });

  describe('PUT /promos/:id', () => {
    test('should update an existing promo', async () => {
      const created = await repository.create({
        productName: 'Old Name',
        tiers: [{ minQty: 0, discountPercent: 0 }]
      });

      const res = await request(app)
        .put(`/promos/${created.id}`)
        .send({
          productName: 'Updated Name',
          tiers: [
            { minQty: 0, discountPercent: 0 },
            { minQty: 20, discountPercent: 10 }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.data.productName).toBe('Updated Name');
      expect(res.body.data.tiers).toHaveLength(2);
    });

    test('should return 404 when updating non-existent promo', async () => {
      const res = await request(app)
        .put('/promos/unknown-id')
        .send({
          productName: 'Unknown',
          tiers: [{ minQty: 0, discountPercent: 0 }]
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /promos/:id', () => {
    test('should delete an existing promo', async () => {
      const created = await repository.create({
        productName: 'Item To Delete',
        tiers: [{ minQty: 0, discountPercent: 0 }]
      });

      const deleteRes = await request(app).delete(`/promos/${created.id}`);
      expect(deleteRes.status).toBe(200);

      const getRes = await request(app).get(`/promos/${created.id}`);
      expect(getRes.status).toBe(404);
    });

    test('should return 404 when deleting non-existent promo', async () => {
      const res = await request(app).delete('/promos/non-existent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /promos/:id/calculate', () => {
    test('should calculate discount accurately based on study case tier scenario', async () => {
      const created = await repository.create({
        productName: 'Coffee Beans',
        tiers: [
          { minQty: 0, discountPercent: 0 },
          { minQty: 50, discountPercent: 5 },
          { minQty: 200, discountPercent: 10 },
          { minQty: 500, discountPercent: 15 }
        ]
      });

      const res = await request(app)
        .post(`/promos/${created.id}/calculate`)
        .send({
          quantity: 250,
          unitPrice: 10000
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        promoId: created.id,
        productName: 'Coffee Beans',
        quantity: 250,
        unitPrice: 10000,
        appliedTier: { minQty: 200, discountPercent: 10 },
        discountPercent: 10,
        subtotal: 2500000,
        discountAmount: 250000,
        finalPrice: 2250000
      });
    });

    test('should return 400 if quantity or unitPrice is non-positive or invalid', async () => {
      const created = await repository.create({
        productName: 'Sample Product',
        tiers: [{ minQty: 0, discountPercent: 0 }]
      });

      const res = await request(app)
        .post(`/promos/${created.id}/calculate`)
        .send({
          quantity: -5,
          unitPrice: 0
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      expect(res.body.messages).toHaveLength(2);
    });

    test('should return 404 if calculating for non-existent promo', async () => {
      const res = await request(app)
        .post('/promos/missing-id/calculate')
        .send({
          quantity: 10,
          unitPrice: 5000
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Promo not found');
    });
  });
});
