import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function PromoForm({ isOpen, onClose, onSubmit, initialData }) {
  const [productName, setProductName] = useState('');
  const [tiers, setTiers] = useState([
    { minQty: '0', discountPercent: '0' },
    { minQty: '50', discountPercent: '5' }
  ]);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || '');
      setTiers(
        initialData.tiers && initialData.tiers.length > 0
          ? initialData.tiers.map((t) => ({
              minQty: String(t.minQty),
              discountPercent: String(t.discountPercent)
            }))
          : [{ minQty: '0', discountPercent: '0' }]
      );
    } else {
      setProductName('');
      setTiers([
        { minQty: '0', discountPercent: '0' },
        { minQty: '50', discountPercent: '5' },
        { minQty: '200', discountPercent: '10' },
        { minQty: '500', discountPercent: '15' }
      ]);
    }
    setErrors([]);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const nextMinQty = lastTier && !isNaN(Number(lastTier.minQty)) ? Number(lastTier.minQty) + 50 : 0;
    setTiers([...tiers, { minQty: String(nextMinQty), discountPercent: '' }]);
  };

  const handleRemoveTier = (index) => {
    if (tiers.length <= 1) {
      setErrors(['Promo harus memiliki minimal 1 aturan tier.']);
      return;
    }
    const updated = tiers.filter((_, i) => i !== index);
    setTiers(updated);
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  const validate = () => {
    const errs = [];

    if (!productName.trim()) {
      errs.push('Nama produk wajib diisi.');
    }

    if (tiers.length === 0) {
      errs.push('Minimal harus ada satu baris aturan tier.');
      return errs;
    }

    let prevMin = -1;
    for (let i = 0; i < tiers.length; i++) {
      const row = tiers[i];
      const minQtyNum = Number(row.minQty);
      const discountNum = Number(row.discountPercent);

      if (row.minQty === '' || isNaN(minQtyNum) || !Number.isInteger(minQtyNum) || minQtyNum < 0) {
        errs.push(`Baris ${i + 1}: Minimal Quantity harus berupa bilangan bulat positif atau 0.`);
      }

      if (row.discountPercent === '' || isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        errs.push(`Baris ${i + 1}: Persen Diskon harus berada di antara 0 sampai 100.`);
      }

      if (!isNaN(minQtyNum)) {
        if (i > 0 && minQtyNum <= prevMin) {
          errs.push(`Baris ${i + 1}: Nilai Minimal Quantity (${minQtyNum}) harus lebih besar dari baris sebelumnya (${prevMin}) tanpa duplikasi.`);
        }
        prevMin = minQtyNum;
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSubmitting(true);

    try {
      const payload = {
        productName: productName.trim(),
        tiers: tiers.map((t) => ({
          minQty: Number(t.minQty),
          discountPercent: Number(t.discountPercent)
        }))
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors(err.messages || [err.message || 'Gagal menyimpan promo']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{initialData ? 'Ubah Promo Diskon' : 'Tambah Promo Baru'}</h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ border: 'none', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.length > 0 && (
              <div className="alert alert-danger">
                <ul style={{ paddingLeft: '18px' }}>
                  {errors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="productName">Nama Produk</label>
              <input
                id="productName"
                type="text"
                className="form-control"
                placeholder="Contoh: Kopi Arabika 250gr"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Aturan Diskon Bertingkat (Tiers)</label>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddTier}
                >
                  <Plus size={13} />
                  Tambah Baris Tier
                </button>
              </div>

              <div className="tiers-builder">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '12px', marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--gray-600)' }}>
                  <div>Minimal Qty (unit)</div>
                  <div>Diskon (%)</div>
                  <div></div>
                </div>

                {tiers.map((tier, index) => (
                  <div key={index} className="tier-row">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="form-control"
                      placeholder="Contoh: 50"
                      value={tier.minQty}
                      onChange={(e) => handleTierChange(index, 'minQty', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      className="form-control"
                      placeholder="Contoh: 10"
                      value={tier.discountPercent}
                      onChange={(e) => handleTierChange(index, 'discountPercent', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => handleRemoveTier(index)}
                      disabled={tiers.length <= 1}
                      title="Hapus baris"
                      style={{ padding: '8px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <small style={{ color: 'var(--gray-500)', fontSize: '11px', display: 'block', marginTop: '6px' }}>
                * Aturan tier harus terurut naik berdasarkan Minimal Qty tanpa duplikasi.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Buat Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
