# Magician-Game

> **Trik Sulap Kartu Deterministik** — game interaktif + penjelasan matematis, dalam estetika *Vintage Magic Treatise*.

🌐 **Live site**: https://adamrizky1.github.io/Magician-Game/

---

## Apa ini?

Sebuah web app yang membongkar rahasia matematis di balik trik sulap kartu klasik. Pilih satu kartu dari deck 52, dan "mesin" akan menemukan kartumu pasti di antara 3 kartu terakhir — tanpa keberuntungan.

Penjelasan matematisnya cuma satu baris:

$$c^* = \mathcal{D} \setminus \mathcal{R}$$

di mana $\mathcal{D}$ = deck standar 52 kartu, dan $\mathcal{R}$ = 51 kartu yang dipegang temanmu. Selisihnya = kartumu.

## Fitur

**Tab I — Panggung Sulap** (game interaktif):
- 52 kartu poker dikocok acak
- Pilih 1 kartu
- Sistem ambil 27 kartu (termasuk kartumu) — karena $27 = 3^3$
- 2 ronde pembagian ke 3 tumpukan + pertanyaan Ya/Tidak
- Konvergen ke 3 kartu terakhir yang pasti berisi kartumu

**Tab II — Treatise Matematis** (7 artikel):
1. Skenario lengkap 7 tahap
2. Notasi matematis dasar (4 definisi)
3. Metode 1: Selisih Himpunan — cara asli temanmu
4. Metode 2: Konvergensi via Pembagian Tumpukan (pemetaan linear $f(x) = (ax+b) \bmod N$)
5. Jawaban langsung: bagaimana temanmu tahu 2♥?
6. Diagram alur lengkap
7. Kesimpulan

Rumus dirender pakai [KaTeX](https://katex.org/).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Math**: KaTeX
- **Fonts**: Playfair Display, Source Serif 4, JetBrains Mono (Google Fonts)
- **Deployment**: GitHub Pages via GitHub Actions (static export)

## Pengembangan Lokal

```bash
# Install dependencies
bun install

# Jalankan dev server
bun run dev

# Build untuk produksi (static export ke ./out)
bun run build:pages
```

Output static ada di `./out/`. Buka `out/index.html` langsung, atau serve dengan static server.

## Design

Estetika **"Swiss Brutalist"** — restraint sebagai filosofi desain. Pure typography + white space, satu accent color.

- **Palet**: pure white `#ffffff` + black `#0a0a0a` + cardinal red `#c41e3a` (accent, dipakai sparing)
- **Tipografi**: Space Grotesk (display) + Inter (body) + JetBrains Mono (math/code/numbers)
- **Layout**: 2-kolom grid di desktop (game stage | math trace side panel), single column mobile
- **Tanpa AI-slop**: no gradients, no shadows, no glassmorphism, no ornaments, no suit symbols as decoration, no em-dashes, no Lucide icons, no rounded corners (radius 0)
- **Contextual Math Trace**: sticky side panel yang update tiap game phase, nunjukin operasi matematis yang sedang berlangsung dengan rumus KaTeX real-time

## Lisensi

Bebas dipakai, dimodifikasi, dan disebar. Kredit appreciated tapi tidak wajib.

---

*Dicetak untuk pemilik repo* — `c* = D − R`
