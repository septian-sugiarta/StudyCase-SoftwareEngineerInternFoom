# Tiered Quantity Discount System

Sistem pengelolaan aturan diskon bertingkat (*tiered quantity discount*) dan kalkulator kalkulasi diskon otomatis berbasis kuantitas pembelian per produk. Proyek ini dibangun dengan memisahkan arsitektur frontend (React.js + Vite) dan backend (Node.js + Express.js), dilengkapi validasi input komprehensif, unit testing, integration testing, serta dokumentasi teknis lengkap.

---

## Daftar Isi
1. [Fitur Utama](#fitur-utama)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Struktur Folder](#struktur-folder)
4. [Cara Menjalankan Proyek](#1-cara-menjalankan-proyek)
5. [Dokumentasi API](#2-dokumentasi-api)
6. [Keputusan Desain & Arsitektur](#3-keputusan-desain--arsitektur)
7. [Batasan & Asumsi Sistem](#4-batasan--asumsi-sistem)
8. [Penjelasan Bug pada Tugas C (Debugging)](#5-penjelasan-bug-pada-tugas-c-debugging)

---

## Fitur Utama

- **Manajemen Promo (CRUD)**: Membuat, menampilkan, mengubah, dan menghapus aturan diskon per produk.
- **Daftar Tier Dinamis**: Menambah dan menghapus baris aturan tier kuantitas secara interaktif.
- **Kalkulator Diskon Real-time**: Menghitung tier diskon, potongan harga, dan harga akhir secara otomatis ketika kuantitas atau harga satuan diinput.
- **Validasi Ketat**: Memastikan aturan tier terurut naik tanpa duplikasi batas minimum (`minQty`), persentase diskon valid (0–100%), dan angka kuantitas/harga bernilai positif.
- **Testing Lengkap**: Unit test untuk logika penentuan tier diskon dan integration test untuk seluruh endpoint REST API.

---

## Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Backend Runtime** | Node.js (v18+) | Lingkungan eksekusi JavaScript |
| **Web Framework** | Express.js | Framework REST API |
| **Frontend UI** | React.js (v18) + Vite | Antarmuka pengguna berbasis komponen fungsional |
| **Testing** | Jest + Supertest | Unit testing dan HTTP integration testing |
| **Icons & Styling** | Lucide React + Clean CSS | Komponen ikon dan tata letak responsif |

---

## Struktur Folder

```text
Software Intern Foom Study Case/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── promoController.js      # Penanganan request & response HTTP
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js         # Handler error terpusat
│   │   │   └── validateRequest.js      # Validasi payload request
│   │   ├── repositories/
│   │   │   └── promoRepository.js      # Abstraksi persistensi data (file JSON / memory)
│   │   ├── routes/
│   │   │   └── promoRoutes.js          # Definisi rute endpoint
│   │   ├── services/
│   │   │   └── promoService.js         # Logika bisnis promo
│   │   ├── utils/
│   │   │   └── discountCalculator.js   # Pure logic kalkulasi diskon & tier
│   │   ├── app.js                      # Konfigurasi aplikasi Express
│   │   └── server.js                   # Entry point server backend
│   ├── tests/
│   │   ├── integration/
│   │   │   └── promoRoutes.test.js     # Integration test API
│   │   └── unit/
│   │       └── discountCalculator.test.js # Unit test getDiscountTier
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DiscountCalculator.jsx  # Widget kalkulator diskon real-time
│   │   │   ├── PromoForm.jsx           # Form modal tambah/ubah promo & tier dinamis
│   │   │   └── PromoList.jsx           # Tabel daftar promo & aksi
│   │   ├── services/
│   │   │   └── api.js                  # Client fetch API ke backend
│   │   ├── App.jsx                     # Komponen utama state & orkestrator
│   │   ├── index.css                   # Styling desain antarmuka
│   │   └── main.jsx                    # Entry point React
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json                        # Orchestration scripts di root
└── README.md
```

---

## 1. Cara Menjalankan Proyek

### Prasyarat
- **Node.js**: versi 18 atau lebih baru (teruji pada Node.js v21)
- **npm**: versi 9 atau lebih baru
- **Git**

### Instalasi Dependensi
Jalankan perintah berikut di root folder proyek:

```bash
# Menginstal seluruh dependensi backend dan frontend sekaligus
npm run install:all
```

*Atau instalasi manual per direktori:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Konfigurasi Environment Variable
Konfigurasi bersifat opsional karena telah disediakan nilai default siap pakai:
- **Backend**:
  - `PORT`: Port server backend (default: `5000`).
- **Frontend**:
  - `VITE_API_URL`: URL API backend jika tidak menggunakan reverse proxy bawaan Vite (default: otomatis menggunakan proxy ke `http://localhost:5000`).

---

### Menjalankan Server & Aplikasi

#### 1. Jalankan Backend Server
Buka terminal dan jalankan:
```bash
npm run start:backend
```
Server backend akan aktif di `http://localhost:5000`.

#### 2. Jalankan Frontend Client
Buka jendela terminal baru dan jalankan:
```bash
npm run start:frontend
```
Aplikasi frontend dapat diakses melalui browser di `http://localhost:3000`.

---

### Menjalankan Pengujian (Testing)

Untuk menjalankan seluruh unit test dan integration test pada backend:
```bash
npm run test:backend
```

Hasil eksekusi mencakup 19 test case yang menguji seluruh endpoint dan logika kalkulasi batas:
- `PASS tests/unit/discountCalculator.test.js`
- `PASS tests/integration/promoRoutes.test.js`

---

## 2. Dokumentasi API

Base URL: `http://localhost:5000`

### Ringkasan Endpoint

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/promos` | Mengambil seluruh daftar promo |
| `GET` | `/promos/:id` | Mengambil detail satu promo berdasarkan ID |
| `POST` | `/promos` | Membuat promo baru beserta aturan tier |
| `PUT` | `/promos/:id` | Mengubah promo dan aturan tier yang ada |
| `DELETE` | `/promos/:id` | Menghapus promo berdasarkan ID |
| `POST` | `/promos/:id/calculate` | Menghitung diskon dan harga akhir secara otomatis |

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
Membuat promo baru. 

**Validasi yang diterapkan:**
- `productName`: Wajib diisi dan berupa string tidak kosong.
- `tiers`: Array berisi minimal satu aturan `{ minQty, discountPercent }`.
- `minQty`: Bilangan bulat non-negatif (`minQty >= 0`), terurut naik secara ketat tanpa duplikasi.
- `discountPercent`: Angka di rentang 0 sampai 100.

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

**Response `400 Bad Request`:**
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
Memperbarui data promo dan susunan tier.

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
Menghapus promo berdasarkan ID.

**Response `200 OK`:**
```json
{
  "message": "Promo deleted successfully"
}
```

---

#### 6. `POST /promos/:id/calculate`
Melakukan kalkulasi diskon otomatis berdasarkan jumlah unit (`quantity`) dan harga satuan (`unitPrice`).

**Validasi yang diterapkan:**
- `quantity`: Angka positif lebih besar dari 0 (`quantity > 0`).
- `unitPrice`: Angka positif lebih besar dari 0 (`unitPrice > 0`).

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
Aplikasi memisahkan layer secara tegas untuk menjaga keterbacaan, kemudahan pengujian, dan skalabilitas kode:
- **Routes Layer (`routes/`)**: Mengatur routing HTTP dan menghubungkan middleware validasi ke controller terkait.
- **Middleware Layer (`middlewares/`)**: Memvalidasi request sebelum menyentuh logika bisnis serta menyediakan penanganan error terpusat (`errorHandler`).
- **Controller Layer (`controllers/`)**: Bertanggung jawab atas pengelolaan protokol HTTP (status code, ekstraksi parameter, dan format serialisasi).
- **Service Layer (`services/`)**: Mengisolasi aturan bisnis promo dan mengorkestrasi kalkulasi diskon.
- **Domain Utility (`utils/discountCalculator.js`)**: Modul fungsi murni (*pure functions*) untuk menghitung tier dan harga akhir tanpa keterikatan pada HTTP framework.
- **Repository Pattern (`repositories/promoRepository.js`)**: Mengabstraksi akses data. Mendukung mode file JSON terstruktur untuk operasi normal dan mode `:memory:` untuk pengujian otomatis yang terisolasi dan cepat.

### Struktur Data Tier
Aturan diskon disimpan sebagai array objek `[{ minQty: number, discountPercent: number }]` yang divalidasi terurut naik secara ketat (*strictly ascending*). 
1. **Validasi Tanpa Ambang Tumpang Tindih**: Menghilangkan kemungkinan ambiguitas data antar-tingkatan kuantitas.
2. **Efisiensi Evaluasi $O(N)$**: Evaluasi kuantitas dilakukan dengan metode *reverse search* dari tier batas tertinggi ke terendah, menghasilkan evaluasi instan tanpa overhead berlebih.

---

## 4. Batasan & Asumsi Sistem

1. **Autentikasi & Otorisasi**: Sistem belum dilengkapi autentikasi pengguna (JWT/Session) maupun hak akses role, sesuai dengan batasan penugasan studi kasus.
2. **Kalkulasi Single-Product**: Perhitungan diskon dievaluasi untuk satu produk per transaksi dan belum mencakup keranjang belanja multi-produk atau voucher global.
3. **Persistensi File JSON**: Penyimpanan menggunakan file JSON lokal dengan repository pattern. Ditujukan untuk lingkungan pengembangan dan evaluasi lokal, bukan untuk konkurensi tulis tinggi (*high concurrent writes*).

---

## 5. Penjelasan Bug pada Tugas C (Debugging)

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

### Akar Penyebab Masalah:
1. **Penghentian Prematur pada Loop Naik (`break;`)**:
   Daftar `tiers` terurut naik berdasarkan `minQty` (contoh: 0, 50, 200, 500). Ketika dipanggil `getDiscountTier(250, tiers)`, pada iterasi pertama `i = 0` (`minQty = 0`), kondisi `250 > 0` langsung terpenuhi. Program mengisi `discount = 0` lalu langsung mengeksekusi `break;`, sehingga loop terhenti sebelum sempat memeriksa tier yang lebih tinggi (tier 50, 200, atau 500).
2. **Operator Perbandingan Strict (`>`)**:
   Penggunaan operator `>` menyebabkan kuantitas yang tepat berada di batas bawah tier (misal: `qty = 50` pada tier `50-199`) menghasilkan nilai `false` (`50 > 50`), sehingga pelanggan tidak mendapatkan diskon yang seharusnya menjadi haknya.

### Solusi & Logika Perbaikan:
Fungsi diperbaiki dengan melakukan iterasi dari tier tertinggi ke terendah (*reverse loop*) dan menggunakan operator inklusif `>=`:

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

**Hasil setelah perbaikan:**
- Untuk `quantity = 250`, sistem memeriksa tier 500 (`250 >= 500` -> `false`), kemudian memeriksa tier 200 (`250 >= 200` -> `true`), dan langsung mengembalikan diskon tertinggi yang memenuhi syarat, yaitu **10%**.
- Untuk nilai batas bawah `quantity = 50`, kondisi `50 >= 50` terpenuhi dengan benar menghasilkan diskon **5%**.
- Untuk kuantitas di bawah ambang batas diskon (misal `qty = 10`), fungsi mengembalikan **0%**.
