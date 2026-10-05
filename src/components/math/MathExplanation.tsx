'use client'

import { motion } from 'framer-motion'
import { Math, FormulaBox, TahapBox, InsightBox, DefBox, V } from './MathBlocks'

/**
 * Penjelasan matematis lengkap — gaya editorial treatise.
 */
export function MathExplanation() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-body text-[#1a1410]"
    >
      {/* ===== ABSTRACT / RINGKASAN ===== */}
      <header className="mb-8 pb-4 border-b-2 border-[#1a1410]">
        <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-1">
          Ringkasan
        </div>
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Dokumen ini membongkar secara matematis bagaimana seorang temanmu dapat mengetahui
          dengan pasti kartu yang kamu pilih (misalnya <V>2♥</V>) dari sebuah deck poker standar
          berisi 52 kartu, meskipun kamu mengocoknya secara acak. Penjelasan dibagi dalam dua
          mekanisme matematis yang berbeda: <strong>(1) Metode Selisih Himpunan</strong> yang
          merupakan cara langsung dan paling sederhana — temanmu cukup memeriksa 51 kartu yang ia
          pegang dan menemukan kartu mana dari deck standar yang tidak ada; dan{' '}
          <strong>(2) Metode Konvergensi Algoritmik</strong> via pembagian tumpukan berulang yang
          merupakan trik sulap klasik <em>27-Card Trick</em>. Kedua metode bersifat{' '}
          <em>deterministik</em> — tidak ada unsur keberuntungan, hanya pemetaan matematis pada
          himpunan terbatas.
        </p>
      </header>

      {/* ===== §1 SKENARIO ===== */}
      <Article num="I" title="Skenario Lengkap: dari Kocok sampai Teman Tahu Kartumu">
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-4 dropcap">
          Sebelum membahas rumus, mari kita pahami persis alur peristiwanya seperti yang kamu
          alami. Skenario ini penting karena setiap langkah punya peran matematis yang berbeda.
        </p>
        <div className="space-y-1">
          <TahapBox num={1} title="Kamu mengocok 52 kartu">
            Kamu memegang sebuah deck poker standar berisi 52 kartu yang sudah campur aduk.
            Pengocokan ini murni acak — tidak ada urutan tertentu, tidak ada pola. Dalam istilah
            probabilitas, ini adalah <em>uniform random permutation</em> dari 52 kartu.
          </TahapBox>
          <TahapBox num={2} title="Kamu menyerahkan deck ke teman">
            Setelah selesai mengocok, kamu memberikan seluruh tumpukan ke temanmu. Pada titik ini,
            temanmu memegang deck lengkap 52 kartu.
          </TahapBox>
          <TahapBox num={3} title="Kamu disuruh memilih satu kartu secara acak">
            Temanmu menyodorkan deck (yang masih tertutup) dan menyuruh kamu mengambil satu kartu.
            Kamu tidak tahu apa yang kamu ambil — mungkin 2♥, mungkin K♠, mungkin apa saja. Kamu
            mengambil satu, melihatnya sendiri, lalu menyimpannya. Kamu tidak menunjukkan ke
            temanmu.
          </TahapBox>
          <TahapBox num={4} title="Kamu mengocok lagi">
            Setelah mengambil kartu pilihanmu, kamu (atau temanmu) mengocok sisa deck lagi.
            Pengocokan ini juga murni acak — tidak ada pola.
          </TahapBox>
          <TahapBox num={5} title="Temanmu memisah-misahkan deck jadi beberapa bagian">
            Temanmu mulai membagi sisa deck menjadi beberapa tumpukan kecil (misalnya 3 tumpukan).
            Pembagian ini terlihat seperti bagian dari trik sulap.
          </TahapBox>
          <TahapBox num={6} title="Temanmu bertanya: 'Apakah kartu kamu ada di bagian ini?'">
            Untuk setiap tumpukan, temanmu menunjukinya ke kamu dan bertanya: <em>"Apakah kartu
            kamu ada di tumpukan ini?"</em> Kamu menjawab <em>"Ya"</em> atau <em>"Tidak"</em>{' '}
            dengan jujur.
          </TahapBox>
          <TahapBox num={7} title="Berlanjut sampai tersisa 3 kartu">
            Temanmu mengulang proses bagi-tumpukan-dan-tanya beberapa kali. Setiap kali kamu bilang{' '}
            <em>"Ya"</em>, temanmu mengambil tumpukan itu sebagai deck baru. Setelah beberapa
            ronde, tersisa 3 kartu. Dan kartu kamu PASTI ada di antara 3 itu.
          </TahapBox>
        </div>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mt-4">
          <strong>Pertanyaan kunci:</strong>{' '}
          <em className="text-[#722637]">Bagaimana temanmu tahu kartumu adalah 2♥?</em>{' '}
          Dua jawaban matematis akan diberikan di artikel berikut.
        </p>
        <Ornament />
      </Article>

      {/* ===== §2 NOTASI ===== */}
      <Article num="II" title="Notasi Matematis Dasar">
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-4">
          Sebelum masuk ke rumus, mari kita tetapkan notasi yang dipakai sepanjang dokumen.
        </p>

        <DefBox label="Definisi II.1" title="Deck Standar">
          <p className="mb-2">Deck poker standar adalah himpunan</p>
          <Math block tex="\mathcal{D} = \{ c_1, c_2, c_3, \ldots, c_{52} \}, \quad |\mathcal{D}| = 52" />
          <p className="mt-2">
            di mana setiap <Math tex="c_i" /> adalah pasangan <em>(rank, suit)</em> unik. Rank
            ada 13 macam <V>A, 2, 3, ..., K</V> dan suit ada 4 macam <V>♥, ♦, ♣, ♠</V>, sehingga{' '}
            <Math tex="13 \times 4 = 52" /> kartu unik.
          </p>
        </DefBox>

        <DefBox label="Definisi II.2" title="Kartu Pilihan User">
          <p>
            Misalkan kamu memilih satu kartu tertentu, sebut saja <Math tex="c^* \in \mathcal{D}" />.
            Dalam contoh kamu, <Math tex="c^* = 2\heartsuit" />. Nilai <Math tex="c^*" /> tidak
            diketahui temanmu di awal — ini yang harus ia temukan.
          </p>
        </DefBox>

        <DefBox label="Definisi II.3" title="Sisa Deck yang Dimiliki Teman">
          <p className="mb-2">
            Setelah kamu mengambil <Math tex="c^*" /> dan menyimpannya, temanmu memegang sisa deck:
          </p>
          <Math block tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}, \quad |\mathcal{R}| = 51" />
          <p className="mt-2">
            Himpunan <Math tex="\mathcal{R}" /> inilah yang temanmu <em>pegang dan lihat</em>.
          </p>
        </DefBox>

        <DefBox label="Definisi II.4" title="Operasi Selisih Himpunan">
          <p className="mb-2">
            Operasi selisih himpunan (set difference) <Math tex="\setminus" /> didefinisikan
            sebagai:
          </p>
          <Math block tex="A \setminus B = \{ x \in A \mid x \notin B \}" />
          <p className="mt-2">
            Secara intuitif: <em>"ambil semua elemen <Math tex="A" />, buang yang juga ada di{' '}
            <Math tex="B" />"</em>.
          </p>
        </DefBox>
      </Article>

      {/* ===== §3 METODE 1 ===== */}
      <Article num="III" title="Metode 1: Selisih Himpunan — Cara Asli Temanmu">
        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-6 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ III.1</span>
          Ide Dasar
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Inilah kunci yang sering tidak disadari: temanmu{' '}
          <strong className="text-[#722637]">tidak perlu</strong> membagi-bagi tumpukan untuk tahu
          kartumu. Dari obrolan WhatsApp yang kamu lampirkan, temanmu sendiri mengaku:
        </p>

        <blockquote className="my-5 pl-4 border-l-2 border-[#722637]">
          <p className="font-body italic text-base text-[#2c241b] mb-1">
            "tanpa gua bagi2 in gua juga bisa langsung tau kartu lu"
          </p>
          <p className="font-body italic text-base text-[#2c241b] mb-1">
            "langsung gua bagi semua (kecuali kartu lu) misalnya, itu juga bisa"
          </p>
          <p className="font-body italic text-base text-[#2c241b]">
            "cuma kan bagi2 itu buat some kind of playing aja biar gak langsung selesai sulapnya"
          </p>
        </blockquote>

        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Pernyataan ini <strong className="text-[#722637]">sangat jujur secara matematis</strong>.
          Temanmu tidak berbohong. Trik sebenarnya sangat sederhana:{' '}
          <strong className="text-[#722637]">dia tahu kartumu dengan menghitung selisih antara deck
          standar dengan sisa kartu yang ia pegang</strong>.
        </p>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ III.2</span>
          Rumus Inti
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Karena <Math tex="\mathcal{D}" /> (deck standar 52 kartu) adalah himpunan yang sudah
          dikenal dan tetap, dan <Math tex="\mathcal{R}" /> (sisa 51 kartu di tangan temanmu) bisa
          diperiksa satu per satu, maka:
        </p>

        <FormulaBox title="Rumus Selisih Himpunan">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
        </FormulaBox>

        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Karena <Math tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}" />, maka:
        </p>
        <Math block tex="\mathcal{D} \setminus \mathcal{R} = \mathcal{D} \setminus \bigl(\mathcal{D} \setminus \{c^*\}\bigr) = \{c^*\}" />

        <p className="font-body text-base leading-relaxed text-[#2c241b] mt-4">
          Himpunan hasilnya berisi <em>tepat satu elemen</em>, yaitu <Math tex="c^*" />. Karena{' '}
          <Math tex="|\mathcal{D}| = 52" />, <Math tex="|\mathcal{R}| = 51" />, dan keduanya
          berbagi 51 elemen yang sama, maka:
        </p>
        <Math block tex="|\mathcal{D} \setminus \mathcal{R}| = |\mathcal{D}| - |\mathcal{D} \cap \mathcal{R}| = 52 - 51 = 1" />

        <p className="font-body text-base leading-relaxed text-[#2c241b] mt-4">
          Satu-satunya elemen di <Math tex="\mathcal{D}" /> yang tidak ada di{' '}
          <Math tex="\mathcal{R}" /> adalah <Math tex="c^*" />.{' '}
          <strong className="text-[#722637]">Itulah kartumu.</strong>
        </p>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ III.3</span>
          Kenapa 100% Berhasil tanpa Keberuntungan?
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Operasi selisih himpunan adalah operasi <em>deterministik</em>: untuk input yang sama,
          output selalu sama. Tidak ada probabilitas, tidak ada ruang untuk "gagal". Selama:
        </p>
        <ul className="list-disc list-inside font-body text-base leading-relaxed text-[#2c241b] mb-3 space-y-1 ml-2">
          <li><Math tex="\mathcal{D}" /> adalah himpunan acuan yang diketahui (karena deck poker standar selalu sama 52 kartu),</li>
          <li><Math tex="\mathcal{R}" /> dapat diobservasi sepenuhnya (karena temanmu memegang semua 51 kartu sisanya),</li>
        </ul>
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          maka <Math tex="c^*" /> teridentifikasi <strong className="text-[#722637]">secara pasti</strong>.
        </p>

        <InsightBox title="Catatan Penting">
          "Trik sulap" yang sebenarnya bukanlah pembagian tumpukan — itu hanya <em>showmanship</em>{' '}
          (pura-pura). Trik sebenarnya adalah{' '}
          <strong className="text-[#722637]">
            operasi <Math tex="\mathcal{D} \setminus \mathcal{R}" /> di kepala temanmu
          </strong>. Temanmu bisa langsung tahu kartumu dalam 1 detik tanpa pembagian apapun,
          hanya dengan memeriksa 51 kartu yang ia pegang.
        </InsightBox>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ III.4</span>
          Algoritma Operasional
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Dalam praktiknya, algoritma temanmu adalah:
        </p>
        <ol className="list-decimal list-inside font-body text-base leading-relaxed text-[#2c241b] mb-3 space-y-2 ml-2">
          <li>
            <strong>Inisialisasi:</strong> buat checklist mental semua 52 kartu standar (atau
            pakai kartu fisik sebagai referensi).
          </li>
          <li>
            <strong>Iterasi:</strong> untuk setiap kartu <Math tex="c" /> di <Math tex="\mathcal{R}" />{' '}
            (sisa 51 kartu), tandai <Math tex="c" /> sebagai "ada" di checklist.
          </li>
          <li>
            <strong>Identifikasi:</strong> setelah iterasi selesai, satu-satunya kartu di{' '}
            <Math tex="\mathcal{D}" /> yang tidak tertandai adalah <Math tex="c^*" />.
          </li>
        </ol>
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Kompleksitas waktu: <Math tex="\mathcal{O}(|\mathcal{D}|) = \mathcal{O}(52)" />, konstan.
          Tidak ada kerja komputasi yang berarti.
        </p>
      </Article>

      {/* ===== §4 METODE 2 ===== */}
      <Article num="IV" title="Metode 2: Konvergensi via Pembagian Tumpukan">
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Sekarang mari kita bahas <em>versi showmanship</em>-nya, yang melibatkan pembagian
          tumpukan dan pertanyaan Ya/Tidak. Ini lebih spektakuler tapi secara matematis lebih
          rumit dari yang dibutuhkan.
        </p>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-6 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ IV.1</span>
          Pemetaan Linear pada Indeks Kartu
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Setiap kali temanmu membagi deck menjadi <Math tex="k" /> tumpukan dan menyatukan
          kembali dengan pola tertentu, posisi setiap kartu di dalam deck berubah mengikuti{' '}
          <em>fungsi linear modulo</em>.
        </p>

        <DefBox label="Definisi IV.1" title="Fungsi Pemetaan Posisi">
          <p className="mb-2">
            Misalkan kartu berada di posisi <Math tex="x" /> pada deck berisi <Math tex="N" />{' '}
            kartu. Setelah satu ronde pembagian-jadi-<Math tex="k" />-tumpukan-dan-penggabungan,
            posisi baru <Math tex="x'" /> mengikuti:
          </p>
          <Math block tex="x' = (a \cdot x + b) \pmod{N}" />
          <p className="mt-2">di mana:</p>
          <ul className="list-disc list-inside text-[#2c241b] text-sm mt-2 space-y-1 ml-2">
            <li><Math tex="a" /> = konstanta perkalian yang ditentukan oleh banyaknya tumpukan <Math tex="k" />,</li>
            <li><Math tex="b" /> = konstanta pergeseran yang ditentukan oleh urutan penumpukan kembali,</li>
            <li><Math tex="N" /> = total kartu saat itu.</li>
          </ul>
        </DefBox>

        <DefBox label="Teorema IV.1" title="Iterasi Fungsi Linear pada Himpunan Terbatas">
          <p>
            Untuk sembarang fungsi <Math tex="f: \mathbb{Z}_N \to \mathbb{Z}_N" /> yang berbentuk{' '}
            <Math tex="f(x) = (ax + b) \pmod{N}" />, jika <Math tex="\gcd(a, N) = 1" />, maka{' '}
            <Math tex="f" /> adalah bijeksi. Iterasi <Math tex="f" /> yang berulang akan
            membentuk orbit yang konvergen (menuju titik tetap atau siklus) tergantung pada
            struktur grup <Math tex="\mathbb{Z}_N" />.
          </p>
        </DefBox>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ IV.2</span>
          Kasus Khusus: Trik 27-Kartu
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Trik sulap klasik menggunakan <Math tex="N = 27" /> kartu yang dibagi menjadi{' '}
          <Math tex="k = 3" /> tumpukan di setiap ronde. Karena <Math tex="27 = 3^3" />, setelah
          tepat 3 ronde pemetaan linear, posisi kartu konvergen ke indeks tertentu yang dapat
          diprediksi.
        </p>

        <FormulaBox title="Pemetaan pada Trik 27-Kartu">
          <p className="font-body text-sm text-[#2c241b] mb-3">
            Setelah <Math tex="r" /> ronde pembagian ke 3 tumpukan dengan penggabungan di mana
            tumpukan terpilih selalu ditempatkan di tengah, posisi kartu <Math tex="c^*" /> dalam
            deck adalah:
          </p>
          <Math block tex="x_r \in \left[ \tfrac{N}{3}(t_r - 1) + 1, \;\; \tfrac{N}{3}\, t_r \right] \pmod{N}" />
          <p className="font-body text-sm text-[#6e5f4c] italic mt-3">
            di mana <Math tex="t_r \in \{1, 2, 3\}" /> adalah tumpukan yang dipilih di ronde{' '}
            <Math tex="r" />.
          </p>
        </FormulaBox>

        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Setelah ronde 1: posisi <Math tex="c^*" /> berada di blok tengah (indeks 10–18).<br />
          Setelah ronde 2: posisi <Math tex="c^*" /> berada di sub-blok tengah (indeks 13–15).<br />
          Setelah ronde 3: posisi <Math tex="c^*" /> tepat di indeks 14 (titik tengah deck).
        </p>

        <InsightBox title="Verifikasi Konvergensi">
          Karena <Math tex="27 = 3^3" />, ada 3 iterasi pemetaan linear. Tiap iterasi membagi 3
          blok. Setelah 3 iterasi, hanya ada 1 posisi yang selamat di tengah, yaitu{' '}
          <Math tex="c^*" />. Inilah kenapa trik ini disebut <em>deterministik</em> — tidak ada
          probabilitas, posisi akhir ditentukan oleh struktur matematis.
        </InsightBox>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ IV.3</span>
          Adaptasi untuk Berakhir di 3 Kartu
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
          Versi yang kamu alami berakhir di 3 kartu (bukan 1). Untuk ini, gunakan 2 ronde
          alih-alih 3:
        </p>
        <ol className="list-decimal list-inside font-body text-base leading-relaxed text-[#2c241b] mb-3 space-y-2 ml-2">
          <li>
            Mulai dengan <Math tex="N_0 = 27" /> kartu (termasuk <Math tex="c^*" />). Bagi ke 3
            tumpukan @ 9 kartu. Tanya <em>"Apakah <Math tex="c^*" /> di tumpukan <Math tex="i" />?"</em>.
            Saat user bilang Ya, <Math tex="N_1 = 9" /> kartu (tumpukan terpilih).
          </li>
          <li>
            Bagi <Math tex="N_1 = 9" /> kartu ke 3 tumpukan @ 3 kartu. Tanya lagi. Saat user
            bilang Ya, <Math tex="N_2 = 3" /> kartu.
          </li>
        </ol>

        <FormulaBox title="Konvergensi Eksponensial">
          <Math block tex="N_r = \frac{N_0}{3^r} = \frac{27}{3^r}" />
          <Math block tex="\Longrightarrow \quad N_0 = 27, \; N_1 = 9, \; N_2 = 3" />
          <p className="font-body text-sm text-[#2c241b] mt-3">
            Setelah <Math tex="r = 2" /> ronde, tersisa tepat 3 kartu yang{' '}
            <strong className="text-[#722637]">pasti memuat</strong> <Math tex="c^*" />.
          </p>
        </FormulaBox>

        <h3 className="font-display font-bold text-lg text-[#1a1410] mt-8 mb-2">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">§ IV.4</span>
          Pemilihan 27 dari 52
        </h3>
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Karena deck asli punya 52 kartu (bukan 27), temanmu terlebih dahulu mengambil 27 kartu
          secara strategis dari 52 — pastikan <Math tex="c^*" /> termasuk di dalamnya — lalu
          menjalankan trik 27-kartu di atas himpunan kecil itu. Pengambilan 27 kartu ini sendiri
          bukan trik; cukup ambil <Math tex="c^*" /> (yang sudah teridentifikasi via Metode 1!)
          plus 26 kartu acak dari 51 sisanya.
        </p>

        <InsightBox title="Ironi Matematis">
          Temanmu sebenarnya sudah tahu <Math tex="c^*" /> sejak awal (lewat Metode 1). Trik
          pembagian tumpukan hanyalah <em>teatrikal</em> — dibuat-buat agar sulap tidak selesai
          dalam 1 detik. Sesuai pengakuannya: <em>"cuma kan bagi2 itu buat some kind of playing
          aja biar gak langsung selesai sulapnya"</em>.
        </InsightBox>
      </Article>

      {/* ===== §5 JAWABAN LANGSUNG ===== */}
      <Article num="V" title="Jawaban Langsung: Bagaimana Temanmu Tahu 2♥?">
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-4">
          Berdasarkan analisis di atas, jawaban matematis terhadap pertanyaanmu adalah:
        </p>

        <div className="my-6 p-6 border-2 border-[#1a1410] bg-[#f5ecd5]/60">
          <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-3">
            Jawaban Final
          </div>
          <p className="font-body text-base leading-relaxed text-[#2c241b] mb-3">
            Temanmu mengetahui kartumu adalah <V>2♥</V> dengan menerapkan operasi selisih himpunan:
          </p>
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="font-body text-base leading-relaxed text-[#2c241b] mt-3">
            di mana <Math tex="\mathcal{D}" /> adalah deck standar 52 kartu dan{' '}
            <Math tex="\mathcal{R}" /> adalah 51 kartu yang ia pegang. Ia cukup memeriksa 51 kartu
            di tangannya dan menemukan bahwa satu-satunya kartu standar yang tidak ia miliki
            adalah <V>2♥</V>. <strong className="text-[#722637]">Itulah kartu yang kamu ambil.</strong>
          </p>
          <p className="font-body text-base leading-relaxed text-[#2c241b] mt-3">
            Pembagian tumpukan dan pertanyaan Ya/Tidak yang ia lakukan setelahnya{' '}
            <strong className="text-[#722637]">bukan mekanisme identifikasi</strong>, melainkan{' '}
            <em>showmanship</em> — pura-pura agar trik terlihat lebih rumit dari sebenarnya.
          </p>
        </div>
      </Article>

      {/* ===== §6 DIAGRAM ALUR ===== */}
      <Article num="VI" title="Diagram Alur Lengkap">
        <FlowchartDiagram />
        <p className="font-body italic text-xs text-[#6e5f4c] mt-4 text-center">
          Bilah-bilah di atas mewakili alur peristiwa. Yang berwarna <em>burgundy</em> adalah
          mekanisme identifikasi sebenarnya; yang berwarna <em>kelabu</em> adalah langkah teatrikal
          opsional.
        </p>
      </Article>

      {/* ===== §7 KESIMPULAN ===== */}
      <Article num="VII" title="Kesimpulan">
        <p className="font-body text-base leading-relaxed text-[#2c241b] mb-4">
          Tiga poin matematis yang harus kamu ingat:
        </p>
        <ol className="list-decimal list-inside font-body text-base leading-relaxed text-[#2c241b] mb-4 space-y-3 ml-2">
          <li>
            <strong className="text-[#722637]">Trik sebenarnya adalah operasi himpunan, bukan
            algoritma rumit.</strong> Rumusnya cuma satu baris:{' '}
            <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />.
          </li>
          <li>
            <strong className="text-[#722637]">Pembagian tumpukan dan pertanyaan Ya/Tidak adalah
            "show" bukan "substance".</strong> Temanmu mengaku sendiri: <em>"tanpa gua bagi2 in
            gua juga bisa langsung tau kartu lu"</em> — pernyataan ini benar secara matematis.
          </li>
          <li>
            <strong className="text-[#722637]">Sistem deterministik 100%.</strong> Tidak ada
            keberuntungan. Selama <Math tex="\mathcal{D}" /> diketahui dan{' '}
            <Math tex="\mathcal{R}" /> terobservasi, <Math tex="c^*" /> pasti teridentifikasi.
            Itu sebabnya trik ini disebut <em>Sistem Deterministik</em> dalam matematika.
          </li>
        </ol>
        <p className="font-body text-base leading-relaxed text-[#2c241b]">
          Jadi, saat temanmu membagi-bagi kartu dan bertanya Ya/Tidak sampai sisa 3, sebenarnya
          ia hanya <strong className="text-[#722637]">membeli waktu</strong> supaya trik terlihat
          seperti sulap. Kartumu sudah ia ketahui sejak detik pertama ia menerima sisa deck
          darimu.
        </p>

        <div className="mt-8 pt-6 border-t-2 border-[#1a1410] text-center">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="font-display italic text-base text-[#722637] mt-2">
            Itulah seluruh rahasianya.
          </p>
        </div>
      </Article>
    </motion.article>
  )
}

// ===== Article wrapper =====
function Article({
  num,
  title,
  children,
}: {
  num: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight mb-1">
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest block mb-1">
          Artikel {num}
        </span>
        {title}
      </h2>
      <div className="border-b-2 border-[#1a1410] mb-6"></div>
      {children}
    </section>
  )
}

// ===== Ornament =====
function Ornament() {
  return (
    <div className="ornament-suits select-none my-6" aria-hidden>
      <span>♥</span>
      <span>♦</span>
      <span>♣</span>
      <span>♠</span>
    </div>
  )
}

// ===== Flowchart =====
function FlowchartDiagram() {
  const steps = [
    { label: 'Kamu kocok 52 kartu (acak)', highlight: false },
    { label: 'Kasih deck ke teman', highlight: false },
    { label: 'Kamu pilih 1 kartu = c*', highlight: false },
    { label: 'Simpan c*, kasih sisa ke teman', highlight: false },
    { label: 'Teman punya R = D \\ {c*}', highlight: true },
    { label: 'Teman hitung D \\ R = {c*}', highlight: true },
    { label: 'Teman tahu: c* = 2♥', highlight: true, bold: true },
  ]

  return (
    <div className="my-6 space-y-1 max-w-md mx-auto">
      {steps.map((step, i) => (
        <div key={i}>
          <div
            className={`px-4 py-2.5 border-2 text-center font-body text-sm
              ${step.highlight
                ? 'bg-[#f5ecd5] border-[#722637] text-[#722637]'
                : 'bg-transparent border-[#1a1410] text-[#1a1410]'}
              ${step.bold ? 'font-display font-black text-base' : ''}
            `}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center my-1">
              <span className="text-[#6e5f4c] font-mono">↓</span>
            </div>
          )}
        </div>
      ))}

      <div className="mt-8 pt-4 border-t border-dashed border-[#d4c4a3]">
        <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-2 text-center">
          § Cabang Opsional — Showmanship
        </div>
        <div className="border-2 border-dashed border-[#6e5f4c] p-3 text-center text-[#6e5f4c] font-body text-sm italic">
          [Opsional] Pembagian tumpukan, tanya Ya/Tidak — dibuat-buat
          agar sulap tidak selesai dalam 1 detik.
        </div>
        <div className="flex justify-center my-1">
          <span className="text-[#6e5f4c] font-mono">↓</span>
        </div>
        <p className="text-center font-body text-xs text-[#6e5f4c] italic">
          tetap berakhir di kesimpulan yang sama
        </p>
      </div>
    </div>
  )
}
