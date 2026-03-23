# HISTOPLAY (Sejarah-Ku)

Histoplay adalah platform edukasi interaktif berbasis web (Visual Novel) yang membawa sejarah Indonesia menjadi sebuah petualangan seru. Pengguna dapat memilih misi sejarah, membuat keputusan yang memengaruhi alur cerita, dan mengumpulkan lencana pencapaian.

## 🚀 Teknologi yang Digunakan
- **Framework:** Next.js (App Router), React 19
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Firebase (Firestore & Authentication)
- **Animasi:** Framer Motion
- **Carousel:** Swiper
- **Audio:** `use-sound`

## 📁 Struktur Proyek
```text
/
├── app/               # Next.js App Router
│   ├── admin/         # Panel khusus administrator
│   ├── auth/          # Halaman autentikasi (Login/Register)
│   ├── dashboard/     # Halaman utama pengguna (Misi, Arena, Badge)
│   ├── game/          # Halaman bermain rute dinamis (game/story/[id]/game)
│   └── page.tsx       # Entry point utama (Landing Page)
├── components/        # Komponen UI Reusable
│   ├── landing/       # Komponen presentasional untuk Landing Page
│   └── ui/            # Komponen dasar (Button, Modal, Bubble)
├── hooks/             # Custom React Hooks (useSoundManager, dll)
├── lib/               # Utility dan Firebase configuration
├── public/            # Aset statis (Gambar, Audio BGM/SFX)
└── package.json       # Konfigurasi dependensi project
```

## 🛠️ Setup Project
Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal:

1. **Clone repositori:**
   ```bash
   git clone <repository_url>
   cd Comic
   ```

2. **Install dependensi:**
   ```bash
   npm install
   # Atau menggunakan yarn
   yarn install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env.local` di root proyek dan tambahkan konfigurasi Firebase Anda (sesuaikan dengan isi file `copy.env` jika ada):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda untuk melihat hasilnya.
