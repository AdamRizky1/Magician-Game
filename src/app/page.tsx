'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Wand2,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  Layers,
  Brain,
  X,
  Check,
  Hand,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MathExplanation } from '@/components/math/MathExplanation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
  | 'reveal-selection' // 52 kartu face-up, user pilih 1
  | 'memorize' // tampilkan kartu pilihan user
  | 'trick-prep' // sistem ambil 27 kartu (termasuk milik user)
  | 'dealing' // sistem bagi ke 3 tumpukan
  | 'ask-pile' // sistem nanya "kartumu di tumpukan ini? Ya/Tidak"
  | 'collecting' // animasi pengumpulan tumpukan terpilih
  | 'final-reveal' // 3 kartu face-down
  | 'trick-reveal' // kartu user di-reveal
  | 'completed'

// ===== Konstanta =====
const FULL_DECK_SIZE = 52
const TRICK_SIZE = 27 // 3^3 → converge rapi ke 3 kartu setelah 2 ronde
const PILE_COUNT = 3
const ROUNDS = 2 // 27 → 9 → 3

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

// ===== Komponen kartu mini =====
function MiniCard({
  card,
  faceDown = false,
  highlight = false,
  selected = false,
  onClick,
  size = 'md',
  dim = false,
}: {
  card?: PokerCard
  faceDown?: boolean
  highlight?: boolean
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  dim?: boolean
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
          border-slate-700 shadow-lg overflow-hidden ${dim ? 'opacity-30' : ''}`}
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
        ${dim ? 'opacity-30 grayscale' : ''}
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
  const [shuffledDeck, setShuffledDeck] = useState<PokerCard[]>([]) // 52 kartu untuk seleksi
  const [selectedCard, setSelectedCard] = useState<PokerCard | null>(null)
  const [workingDeck, setWorkingDeck] = useState<PokerCard[]>([]) // 27 kartu untuk trik
  const [piles, setPiles] = useState<PokerCard[][]>([[], [], []])
  const [currentAskPile, setCurrentAskPile] = useState(0) // pile yang sedang ditanya
  const [pickedPile, setPickedPile] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [finalThree, setFinalThree] = useState<PokerCard[]>([])
  const [revealIndex, setRevealIndex] = useState(0)
  const [autoReveal, setAutoReveal] = useState(false)

  // ===== Start: kocok 52 kartu =====
  const startTrick = useCallback(() => {
    setPhase('shuffling')
    setRound(0)
    setSelectedCard(null)
    setShuffledDeck([])
    setWorkingDeck([])
    setPiles([[], [], []])
    setCurrentAskPile(0)
    setPickedPile(null)
    setFinalThree([])
    setRevealIndex(0)
    setAutoReveal(false)

    const shuffled = shuffle(fullDeck)
    setShuffledDeck(shuffled)

    setTimeout(() => setPhase('reveal-selection'), 900)
  }, [fullDeck])

  // ===== User pilih kartu dari 52 =====
  const chooseCard = useCallback((card: PokerCard) => {
    setSelectedCard(card)
    setPhase('memorize')
  }, [])

  // ===== Mulai ronde: bagi ke 3 tumpukan =====
  const startRound = useCallback((roundNum: number, deck: PokerCard[]) => {
    setPhase('dealing')
    setRound(roundNum)
    setPickedPile(null)
    setCurrentAskPile(0)
    setPiles([[], [], []])

    // Deal column-by-column supaya tiap tumpukan dapat ~N/3 kartu
    const newPiles: PokerCard[][] = [[], [], []]
    deck.forEach((card, idx) => {
      newPiles[idx % PILE_COUNT].push(card)
    })
    setPiles(newPiles)

    setTimeout(() => setPhase('ask-pile'), 1500)
  }, [])

  // ===== Mulai trik proper: sistem ambil 27 kartu =====
  const startTrikProper = useCallback(() => {
    if (!selectedCard) return
    setPhase('trick-prep')

    // Sistem ambil 27 kartu: kartu user + 26 random dari 51 sisanya
    const remaining = fullDeck.filter(c => c.id !== selectedCard.id)
    const random26 = shuffle(remaining).slice(0, TRICK_SIZE - 1)
    const trickDeck = shuffle([selectedCard, ...random26])
    setWorkingDeck(trickDeck)

    setTimeout(() => {
      startRound(1, trickDeck)
    }, 1800)
  }, [selectedCard, fullDeck, startRound])

  // ===== User jawab Ya/Tidak untuk tumpukan currentAskPile =====
  const answerPile = useCallback(
    (yes: boolean) => {
      if (yes) {
        // User bilang Ya → kartu ada di tumpukan ini
        const pileIdx = currentAskPile
        setPickedPile(pileIdx)
        setPhase('collecting')

        setTimeout(() => {
          const newDeck = piles[pileIdx]
          if (round < ROUNDS) {
            startRound(round + 1, newDeck)
          } else {
            // Ronde terakhir selesai → 3 kartu tersisa
            setFinalThree(newDeck)
            setPhase('final-reveal')
          }
        }, 900)
      } else {
        // User bilang Tidak → lanjut ke tumpukan berikutnya
        if (currentAskPile < PILE_COUNT - 1) {
          setCurrentAskPile(p => p + 1)
        } else {
          // Tumpukan terakhir — kartu HARUS di sini (logika)
          // Otomatis anggap Ya
          const pileIdx = currentAskPile
          setPickedPile(pileIdx)
          setPhase('collecting')
          setTimeout(() => {
            const newDeck = piles[pileIdx]
            if (round < ROUNDS) {
              startRound(round + 1, newDeck)
            } else {
              setFinalThree(newDeck)
              setPhase('final-reveal')
            }
          }, 900)
        }
      }
    },
    [currentAskPile, piles, round, startRound],
  )

  // ===== Auto-reveal 3 kartu =====
  useEffect(() => {
    if (phase !== 'final-reveal') return
    if (!autoReveal) return

    if (revealIndex < 3) {
      const t = setTimeout(() => setRevealIndex(i => i + 1), 700)
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
    setShuffledDeck([])
    setWorkingDeck([])
    setSelectedCard(null)
    setPiles([[], [], []])
    setCurrentAskPile(0)
    setPickedPile(null)
    setRound(0)
    setFinalThree([])
    setRevealIndex(0)
    setAutoReveal(false)
  }, [])

  // ===== Progress bar =====
  const progress = useMemo(() => {
    switch (phase) {
      case 'intro':
        return 0
      case 'shuffling':
        return 8
      case 'reveal-selection':
        return 18
      case 'memorize':
        return 25
      case 'trick-prep':
        return 30
      case 'dealing':
      case 'ask-pile':
      case 'collecting':
        return 30 + (round / ROUNDS) * 55
      case 'final-reveal':
        return 92
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
            Pilih 1 dari 52 kartu. Sistem yang membagi-bagi ke tumpukan dan bertanya{' '}
            <span className="text-amber-400 font-semibold">"Apakah kartumu di sini?"</span> — sampai tersisa 3 kartu
            yang PASTI berisi kartumu.
          </p>
        </header>

        {/* Progress bar — only visible on Game tab */}
        <div className="mb-6 max-w-3xl mx-auto" data-game-only>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" /> Ronde {round}/{ROUNDS}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>

        {/* Tabs: Game | Math Explanation */}
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4 bg-slate-900/60 border border-slate-700">
            <TabsTrigger value="game" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Wand2 className="w-4 h-4 mr-1.5" /> Game Trik Sulap
            </TabsTrigger>
            <TabsTrigger value="math" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Brain className="w-4 h-4 mr-1.5" /> Penjelasan Matematis
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB 1: GAME ===== */}
          <TabsContent value="game">
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
                      {phase === 'reveal-selection' || phase === 'memorize' || phase === 'shuffling'
                        ? `${FULL_DECK_SIZE} kartu`
                        : `${TRICK_SIZE} kartu`}
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
                  shuffledDeck={shuffledDeck}
                  workingDeck={workingDeck}
                  selectedCard={selectedCard}
                  piles={piles}
                  currentAskPile={currentAskPile}
                  pickedPile={pickedPile}
                  round={round}
                  finalThree={finalThree}
                  revealIndex={revealIndex}
                  autoReveal={autoReveal}
                  onStart={startTrick}
                  onChooseCard={chooseCard}
                  onTrikProper={startTrikProper}
                  onAnswer={answerPile}
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
                      Hasil akhir <span className="text-amber-300">100% terprediksi</span> karena aturan matematis mengikat
                      posisi kartu sejak awal. Tanpa unsur keberuntungan.
                    </>
                  }
                />
                <MathBlock
                  title="2. Pemetaan Linear"
                  body={
                    <>
                      <code className="text-emerald-300">f(x) = (a·x + b) mod 27</code>
                      <br />
                      Setiap ronde pembagian = satu iterasi fungsi linear pada indeks kartu.
                    </>
                  }
                />
                <MathBlock
                  title="3. Konvergensi 3²"
                  body={
                    <>
                      Mulai dari <span className="text-amber-300">27 kartu</span> (dipilih sistem dari 52). Ronde 1 →
                      9 kartu. Ronde 2 → <span className="text-amber-300">3 kartu</span> tersisa.
                    </>
                  }
                />
                <MathBlock
                  title="4. Reduksi Himpunan"
                  body={
                    <>
                      52 → 27 → 9 → 3 kartu. Himpunan sample space mengecil secara eksponensial hingga tersisa{' '}
                      <span className="text-amber-300">3 elemen</span> yang pasti memuat kartumu.
                    </>
                  }
                />
                <MathBlock
                  title="5. Ya/Tidak = Pencarian"
                  body={
                    <>
                      Setiap pertanyaan Ya/Tidak memaksa sistem mengambil <em>tumpukan terpilih</em> sebagai himpunan
                      baru. Ini <span className="text-emerald-300">pemetaan injektif</span> yang konvergen.
                    </>
                  }
                />
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        <HelpCircle className="w-3 h-3 mr-1.5" /> Cara Kerja Trik
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-amber-300">Mengapa Trik Ini Selalu Berhasil?</DialogTitle>
                        <DialogDescription className="text-slate-400">Penjelasan matematis singkat</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm text-slate-300">
                        <p>
                          Kamu memilih 1 kartu dari <strong className="text-amber-300">52 kartu</strong>. Sistem lalu
                          mengambil <strong className="text-amber-300">27 kartu</strong> dari deck (termasuk kartumu) —
                          angka 27 dipilih karena <code className="text-emerald-300">27 = 3³</code>.
                        </p>
                        <p>
                          Sistem membagi 27 kartu ke <strong className="text-amber-300">3 tumpukan @ 9 kartu</strong>{' '}
                          lalu bertanya "Apakah kartumu di tumpukan X?" untuk masing-masing tumpukan. Saat kamu menjawab{' '}
                          <em>Ya</em>, sistem hanya mengambil tumpukan itu untuk ronde berikutnya.
                        </p>
                        <p>
                          Setelah <strong className="text-amber-300">2 ronde</strong> (27 → 9 → 3), tersisa 3 kartu
                          yang PASTI berisi kartumu. Bukan sihir — ini <strong className="text-emerald-300">Sistem
                          Deterministik</strong>: pemetaan linear pada himpunan terbatas selalu konvergen ke titik
                          tetap.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          {/* ===== TAB 2: MATH EXPLANATION ===== */}
          <TabsContent value="math">
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 sm:p-6">
              <MathExplanation />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 pb-4">
          Dibuat untuk demonstrasi algoritma deterministik · f(x) = (a·x + b) mod N · Variasi "27-Card Trick" dengan 52 kartu
          awal
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
  shuffledDeck: PokerCard[]
  workingDeck: PokerCard[]
  selectedCard: PokerCard | null
  piles: PokerCard[][]
  currentAskPile: number
  pickedPile: number | null
  round: number
  finalThree: PokerCard[]
  revealIndex: number
  autoReveal: boolean
  onStart: () => void
  onChooseCard: (card: PokerCard) => void
  onTrikProper: () => void
  onAnswer: (yes: boolean) => void
  onTriggerReveal: () => void
  onReset: () => void
}

function GameStage({
  phase,
  shuffledDeck,
  workingDeck,
  selectedCard,
  piles,
  currentAskPile,
  pickedPile,
  round,
  finalThree,
  revealIndex,
  autoReveal,
  onStart,
  onChooseCard,
  onTrikProper,
  onAnswer,
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
          Pilih satu kartu dari <span className="text-amber-400 font-semibold">52 kartu</span> acak. Sistem yang akan
          membagi-bagi dan bertanya "Apakah kartumu di tumpukan ini?" — sampai tersisa 3 kartu yang dijamin berisi
          kartumu, 100% tanpa keberuntungan.
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
        <p className="text-slate-500 text-xs mt-1">Acak seluruh deck poker standar</p>
      </div>
    )
  }

  // ===== Phase: REVEAL-SELECTION (52 kartu face-up, user pilih) =====
  if (phase === 'reveal-selection') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300 mb-1">Pilih Salah Satu Kartu dari 52</h3>
          <p className="text-slate-400 text-xs">
            Klik salah satu kartu di bawah. Ingat baik-baik kartu yang kamu pilih.
          </p>
        </div>
        <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 justify-items-center max-w-3xl mx-auto">
          {shuffledDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: -20, rotateZ: -10 }}
              animate={{ opacity: 1, y: 0, rotateZ: 0 }}
              transition={{ delay: i * 0.015, duration: 0.25 }}
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
          <p className="text-slate-400 text-xs">
            Ini kartu yang kamu pilih. Klik "Mulai Trik" untuk menyerahkan ke sistem.
          </p>
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
          onClick={onTrikProper}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold"
        >
          <Hand className="w-4 h-4 mr-2" /> Serahkan ke Sistem
        </Button>
      </div>
    )
  }

  // ===== Phase: TRICK-PREP (sistem ambil 27 kartu) =====
  if (phase === 'trick-prep') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-10 h-10 text-amber-400" />
        </motion.div>
        <h3 className="text-lg font-semibold text-amber-300">Sistem Mengambil 27 Kartu...</h3>
        <p className="text-slate-400 text-xs max-w-md text-center">
          Sistem mengambil <span className="text-amber-300 font-semibold">27 kartu</span> dari deck (termasuk kartumu) untuk
          trik ini. Angka 27 dipilih karena <code className="text-emerald-300">27 = 3³</code> supaya converge rapi ke 3
          kartu.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
          {workingDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <MiniCard card={card} size="sm" faceDown highlight={card.id === selectedCard?.id} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ===== Phase: DEALING (sistem bagi ke 3 tumpukan) =====
  if (phase === 'dealing') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">
            Ronde {round}/{ROUNDS} — Sistem Membagi ke 3 Tumpukan
          </h3>
          <p className="text-slate-400 text-xs">Mendistribusikan {round === 1 ? TRICK_SIZE : 9} kartu ke {PILE_COUNT} tumpukan...</p>
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

  // ===== Phase: ASK-PILE (sistem nanya Ya/Tidak) =====
  if (phase === 'ask-pile') {
    const isLastPile = currentAskPile === PILE_COUNT - 1
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">
            Ronde {round}/{ROUNDS} — Pertanyaan untuk Tumpukan {currentAskPile + 1}
          </h3>
          <p className="text-slate-400 text-xs">
            Kartumu: <span className="text-amber-300 font-bold">{selectedCard?.label}</span>
          </p>
        </div>

        {/* Banner pertanyaan */}
        <motion.div
          key={currentAskPile}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 rounded-xl p-4 text-center max-w-2xl mx-auto"
        >
          <p className="text-white text-base sm:text-lg font-semibold mb-1">
            Apakah kartumu ada di <span className="text-amber-300">Tumpukan {currentAskPile + 1}</span>?
          </p>
          <p className="text-slate-400 text-xs">
            {isLastPile
              ? 'Tumpukan terakhir — kartumu pasti di sini kalau bukan di tumpukan lain'
              : 'Lihat tumpukan yang disorot. Klik Ya kalau kartumu ada di sana, Tidak kalau tidak.'}
          </p>
        </motion.div>

        {/* 3 tumpukan, tumpukan currentAskPile di-highlight */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {piles.map((pile, i) => {
            const isCurrent = i === currentAskPile
            const isPast = i < currentAskPile
            return (
              <motion.div
                key={i}
                animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
                className={`flex flex-col items-center rounded-xl p-2 transition-all
                  ${isCurrent ? 'ring-4 ring-amber-400/60 bg-amber-500/5' : ''}
                  ${isPast ? 'opacity-40' : ''}`}
              >
                <div className="text-xs text-slate-400 mb-2">
                  Tumpukan {i + 1}
                  {isPast && ' ✓ Tidak'}
                  {isCurrent && ' ← sedang ditanya'}
                </div>
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
                <div className="text-xs text-slate-500 mt-1">{pile.length} kartu</div>
              </motion.div>
            )
          })}
        </div>

        {/* Tombol Ya / Tidak */}
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(true)}
            className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" /> Ya
          </motion.button>
          {!isLastPile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAnswer(false)}
              className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-rose-500/30 hover:from-rose-400 hover:to-rose-500 transition-all flex items-center gap-2"
            >
              <X className="w-5 h-5" /> Tidak
            </motion.button>
          )}
        </div>
      </div>
    )
  }

  // ===== Phase: COLLECTING (animasi pengumpulan) =====
  if (phase === 'collecting' && pickedPile !== null) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-amber-300">Mengambil Tumpukan {pickedPile + 1}</h3>
          <p className="text-slate-400 text-xs">
            Sistem menyimpan tumpukan ini (yang berisi kartumu) untuk ronde berikutnya
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {piles.map((pile, i) => {
            const isPicked = i === pickedPile
            return (
              <div
                key={i}
                className={`flex flex-col items-center rounded-xl p-2 transition-all
                  ${isPicked ? 'ring-4 ring-emerald-400/60 bg-emerald-500/5 scale-105' : 'opacity-25 grayscale'}`}
              >
                <div className="text-xs text-slate-400 mb-2">
                  Tumpukan {i + 1}
                  {isPicked && ' ★ dipilih'}
                </div>
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
                <div className="text-xs text-slate-500 mt-1">{pile.length} kartu</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ===== Phase: FINAL-REVEAL (3 kartu face-down) =====
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

  // ===== Phase: TRICK-REVEAL (sukses) =====
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
          Kartu pilihanmu <span className="text-amber-300 font-bold text-lg">{selectedCard.label}</span> ada di antara 3
          kartu terakhir — seperti yang diprediksi algoritma. Bukan kebetulan, ini deterministik.
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
