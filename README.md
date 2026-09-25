# Tiered Quantity Discount System

Sistem manajemen promo dan kalkulator diskon bertingkat (*tiered quantity discount*) berbasis kuantitas pembelian per produk. Proyek ini dibangun dengan arsitektur terpisah antara backend (Node.js & Express.js) dan frontend (React.js), dilengkapi validasi input komprehensif, unit testing, dan integration testing.

---

## 1. Cara Menjalankan Proyek

### Prasyarat
- **Node.js** (v18.0.0 atau lebih baru disarankan, teruji pada Node.js v21)
- **npm** (v9.0.0 atau lebih baru)
- **Git**

### Instalasi Dependensi
Jalankan perintah berikut di root folder proyek untuk menginstal seluruh dependensi backend dan frontend:

```bash
# Opsi 1: Menggunakan script root
npm run install:all

# Opsi 2: Instalasi manual per folder
cd backend && npm install
cd ../frontend && npm install
```

### Konfigurasi Environment Variable
Konfigurasi bersifat opsional karena sudah disiapkan nilai default yang siap pakai:
- **Backend**:
  - `PORT`: Port server backend (default: `5000`).
- **Frontend**:
  - `VITE_API_URL`: URL API backend jika tidak menggunakan reverse proxy bawaan Vite (default: reverse proxy mengarah ke `http://localhost:5000`).

### Menjalankan Aplikasi

#### 1. Menjalankan Backend
Buka terminal dan jalankan:
```bash
npm run start:backend
# atau: cd backend && npm run dev
```
Server backend berjalan di `http://localhost:5000`.

#### 2. Menjalankan Frontend
Buka terminal baru dan jalankan:
```bash
npm run start:frontend
# atau: cd frontend && npm run dev
```
Aplikasi frontend dapat diakses melalui browser di `http://localhost:3000`.

### Menjalankan Pengujian (Testing)
Untuk menjalankan seluruh unit test dan integration test pada backend:
```bash
npm run test:backend
# atau: cd backend && npm test
```

---

## 2. Dokumentasi API

Base URL: `http://localhost:5000`

### Ringkasan Endpoint

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/promos` | Menampilkan seluruh daftar promo |
| `GET` | `/promos/:id` | Mengambil detail satu promo berdasarkan ID |
| `POST` | `/promos` | Membuat aturan promo baru beserta daftar tier |
| `PUT` | `/promos/:id` | Mengubah data promo dan aturan tier yang sudah ada |
| `DELETE` | `/promos/:id` | Menghapus promo berdasarkan ID |
| `POST` | `/promos/:id/calculate` | Menghitung tier diskon, potongan, dan harga akhir |

---

### Detail Endpoint & Contoh Request/Response

#### 1. `GET /promos`
Mengambil semua daftar promo yang tersedia.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "promo-sample-1",
      "productName": "Sample Product - Study Case",
      "tiers": [
        { "minQty": 0, "discountPercent": 0 },
        { "minQty": 50, "discountPercent": 5 },
        { "minQty": 200, "discountPercent": 10 },
        { "minQty": 500, "discountPercent": 15 }
      ],
      "createdAt": "2026-09-25T05:00:00.000Z",
      "updatedAt": "2026-09-25T05:00:00.000Z"
    }
  ]
}
```

---

#### 2. `GET /promos/:id`
Mengambil detail satu promo berdasarkan ID.

**Response `200 OK`:**
```json
{
  "data": {
    "id": "promo-sample-1",
    "productName": "Sample Product - Study Case",
    "tiers": [
      { "minQty": 0, "discountPercent": 0 },
      { "minQty": 50, "discountPercent": 5 },
      { "minQty": 200, "discountPercent": 10 },
      { "minQty": 500, "discountPercent": 15 }
    ],
    "createdAt": "2026-09-25T05:00:00.000Z",
    "updatedAt": "2026-09-25T05:00:00.000Z"
  }
}
```

**Response `404 Not Found`:**
```json
{
  "error": "Promo not found"
}
```

---

#### 3. `POST /promos`
Membuat promo baru. Validasi: `productName` wajib diisi, `tiers` harus terurut naik berdasarkan `minQty` tanpa duplikasi, dan `discountPercent` di antara 0-100.

**Request Body:**
```json
{
  "productName": "Kopi Arabika Gayo 250g",
  "tiers": [
    { "minQty": 0, "discountPercent": 0 },
    { "minQty": 50, "discountPercent": 5 },
    { "minQty": 200, "discountPercent": 10 },
    { "minQty": 500, "discountPercent": 15 }
  ]
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "id": "f8a7e3d1-4e2b-47e1-8a9d-5f8e3b2c1d0a",
    "productName": "Kopi Arabika Gayo 250g",
    "tiers": [
      { "minQty": 0, "discountPercent": 0 },
      { "minQty": 50, "discountPercent": 5 },
      { "minQty": 200, "discountPercent": 10 },
      { "minQty": 500, "discountPercent": 15 }
    ],
    "createdAt": "2026-09-25T06:00:00.000Z",
    "updatedAt": "2026-09-25T06:00:00.000Z"
  }
}
```

**Response `400 Bad Request` (Jika data tidak valid):**
```json
{
  "error": "Validation Error",
  "messages": [
    "Tier rules must be strictly ascending by minQty without duplicates. Tier at index 1 (minQty: 10) must be strictly greater than preceding minQty (20)."
  ]
}
```

---

#### 4. `PUT /promos/:id`
Memperbarui data promo dan susunan tier yang ada.

**Request Body:**
```json
{
  "productName": "Kopi Arabika Gayo Premium 250g",
  "tiers": [
    { "minQty": 0, "discountPercent": 0 },
    { "minQty": 30, "discountPercent": 5 },
    { "minQty": 100, "discountPercent": 12 }
  ]
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "f8a7e3d1-4e2b-47e1-8a9d-5f8e3b2c1d0a",
    "productName": "Kopi Arabika Gayo Premium 250g",
    "tiers": [
      { "minQty": 0, "discountPercent": 0 },
      { "minQty": 30, "discountPercent": 5 },
      { "minQty": 100, "discountPercent": 12 }
    ],
    "createdAt": "2026-09-25T06:00:00.000Z",
    "updatedAt": "2026-09-25T06:15:00.000Z"
  }
}
```

---

#### 5. `DELETE /promos/:id`
Menghapus promo dari sistem.

**Response `200 OK`:**
```json
{
  "message": "Promo deleted successfully"
}
```

---

#### 6. `POST /promos/:id/calculate`
Melakukan kalkulasi diskon otomatis berdasarkan jumlah barang (`quantity`) dan harga satuan (`unitPrice`).

**Request Body:**
```json
{
  "quantity": 250,
  "unitPrice": 10000
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "promoId": "promo-sample-1",
    "productName": "Sample Product - Study Case",
    "quantity": 250,
    "unitPrice": 10000,
    "appliedTier": {
      "minQty": 200,
      "discountPercent": 10
    },
    "discountPercent": 10,
    "subtotal": 2500000,
    "discountAmount": 250000,
    "finalPrice": 2250000
  }
}
```

**Response `400 Bad Request`:**
```json
{
  "error": "Validation Error",
  "messages": [
    "quantity is required and must be a positive number greater than 0.",
    "unitPrice is required and must be a positive number greater than 0."
  ]
}
```

---

## 3. Keputusan Desain & Arsitektur

### Pemisahan Tanggung Jawab (Separation of Concerns)
Backend dibangun menggunakan pola arsitektur berlapis:
- **Routes Layer (`routes/`)**: Mendefinisikan jalur routing HTTP dan mengikat middleware validasi ke setiap handler.
- **Middleware Layer (`middlewares/`)**: Memvalidasi payload request sebelum masuk ke logic utama serta menangani *error handling* terpusat.
- **Controller Layer (`controllers/`)**: Mengelola protokol HTTP (status code, deserialisasi request, dan format response).
- **Service Layer (`services/`)**: Mengatur proses bisnis dan kalkulasi.
- **Domain Utility (`utils/discountCalculator.js`)**: Berisi pure function kalkulasi diskon yang independen dari framework HTTP, sehingga mudah diuji secara modular.
- **Repository Pattern (`repositories/promoRepository.js`)**: Memisahkan logika penyimpanan data dari logika bisnis, mendukung mode persistensi JSON file untuk runtime reguler dan in-memory untuk kecepatan unit & integration test.

### Struktur Data Tier
Aturan diskon disimpan dalam bentuk *array of objects* `[{ minQty: number, discountPercent: number }]` yang divalidasi terurut naik secara ketat (`strictly ascending`). Desain ini memastikan:
1. Validasi batas bawah bersifat terprediksi tanpa celah tumpang tindih (*overlapping* atau *gap* yang ambigu).
2. Algoritma evaluasi tier dapat dieksekusi dalam kompleksitas $O(N)$ secara efisien menggunakan pendekatan reverse sweep dari tier tertinggi ke terendah.

---

## 4. Batasan & Asumsi Sistem

1. **Autentikasi & Otorisasi**: Sistem belum mengimplementasikan autentikasi (JWT/Session) atau hak akses role (Admin/Kasir), sesuai dengan ketentuan batasan pada studi kasus.
2. **Kalkulasi Single-Product**: Endpoint kalkulasi dievaluasi untuk satu produk promo dalam satu transaksi. Sistem belum mencakup keranjang belanja multi-produk atau kombinasi kupon diskon global.
3. **Persistensi & Konkurensi**: Penyimpanan data menggunakan file JSON terstruktur dengan repository pattern. Sistem ini ditujukan untuk lingkungan lokal/studi kasus dan belum mengimplementasikan *row-level locking* database untuk menangani *high concurrent write*.

---

## 5. Penjelasan Bug pada Tugas C (Akar Masalah & Perbaikan)

### Kode Asli dengan Bug:
```javascript
function getDiscountTier(quantity, tiers) {
  let discount = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (quantity > tiers[i].minQty) {
      discount = tiers[i].discountPercent;
      break;
    }
  }
  return discount;
}
```

### Akar Masalah:
1. **Penghentian Dini pada Loop Naik (`break;`)**:
   Daftar `tiers` terurut naik berdasarkan `minQty` (misal: 0, 50, 200, 500). Ketika dipanggil `getDiscountTier(250, tiers)`, pada iterasi pertama `i = 0` (`minQty = 0`), kondisi `250 > 0` langsung bernilai `true`. Program langsung mengisi `discount = 0` dan mengeksekusi `break;`, sehingga perulangan langsung berhenti tanpa pernah memeriksa tier yang lebih tinggi (tier 50, 200, atau 500).
2. **Operator Perbandingan Strict (`>`)**:
   Kondisi menggunakan `quantity > tiers[i].minQty` alih-alih `>=`. Akibatnya, kuantitas yang berada tepat pada batas bawah tier (misal: `qty = 50` pada tier `50-199`) menghasilkan nilai `false` (`50 > 50`), sehingga gagal mendapatkan diskon pada tier yang seharusnya berhak ia peroleh.

### Solusi & Logika Perbaikan:
Fungsi diperbaiki dengan melakukan iterasi mundur (*reverse loop*) dari indeks tier tertinggi ke indeks terendah, serta menggunakan operator inklusif `>=`:
```javascript
function getDiscountTier(quantity, tiers) {
  if (!Array.isArray(tiers) || tiers.length === 0 || quantity < 0) {
    return 0;
  }

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (quantity >= tiers[i].minQty) {
      return tiers[i].discountPercent;
    }
  }

  return 0;
}
```
Dengan perbaikan ini:
- Untuk `quantity = 250`, loop memeriksa dari tier 500 (`250 >= 500` -> `false`), lalu memeriksa tier 200 (`250 >= 200` -> `true`), dan langsung mengembalikan diskon tertinggi yang memenuhi syarat, yaitu `10%`.
- Untuk batas bawah `quantity = 50`, kondisi `50 >= 50` terpenuhi dengan benar menghasilkan diskon `5%`.
- Untuk kuantitas di bawah ambang batas (misal `qty = 10`), sistem mengembalikan nilai `0%`.
