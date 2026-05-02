# 🎵 MusicPlayerMod

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android-green.svg)
![Language](https://img.shields.io/badge/language-Kotlin-orange.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

> **MusicPlayerMod** adalah aplikasi pemutar musik Android yang dimodifikasi dengan tampilan modern, fitur canggih, dan pengalaman mendengarkan musik yang lebih menyenangkan. Dibangun di atas arsitektur yang bersih dan performa tinggi.

---

## 👋 Tentang Project Ini

Hei! Selamat datang di **MusicPlayerMod** 🎉

Project ini lahir dari keinginan sederhana — punya music player di Android yang nggak cuma bisa putar lagu, tapi juga enak dipandang dan nyaman dipakai sehari-hari. Banyak music player di luar sana yang terlalu polos atau justru terlalu penuh fitur yang nggak perlu. Nah, **MusicPlayerMod** hadir sebagai jalan tengahnya.

Dibangun dengan **Kotlin** dan arsitektur **MVVM** yang bersih, app ini dirancang supaya ringan, responsif, dan gampang dikembangkan lebih lanjut. Cocok banget buat kamu yang lagi belajar Android development atau mau kontribusi ke project open source! 🚀

Kalau kamu suka dengan project ini, jangan lupa kasih ⭐ di repo-nya ya — itu sangat berarti dan bikin semangat terus develop!

---

## 📸 Screenshot

> Home
 <img width="217" height="632" alt="image" src="https://github.com/user-attachments/assets/f8aa92f0-d8a7-428d-97fc-f66a204b24a6" />
> Player
 <img width="390" height="1336" alt="music page" src="https://github.com/user-attachments/assets/4cfa4290-dfc2-447b-a253-a35bc56d2d39" />
> Playlist
 <img width="375" height="812" alt="Playlist" src="https://github.com/user-attachments/assets/3dde99f2-c0d2-442c-ad5a-e75bbabe93a6" />


## ✨ Fitur Utama

- 🎧 **Pemutaran Audio Berkualitas Tinggi** — Mendukung format MP3, FLAC, AAC, OGG, dan WAV
- 📂 **Manajemen Library Otomatis** — Scan dan organisasi lagu dari penyimpanan lokal secara otomatis
- 🎨 **UI Modern & Kustomisasi Tema** — Tampilan Material Design dengan pilihan tema terang dan gelap
- 📋 **Playlist Dinamis** — Buat, edit, dan kelola playlist dengan mudah
- 🔀 **Shuffle & Repeat** — Mode acak dan pengulangan lagu/playlist
- 🔊 **Equalizer Built-in** — Sesuaikan kualitas audio dengan preset equalizer bawaan
- 📡 **Background Playback** — Pemutaran musik berjalan di background dengan notifikasi kontrol
- ⏱️ **Sleep Timer** — Atur timer untuk menghentikan musik secara otomatis
- ❤️ **Favorit & Rating** — Tandai lagu favorit dan beri rating
- 🔍 **Pencarian Cepat** — Cari lagu, artis, dan album dengan instan

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Bahasa** | Kotlin |
| **UI** | Jetpack Compose / XML Layout |
| **Arsitektur** | MVVM (Model-View-ViewModel) |
| **Audio Engine** | ExoPlayer / MediaPlayer API |
| **Database** | Room Database |
| **Dependency Injection** | Hilt / Koin |
| **Async** | Kotlin Coroutines & Flow |
| **Image Loading** | Glide / Coil |
| **Navigation** | Jetpack Navigation Component |
| **Background Service** | Android Foreground Service |

---

## ✅ Prasyarat Instalasi

Sebelum memulai, pastikan lingkungan pengembangan kamu memenuhi syarat berikut:

- **Android Studio** Hedgehog (2023.1.1) atau yang lebih baru
- **JDK** versi 11 atau 17
- **Android SDK** API Level 24 (Android 7.0) atau lebih tinggi
- **Gradle** versi 8.0+
- **Git** terinstal di sistem kamu
- Perangkat/emulator Android dengan API Level ≥ 24

---

## 🚀 Instalasi & Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/Mhadi709/MusicPlayerMod.git
cd MusicPlayerMod
```

### 2. Buka di Android Studio

```
File → Open → Pilih folder MusicPlayerMod
```

### 3. Sync Gradle

Tunggu Android Studio menyelesaikan sinkronisasi dependensi secara otomatis, atau jalankan:

```bash
./gradlew build
```

### 4. Jalankan Aplikasi

```bash
# Jalankan di emulator atau perangkat fisik
./gradlew installDebug
```

Atau tekan tombol **▶ Run** di Android Studio.

---

## 📁 Struktur Project

```
MusicPlayerMod/
│
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mhadi709/musicplayermod/
│   │   │   │   ├── data/              # Layer data (Room DB, Repository)
│   │   │   │   │   ├── local/         # DAO, Entity, Database
│   │   │   │   │   └── repository/    # Implementasi Repository
│   │   │   │   ├── domain/            # Business logic & Use Cases
│   │   │   │   │   ├── model/         # Data model / entity domain
│   │   │   │   │   └── usecase/       # Use case classes
│   │   │   │   ├── presentation/      # UI Layer
│   │   │   │   │   ├── ui/            # Activities, Fragments, Composables
│   │   │   │   │   ├── viewmodel/     # ViewModel classes
│   │   │   │   │   └── adapter/       # RecyclerView Adapters
│   │   │   │   ├── service/           # Background playback service
│   │   │   │   ├── utils/             # Helper & Extension functions
│   │   │   │   └── di/                # Dependency Injection modules
│   │   │   ├── res/                   # Resources (layout, drawable, values)
│   │   │   └── AndroidManifest.xml
│   │   └── test/                      # Unit Tests
│   └── build.gradle
│
├── gradle/
├── .gitignore
├── build.gradle
├── settings.gradle
└── README.md
```

---

## 💡 Contoh Penggunaan

### Memutar Lagu

```kotlin
// Inisialisasi MusicPlayer service
val intent = Intent(context, MusicPlayerService::class.java).apply {
    action = MusicPlayerService.ACTION_PLAY
    putExtra(MusicPlayerService.EXTRA_SONG_ID, song.id)
}
startService(intent)
```

### Mengambil Daftar Lagu

```kotlin
// Dari ViewModel
viewModel.songList.observe(viewLifecycleOwner) { songs ->
    adapter.submitList(songs)
}

// Dari Repository
val songs = musicRepository.getAllSongs()
```

### Menambah Lagu ke Playlist

```kotlin
viewModel.addSongToPlaylist(playlistId = 1, songId = song.id)
```

### Mengatur Sleep Timer

```kotlin
// Set timer 30 menit
viewModel.setSleepTimer(durationInMinutes = 30)
```

---

## 🧪 Menjalankan Tests

```bash
# Unit Tests
./gradlew test

# Instrumented Tests (membutuhkan perangkat/emulator)
./gradlew connectedAndroidTest

# Semua tests
./gradlew check
```

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Ikuti langkah berikut untuk berkontribusi:

1. **Fork** repository ini
2. Buat branch fitur baru:
   ```bash
   git checkout -b feature/nama-fitur-kamu
   ```
3. **Commit** perubahan kamu dengan pesan yang jelas:
   ```bash
   git commit -m "feat: tambah fitur nama-fitur"
   ```
4. **Push** ke branch kamu:
   ```bash
   git push origin feature/nama-fitur-kamu
   ```
5. Buat **Pull Request** ke branch `main`

### 📌 Panduan Kontribusi

- Ikuti konvensi penamaan Kotlin dan style guide Android
- Pastikan semua test lulus sebelum membuat Pull Request
- Tambahkan unit test untuk fitur baru
- Update dokumentasi jika diperlukan
- Gunakan format commit message: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

### 🐛 Melaporkan Bug

Temukan bug? Buka [Issue baru](https://github.com/Mhadi709/MusicPlayerMod/issues) dengan template:
- **Deskripsi bug** yang jelas
- **Langkah reproduksi** step-by-step
- **Hasil yang diharapkan** vs **hasil aktual**
- **Screenshot** (jika memungkinkan)
- **Versi Android** dan **spesifikasi perangkat**

---

## 📄 Lisensi

```
MIT License

Copyright (c) 2024 Mhadi709

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Mhadi709**

- GitHub: [@Mhadi709](https://github.com/Mhadi709)

---

<div align="center">
  <sub>Dibuat dengan ❤️ oleh Mhadi709 — Jika project ini bermanfaat, beri ⭐ ya!</sub>
</div>
