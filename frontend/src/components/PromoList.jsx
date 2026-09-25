import React from 'react';
import { Edit2, Trash2, Calculator, Plus, RefreshCw } from 'lucide-react';

export default function PromoList({
  promos,
  loading,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
  onDelete,
  onSelectForCalculate,
  selectedPromoId
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Daftar Promo Diskon</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
            title="Muat ulang data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCreate}
          >
            <Plus size={14} />
            Tambah Promo
          </button>
        </div>
      </div>

      <div className="card-body" style={{ padding: 0 }}>
        {loading && promos.length === 0 ? (
          <div className="empty-state">
            <p>Memuat daftar promo...</p>
          </div>
        ) : promos.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada aturan promo.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: '12px' }}
              onClick={onOpenCreate}
            >
              Buat Promo Pertama
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Jumlah Tier</th>
                  <th>Aturan Tier</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((promo) => {
                  const isSelected = promo.id === selectedPromoId;
                  return (
                    <tr
                      key={promo.id}
                      style={{
                        backgroundColor: isSelected ? 'var(--primary-light)' : undefined
                      }}
                    >
                      <td>
                        <strong style={{ color: 'var(--gray-900)' }}>
                          {promo.productName}
                        </strong>
                        <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>
                          ID: {promo.id}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {promo.tiers?.length || 0} Tier
                        </span>
                      </td>
                      <td>
                        <div className="tiers-preview">
                          {promo.tiers?.map((tier, index) => (
                            <span key={index} className="tier-chip">
                              ≥{tier.minQty} unit: {tier.discountPercent}%
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onSelectForCalculate(promo)}
                            title="Pilih ke kalkulator"
                          >
                            <Calculator size={13} />
                            Hitung
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenEdit(promo)}
                            title="Ubah promo"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => onDelete(promo.id, promo.productName)}
                            title="Hapus promo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
