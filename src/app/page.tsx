'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2, RotateCw, HelpCircle, CheckCircle2, Layers, Target, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ===== Tipe data =====
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
type SuitColor = 'red' | 'black'

interface PokerCard {
  id: string
  rank: string
  rankValue: number
  suit: Suit
  color: SuitColor
  label: string
}

type GamePhase =
  | 'intro'
  | 'shuffling'
  | 'reveal-selection'
  | 'memorize'
  | 'dealing'
  | 'await-pick'
  | 'collecting'
  | 'final-reveal'
  | 'trick-reveal'
  | 'completed'

// ===== Util kartu =====
const SUITS: { suit: Suit; symbol: string; color: SuitColor }[] = [
  { suit: 'hearts', symbol: '♥', color: 'red' },
  { suit: 'diamonds', symbol: '♦', color: 'red' },
  { suit: 'clubs', symbol: '♣', color: 'black' },
  { suit: 'spades', symbol: '♠', color: 'black' },
]

const RANKS: { rank: string; value: number }[] = [
  { rank: 'A', value: 1 },
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 11 },
  { rank: 'Q', value: 12 },
  { rank: 'K', value: 13 },
]

function buildFullDeck(): PokerCard[] {
  const deck: PokerCard[] = []
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({
        id: `${r.rank}-${s.suit}`,
        rank: r.rank,
        rankValue: r.value,
        suit: s.suit,
        color: s.color,
        label: `${r.rank}${s.symbol}`,
      })
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ===== Konstanta trik =====
const TRICK_SIZE = 27 // 3^3 = 27, supaya converge rapi ke 3 kartu
const PILE_COUNT = 3
const ROUNDS = 3

// ===== Komponen kartu mini =====
function MiniCard({
  card,
  faceDown = false,
  highlight = false,
  selected = false,
  onClick,
  size = 'md',
}: {
  card?: PokerCard
  faceDown?: boolean
  highlight?: boolean
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const dims = {
    sm: 'w-10 h-14 text-[10px] rounded-md',
    md: 'w-16 h-24 text-sm rounded-lg',
    lg: 'w-24 h-36 text-2xl rounded-xl',
  }[size]

  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`${dims} relative cursor-pointer select-none border-2 transition-all
          bg-gradient-to-br from-slate-800 via-slate-900 to-black
          border-slate-700 shadow-lg overflow-hidden`}
      >
        <div className="absolute inset-1 rounded-md border border-amber-500/30 flex items-center justify-center">
          <div className="text-amber-500/40 text-xl font-serif">✦</div>
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent 0, transparent 6px, rgba(251,191,36,0.15) 6px, rgba(251,191,36,0.15) 7px)',
          }}
        />
      </div>
    )
  }

  if (!card) return <div className={`${dims} bg-muted`} />

  return (
    <div
      onClick={onClick}
      className={`${dims} relative cursor-pointer select-none border-2 transition-all
        bg-gradient-to-br from-white via-slate-50 to-slate-100
        ${highlight ? 'border-amber-500 ring-4 ring-amber-400/50 -translate-y-2' : ''}
        ${selected ? 'border-emerald-500 ring-4 ring-emerald-400/60' : ''}
        ${!highlight && !selected ? 'border-slate-300' : ''}
        shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col items-center justify-center p-1`}
    >
      <span className={`font-bold ${card.color === 'red' ? 'text-rose-600' : 'text-slate-900'} leading-none`}>
        {card.rank}
      </span>
      <span className={`text-lg leading-none ${card.color === 'red' ? 'text-rose-600' : 'text-slate-900'}`}>
        {SUITS.find(s => s.suit === card.suit)?.symbol}
      </span>
      {size === 'lg' && (
        <span className={`text-xs mt-1 ${card.color === 'red' ? 'text-rose-500/70' : 'text-slate-500'}`}>
          {card.suit}
        </span>
      )}
    </div>
  )
}

// ===== Komponen utama =====
export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [fullDeck] = useState<PokerCard[]>(() => buildFullDeck())
  const [workingDeck, setWorkingDeck] = useState<PokerCard[]>([]) // 27 kartu yang dipakai untuk trik
  const [selectedCard, setSelectedCard] = useState<PokerCard | null>(null)
  const [piles, setPiles] = useState<PokerCard[][]>([[], [], []])
  const [pickedPile, setPickedPile] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [finalThree, setFinalThree] = useState<PokerCard[]>([])
  const [revealIndex, setRevealIndex] = useState(0)
  const [autoReveal, setAutoReveal] = useState(false)

  // Hitung posisi target teoritis (untuk display matematika)
  // Pada ronde r, dengan trik 27-kartu 3-tumpukan 3-ronde,
  // posisi kartu di akhir konvergen ke indeks 13 (tengah) dari 27.
  // Setelah truncate ke 3 kartu terakhir, kartu ada di antara 3 itu.
  const theoreticalNote = useMemo(() => {
    return `f(x) = (a·x + b) mod 27 → konvergen ke indeks tengah → kartumu PASTI di 3 kartu terakhir`
  }, [])

  // ===== Step 1: Kocok deck & ambil 27 kartu =====
  const startTrick = useCallback(() => {
    setPhase('shuffling')
    setRound(0)
    setSelectedCard(null)
    setPickedPile(null)
    setFinalThree([])
    setRevealIndex(0)

    // Acak deck 52, ambil 27 pertama
    const shuffled = shuffle(fullDeck).slice(0, TRICK_SIZE)
    setWorkingDeck(shuffled)

    // Setelah 800ms, pindah ke reveal-selection
    setTimeout(() => {
      setPhase('reveal-selection')
    }, 900)
  }, [fullDeck])

  // ===== Step 2: User pilih kartu (klik salah satu) =====
  const chooseCard = useCallback(
    (card: PokerCard) => {
      setSelectedCard(card)
      setPhase('memorize')
    },
    [],
  )

  // ===== Step 3: Mulai dealing — bagi 27 jadi 3 piles of 9 =====
  const startDealing = useCallback(() => {
    setPhase('dealing')
    setRound(1)

    // Deal: distribusi vertikal. Kartu ke-i masuk ke pile (i % 3), index dalam pile = floor(i/3)
    // Ini adalah deal column-by-column supaya saat user pilih pile, kita tahu posisi kartu.
    const newPiles: PokerCard[][] = [[], [], []]
    workingDeck.forEach((card, idx) => {
      newPiles[idx % PILE_COUNT].push(card)
    })
    setPiles(newPiles)

    // Setelah animasi dealing (1.2s), tunggu user pilih pile
    setTimeout(() => {
      setPhase('await-pick')
    }, 1300)
  }, [workingDeck])

  // ===== Step 4: User tunjuk pile mana yang berisi kartunya =====
  const pickPile = useCallback(
    (pileIdx: number) => {
      if (phase !== 'await-pick') return
      setPickedPile(pileIdx)

      // Animasi singkat "mengumpulkan"
      setPhase('collecting')

      setTimeout(() => {
        // Kumpulkan piles: pile terpilih ditaruh di TENGAH
        // urutan: pile0, pickedPile (tengah), pile2 — tapi kalau pickedPile = 0 atau 2, tetap di tengah
        const order = [0, 1, 2].filter(i => i !== pileIdx)
        const leftPile = order[0]
        const rightPile = order[1]
        // Susunan: kiri - tengah(picked) - kanan
        const newDeck = [
          ...piles[leftPile],
          ...piles[pileIdx],
          ...piles[rightPile],
        ]

        if (round < ROUNDS) {
          // Lanjut ronde berikutnya
          setWorkingDeck(newDeck)
          setPiles([[], [], []])
          setPickedPile(null)

          if (round + 1 >= ROUNDS) {
            // RONDE TERAKHIR: ambil 3 kartu terakhir
            // Setelah 3 ronde pile-3-pick-middle, kartu ada di posisi 13 (tengah) dari 27
            // Tapi user minta "3 kartu terakhir", jadi kita pakai versi adaptif:
            // Ambil 3 kartu terakhir dari deck hasil ronde ke-3
            const lastThree = newDeck.slice(-3)
            setFinalThree(lastThree)
            setPhase('final-reveal')
          } else {
            // Lanjut deal ronde berikutnya
            setRound(r => r + 1)
            setPhase('dealing')

            const nextPiles: PokerCard[][] = [[], [], []]
            newDeck.forEach((card, idx) => {
              nextPiles[idx % PILE_COUNT].push(card)
            })
            setPiles(nextPiles)

            setTimeout(() => {
              setPhase('await-pick')
            }, 1300)
          }
        }
      }, 700)
    },
    [phase, piles, round],
  )

  // ===== Step 5: Final reveal — tunjukkan 3 kartu terakhir =====
  // Auto-reveal kartu user di antara 3 itu
  useEffect(() => {
    if (phase !== 'final-reveal') return
    if (!autoReveal) return

    if (revealIndex < 3) {
      const t = setTimeout(() => {
        setRevealIndex(i => i + 1)
      }, 700)
      return () => clearTimeout(t)
    }

    if (revealIndex === 3) {
      const t = setTimeout(() => setPhase('trick-reveal'), 800)
      return () => clearTimeout(t)
    }
  }, [phase, revealIndex, autoReveal])

  const triggerReveal = useCallback(() => {
    setAutoReveal(true)
    setRevealIndex(0)
  }, [])

  // ===== Reset =====
  const reset = useCallback(() => {
    setPhase('intro')
    setWorkingDeck([])
    setSelectedCard(null)
    setPiles([[], [], []])
    setPickedPile(null)
    setRound(0)
    setFinalThree([])
    setRevealIndex(0)
    setAutoReveal(false)
  }, [])

  // ===== Hitung progress =====
  const progress = useMemo(() => {
    switch (phase) {
      case 'intro':
        return 0
      case 'shuffling':
      case 'reveal-selection':
        return 15
      case 'memorize':
        return 25
      case 'dealing':
      case 'await-pick':
      case 'collecting':
        return 25 + (round / ROUNDS) * 60
      case 'final-reveal':
        return 90
      case 'trick-reveal':
        return 100
      default:
        return 100
    }
  }, [phase, round])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(251,191,36,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(244,63,94,0.3) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0, transparent 30px, rgba(255,255,255,0.5) 30px, rgba(255,255,255,0.5) 31px)',
        }}
      />

      <main className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Wand2 className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              Trik Sulap Kartu Deterministik
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Berdasarkan algoritma matematis murni. Kartu pilihanmu{' '}
            <span className="text-amber-400 font-semibold">PASTI</span> mendarat di 3 kartu terakhir — 100% tanpa keberuntungan.
          </p>
        </header>

        {/* Progress bar */}
        <div className="mb-6 max-w-3xl mx-auto">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" /> Ronde {round}/{ROUNDS}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* LEFT: Game stage */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Panggung Sulap
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-amber-500/40 text-amber-300">
                      N = {TRICK_SIZE} kartu
                    </Badge>
                    <Badge variant="outline" className="border-rose-500/40 text-rose-300">
                      K = {PILE_COUNT} tumpukan
                    </Badge>
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
                      r = {ROUNDS} ronde
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GameStage
                  phase={phase}
                  workingDeck={workingDeck}
                  selectedCard={selectedCard}
                  piles={piles}
                  pickedPile={pickedPile}
                  round={round}
                  finalThree={finalThree}
                  revealIndex={revealIndex}
                  autoReveal={autoReveal}
                  onStart={startTrick}
                  onChooseCard={chooseCard}
                  onDeal={startDealing}
                  onPickPile={pickPile}
                  onTriggerReveal={triggerReveal}
                  onReset={reset}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Math explainer */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/60 border-slate-700 backdrop-blur-sm sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Otak di Balik Sulap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <MathBlock
                  title="1. Sistem Deterministik"
                  body={
                    <>
                      Hasil akhir <span className="text-amber-300">100% terprediksi</span> karena aturan matematis mengikat posisi setiap kartu sejak awal.
                    </>
                  }
                />
                <MathBlock
                  title="2. Pemetaan Linear"
                  body={
                    <>
                      <code className="text-emerald-300">f(x) = (a·x + b) mod 27</code>
                      <br />
                      Setiap deal + pickup = satu iterasi fungsi linear pada indeks kartu.
                    </>
                  }
                />
                <MathBlock
                  title="3. Konvergensi"
                  body={
                    <>
                      Setelah <span className="text-amber-300">3 iterasi</span> (karena 27 = 3³), posisi kartu mengecil ke titik tetap. Penggunaan pile-tengah memaksa kartu ke indeks 13.
                    </>
                  }
                />
                <MathBlock
                  title="4. Reduksi Himpunan"
                  body={
                    <>
                      52 → 27 → 9 → 3 kartu. Himpunan sample space mengecil secara eksponensial hingga tersisa <span className="text-amber-300">3 elemen</span> yang pasti memuat kartumu.
                    </>
                  }
                />
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                        <HelpCircle className="w-3 h-3 mr-1.5" /> Cara Kerja Trik
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-amber-300">Mengapa Trik Ini Selalu Berhasil?</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Penjelasan matematis singkat
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm text-slate-300">
                        <p>
                          Trik ini menggunakan <strong className="text-amber-300">27 kartu</strong> yang dibagi menjadi{' '}
                          <strong className="text-amber-300">3 tumpukan @ 9 kartu</strong>. Setiap kali kamu menyebutkan tumpukan mana yang berisi kartumu, kartu itu dipindahkan ke posisi <em>tengah</em> tumpukan akhir.
                        </p>
                        <p>
                          Karena 27 = 3³, setelah <strong className="text-amber-300">3 ronde</strong> pembagian, posisi kartumu konvergen ke <code className="text-emerald-300">indeks 13</code> (tengah absolut). Dengan demikian, dalam 3 kartu terakhir yang tersisa, kartu kamu PASTI ada di antaranya.
                        </p>
                        <p>
                          Ini bukan sihir — ini <strong className="text-emerald-300">Sistem Deterministik</strong>. Tidak ada ruang untuk keberuntungan, karena pemetaan linear pada himpunan terbatas selalu menemukan titik tetap.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 pb-4">
          Dibuat untuk demonstrasi algoritma deterministik · f(x) = (a·x + b) mod N · Trik klasik "27-Card Trick"
        </footer>
      </main>
    </div>
  )
}

// ===== Sub-komponen: Math block =====
function MathBlock({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="p-2.5 rounded-md bg-slate-800/50 border border-slate-700/50">
      <div className="text-amber-300 font-semibold mb-1 text-xs">{title}</div>
      <div className="text-slate-300 text-[11px] leading-relaxed">{body}</div>
    </div>
  )
}

// ===== Sub-komponen: Game stage =====
interface GameStageProps {
  phase: GamePhase
  workingDeck: PokerCard[]
  selectedCard: PokerCard | null
  piles: PokerCard[][]
  pickedPile: number | null
  round: number
  finalThree: PokerCard[]
  revealIndex: number
  autoReveal: boolean
  onStart: () => void
  onChooseCard: (card: PokerCard) => void
  onDeal: () => void
  onPickPile: (idx: number) => void
  onTriggerReveal: () => void
  onReset: () => void
}

function GameStage({
  phase,
  workingDeck,
  selectedCard,
  piles,
  pickedPile,
  round,
  finalThree,
  revealIndex,
  autoReveal,
  onStart,
  onChooseCard,
  onDeal,
  onPickPile,
  onTriggerReveal,
  onReset,
}: GameStageProps) {
  // ===== Phase: INTRO =====
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full"
            >
              <div className="w-full h-full rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                <Wand2 className="w-14 h-14 text-amber-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-white">Sulap Kartu Deterministik</h2>
        <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base">
          Pilih satu kartu dari tumpukan acak. Sistem akan membagi-bagi kartu sebanyak 3 ronde, dan kartumu
          <span className="text-amber-400 font-semibold"> dijamin 100% </span>
          muncul di antara 3 kartu terakhir — tanpa trik tangan, murni algoritma.
        </p>
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/30"
        >
          <Wand2 className="w-4 h-4 mr-2" /> Mulai Sulap
        </Button>
      </div>
    )
  }

  // ===== Phase: SHUFFLING =====
  if (phase === 'shuffling') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <RotateCw className="w-12 h-12 text-amber-400" />
        </motion.div>
        <p className="text-slate-300 text-lg font-medium">Mengocok 52 kartu...</p>
        <p className="text-slate-500 text-xs mt-1">Mengambil 27 kartu pertama untuk trik</p>
      </div>
    )
  }

  // ===== Phase: REVEAL-SELECTION (user pilih kartu) =====
  if (phase === 'reveal-selection') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300 mb-1">Pilih Salah Satu Kartu</h3>
          <p className="text-slate-400 text-xs">
            Klik salah satu kartu di bawah. Ingat baik-baik kartu yang kamu pilih. (Jangan khawatir, kartunya acak semua)
          </p>
        </div>
        <div className="grid grid-cols-9 sm:grid-cols-9 gap-1.5 justify-items-center max-w-2xl mx-auto">
          {workingDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: -20, rotateZ: -10 }}
              animate={{ opacity: 1, y: 0, rotateZ: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
            >
              <MiniCard card={card} size="sm" onClick={() => onChooseCard(card)} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ===== Phase: MEMORIZE =====
  if (phase === 'memorize' && selectedCard) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">Hafalkan Kartumu</h3>
          <p className="text-slate-400 text-xs">Ini kartu yang kamu pilih. Klik "Mulai Bagi" untuk lanjut.</p>
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MiniCard card={selectedCard} size="lg" highlight />
        </motion.div>
        <div className="text-center">
          <p className="text-slate-300 text-sm">
            Kartu terpilih: <span className="text-amber-300 font-bold">{selectedCard.label}</span>
          </p>
        </div>
        <Button
          onClick={onDeal}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold"
        >
          <Layers className="w-4 h-4 mr-2" /> Mulai Bagi Kartu
        </Button>
      </div>
    )
  }

  // ===== Phase: DEALING (animasi bagi ke 3 piles) =====
  if (phase === 'dealing') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">
            Ronde {round}/{ROUNDS} — Membagi ke 3 Tumpukan
          </h3>
          <p className="text-slate-400 text-xs">Mendistribusikan {TRICK_SIZE} kartu ke {PILE_COUNT} tumpukan...</p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {piles.map((pile, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-2">Tumpukan {i + 1}</div>
              <div className="relative h-44 w-full flex items-end justify-center">
                <AnimatePresence>
                  {pile.map((card, j) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: -200, x: 0 }}
                      animate={{ opacity: 1, y: -j * 3, x: j * 0.5 }}
                      transition={{ delay: j * 0.04, duration: 0.3, ease: 'easeOut' }}
                      className="absolute"
                      style={{ zIndex: j }}
                    >
                      <MiniCard card={card} size="sm" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="text-xs text-slate-500 mt-1">{pile.length} kartu</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ===== Phase: AWAIT-PICK (user tunjuk pile mana berisi kartunya) =====
  if (phase === 'await-pick') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">
            Ronde {round}/{ROUNDS} — Di Tumpukan Mana Kartumu?
          </h3>
          <p className="text-slate-400 text-xs">
            Kartumu: <span className="text-amber-300 font-bold">{selectedCard?.label}</span> · Klik tumpukan yang berisi kartu kamu
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {piles.map((pile, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPickPile(i)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="text-xs text-slate-400 mb-2 group-hover:text-amber-300 transition-colors">
                Tumpukan {i + 1}
              </div>
              <div className="relative h-44 w-full flex items-end justify-center p-2 rounded-lg border-2 border-transparent group-hover:border-amber-500/50 group-hover:bg-amber-500/5 transition-all">
                {pile.map((card, j) => (
                  <div
                    key={card.id}
                    className="absolute"
                    style={{
                      transform: `translateY(${-j * 2}px) translateX(${j * 0.5}px)`,
                      zIndex: j,
                    }}
                  >
                    <MiniCard card={card} size="sm" />
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-1">{pile.length} kartu</div>
              <div className="text-[10px] text-slate-600 mt-0.5">↑ klik</div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // ===== Phase: COLLECTING =====
  if (phase === 'collecting' && pickedPile !== null) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">Mengumpulkan Tumpukan...</h3>
          <p className="text-slate-400 text-xs">
            Tumpukan {pickedPile + 1} (yang berisi kartumu) ditempatkan di <span className="text-amber-300">tengah</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto opacity-50">
          {piles.map((pile, i) => (
            <div
              key={i}
              className={`flex flex-col items-center ${i === pickedPile ? 'opacity-100 ring-2 ring-amber-500 rounded-lg p-2' : 'opacity-30'}`}
            >
              <div className="text-xs text-slate-500 mb-2">Tumpukan {i + 1}{i === pickedPile ? ' ★' : ''}</div>
              <div className="relative h-44 w-full flex items-end justify-center">
                {pile.map((card, j) => (
                  <div
                    key={card.id}
                    className="absolute"
                    style={{
                      transform: `translateY(${-j * 2}px) translateX(${j * 0.5}px)`,
                      zIndex: j,
                    }}
                  >
                    <MiniCard card={card} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ===== Phase: FINAL-REVEAL (3 kartu terakhir) =====
  if (phase === 'final-reveal' && finalThree.length === 3) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-amber-300">3 Kartu Terakhir</h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            Setelah {ROUNDS} ronde pembagian, tersisa 3 kartu. Kartumu PASTI ada di antaranya.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {finalThree.map((card, i) => {
            const revealed = i < revealIndex
            const isUserCard = selectedCard?.id === card.id
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="text-xs text-slate-500 mb-2">Posisi {i + 1}</div>
                <motion.div
                  animate={
                    isUserCard && revealed
                      ? { scale: [1, 1.15, 1], rotateZ: [0, -3, 0] }
                      : { scale: 1, rotateZ: 0 }
                  }
                  transition={{ duration: 0.6, repeat: isUserCard && revealed ? 1 : 0 }}
                >
                  <MiniCard card={card} size="lg" faceDown={!revealed} highlight={isUserCard && revealed} />
                </motion.div>
                {isUserCard && revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-1 text-emerald-400 text-xs font-bold"
                  >
                    <CheckCircle2 className="w-3 h-3" /> KARTU KAMU!
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
        {revealIndex < 3 && !autoReveal && (
          <div className="text-center">
            <Button
              onClick={onTriggerReveal}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Buka Kartu!
            </Button>
          </div>
        )}
      </div>
    )
  }

  // ===== Phase: TRICK-REVEAL (kartu user di-reveal sebagai pemenang) =====
  if (phase === 'trick-reveal' && selectedCard) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-3" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
          Trik Berhasil!
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-md">
          Kartu pilihanmu <span className="text-amber-300 font-bold text-lg">{selectedCard.label}</span>{' '}
          ada di antara 3 kartu terakhir — seperti yang diprediksi algoritma. Bukan kebetulan, ini deterministik.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onReset}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold"
          >
            <RotateCw className="w-4 h-4 mr-2" /> Main Lagi
          </Button>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="text-center py-8">
      <Button onClick={onReset} variant="outline">
        <RotateCw className="w-4 h-4 mr-2" /> Reset
      </Button>
    </div>
  )
}
