'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MathExplanation } from '@/components/math/MathExplanation'

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
  | 'trick-prep'
  | 'dealing'
  | 'ask-pile'
  | 'collecting'
  | 'final-reveal'
  | 'trick-reveal'
  | 'completed'

// ===== Konstanta =====
const FULL_DECK_SIZE = 52
const TRICK_SIZE = 27
const PILE_COUNT = 3
const ROUNDS = 2

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

// ===== Playing card — letterpress style =====
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
    sm: 'w-9 h-12 text-[9px]',
    md: 'w-14 h-20 text-sm',
    lg: 'w-20 h-28 text-2xl',
  }[size]

  const base = `relative cursor-pointer select-none border-2 transition-all duration-150 ${dims} ${dim ? 'opacity-30' : ''}`

  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`${base} bg-[#1a1410] border-[#1a1410] hover:border-[#722637]`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent 0, transparent 4px, rgba(138,107,31,0.18) 4px, rgba(138,107,31,0.18) 5px)',
        }}
      >
        <div className="absolute inset-0.5 border border-[#8a6b1f]/40 flex items-center justify-center">
          <span className="text-[#8a6b1f]/60 text-base font-display">✦</span>
        </div>
      </div>
    )
  }

  if (!card) return <div className={`${dims} border-2 border-[#d4c4a3] bg-[#f5ecd5]`} />

  const isRed = card.color === 'red'
  const inkColor = isRed ? 'text-[#722637]' : 'text-[#1a1410]'

  return (
    <div
      onClick={onClick}
      className={`${base} bg-[#f5ecd5] hover:bg-[#fff8e0] hover:-translate-y-0.5 flex flex-col items-center justify-center p-1
        ${highlight ? 'border-[#722637] -translate-y-1' : ''}
        ${selected ? 'border-[#8a6b1f]' : ''}
        ${!highlight && !selected ? 'border-[#1a1410]' : ''}`}
    >
      <span className={`font-display font-bold leading-none ${inkColor}`}>{card.rank}</span>
      <span className={`text-base leading-none ${inkColor}`}>
        {SUITS.find((s) => s.suit === card.suit)?.symbol}
      </span>
      {size === 'lg' && (
        <span className="text-[10px] mt-1 text-[#6e5f4c] smallcaps">{card.suit}</span>
      )}
    </div>
  )
}

// ===== Editorial ornaments =====
function Ornament() {
  return (
    <div className="ornament-suits select-none" aria-hidden>
      <span>♥</span>
      <span>♦</span>
      <span>♣</span>
      <span>♠</span>
    </div>
  )
}

function RuleDouble() {
  return <div className="rule-double" />
}

function ArticleHeading({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="article-heading text-2xl sm:text-3xl mt-8 mb-3">
      <span className="smallcaps text-[#722637] text-xs block mb-1">Artikel {num}</span>
      <span>{title}</span>
    </h2>
  )
}

// ===== Komponen utama =====
export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [fullDeck] = useState<PokerCard[]>(() => buildFullDeck())
  const [shuffledDeck, setShuffledDeck] = useState<PokerCard[]>([])
  const [selectedCard, setSelectedCard] = useState<PokerCard | null>(null)
  const [workingDeck, setWorkingDeck] = useState<PokerCard[]>([])
  const [piles, setPiles] = useState<PokerCard[][]>([[], [], []])
  const [currentAskPile, setCurrentAskPile] = useState(0)
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

    const remaining = fullDeck.filter((c) => c.id !== selectedCard.id)
    const random26 = shuffle(remaining).slice(0, TRICK_SIZE - 1)
    const trickDeck = shuffle([selectedCard, ...random26])
    setWorkingDeck(trickDeck)

    setTimeout(() => {
      startRound(1, trickDeck)
    }, 1800)
  }, [selectedCard, fullDeck, startRound])

  // ===== User jawab Ya/Tidak =====
  const answerPile = useCallback(
    (yes: boolean) => {
      if (yes) {
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
      } else {
        if (currentAskPile < PILE_COUNT - 1) {
          setCurrentAskPile((p) => p + 1)
        } else {
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

  // ===== Auto-reveal =====
  useEffect(() => {
    if (phase !== 'final-reveal' || !autoReveal) return
    if (revealIndex < 3) {
      const t = setTimeout(() => setRevealIndex((i) => i + 1), 700)
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
      case 'intro': return 0
      case 'shuffling': return 8
      case 'reveal-selection': return 18
      case 'memorize': return 25
      case 'trick-prep': return 30
      case 'dealing':
      case 'ask-pile':
      case 'collecting':
        return 30 + (round / ROUNDS) * 55
      case 'final-reveal': return 92
      case 'trick-reveal': return 100
      default: return 100
    }
  }, [phase, round])

  return (
    <div className="min-h-screen bg-[#efe6d0] text-[#1a1410]">
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* ===== MASTHEAD ===== */}
        <header className="mb-8">
          <div className="flex items-baseline justify-between border-b-2 border-[#1a1410] pb-2 mb-1">
            <div className="smallcaps text-[10px] sm:text-xs text-[#722637] tracking-widest">
              Sebuah Treatise Matematis
            </div>
            <div className="font-mono text-[10px] sm:text-xs text-[#6e5f4c]">MMXXVI · No. I</div>
          </div>
          <div className="flex items-baseline justify-between text-[10px] sm:text-xs text-[#6e5f4c] smallcaps">
            <span>Vol. I — Cartomancy Deterministik</span>
            <span>Harga: Sumbang</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl leading-[0.95] mt-8 text-[#1a1410]">
            Trik Sulap Kartu
          </h1>
          <p className="font-display italic text-xl sm:text-2xl text-[#722637] mt-1 mb-4">
            atau, Bagaimana Temanmu Selalu Tahu Kartumu
          </p>

          <p className="font-body text-base sm:text-lg leading-relaxed text-[#2c241b] max-w-2xl dropcap">
            Pilih satu kartu dari deck standar berisi lima-puluh-dua. Kocok, bagi, dan tanyakan:
            apakah kartumu ada di tumpukan ini? Temanmu akan bertanya demikian hingga tersisa tiga
            kartu — dan kartumu <em>pasti</em> berada di antaranya. Bagaimana mungkin? Jawabannya,
            seperti akan kami tunjukkan, sesederhana <span className="font-mono text-sm bg-[#e6dcc4] px-1.5 py-0.5">c* = D − R</span>.
          </p>

          <Ornament />
        </header>

        {/* ===== Tabs (editorial style) ===== */}
        <Tabs defaultValue="game" className="w-full">
          <div className="border-y border-[#1a1410] py-2 mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-transparent border-0 h-auto p-0 gap-0">
              <TabsTrigger
                value="game"
                className="font-display font-bold text-sm data-[state=active]:bg-[#1a1410] data-[state=active]:text-[#efe6d0] data-[state=active]:shadow-none border border-[#1a1410] -mr-px data-[state=active]:z-10 py-2 rounded-none transition-colors"
              >
                I. PANGGUNG SULAP
              </TabsTrigger>
              <TabsTrigger
                value="math"
                className="font-display font-bold text-sm data-[state=active]:bg-[#1a1410] data-[state=active]:text-[#efe6d0] data-[state=active]:shadow-none border border-[#1a1410] -ml-px data-[state=active]:z-10 py-2 rounded-none transition-colors"
              >
                II. TREATISE MATEMATIS
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== TAB 1: GAME ===== */}
          <TabsContent value="game">
            {/* Progress as editorial pagination */}
            <div className="flex items-baseline justify-between text-[11px] font-mono text-[#6e5f4c] mb-3">
              <span>Ronde {round}/{ROUNDS}</span>
              <span>hal. {String(Math.max(1, Math.round(progress / 12))).padStart(2, '0')} dari {String(Math.ceil(100 / 12)).padStart(2, '0')}</span>
            </div>
            <div className="h-px bg-[#d4c4a3] relative mb-6">
              <div
                className="absolute top-0 left-0 h-1 -translate-y-1/2 bg-[#722637] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

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

            {/* Editorial footer with hint */}
            <div className="mt-8 pt-4 border-t border-[#d4c4a3] text-[11px] text-[#6e5f4c] italic">
              <span className="smallcaps not-italic text-[#722637]">Catatan editor</span>{' '}
              — Setelah selesai, lanjut ke Artikel II untuk memahami rahasia matematis di balik
              trik ini. Atau baca dulu, baru mainkan.
            </div>
          </TabsContent>

          {/* ===== TAB 2: MATH EXPLANATION ===== */}
          <TabsContent value="math">
            <MathExplanation />
          </TabsContent>
        </Tabs>

        {/* ===== FOOTER ===== */}
        <footer className="mt-12 pt-4 border-t-2 border-[#1a1410]">
          <div className="flex items-baseline justify-between text-[10px] sm:text-xs text-[#6e5f4c] smallcaps">
            <span>Dicetak untuk pemilik repo</span>
            <span className="font-mono">c* = D − R</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

// ===== GameStage =====
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

function GameStage(props: GameStageProps) {
  const {
    phase, shuffledDeck, workingDeck, selectedCard, piles, currentAskPile,
    pickedPile, round, finalThree, revealIndex, autoReveal,
    onStart, onChooseCard, onTrikProper, onAnswer, onTriggerReveal, onReset,
  } = props

  // ===== INTRO =====
  if (phase === 'intro') {
    return (
      <section className="py-10 sm:py-16 text-center">
        <div className="font-display text-7xl sm:text-9xl text-[#722637] leading-none mb-6 select-none">
          ♠
        </div>
        <h2 className="font-display font-black text-3xl sm:text-5xl mb-3 leading-tight">
          Sebuah Percobaan
        </h2>
        <p className="font-body italic text-lg sm:text-xl text-[#722637] mb-6">
          dalam seni menemukan yang tersembunyi
        </p>
        <p className="font-body text-base sm:text-lg leading-relaxed text-[#2c241b] max-w-md mx-auto mb-8">
          Dalam percobaan ini, engkau akan memilih satu kartu dari deck standar lima-puluh-dua.
          Mesinpun, dengan pembagian dan pertanyaan yang sungguh-sungguh, akan menemukan kartumu
          di antara tiga kartu terakhir — tanpa keberuntungan, tanpa pengetahuan tersembunyi.
        </p>
        <button
          onClick={onStart}
          className="font-display font-bold text-sm sm:text-base smallcaps tracking-wider bg-[#1a1410] text-[#efe6d0] px-8 py-3 border-2 border-[#1a1410] hover:bg-[#722637] hover:border-[#722637] transition-colors"
        >
          Mulai Percobaan →
        </button>
      </section>
    )
  }

  // ===== SHUFFLING =====
  if (phase === 'shuffling') {
    return (
      <section className="py-16 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="font-display text-5xl mb-4 text-[#722637]"
        >
          ♣
        </motion.div>
        <p className="font-display text-xl smallcaps tracking-widest text-[#2c241b]">Mengocok...</p>
        <p className="font-body italic text-sm text-[#6e5f4c] mt-2">
          Acak seragam dari 52! permutasi
        </p>
      </section>
    )
  }

  // ===== REVEAL-SELECTION (52 cards) =====
  if (phase === 'reveal-selection') {
    return (
      <section>
        <div className="mb-4">
          <span className="smallcaps text-[10px] text-[#722637] tracking-widest">§ I.1 — Seleksi</span>
          <h3 className="font-display font-bold text-xl sm:text-2xl mt-1">Pilih Satu Kartu</h3>
          <p className="font-body text-sm text-[#6e5f4c] italic mt-1">
            Klik salah satu. Hafalkan. Jangan tunjukkan ke siapa pun — mesin pun tidak akan tahu,
            setidaknya bukan dari pilihannya sendiri.
          </p>
        </div>
        <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 justify-items-center">
          {shuffledDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.015, duration: 0.2 }}
            >
              <MiniCard card={card} size="sm" onClick={() => onChooseCard(card)} />
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  // ===== MEMORIZE =====
  if (phase === 'memorize' && selectedCard) {
    return (
      <section className="py-8 text-center">
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">§ I.2 — Pengingat</span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-6">Hafalkan Kartumu</h3>
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4"
        >
          <MiniCard card={selectedCard} size="lg" highlight />
        </motion.div>
        <p className="font-body text-base text-[#2c241b]">
          Kartu terpilih: <span className="font-display font-bold text-[#722637] text-lg">{selectedCard.label}</span>
        </p>
        <p className="font-body italic text-xs text-[#6e5f4c] mt-2 mb-6 max-w-sm mx-auto">
          Tidak ada yang melihat ini selain engkau sendiri. Mesin tidak akan melihat pilihanmu —
          ia hanya akan memeriksa keberadaannya.
        </p>
        <button
          onClick={onTrikProper}
          className="font-display font-bold text-sm smallcaps tracking-wider bg-[#1a1410] text-[#efe6d0] px-8 py-3 border-2 border-[#1a1410] hover:bg-[#722637] hover:border-[#722637] transition-colors"
        >
          Serahkan ke Mesin →
        </button>
      </section>
    )
  }

  // ===== TRICK-PREP =====
  if (phase === 'trick-prep') {
    return (
      <section className="py-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="font-display text-4xl mb-4 text-[#8a6b1f]"
        >
          ♦
        </motion.div>
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">§ I.3 — Persiapan</span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1">Mesin Mengambil 27 Kartu</h3>
        <p className="font-body text-sm text-[#6e5f4c] italic mt-2 mb-6 max-w-md mx-auto">
          Mesin menyisihkan dua-puluh-tujuh kartu (termasuk kartumu) untuk trik ini. Angka 27
          dipilih bukan kebetulan: <span className="font-mono not-italic">27 = 3³</span>, sehingga
          tiga ronde pembagian akan menemukan kartumu pasti.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto">
          {workingDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <MiniCard card={card} size="sm" faceDown highlight={card.id === selectedCard?.id} />
            </motion.div>
          ))}
        </div>
      </section>
    )
  }

  // ===== DEALING =====
  if (phase === 'dealing') {
    return (
      <section>
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">
          § I.{round + 3} — Pembagian Ronde {round}
        </span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-4">
          Mesin Membagi ke Tiga Tumpukan
        </h3>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {piles.map((pile, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="smallcaps text-[10px] text-[#6e5f4c] tracking-widest mb-2">
                Tumpukan {romanize(i + 1)}
              </div>
              <div className="relative h-44 w-full flex items-end justify-center">
                <AnimatePresence>
                  {pile.map((card, j) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: -150 }}
                      animate={{ opacity: 1, y: -j * 3, x: j * 0.5 }}
                      transition={{ delay: j * 0.04, duration: 0.25 }}
                      className="absolute"
                      style={{ zIndex: j }}
                    >
                      <MiniCard card={card} size="sm" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="font-mono text-[10px] text-[#6e5f4c] mt-1">
                {pile.length} kartu
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ===== ASK-PILE =====
  if (phase === 'ask-pile') {
    const isLastPile = currentAskPile === PILE_COUNT - 1
    return (
      <section>
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">
          § I.{round + 3} — Interogasi Ronde {round}
        </span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-2">
          Apakah Kartumu di Tumpukan {romanize(currentAskPile + 1)}?
        </h3>
        <p className="font-body text-sm text-[#6e5f4c] italic mb-4">
          Kartumu: <span className="font-display font-bold not-italic text-[#722637]">{selectedCard?.label}</span>
        </p>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6">
          {piles.map((pile, i) => {
            const isCurrent = i === currentAskPile
            const isPast = i < currentAskPile
            return (
              <motion.div
                key={i}
                animate={isCurrent ? { scale: 1.04 } : { scale: 1 }}
                className={`flex flex-col items-center p-2 border-2 ${
                  isCurrent ? 'border-[#722637] bg-[#f5ecd5]/40' : isPast ? 'border-[#d4c4a3] opacity-50' : 'border-transparent'
                }`}
              >
                <div className="smallcaps text-[10px] text-[#6e5f4c] tracking-widest mb-2">
                  Tumpukan {romanize(i + 1)}
                  {isPast && <span className="ml-1 not-italic">✗</span>}
                  {isCurrent && <span className="ml-1 not-italic text-[#722637]">←</span>}
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
                <div className="font-mono text-[10px] text-[#6e5f4c] mt-1">
                  {pile.length} kartu
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => onAnswer(true)}
            className="font-display font-bold text-sm smallcaps tracking-wider bg-[#1a1410] text-[#efe6d0] px-6 py-2.5 border-2 border-[#1a1410] hover:bg-[#722637] hover:border-[#722637] transition-colors"
          >
            Ya, ada
          </button>
          {!isLastPile && (
            <button
              onClick={() => onAnswer(false)}
              className="font-display font-bold text-sm smallcaps tracking-wider bg-transparent text-[#1a1410] px-6 py-2.5 border-2 border-[#1a1410] hover:bg-[#1a1410] hover:text-[#efe6d0] transition-colors"
            >
              Tidak
            </button>
          )}
        </div>
        {isLastPile && (
          <p className="font-body italic text-xs text-[#6e5f4c] mt-3 text-center">
            Tumpukan terakhir — kartumu pasti di sini.
          </p>
        )}
      </section>
    )
  }

  // ===== COLLECTING =====
  if (phase === 'collecting' && pickedPile !== null) {
    return (
      <section>
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">
          § I.{round + 3} — Pengumpulan
        </span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-4">
          Tumpukan {romanize(pickedPile + 1)} Disisihkan
        </h3>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {piles.map((pile, i) => {
            const isPicked = i === pickedPile
            return (
              <div
                key={i}
                className={`flex flex-col items-center p-2 border-2 ${
                  isPicked ? 'border-[#722637] bg-[#f5ecd5]/60 scale-105' : 'border-[#d4c4a3] opacity-30'
                } transition-all`}
              >
                <div className="smallcaps text-[10px] text-[#6e5f4c] tracking-widest mb-2">
                  Tumpukan {romanize(i + 1)}{isPicked && ' ★'}
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
                <div className="font-mono text-[10px] text-[#6e5f4c] mt-1">
                  {pile.length} kartu
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // ===== FINAL-REVEAL =====
  if (phase === 'final-reveal' && finalThree.length === 3) {
    return (
      <section className="py-6 text-center">
        <span className="smallcaps text-[10px] text-[#722637] tracking-widest">
          § I.{ROUNDS + 3} — Penyingkapan Akhir
        </span>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 mb-2">
          Tiga Kartu yang Tersisa
        </h3>
        <p className="font-body text-sm text-[#6e5f4c] italic mb-6 max-w-md mx-auto">
          Setelah dua ronde pembagian, hanya tiga kartu tersisa. Salah satunya — dengar baik-baik —
          adalah kartumu.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
          {finalThree.map((card, i) => {
            const revealed = i < revealIndex
            const isUserCard = selectedCard?.id === card.id
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="smallcaps text-[10px] text-[#6e5f4c] tracking-widest mb-2">
                  Posisi {romanize(i + 1)}
                </div>
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
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="smallcaps text-[10px] text-[#722637] tracking-widest mt-2"
                  >
                    ★ Kartumu ★
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {revealIndex < 3 && !autoReveal && (
          <button
            onClick={onTriggerReveal}
            className="font-display font-bold text-sm smallcaps tracking-wider bg-[#722637] text-[#efe6d0] px-8 py-3 border-2 border-[#722637] hover:bg-[#5a1c2a] hover:border-[#5a1c2a] transition-colors"
          >
            Buka Kartu →
          </button>
        )}
      </section>
    )
  }

  // ===== TRICK-REVEAL =====
  if (phase === 'trick-reveal' && selectedCard) {
    return (
      <section className="py-10 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="font-display text-6xl text-[#722637] mb-4 select-none"
        >
          ♥
        </motion.div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1a1410] mb-2">
          Percobaan Berhasil
        </h2>
        <p className="font-display italic text-lg sm:text-xl text-[#722637] mb-4">
          kartu pilihanmu — {selectedCard.label} — ditemukan
        </p>
        <p className="font-body text-base text-[#2c241b] max-w-md mx-auto mb-8">
          Meski engkau yang memilih, yang mengocok, yang menjawab — mesin tetap menemukan
          kartumu. Bukan sihir. Bukan keberuntungan. Hanya <span className="font-mono text-sm bg-[#e6dcc4] px-1.5 py-0.5">c* = D − R</span>.
        </p>
        <button
          onClick={onReset}
          className="font-display font-bold text-sm smallcaps tracking-wider bg-[#1a1410] text-[#efe6d0] px-8 py-3 border-2 border-[#1a1410] hover:bg-[#722637] hover:border-[#722637] transition-colors"
        >
          ↻ Ulang Percobaan
        </button>
      </section>
    )
  }

  // Fallback
  return (
    <div className="text-center py-8">
      <button onClick={onReset} className="font-display text-sm underline">Reset</button>
    </div>
  )
}

// ===== Helper: Roman numerals =====
function romanize(num: number): string {
  const lookup: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let result = ''
  let n = num
  for (const [v, s] of lookup) {
    while (n >= v) {
      result += s
      n -= v
    }
  }
  return result || 'I'
}
