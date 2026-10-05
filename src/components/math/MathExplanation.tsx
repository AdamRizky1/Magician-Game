'use client'

import { motion } from 'framer-motion'
import { Math, FormulaBox, TahapBox, InsightBox, DefBox, V } from './MathBlocks'
import { Sparkles, Brain, Wand2, ArrowDown, Layers, GitCompare, CheckCircle2 } from 'lucide-react'

/**
 * Komponen utama penjelasan matematis lengkap.
 * Mirror isi PDF card-trick-math.pdf, tapi di-render sebagai HTML interaktif.
 */
export function MathExplanation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      {/* ===== ABSTRACT ===== */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-xl p-5">
        <h2 className="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5" /> Ringkasan
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Dokumen ini membongkar secara matematis bagaimana temanmu dapat mengetahui dengan pasti
          kartu yang kamu pilih (misalnya <V>2♥</V>) dari deck poker standar berisi 52 kartu,
          meskipun kamu mengocoknya secara acak. Penjelasan dibagi dalam dua mekanisme matematis
          yang berbeda: <strong className="text-amber-300">(1) Metode Selisih Himpunan</strong> yang
          merupakan cara langsung dan paling sederhana — temanmu cukup memeriksa 51 kartu yang ia
          pegang dan menemukan kartu mana dari deck standar yang tidak ada; dan{' '}
          <strong className="text-amber-300">(2) Metode Konvergensi Algoritmik</strong> via
          pembagian tumpukan berulang yang merupakan trik sulap klasik{' '}
          <em>27-Card Trick</em>. Kedua metode bersifat <strong className="text-emerald-300">
          deterministik</strong> — tidak ada unsur keberuntungan, hanya pemetaan matematis pada
          himpunan terbatas.
        </p>
      </section>

      {/* ===== SECTION 1: SKENARIO ===== */}
      <Section
        num={1}
        title="Skenario Lengkap: dari Kocok sampai Teman Tahu Kartumu"
        icon={<Wand2 className="w-5 h-5" />}
      >
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Sebelum membahas rumus, mari kita pahami persis alur peristiwanya seperti yang kamu
          alami. Skenario ini penting karena setiap langkah punya peran matematis yang berbeda:
        </p>
        <div className="space-y-2">
          <TahapBox num={1} title="Kamu mengocok 52 kartu">
            Kamu memegang sebuah deck poker standar berisi 52 kartu yang sudah campur aduk.
            Pengocokan ini murni acak — tidak ada urutan tertentu, tidak ada pola, tidak ada
            konspirasi. Dalam istilah probabilitas, ini adalah <em>uniform random permutation</em>{' '}
            dari 52 kartu.
          </TahapBox>
          <TahapBox num={2} title="Kamu menyerahkan deck ke teman">
            Setelah selesai mengocok, kamu memberikan seluruh tumpukan ke temanmu. Pada titik ini,
            temanmu memegang deck lengkap 52 kartu.
          </TahapBox>
          <TahapBox num={3} title="Kamu disuruh memilih satu kartu secara acak">
            Temanmu menyodorkan deck (yang masih dalam keadaan tertutup) dan menyuruh kamu
            mengambil satu kartu. Kamu tidak tahu apa yang kamu ambil — mungkin 2♥, mungkin K♠,
            mungkin apa saja. Kamu mengambil satu, melihatnya sendiri (misalnya 2♥), lalu
            menyimpannya. Kamu tidak menunjukkan ke temanmu.
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
            kamu ada di tumpukan ini?"</em> Kamu menjawab <em>"Ya"</em> atau <em>"Tidak"</em> dengan
            jujur.
          </TahapBox>
          <TahapBox num={7} title="Berlanjut sampai tersisa 3 kartu">
            Temanmu mengulang proses bagi-tumpukan-dan-tanya beberapa kali. Setiap kali kamu bilang{' '}
            <em>"Ya"</em>, temanmu mengambil tumpukan itu sebagai deck baru. Setelah beberapa ronde,
            tersisa 3 kartu. Dan kartu kamu PASTI ada di antara 3 itu.
          </TahapBox>
        </div>
        <p className="text-slate-300 text-sm mt-4">
          <strong>Pertanyaan kunci:</strong>{' '}
          <span className="text-amber-300 font-semibold">
            Bagaimana temanmu tahu kartumu adalah 2♥?
          </span>{' '}
          Dua jawaban matematis akan diberikan di bab berikut.
        </p>
      </Section>

      {/* ===== SECTION 2: NOTASI ===== */}
      <Section
        num={2}
        title="Notasi Matematis Dasar"
        icon={<Layers className="w-5 h-5" />}
      >
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Sebelum masuk ke rumus, mari kita tetapkan notasi yang dipakai sepanjang dokumen.
        </p>

        <DefBox label="Definisi 2.1" title="Deck Standar">
          <p className="mb-2">Deck poker standar adalah himpunan</p>
          <Math block tex="\mathcal{D} = \{ c_1, c_2, c_3, \ldots, c_{52} \}, \quad |\mathcal{D}| = 52" />
          <p className="mt-2">
            di mana setiap <Math tex="c_i" /> adalah pasangan <em>(rank, suit)</em> unik. Rank ada
            13 macam <V>A, 2, 3, ..., K</V> dan suit ada 4 macam <V>♥, ♦, ♣, ♠</V>, sehingga{' '}
            <Math tex="13 \times 4 = 52" /> kartu unik.
          </p>
        </DefBox>

        <DefBox label="Definisi 2.2" title="Kartu Pilihan User">
          <p>
            Misalkan kamu memilih satu kartu tertentu, sebut saja <Math tex="c^* \in \mathcal{D}" />.
            Dalam contoh kamu, <Math tex="c^* = 2\heartsuit" />. Nilai <Math tex="c^*" /> tidak
            diketahui temanmu di awal — ini yang harus ia temukan.
          </p>
        </DefBox>

        <DefBox label="Definisi 2.3" title="Sisa Deck yang Dimiliki Teman">
          <p className="mb-2">Setelah kamu mengambil <Math tex="c^*" /> dan menyimpannya, temanmu memegang sisa deck:</p>
          <Math block tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}, \quad |\mathcal{R}| = 51" />
          <p className="mt-2">
            Himpunan <Math tex="\mathcal{R}" /> inilah yang temanmu <em>pegang dan lihat</em>.
          </p>
        </DefBox>

        <DefBox label="Definisi 2.4" title="Operasi Selisih Himpunan">
          <p className="mb-2">Operasi selisih himpunan (set difference) <Math tex="\setminus" /> didefinisikan sebagai:</p>
          <Math block tex="A \setminus B = \{ x \in A \mid x \notin B \}" />
          <p className="mt-2">
            Secara intuitif: <em>"ambil semua elemen <Math tex="A" />, buang yang juga ada di{' '}
            <Math tex="B" />"</em>.
          </p>
        </DefBox>
      </Section>

      {/* ===== SECTION 3: METODE 1 - SELISIH HIMPUNAN ===== */}
      <Section
        num={3}
        title="Metode 1: Selisih Himpunan — Cara Asli Temanmu"
        icon={<GitCompare className="w-5 h-5" />}
      >
        <h3 className="text-base font-semibold text-amber-300 mt-4 mb-2">3.1 Ide Dasar</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Inilah kunci yang sering tidak disadari: temanmu{' '}
          <strong className="text-amber-300">tidak perlu</strong> membagi-bagi tumpukan untuk tahu
          kartumu. Dari obrolan WhatsApp yang kamu lampirkan, temanmu sendiri mengaku:
        </p>

        <blockquote className="border-l-4 border-amber-500/50 bg-amber-950/20 pl-4 pr-3 py-3 my-4 italic text-slate-300 text-sm space-y-1">
          <p>"tanpa gua bagi2 in gua juga bisa langsung tau kartu lu"</p>
          <p>"langsung gua bagi semua (kecuali kartu lu) misalnya, itu juga bisa"</p>
          <p>"cuma kan bagi2 itu buat some kind of playing aja biar gak langsung selesai sulapnya"</p>
        </blockquote>

        <p className="text-slate-300 text-sm leading-relaxed">
          Pernyataan ini <strong className="text-emerald-300">sangat jujur secara matematis</strong>.
          Temanmu tidak berbohong. Trik sebenarnya sangat sederhana:{' '}
          <strong className="text-amber-300">dia tahu kartumu dengan menghitung selisih antara deck
          standar dengan sisa kartu yang ia pegang</strong>.
        </p>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">3.2 Rumus Inti</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Karena <Math tex="\mathcal{D}" /> (deck standar 52 kartu) adalah himpunan yang sudah
          dikenal dan tetap, dan <Math tex="\mathcal{R}" /> (sisa 51 kartu di tangan temanmu) bisa
          diperiksa satu per satu, maka:
        </p>

        <FormulaBox title="Rumus Selisih Himpunan">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
        </FormulaBox>

        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Karena <Math tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}" />, maka:
        </p>
        <Math block tex="\mathcal{D} \setminus \mathcal{R} = \mathcal{D} \setminus \bigl(\mathcal{D} \setminus \{c^*\}\bigr) = \{c^*\}" />

        <p className="text-slate-300 text-sm leading-relaxed mt-3">
          Himpunan hasilnya berisi <em>tepat satu elemen</em>, yaitu <Math tex="c^*" />. Karena{' '}
          <Math tex="|\mathcal{D}| = 52" />, <Math tex="|\mathcal{R}| = 51" />, dan keduanya berbagi
          51 elemen yang sama, maka:
        </p>
        <Math block tex="|\mathcal{D} \setminus \mathcal{R}| = |\mathcal{D}| - |\mathcal{D} \cap \mathcal{R}| = 52 - 51 = 1" />

        <p className="text-slate-300 text-sm leading-relaxed">
          Satu-satunya elemen di <Math tex="\mathcal{D}" /> yang tidak ada di{' '}
          <Math tex="\mathcal{R}" /> adalah <Math tex="c^*" />.{' '}
          <strong className="text-amber-300">Itulah kartumu.</strong>
        </p>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">
          3.3 Kenapa ini 100% Berhasil tanpa Keberuntungan?
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Operasi selisih himpunan adalah operasi <em>deterministik</em>: untuk input yang sama,
          output selalu sama. Tidak ada probabilitas, tidak ada ruang untuk "gagal". Selama:
        </p>
        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 mb-3">
          <li><Math tex="\mathcal{D}" /> adalah himpunan acuan yang diketahui (karena deck poker standar selalu sama 52 kartu),</li>
          <li><Math tex="\mathcal{R}" /> dapat diobservasi sepenuhnya (karena temanmu memegang semua 51 kartu sisanya),</li>
        </ul>
        <p className="text-slate-300 text-sm leading-relaxed">
          maka <Math tex="c^*" /> teridentifikasi <strong className="text-emerald-300">secara
          pasti</strong>.
        </p>

        <InsightBox>
          <p>
            "Trik sulap" yang sebenarnya bukanlah pembagian tumpukan — itu hanya{' '}
            <em>showmanship</em> (pura-pura). Trik sebenarnya adalah{' '}
            <strong className="text-amber-300">
              operasi <Math tex="\mathcal{D} \setminus \mathcal{R}" /> di kepala temanmu
            </strong>. Temanmu bisa langsung tahu kartumu dalam 1 detik tanpa pembagian apapun,
            hanya dengan memeriksa 51 kartu yang ia pegang.
          </p>
        </InsightBox>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">3.4 Algoritma Operasional</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Dalam praktiknya, algoritma temanmu adalah:
        </p>
        <ol className="list-decimal list-inside text-slate-300 text-sm space-y-2 mb-3">
          <li>
            <strong>Inisialisasi:</strong> buat checklist mental semua 52 kartu standar (atau pakai
            kartu fisik sebagai referensi).
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
        <p className="text-slate-300 text-sm leading-relaxed">
          Kompleksitas waktu: <Math tex="\mathcal{O}(|\mathcal{D}|) = \mathcal{O}(52)" />, konstan.
          Tidak ada kerja komputasi yang berarti.
        </p>
      </Section>

      {/* ===== SECTION 4: METODE 2 - KONVERGENSI ===== */}
      <Section
        num={4}
        title="Metode 2: Konvergensi via Pembagian Tumpukan (Cara Sulap)"
        icon={<Layers className="w-5 h-5" />}
      >
        <p className="text-slate-300 text-sm leading-relaxed">
          Sekarang mari kita bahas <em>versi showmanship</em>-nya, yang melibatkan pembagian
          tumpukan dan pertanyaan Ya/Tidak. Ini lebih spektakuler tapi secara matematis lebih rumit
          dari yang dibutuhkan.
        </p>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">
          4.1 Pemetaan Linear pada Indeks Kartu
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Setiap kali temanmu membagi deck menjadi <Math tex="k" /> tumpukan dan menyatukan kembali
          dengan pola tertentu, posisi setiap kartu di dalam deck berubah mengikuti{' '}
          <em>fungsi linear modulo</em>.
        </p>

        <DefBox label="Definisi 4.1" title="Fungsi Pemetaan Posisi">
          <p className="mb-2">
            Misalkan kartu berada di posisi <Math tex="x" /> pada deck berisi <Math tex="N" /> kartu.
            Setelah satu ronde pembagian-jadi-<Math tex="k" />-tumpukan-dan-penggabungan, posisi
            baru <Math tex="x'" /> mengikuti:
          </p>
          <Math block tex="x' = (a \cdot x + b) \pmod{N}" />
          <p className="mt-2">di mana:</p>
          <ul className="list-disc list-inside text-slate-400 text-sm mt-2 space-y-1">
            <li><Math tex="a" /> = konstanta perkalian yang ditentukan oleh banyaknya tumpukan <Math tex="k" />,</li>
            <li><Math tex="b" /> = konstanta pergeseran yang ditentukan oleh urutan penumpukan kembali,</li>
            <li><Math tex="N" /> = total kartu saat itu.</li>
          </ul>
        </DefBox>

        <DefBox label="Teorema 4.1" title="Iterasi Fungsi Linear pada Himpunan Terbatas">
          <p className="mb-2">
            Untuk sembarang fungsi <Math tex="f: \mathbb{Z}_N \to \mathbb{Z}_N" /> yang berbentuk{' '}
            <Math tex="f(x) = (ax + b) \pmod{N}" />, jika <Math tex="\gcd(a, N) = 1" />, maka{' '}
            <Math tex="f" /> adalah bijeksi. Iterasi <Math tex="f" /> yang berulang akan membentuk
            orbit yang konvergen (menuju titik tetap atau siklus) tergantung pada struktur grup{' '}
            <Math tex="\mathbb{Z}_N" />.
          </p>
        </DefBox>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">
          4.2 Kasus Khusus: Trik 27-Kartu
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Trik sulap klasik menggunakan <Math tex="N = 27" /> kartu yang dibagi menjadi{' '}
          <Math tex="k = 3" /> tumpukan di setiap ronde. Karena <Math tex="27 = 3^3" />, setelah
          tepat 3 ronde pemetaan linear, posisi kartu konvergen ke indeks tertentu yang dapat
          diprediksi.
        </p>

        <FormulaBox title="Pemetaan pada Trik 27-Kartu">
          <p className="text-slate-300 text-sm mb-3">
            Setelah <Math tex="r" /> ronde pembagian ke 3 tumpukan dengan penggabungan di mana
            tumpukan terpilih selalu ditempatkan di tengah, posisi kartu <Math tex="c^*" /> dalam
            deck adalah:
          </p>
          <Math block tex="x_r \in \left[ \tfrac{N}{3}(t_r - 1) + 1, \;\; \tfrac{N}{3}\, t_r \right] \pmod{N}" />
          <p className="text-slate-400 text-sm mt-3">
            di mana <Math tex="t_r \in \{1, 2, 3\}" /> adalah tumpukan yang dipilih di ronde{' '}
            <Math tex="r" />.
          </p>
        </FormulaBox>

        <p className="text-slate-300 text-sm leading-relaxed">
          Setelah ronde 1: posisi <Math tex="c^*" /> berada di blok tengah (indeks 10–18).<br />
          Setelah ronde 2: posisi <Math tex="c^*" /> berada di sub-blok tengah (indeks 13–15).<br />
          Setelah ronde 3: posisi <Math tex="c^*" /> tepat di indeks 14 (titik tengah deck).
        </p>

        <InsightBox title="Verifikasi Konvergensi">
          <p>
            Karena <Math tex="27 = 3^3" />, ada 3 iterasi pemetaan linear. Tiap iterasi membagi 3
            blok. Setelah 3 iterasi, hanya ada 1 posisi yang selamat di tengah, yaitu{' '}
            <Math tex="c^*" />. Inilah kenapa trik ini disebut <em>deterministik</em> — tidak ada
            probabilitas, posisi akhir ditentukan oleh struktur matematis.
          </p>
        </InsightBox>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">
          4.3 Adaptasi untuk Berakhir di 3 Kartu
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          Versi yang kamu alami berakhir di 3 kartu (bukan 1). Untuk ini, gunakan 2 ronde alih-alih 3:
        </p>
        <ol className="list-decimal list-inside text-slate-300 text-sm space-y-2 mb-3">
          <li>
            Mulai dengan <Math tex="N_0 = 27" /> kartu (termasuk <Math tex="c^*" />). Bagi ke 3
            tumpukan @ 9 kartu. Tanya <em>"Apakah <Math tex="c^*" /> di tumpukan <Math tex="i" />?"</em>.
            Saat user bilang Ya, <Math tex="N_1 = 9" /> kartu (tumpukan terpilih).
          </li>
          <li>
            Bagi <Math tex="N_1 = 9" /> kartu ke 3 tumpukan @ 3 kartu. Tanya lagi. Saat user bilang
            Ya, <Math tex="N_2 = 3" /> kartu.
          </li>
        </ol>

        <FormulaBox title="Konvergensi Eksponensial">
          <Math block tex="N_r = \frac{N_0}{3^r} = \frac{27}{3^r}" />
          <Math block tex="\Longrightarrow \quad N_0 = 27, \; N_1 = 9, \; N_2 = 3" />
          <p className="text-slate-300 text-sm mt-3">
            Setelah <Math tex="r = 2" /> ronde, tersisa tepat 3 kartu yang{' '}
            <strong className="text-amber-300">pasti memuat</strong> <Math tex="c^*" />.
          </p>
        </FormulaBox>

        <h3 className="text-base font-semibold text-amber-300 mt-6 mb-2">
          4.4 Pemilihan 27 dari 52
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Karena deck asli punya 52 kartu (bukan 27), temanmu terlebih dahulu mengambil 27 kartu
          secara strategis dari 52 — pastikan <Math tex="c^*" /> termasuk di dalamnya — lalu
          menjalankan trik 27-kartu di atas himpunan kecil itu. Pengambilan 27 kartu ini sendiri
          bukan trik; cukup ambil <Math tex="c^*" /> (yang sudah teridentifikasi via Metode 1!) plus
          26 kartu acak dari 51 sisanya.
        </p>

        <InsightBox title="Ironi Matematis">
          <p>
            Temanmu sebenarnya sudah tahu <Math tex="c^*" /> sejak awal (lewat Metode 1). Trik
            pembagian tumpukan hanyalah <em>teatrikal</em> — dibuat-buat agar sulap tidak selesai
            dalam 1 detik. Sesuai pengakuannya: <em>"cuma kan bagi2 itu buat some kind of playing
            aja biar gak langsung selesai sulapnya"</em>.
          </p>
        </InsightBox>
      </Section>

      {/* ===== SECTION 5: JAWABAN LANGSUNG ===== */}
      <Section
        num={5}
        title="Jawaban Langsung: Bagaimana Temanmu Tahu 2♥?"
        icon={<CheckCircle2 className="w-5 h-5" />}
      >
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Berdasarkan analisis di atas, jawaban matematis terhadap pertanyaanmu adalah:
        </p>

        <div className="bg-blue-950/40 border-2 border-blue-600/60 rounded-xl p-5 my-4">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Jawaban Final
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Temanmu mengetahui kartumu adalah <V>2♥</V> dengan menerapkan operasi selisih himpunan:
          </p>
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="text-slate-300 text-sm leading-relaxed mt-3">
            di mana <Math tex="\mathcal{D}" /> adalah deck standar 52 kartu dan <Math tex="\mathcal{R}" />{' '}
            adalah 51 kartu yang ia pegang. Ia cukup memeriksa 51 kartu di tangannya dan menemukan
            bahwa satu-satunya kartu standar yang tidak ia miliki adalah <V>2♥</V>.{' '}
            <strong className="text-amber-300">Itulah kartu yang kamu ambil.</strong>
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mt-3">
            Pembagian tumpukan dan pertanyaan Ya/Tidak yang ia lakukan setelahnya{' '}
            <strong className="text-amber-300">bukan mekanisme identifikasi</strong>, melainkan{' '}
            <em>showmanship</em> — pura-pura agar trik terlihat lebih rumit dari sebenarnya.
          </p>
        </div>
      </Section>

      {/* ===== SECTION 6: DIAGRAM ALUR ===== */}
      <Section
        num={6}
        title="Diagram Alur Lengkap"
        icon={<ArrowDown className="w-5 h-5" />}
      >
        <FlowchartDiagram />
        <p className="text-slate-400 text-xs italic mt-4 text-center">
          Box biru = mekanisme asli identifikasi. Box oranye = langkah teatrikal opsional untuk
          showmanship.
        </p>
      </Section>

      {/* ===== SECTION 7: KESIMPULAN ===== */}
      <Section
        num={7}
        title="Kesimpulan"
        icon={<Sparkles className="w-5 h-5" />}
      >
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          Tiga poin matematis yang harus kamu ingat:
        </p>
        <ol className="list-decimal list-inside text-slate-300 text-sm space-y-3 mb-4">
          <li>
            <strong className="text-amber-300">Trik sebenarnya adalah operasi himpunan, bukan
            algoritma rumit.</strong> Rumusnya cuma satu baris:{' '}
            <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />.
          </li>
          <li>
            <strong className="text-amber-300">Pembagian tumpukan dan pertanyaan Ya/Tidak adalah
            "show" bukan "substance".</strong> Temanmu mengaku sendiri: <em>"tanpa gua bagi2 in
            gua juga bisa langsung tau kartu lu"</em> — pernyataan ini benar secara matematis.
          </li>
          <li>
            <strong className="text-amber-300">Sistem deterministik 100%.</strong> Tidak ada
            keberuntungan. Selama <Math tex="\mathcal{D}" /> diketahui dan <Math tex="\mathcal{R}" />{' '}
            terobservasi, <Math tex="c^*" /> pasti teridentifikasi. Itu sebabnya trik ini disebut{' '}
            <em>Sistem Deterministik</em> dalam matematika.
          </li>
        </ol>
        <p className="text-slate-300 text-sm leading-relaxed">
          Jadi, saat temanmu membagi-bagi kartu dan bertanya Ya/Tidak sampai sisa 3, sebenarnya ia
          hanya <strong className="text-amber-300">membeli waktu</strong> supaya trik terlihat
          seperti sulap. Kartumu sudah ia ketahui sejak detik pertama ia menerima sisa deck darimu.
        </p>

        <div className="mt-6 p-6 bg-gradient-to-br from-amber-950/40 to-slate-900/40 border-2 border-amber-500/40 rounded-xl text-center">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="text-slate-400 text-sm italic mt-2">
            Itulah seluruh rahasianya.
          </p>
        </div>
      </Section>
    </motion.div>
  )
}

// ===== Sub-komponen: Section wrapper =====
function Section({
  num,
  title,
  icon,
  children,
}: {
  num: number
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-1">
      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mb-3">
        <span className="text-amber-400 text-base font-mono bg-amber-950/40 px-2 py-1 rounded">
          §{num}
        </span>
        {icon && <span className="text-amber-400">{icon}</span>}
        <span>{title}</span>
      </h2>
      <div className="border-l-2 border-slate-700 pl-4 sm:pl-6 ml-3">
        {children}
      </div>
    </section>
  )
}

// ===== Sub-komponen: Flowchart Diagram (HTML/CSS) =====
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
    <div className="my-6 space-y-2 max-w-md mx-auto">
      {steps.map((step, i) => (
        <div key={i}>
          <div
            className={`
              px-4 py-2.5 rounded-lg border text-center text-sm
              ${step.highlight
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
                : 'bg-slate-800/40 border-slate-600/50 text-slate-300'}
              ${step.bold ? 'font-bold text-base ring-2 ring-amber-400/50' : ''}
            `}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center my-1">
              <ArrowDown className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </div>
      ))}

      {/* Showmanship branch */}
      <div className="mt-6 border-t border-dashed border-slate-600 pt-4">
        <div className="text-xs text-slate-500 mb-2 text-center italic">
          ↘ Cabang opsional (showmanship) ↙
        </div>
        <div className="bg-slate-700/30 border border-slate-600/40 rounded-lg p-3 text-center text-slate-400 text-sm">
          <strong className="text-slate-300">[Optional]</strong> Pembagian tumpukan, tanya Ya/Tidak
          <br />
          <span className="text-xs italic">— dibuat-buat agar sulap tidak selesai dalam 1 detik</span>
        </div>
        <div className="flex justify-center my-1">
          <ArrowDown className="w-4 h-4 text-slate-500" />
        </div>
        <div className="text-center text-xs text-slate-500">
          ↓ tetap berakhir di kesimpulan yang sama
        </div>
      </div>
    </div>
  )
}
