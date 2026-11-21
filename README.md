# NextQ — Sistem Antrean Mandiri Cerdas Klinik Gading

Sistem antrean klinik mandiri berbasis web PWA (*Progressive Web App*) terintegrasi untuk **Klinik Gading Yogyakarta**. Dirancang untuk berjalan cepat, responsif, dan dapat digunakan secara offline (*offline-first*) di layar sentuh kios pasien, monitor display TV ruang tunggu, maupun meja komputer dokter/petugas.

---

## 🌟 Fitur Utama

1. **Kios Sentuh Mandiri Pasien (*Touchscreen Kiosk*)**:
   - Pilihan poli/layanan instan:
     - **Poli A**: Poli Umum
     - **Poli B**: Poli Gigi & Mulut
     - **Poli C**: Poli KIA & Anak
     - **Poli D**: Farmasi & Apotek
   - Input opsional nama pasien, nomor WhatsApp & kategori (Umum, BPJS, Asuransi, Prioritas/Lansia).
   - Pratinjau tiket digital seketika dengan kalkulasi estimasi sisa antrean di depan.
   - Siap cetak langsung ke printer struk thermal (*Thermal Receipt 58mm / 80mm*).

2. **Layar Display TV Ruang Tunggu (*Billboard TV*)**:
   - Highlight kartu besar (*Hero Board*) dengan status pemanggilan aktif dan nomor antrean berukuran besar.
   - Grid 4 loket/poli dengan nomor yang sedang dilayani dan jumlah pasien yang menunggu.
   - Efek suara lonceng ding-dong bandara/klinik berbasis **Web Audio API** (tanpa ketergantungan file audio eksternal).
   - Suara pemanggilan pasien berbahasa Indonesia otomatis dengan **Web Speech API Text-to-Speech**.
   - Running text informasi klinik dan jam digital real-time.
   - Mode Layar Penuh (*Fullscreen Toggle*).

3. **Meja Petugas & Dokter (*Operator Console*)**:
   - Pemilihan loket dinamis per dokter/petugas yang bertugas.
   - Tombol kontrol cepat:
     - 📢 **Panggil Berikutnya** (*Next Call*)
     - 🔁 **Panggil Ulang** (*Recall*)
     - ✅ **Selesai Layani** (*Finished*)
     - ⏭️ **Lewati / Absen** (*Skip*)
   - Pendaftaran langsung pasien *walk-in* oleh petugas loket.
   - Sinkronisasi instan antar-tab/layar browser via `BroadcastChannel` dan `localStorage`.

4. **Statistik, Rekap & Export Data**:
   - Ringkasan harian: Total Tiket, Selesai Dilayani, Masih Menunggu, dan Dilewati.
   - Tabel riwayat panggilan dapat difilter per poli.
   - Fitur **Export ke CSV** untuk laporan kunjungan harian klinik.
   - Fitur **Reset Antrean Harian**.

5. **PWA & Offline Ready**:
   - Dilengkapi *Service Worker* dan *Web App Manifest*.
   - Dapat diinstal di tablet Android, iPad, PC Windows, dan Smart TV.

---

## 🚀 Panduan Penggunaan

Buka aplikasi di browser (Google Chrome / Edge / Safari).

- **Tab Kios Mandiri**: Letakkan di tablet / layar sentuh area depan klinik untuk pasien mengambil tiket.
- **Tab Layar Display TV**: Buka di browser Smart TV atau PC yang tersambung ke TV ruang tunggu (tekan tombol *Fullscreen*).
- **Tab Meja Petugas**: Digunakan dokter dan petugas loket untuk memanggil dan mengelola antrean.
- **Audio Suara**: Tekan tombol "Audio Aktif" di navigasi atas satu kali untuk mengaktifkan izin audio browser jika diblokir oleh kebijakan *autoplay*.

---

## 🛠️ Lisensi & Hak Cipta

Dikelola untuk operasional **Klinik Gading Yogyakarta**.
Dikembangkan dengan standar performa tinggi, zero bloatware, dan tanpa dependensi eksternal yang memberatkan.
