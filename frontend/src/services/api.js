const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.messages = data.messages || [data.error || 'Unknown error'];
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
