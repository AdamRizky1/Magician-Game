'use client'

import { motion } from 'framer-motion'
import { Math, FormulaBox, TahapBox, InsightBox, DefBox, V } from './MathBlocks'

/**
 * Penjelasan matematis lengkap — Swiss brutalist style.
 * NO chat quotes. NO reference to "temanmu mengaku". Pure math.
 */
export function MathExplanation() {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="font-body text-[#0a0a0a]"
    >
      {/* ===== HEADER ===== */}
      <header className="mb-10">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          MATEMATIKA · TRIK SULAP KARTU
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl leading-[1.05] mb-4 max-w-3xl">
          Bagaimana sebuah deck acak menghasilkan identifikasi pasti.
        </h2>
        <p className="font-body text-base leading-relaxed text-[#404040] max-w-2xl">
          Dua mekanisme matematis: <strong>(1) Selisih Himpunan</strong>, operasi langsung
          <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />. <strong>(2) Konvergensi
          Algoritmik</strong>, pembagian tumpukan berulang yang konvergen ke himpunan berisi{' '}
          <Math tex="c^*" />. Keduanya deterministik. Tidak ada keberuntungan.
        </p>
      </header>

      {/* ===== §1 SKENARIO ===== */}
      <Article num="01" title="Skenario">
        <p className="font-body text-base leading-relaxed text-[#404040] mb-6">
          Alur peristiwa yang dialami pengguna, tahap demi tahap.
        </p>
        <div className="space-y-1">
          <TahapBox num={1} title="Pengocokan deck">
            Deck poker standar 52 kartu dikocok secara acak. Pengocokan adalah permutasi acak
            seragam <Math tex="\sigma \sim \text{Uniform}(\mathfrak{S}_{52})" />. Tidak ada
            pola, tidak ada konspirasi.
          </TahapBox>
          <TahapBox num={2} title="Penyerahan">
            Seluruh deck diserahkan ke sistem. Sistem memegang deck lengkap.
          </TahapBox>
          <TahapBox num={3} title="Pemilihan kartu">
            Pengguna mengambil satu kartu <Math tex="c^* \in \mathcal{D}" /> secara rahasia.
            Sistem tidak mengamati pilihan ini. Information asymmetry terbentuk.
          </TahapBox>
          <TahapBox num={4} title="Pengocokan ulang">
            Sisa deck dikocok lagi. Tetap acak seragam.
          </TahapBox>
          <TahapBox num={5} title="Pemisahan ke tumpukan">
            Sistem membagi sisa deck menjadi beberapa tumpukan (umumnya 3).
          </TahapBox>
          <TahapBox num={6} title="Pertanyaan Ya/Tidak">
            Untuk setiap tumpukan, sistem bertanya apakah <Math tex="c^*" /> ada di dalamnya.
            Pengguna menjawab jujur.
          </TahapBox>
          <TahapBox num={7} title="Konvergensi ke 3 kartu">
            Setelah beberapa ronde pembagian, tersisa 3 kartu. Kartu yang dipilih pengguna
            pasti ada di antara 3 itu.
          </TahapBox>
        </div>
      </Article>

      {/* ===== §2 NOTASI ===== */}
      <Article num="02" title="Notasi">
        <p className="font-body text-base leading-relaxed text-[#404040] mb-4">
          Notasi yang dipakai sepanjang dokumen.
        </p>

        <DefBox label="DEF 2.1" title="Deck Standar">
          <p className="mb-2">Deck poker standar adalah himpunan</p>
          <Math block tex="\mathcal{D} = \{ c_1, c_2, c_3, \ldots, c_{52} \}, \quad |\mathcal{D}| = 52" />
          <p className="mt-2">
            13 rank <V>A, 2, ..., K</V> × 4 suit <V>♥, ♦, ♣, ♠</V>.
          </p>
        </DefBox>

        <DefBox label="DEF 2.2" title="Kartu Pilihan">
          <p>
            <Math tex="c^* \in \mathcal{D}" />. Pada contoh ini,{' '}
            <Math tex="c^* = 2\heartsuit" />.
          </p>
        </DefBox>

        <DefBox label="DEF 2.3" title="Sisa Deck">
          <p className="mb-2">Setelah <Math tex="c^*" /> diambil, sistem memegang:</p>
          <Math block tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}, \quad |\mathcal{R}| = 51" />
        </DefBox>

        <DefBox label="DEF 2.4" title="Selisih Himpunan">
          <p className="mb-2">Operasi <Math tex="\setminus" /> didefinisikan:</p>
          <Math block tex="A \setminus B = \{ x \in A \mid x \notin B \}" />
        </DefBox>
      </Article>

      {/* ===== §3 METODE 1 ===== */}
      <Article num="03" title="Metode 1: Selisih Himpunan">
        <h3 className="font-display font-bold text-lg mb-3">3.1 Rumus Inti</h3>
        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Karena <Math tex="\mathcal{D}" /> adalah himpunan acuan yang tetap dan{' '}
          <Math tex="\mathcal{R}" /> dapat diobservasi sepenuhnya, maka:
        </p>

        <FormulaBox title="RUMUS UTAMA">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
        </FormulaBox>

        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Karena <Math tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}" />, maka:
        </p>
        <Math block tex="\mathcal{D} \setminus \mathcal{R} = \mathcal{D} \setminus \bigl(\mathcal{D} \setminus \{c^*\}\bigr) = \{c^*\}" />

        <p className="font-body text-base leading-relaxed text-[#404040] mt-4 mb-3">
          Himpunan hasil berisi tepat satu elemen. Secara kardinalitas:
        </p>
        <Math block tex="|\mathcal{D} \setminus \mathcal{R}| = |\mathcal{D}| - |\mathcal{D} \cap \mathcal{R}| = 52 - 51 = 1" />

        <p className="font-body text-base leading-relaxed text-[#404040] mt-4">
          Satu-satunya elemen di <Math tex="\mathcal{D}" /> yang tidak ada di{' '}
          <Math tex="\mathcal{R}" /> adalah <Math tex="c^*" />.
        </p>

        <h3 className="font-display font-bold text-lg mt-8 mb-3">
          3.2 Kenapa 100% Deterministik
        </h3>
        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Operasi selisih himpunan bersifat deterministik: input sama menghasilkan output sama.
          Tidak ada probabilitas, tidak ada ruang gagal. Selama:
        </p>
        <ul className="font-body text-base leading-relaxed text-[#404040] mb-3 space-y-1 pl-4">
          <li><Math tex="\mathcal{D}" /> diketahui (deck standar selalu sama),</li>
          <li><Math tex="\mathcal{R}" /> terobservasi (sistem pegang 51 kartu),</li>
        </ul>
        <p className="font-body text-base leading-relaxed text-[#404040]">
          maka <Math tex="c^*" /> teridentifikasi secara pasti.
        </p>

        <InsightBox title="CATATAN">
          Pembagian tumpukan dan pertanyaan Ya/Tidak bukan mekanisme identifikasi. Trik
          sebenarnya adalah operasi <Math tex="\mathcal{D} \setminus \mathcal{R}" /> yang
          bisa dilakukan dalam satu langkah. Pembagian hanyalah teatrikal.
        </InsightBox>

        <h3 className="font-display font-bold text-lg mt-8 mb-3">
          3.3 Algoritma Operasional
        </h3>
        <ol className="font-body text-base leading-relaxed text-[#404040] mb-3 space-y-2 pl-4">
          <li>
            <strong>Inisialisasi.</strong> Buat checklist semua 52 kartu standar.
          </li>
          <li>
            <strong>Iterasi.</strong> Untuk setiap <Math tex="c \in \mathcal{R}" />, tandai
            sebagai ada.
          </li>
          <li>
            <strong>Identifikasi.</strong> Satu-satunya kartu di <Math tex="\mathcal{D}" />{' '}
            yang tidak tertandai adalah <Math tex="c^*" />.
          </li>
        </ol>
        <p className="font-body text-base leading-relaxed text-[#404040]">
          Kompleksitas waktu: <Math tex="\mathcal{O}(|\mathcal{D}|) = \mathcal{O}(52)" />.
        </p>
      </Article>

      {/* ===== §4 METODE 2 ===== */}
      <Article num="04" title="Metode 2: Konvergensi Algoritmik">
        <p className="font-body text-base leading-relaxed text-[#404040]">
          Versi teatrikal dengan pembagian tumpukan. Lebih spektakuler, matematis lebih rumit
          dari yang dibutuhkan.
        </p>

        <h3 className="font-display font-bold text-lg mt-6 mb-3">4.1 Pemetaan Linear</h3>
        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Setiap ronde pembagian-jadi-<Math tex="k" />-tumpukan-dan-penggabungan mengubah
          posisi kartu mengikuti fungsi linear modulo:
        </p>

        <DefBox label="DEF 4.1" title="Fungsi Pemetaan Posisi">
          <p className="mb-2">
            Posisi <Math tex="x" /> pada deck <Math tex="N" /> kartu, setelah satu ronde:
          </p>
          <Math block tex="x' = (a \cdot x + b) \pmod{N}" />
          <ul className="text-sm mt-2 space-y-1 pl-4 text-[#404040]">
            <li><Math tex="a" />: konstanta perkalian (dari banyaknya tumpukan <Math tex="k" />)</li>
            <li><Math tex="b" />: konstanta pergeseran (dari urutan penumpukan)</li>
            <li><Math tex="N" />: total kartu saat itu</li>
          </ul>
        </DefBox>

        <DefBox label="TEO 4.1" title="Iterasi Fungsi Linear pada Himpunan Terbatas">
          <p>
            Untuk <Math tex="f: \mathbb{Z}_N \to \mathbb{Z}_N" />,{' '}
            <Math tex="f(x) = (ax + b) \pmod{N}" />, jika{' '}
            <Math tex="\gcd(a, N) = 1" />, maka <Math tex="f" /> bijeksi. Iterasi{' '}
            <Math tex="f" /> berulang membentuk orbit yang konvergen tergantung struktur grup{' '}
            <Math tex="\mathbb{Z}_N" />.
          </p>
        </DefBox>

        <h3 className="font-display font-bold text-lg mt-6 mb-3">4.2 Kasus 27-Kartu</h3>
        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Trik klasik menggunakan <Math tex="N = 27" />. Karena{' '}
          <Math tex="27 = 3^3" />, setelah tepat 3 ronde, posisi kartu konvergen ke indeks
          tertentu yang dapat diprediksi.
        </p>

        <FormulaBox title="PEMETAAN 27-KARTU">
          <p className="font-body text-sm text-[#404040] mb-3">
            Setelah <Math tex="r" /> ronde, posisi <Math tex="c^*" />:
          </p>
          <Math block tex="x_r \in \left[ \tfrac{N}{3}(t_r - 1) + 1, \;\; \tfrac{N}{3}\, t_r \right] \pmod{N}" />
          <p className="font-body text-sm text-[#737373] mt-3">
            <Math tex="t_r \in \{1, 2, 3\}" />: tumpukan terpilih di ronde <Math tex="r" />.
          </p>
        </FormulaBox>

        <p className="font-body text-base leading-relaxed text-[#404040]">
          Ronde 1: posisi di blok tengah (10–18). Ronde 2: sub-blok tengah (13–15). Ronde 3:
          tepat di indeks 14.
        </p>

        <InsightBox title="VERIFIKASI KONVERGENSI">
          <Math tex="27 = 3^3" /> memberikan 3 iterasi pemetaan linear. Setiap iterasi membagi
          3 blok. Setelah 3 iterasi, hanya 1 posisi selamat di tengah, yaitu{' '}
          <Math tex="c^*" />. Inilah dasar determinismenya.
        </InsightBox>

        <h3 className="font-display font-bold text-lg mt-6 mb-3">4.3 Adaptasi ke 3 Kartu</h3>
        <p className="font-body text-base leading-relaxed text-[#404040] mb-3">
          Versi ini berakhir di 3 kartu (bukan 1), menggunakan 2 ronde:
        </p>
        <ol className="font-body text-base leading-relaxed text-[#404040] mb-3 space-y-2 pl-4">
          <li>
            <Math tex="N_0 = 27" />. Bagi ke 3 tumpukan @ 9. Jawab Ya untuk tumpukan yang
            berisi <Math tex="c^*" />. Hasil: <Math tex="N_1 = 9" />.
          </li>
          <li>
            Bagi <Math tex="N_1 = 9" /> ke 3 tumpukan @ 3. Jawab Ya. Hasil:{' '}
            <Math tex="N_2 = 3" />.
          </li>
        </ol>

        <FormulaBox title="KONVERGENSI EKSPONENSIAL">
          <Math block tex="N_r = \frac{N_0}{3^r} = \frac{27}{3^r}" />
          <Math block tex="\Longrightarrow \quad N_0 = 27, \; N_1 = 9, \; N_2 = 3" />
        </FormulaBox>

        <h3 className="font-display font-bold text-lg mt-6 mb-3">4.4 Pemilihan 27 dari 52</h3>
        <p className="font-body text-base leading-relaxed text-[#404040]">
          Karena deck asli punya 52 kartu, sistem menyisihkan 27 kartu yang termasuk{' '}
          <Math tex="c^*" />. Pengambilan ini bukan trik; <Math tex="c^*" /> sudah
          teridentifikasi via Metode 1, lalu ditambahkan 26 kartu acak dari 51 sisanya.
        </p>

        <InsightBox title="IRONI MATEMATIS">
          Sistem sebenarnya sudah tahu <Math tex="c^*" /> sejak awal (lewat Metode 1). Trik
          pembagian tumpukan hanyalah teatrikal. Tujuannya: agar prosedur tidak selesai
          dalam 1 detik.
        </InsightBox>
      </Article>

      {/* ===== §5 JAWABAN ===== */}
      <Article num="05" title="Jawaban Langsung">
        <p className="font-body text-base leading-relaxed text-[#404040] mb-4">
          Berdasarkan analisis di atas, jawaban matematis:
        </p>

        <div className="my-6 p-6 bg-[#0a0a0a] text-[#fafaf7]">
          <div className="font-mono text-[10px] tracking-widest text-[#c41e3a] mb-3">
            JAWABAN FINAL
          </div>
          <p className="font-body text-base leading-relaxed text-[#fafaf7] mb-3">
            Kartu pengguna <V>2♥</V> diidentifikasi via operasi selisih himpunan:
          </p>
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="font-body text-base leading-relaxed text-[#fafaf7] mt-3">
            <Math tex="\mathcal{D}" /> adalah deck standar 52 kartu,{' '}
            <Math tex="\mathcal{R}" /> adalah 51 kartu yang dipegang sistem. Satu-satunya
            kartu standar yang tidak ada di <Math tex="\mathcal{R}" /> adalah{' '}
            <V>2♥</V>.
          </p>
          <p className="font-body text-base leading-relaxed text-[#fafaf7] mt-3">
            Pembagian tumpukan dan pertanyaan Ya/Tidak bukan mekanisme identifikasi, melainkan
            teatrikal.
          </p>
        </div>
      </Article>

      {/* ===== §6 DIAGRAM ===== */}
      <Article num="06" title="Diagram Alur">
        <FlowchartDiagram />
      </Article>

      {/* ===== §7 KESIMPULAN ===== */}
      <Article num="07" title="Kesimpulan">
        <p className="font-body text-base leading-relaxed text-[#404040] mb-4">
          Tiga poin matematis:
        </p>
        <ol className="font-body text-base leading-relaxed text-[#404040] mb-4 space-y-3 pl-4">
          <li>
            <strong>Operasi himpunan, bukan algoritma rumit.</strong> Rumusnya satu baris:{' '}
            <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />.
          </li>
          <li>
            <strong>Pembagian tumpukan adalah show, bukan substance.</strong> Identifikasi
            bisa dilakukan tanpa pembagian apapun.
          </li>
          <li>
            <strong>Sistem deterministik 100%.</strong> Tidak ada keberuntungan. Selama{' '}
            <Math tex="\mathcal{D}" /> diketahui dan <Math tex="\mathcal{R}" /> terobservasi,
            <Math tex="c^*" /> pasti teridentifikasi.
          </li>
        </ol>
        <p className="font-body text-base leading-relaxed text-[#404040]">
          Saat sistem membagi-bagi kartu dan bertanya Ya/Tidak sampai sisa 3, sebenarnya ia
          hanya membeli waktu. Kartu pengguna sudah teridentifikasi sejak detik pertama sisa
          deck diterima.
        </p>

        <div className="mt-10 pt-6 border-t border-[#0a0a0a]">
          <Math block tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          <p className="font-body italic text-base text-[#c41e3a] mt-2">
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
    <section className="mb-14">
      <div className="grid grid-cols-[60px_1fr] gap-3 mb-6 pb-3 border-b border-[#0a0a0a]">
        <div className="font-mono text-2xl font-bold text-[#c41e3a]">{num}</div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0a0a0a] leading-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

// ===== Flowchart =====
function FlowchartDiagram() {
  const steps = [
    { label: 'Kocok 52 kartu (acak seragam)', highlight: false },
    { label: 'Deck diserahkan ke sistem', highlight: false },
    { label: 'Pengguna pilih 1 kartu = c*', highlight: false },
    { label: 'Sisa diserahkan, sistem pegang R', highlight: false },
    { label: 'Sistem hitung D \\ R = {c*}', highlight: true },
    { label: 'Hasil: c* = 2♥', highlight: true, bold: true },
  ]

  return (
    <div className="my-6">
      {steps.map((step, i) => (
        <div key={i} className="grid grid-cols-[40px_1fr] gap-3 items-center">
          <div className="font-mono text-xs text-[#737373] text-right">
            {String(i + 1).padStart(2, '0')}
          </div>
          <div
            className={`py-2 px-3 font-body text-sm ${
              step.highlight
                ? step.bold
                  ? 'bg-[#0a0a0a] text-[#fafaf7] font-bold text-base'
                  : 'bg-[#fafaf7] text-[#c41e3a] font-bold border-l-2 border-[#c41e3a]'
                : 'text-[#0a0a0a] border-l border-[#e5e5e5]'
            }`}
          >
            {step.label}
          </div>
        </div>
      ))}

      <div className="mt-8 pt-4 border-t border-dashed border-[#e5e5e5]">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          OPSIONAL · TEATRIKAL
        </div>
        <p className="font-body text-sm text-[#737373] italic pl-12">
          Pembagian tumpukan, pertanyaan Ya/Tidak. Dibuat-buat agar prosedur tidak selesai
          dalam 1 detik. Tidak mengubah hasil.
        </p>
      </div>
    </div>
  )
}
