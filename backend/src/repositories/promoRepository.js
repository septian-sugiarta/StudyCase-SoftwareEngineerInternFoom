const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PromoRepository {
  constructor(filePath = null) {
    this.filePath = filePath || path.join(__dirname, '../../data/promos.json');
    this.memoryStore = null;
    this.ensureStorage();
  }

  ensureStorage() {
    if (this.filePath === ':memory:') {
      this.memoryStore = [];
      return;
    }

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      const initialData = [
        {
          id: 'promo-sample-1',
          productName: 'Sample Product - Study Case',
          tiers: [
            { minQty: 0, discountPercent: 0 },
            { minQty: 50, discountPercent: 5 },
            { minQty: 200, discountPercent: 10 },
            { minQty: 500, discountPercent: 15 }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  async readAll() {
    if (this.filePath === ':memory:') {
      return [...this.memoryStore];
    }

    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  async writeAll(items) {
    if (this.filePath === ':memory:') {
      this.memoryStore = [...items];
      return;
    }

    await fs.promises.writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
  }

  async findAll() {
    return await this.readAll();
  }

  async findById(id) {
    const items = await this.readAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(data) {
    const items = await this.readAll();
    const newItem = {
      id: crypto.randomUUID(),
      productName: data.productName.trim(),
      tiers: data.tiers.map((t) => ({
        minQty: Number(t.minQty),
        discountPercent: Number(t.discountPercent)
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    await this.writeAll(items);
    return newItem;
  }

  async update(id, data) {
    const items = await this.readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const updated = {
      ...items[index],
      productName: data.productName !== undefined ? data.productName.trim() : items[index].productName,
      tiers: data.tiers !== undefined
        ? data.tiers.map((t) => ({
            minQty: Number(t.minQty),
            discountPercent: Number(t.discountPercent)
          }))
        : items[index].tiers,
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    await this.writeAll(items);
    return updated;
  }

  async delete(id) {
    const items = await this.readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    await this.writeAll(items);
    return true;
  }
}

module.exports = PromoRepository;
