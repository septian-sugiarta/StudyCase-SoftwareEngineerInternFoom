const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch {
    const error = new Error('Tidak dapat terhubung ke server backend. Pastikan server backend berjalan di http://127.0.0.1:5000.');
    error.status = 0;
    error.messages = [error.message];
    throw error;
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const fallbackMessage = `Permintaan gagal (${response.status} ${response.statusText || 'Error'})`;
    const message = data.error || data.message || fallbackMessage;
    const error = new Error(message);
    error.status = response.status;
    error.messages = data.messages || [message];
    throw error;
  }

  return data;
}

export const api = {
  getPromos: () => request('/promos'),
  getPromoById: (id) => request(`/promos/${id}`),
  createPromo: (payload) =>
    request('/promos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updatePromo: (id, payload) =>
    request(`/promos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deletePromo: (id) =>
    request(`/promos/${id}`, {
      method: 'DELETE'
    }),
  calculateDiscount: (id, quantity, unitPrice) =>
    request(`/promos/${id}/calculate`, {
      method: 'POST',
      body: JSON.stringify({ quantity, unitPrice })
    })
};
