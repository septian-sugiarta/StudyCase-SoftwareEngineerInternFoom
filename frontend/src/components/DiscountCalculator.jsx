import React, { useState, useEffect } from 'react';
import { Calculator, Tag, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export default function DiscountCalculator({ promos, selectedPromoId, onSelectPromo }) {
  const [promoId, setPromoId] = useState(selectedPromoId || '');
  const [quantity, setQuantity] = useState('250');
  const [unitPrice, setUnitPrice] = useState('10000');
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPromoId) {
      setPromoId(selectedPromoId);
    } else if (promos.length > 0 && !promoId) {
      setPromoId(promos[0].id);
    }
  }, [selectedPromoId, promos]);

  useEffect(() => {
    if (!promoId) {
      setCalculation(null);
      return;
    }

    const qtyNum = Number(quantity);
    const priceNum = Number(unitPrice);

    if (!quantity || !unitPrice || isNaN(qtyNum) || isNaN(priceNum) || qtyNum <= 0 || priceNum <= 0) {
      setCalculation(null);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.calculateDiscount(promoId, qtyNum, priceNum);
        setCalculation(response.data);
      } catch (err) {
        setError(err.messages ? err.messages.join(', ') : err.message || 'Kalkulasi gagal');
        setCalculation(null);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [promoId, quantity, unitPrice]);

  const selectedPromo = promos.find((p) => p.id === promoId);

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <Calculator size={18} color="var(--primary)" />
          Kalkulator Diskon Real-time
        </h2>
      </div>

      <div className="card-body">
        {promos.length === 0 ? (
          <div className="empty-state">
            <p>Silakan buat promo terlebih dahulu untuk mencoba kalkulator.</p>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="calcPromo">Pilih Produk Promo</label>
              <select
                id="calcPromo"
                className="form-control"
                value={promoId}
                onChange={(e) => {
                  setPromoId(e.target.value);
                  onSelectPromo(e.target.value);
                }}
              >
                {promos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} ({p.tiers.length} Tier)
                  </option>
                ))}
              </select>
            </div>

            {selectedPromo && (
              <div style={{ marginBottom: '16px', fontSize: '12px' }}>
                <span style={{ color: 'var(--gray-500)', display: 'block', marginBottom: '4px' }}>
                  Aturan Diskon:
                </span>
                <div className="tiers-preview">
                  {selectedPromo.tiers.map((t, idx) => (
                    <span key={idx} className="tier-chip">
                      ≥{t.minQty} unit: {t.discountPercent}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="calcQuantity">Jumlah Unit (Qty)</label>
                <input
                  id="calcQuantity"
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  placeholder="250"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="calcUnitPrice">Harga Satuan (Rp)</label>
                <input
                  id="calcUnitPrice"
                  type="number"
                  min="1"
                  step="any"
                  className="form-control"
                  placeholder="10000"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {calculation && (
              <div className="calculator-results">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--gray-700)' }}>
                    Hasil Kalkulasi Otomatis
                  </span>
                  <span className="badge badge-success">
                    <Tag size={12} style={{ marginRight: '4px' }} />
                    Tier {calculation.discountPercent}% (≥{calculation.appliedTier.minQty} unit)
                  </span>
                </div>

                <div className="calc-row">
                  <span>Subtotal ({calculation.quantity} unit @ {formatRupiah(calculation.unitPrice)})</span>
                  <strong>{formatRupiah(calculation.subtotal)}</strong>
                </div>

                <div className="calc-row" style={{ color: 'var(--success)' }}>
                  <span>Diskon Didapat ({calculation.discountPercent}%)</span>
                  <strong>- {formatRupiah(calculation.discountAmount)}</strong>
                </div>

                <div className="calc-row total">
                  <span>Harga Akhir:</span>
                  <span>{formatRupiah(calculation.finalPrice)}</span>
                </div>
              </div>
            )}

            {(!quantity || !unitPrice || Number(quantity) <= 0 || Number(unitPrice) <= 0) && (
              <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '8px' }}>
                * Masukkan jumlah unit dan harga satuan berupa angka positif untuk melihat hasil.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
