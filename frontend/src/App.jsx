import React, { useState, useEffect } from 'react';
import PromoList from './components/PromoList';
import PromoForm from './components/PromoForm';
import DiscountCalculator from './components/DiscountCalculator';
import { api } from './services/api';
import { Layers } from 'lucide-react';

export default function App() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [selectedPromoId, setSelectedPromoId] = useState(null);

  const fetchPromos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPromos();
      setPromos(response.data || []);
      if (response.data && response.data.length > 0 && !selectedPromoId) {
        setSelectedPromoId(response.data[0].id);
      }
    } catch (err) {
      setError(err.messages ? err.messages.join(', ') : err.message || 'Gagal memuat data promo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3500);
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    if (editingPromo) {
      const response = await api.updatePromo(editingPromo.id, payload);
      setPromos((prev) =>
        prev.map((item) => (item.id === editingPromo.id ? response.data : item))
      );
      showNotification(`Promo "${payload.productName}" berhasil diperbarui.`);
    } else {
      const response = await api.createPromo(payload);
      setPromos((prev) => [...prev, response.data]);
      setSelectedPromoId(response.data.id);
      showNotification(`Promo "${payload.productName}" berhasil dibuat.`);
    }
  };

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus promo untuk "${productName}"?`)) {
      return;
    }

    try {
      await api.deletePromo(id);
      setPromos((prev) => prev.filter((p) => p.id !== id));
      if (selectedPromoId === id) {
        const remaining = promos.filter((p) => p.id !== id);
        setSelectedPromoId(remaining.length > 0 ? remaining[0].id : null);
      }
      showNotification(`Promo "${productName}" berhasil dihapus.`);
    } catch (err) {
      setError(err.messages ? err.messages.join(', ') : err.message || 'Gagal menghapus promo');
    }
  };

  const handleSelectForCalculate = (promo) => {
    setSelectedPromoId(promo.id);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <Layers size={22} />
            </div>
            <div>
              <h1>Diskon Bertingkat Berdasarkan Kuantitas</h1>
              <p>Modul Pengelolaan Aturan Promo dan Kalkulasi Diskon Otomatis</p>
            </div>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <main className="layout-grid">
        <PromoList
          promos={promos}
          loading={loading}
          onRefresh={fetchPromos}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onDelete={handleDelete}
          onSelectForCalculate={handleSelectForCalculate}
          selectedPromoId={selectedPromoId}
        />

        <DiscountCalculator
          promos={promos}
          selectedPromoId={selectedPromoId}
          onSelectPromo={setSelectedPromoId}
        />
      </main>

      <PromoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPromo}
      />
    </div>
  );
}
