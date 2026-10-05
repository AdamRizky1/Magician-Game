'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { MathExplanation } from '@/components/math/MathExplanation'
import { ContextualMath } from '@/components/math/ContextualMath'
import type { GamePhase, PokerCard } from '@/components/math/types'

// ===== Konstanta =====
const FULL_DECK_SIZE = 52
const TRICK_SIZE = 27
const PILE_COUNT = 3
const ROUNDS = 2

// ===== Util kartu =====
const SUITS: { suit: PokerCard['suit']; symbol: string; color: PokerCard['color'] }[] = [
  { suit: 'hearts', symbol: '♥', color: 'red' },
  { suit: 'diamonds', symbol: '♦', color: 'red' },
  { suit: 'clubs', symbol: '♣', color: 'black' },
  { suit: 'spades', symbol: '♠', color: 'black' },
]

const RANKS: { rank: string; value: number }[] = [
  { rank: 'A', value: 1 }, { rank: '2', value: 2 }, { rank: '3', value: 3 },
  { rank: '4', value: 4 }, { rank: '5', value: 5 }, { rank: '6', value: 6 },
  { rank: '7', value: 7 }, { rank: '8', value: 8 }, { rank: '9', value: 9 },
  { rank: '10', value: 10 }, { rank: 'J', value: 11 }, { rank: 'Q', value: 12 },
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

// ===== Playing card — brutalist minimal =====
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

  const base = `relative cursor-pointer select-none border transition-all duration-100 ${dims} ${dim ? 'opacity-30' : ''}`

  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`${base} bg-[#0a0a0a] border-[#0a0a0a] hover:border-[#c41e3a]`}
      />
    )
  }

  if (!card) return <div className={`${dims} border border-[#e5e5e5] bg-white`} />

  const isRed = card.color === 'red'
  const inkColor = isRed ? 'text-[#c41e3a]' : 'text-[#0a0a0a]'
  const borderColor = highlight ? 'border-[#c41e3a]' : selected ? 'border-[#0a0a0a] border-2' : 'border-[#0a0a0a]'

  return (
    <div
      onClick={onClick}
      className={`${base} bg-white hover:-translate-y-0.5 flex flex-col items-center justify-center p-1 ${borderColor}`}
    >
      <span className={`font-mono font-bold leading-none ${inkColor}`}>{card.rank}</span>
      <span className={`text-sm leading-none ${inkColor}`}>
        {SUITS.find((s) => s.suit === card.suit)?.symbol}
      </span>
    </div>
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
  const [inspectPileIdx, setInspectPileIdx] = useState<number | null>(null)

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
    setInspectPileIdx(null)
    const shuffled = shuffle(fullDeck)
    setShuffledDeck(shuffled)
    setTimeout(() => setPhase('reveal-selection'), 900)
  }, [fullDeck])

  const chooseCard = useCallback((card: PokerCard) => {
    setSelectedCard(card)
    setPhase('memorize')
  }, [])

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
    setInspectPileIdx(null)
  }, [])

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

  // Phase number for "current step" indicator
  const stepNum = useMemo(() => {
    const map: Record<GamePhase, string> = {
      intro: '00',
      shuffling: '01',
      'reveal-selection': '02',
      memorize: '03',
      'trick-prep': '04',
      dealing: '05',
      'ask-pile': '06',
      collecting: '07',
      'final-reveal': '08',
      'trick-reveal': '09',
      completed: '10',
    }
    return map[phase] || '00'
  }, [phase])

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* Sticky minimal header */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-[#c41e3a] font-bold">TRIK SULAP KARTU</span>
            <span className="font-mono text-[10px] text-[#737373] hidden sm:inline">DETERMINISTIK</span>
          </div>
          <div className="font-mono text-[10px] text-[#737373]">
            step {stepNum} · {Math.round(progress)}%
          </div>
        </div>
        {/* Thin progress line */}
        <div className="h-px bg-[#e5e5e5] relative">
          <div
            className="absolute top-0 left-0 h-px bg-[#c41e3a] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <Tabs defaultValue="game" className="w-full">
          {/* Tabs — brutalist style */}
          <div className="border-b border-[#0a0a0a] mb-8">
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-0 w-auto inline-flex">
              <TabsTrigger
                value="game"
                className="font-mono text-xs font-bold tracking-widest data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white data-[state=active]:shadow-none border border-[#0a0a0a] -mr-px px-5 py-2.5 rounded-none transition-colors"
              >
                01 / GAME
              </TabsTrigger>
              <TabsTrigger
                value="math"
                className="font-mono text-xs font-bold tracking-widest data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white data-[state=active]:shadow-none border border-[#0a0a0a] -ml-px px-5 py-2.5 rounded-none transition-colors"
              >
                02 / TREATISE
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ===== TAB: GAME ===== */}
          <TabsContent value="game">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0">
              {/* Game stage */}
              <div className="lg:pr-8 lg:border-r lg:border-[#e5e5e5] lg:min-h-[600px]">
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
                  onInspectPile={setInspectPileIdx}
                />
              </div>

              {/* Contextual math side panel */}
              <div className="lg:pl-0 mt-8 lg:mt-0">
                <ContextualMath
                  phase={phase}
                  round={round}
                  rounds={ROUNDS}
                  selectedCard={selectedCard}
                  piles={piles}
                  currentAskPile={currentAskPile}
                  pickedPile={pickedPile}
                  workingDeckSize={workingDeck.length}
                  finalThreeSize={finalThree.length}
                />
              </div>
            </div>
          </TabsContent>

          {/* ===== TAB: MATH ===== */}
          <TabsContent value="math">
            <MathExplanation />
          </TabsContent>
        </Tabs>
      </main>

      {/* Inspect pile modal */}
      <Dialog
        open={inspectPileIdx !== null}
        onOpenChange={(open) => { if (!open) setInspectPileIdx(null) }}
      >
        <DialogContent className="bg-white border-2 border-[#0a0a0a] max-w-2xl p-0">
          {inspectPileIdx !== null && piles[inspectPileIdx] && (
            <>
              <DialogHeader className="p-5 border-b border-[#0a0a0a]">
                <DialogTitle className="font-display font-bold text-xl text-[#0a0a0a]">
                  Tumpukan P{inspectPileIdx + 1}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-[#737373]">
                  {piles[inspectPileIdx].length} kartu · ronde {round}/{ROUNDS}
                  {selectedCard && piles[inspectPileIdx].some(c => c.id === selectedCard.id) && (
                    <span className="ml-2 text-[#c41e3a] font-bold">
                      · kartumu ada di sini
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 justify-items-center">
                  {piles[inspectPileIdx].map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                    >
                      <MiniCard
                        card={card}
                        size="sm"
                        highlight={selectedCard?.id === card.id}
                      />
                    </motion.div>
                  ))}
                </div>
                {selectedCard && piles[inspectPileIdx].some(c => c.id === selectedCard.id) && (
                  <p className="font-mono text-xs text-[#c41e3a] mt-4 text-center font-bold">
                    ✓ {selectedCard.label} ada di tumpukan ini
                  </p>
                )}
              </div>
              <div className="p-4 border-t border-[#e5e5e5] flex justify-end">
                <button
                  onClick={() => setInspectPileIdx(null)}
                  className="font-mono text-xs font-bold tracking-widest bg-[#0a0a0a] text-white px-5 py-2 hover:bg-[#c41e3a] transition-colors"
                >
                  TUTUP
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
  onInspectPile: (idx: number) => void
}

function GameStage(props: GameStageProps) {
  const {
    phase, shuffledDeck, workingDeck, selectedCard, piles, currentAskPile,
    pickedPile, round, finalThree, revealIndex, autoReveal,
    onStart, onChooseCard, onTrikProper, onAnswer, onTriggerReveal, onReset, onInspectPile,
  } = props

  if (phase === 'intro') {
    return (
      <section className="py-10 sm:py-20">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-4">
          00 / INIT
        </div>
        <h2 className="font-display font-bold text-4xl sm:text-6xl leading-[0.95] mb-4 max-w-xl">
          Sebuah percobaan deterministik.
        </h2>
        <p className="font-body text-base sm:text-lg leading-relaxed text-[#404040] max-w-md mb-8">
          Pilih satu kartu dari 52. Sistem akan menemukan kartu tersebut di antara 3 kartu
          terakhir. Tanpa keberuntungan. Hanya operasi matematis pada himpunan terbatas.
        </p>
        <button
          onClick={onStart}
          className="font-mono text-xs font-bold tracking-widest bg-[#0a0a0a] text-white px-7 py-3 hover:bg-[#c41e3a] transition-colors"
        >
          MULAI PERCOBAAN
        </button>
      </section>
    )
  }

  if (phase === 'shuffling') {
    return (
      <section className="py-20">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          01 / SHUFFLE
        </div>
        <h3 className="font-display font-bold text-3xl mb-3">Mengocok 52 kartu.</h3>
        <p className="font-mono text-xs text-[#737373] mb-6">
          σ ~ Uniform(S_52)
        </p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          className="font-mono text-3xl text-[#c41e3a]"
        >
          +
        </motion.div>
      </section>
    )
  }

  if (phase === 'reveal-selection') {
    return (
      <section>
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          02 / SELECT
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">Pilih satu kartu.</h3>
        <p className="font-body text-sm text-[#737373] mb-5">
          Klik salah satu kartu di bawah. Hafalkan. Sistem tidak akan mengamati pilihanmu.
        </p>
        <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 justify-items-center">
          {shuffledDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: -8 }}
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

  if (phase === 'memorize' && selectedCard) {
    return (
      <section className="py-8">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          03 / MEMORIZE
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-6">Hafalkan kartumu.</h3>
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block mb-5"
        >
          <MiniCard card={selectedCard} size="lg" highlight />
        </motion.div>
        <p className="font-body text-sm text-[#737373] mb-6">
          Kartu terpilih: <span className="font-mono font-bold text-[#c41e3a] text-base">{selectedCard.label}</span>
        </p>
        <button
          onClick={onTrikProper}
          className="font-mono text-xs font-bold tracking-widest bg-[#0a0a0a] text-white px-7 py-3 hover:bg-[#c41e3a] transition-colors"
        >
          SERAHKAN KE SISTEM
        </button>
      </section>
    )
  }

  if (phase === 'trick-prep') {
    return (
      <section className="py-10">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          04 / NARROW
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">Sistem menyisihkan 27 kartu.</h3>
        <p className="font-mono text-xs text-[#737373] mb-6">
          |W₀| = 27 · 27 = 3³
        </p>
        <div className="flex flex-wrap items-center gap-1.5 max-w-2xl">
          {workingDeck.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.5 }}
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

  if (phase === 'dealing') {
    return (
      <section>
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          05 / DEAL · R{round}
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">
          Sistem membagi ke 3 tumpukan.
        </h3>
        <p className="font-body text-xs text-[#737373] mb-5">
          Klik tombol INSPEKSI untuk lihat isi tumpukan.
        </p>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {piles.map((pile, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="font-mono text-[10px] text-[#737373] tracking-widest mb-2">
                P{i + 1} · {pile.length}
              </div>
              <div className="relative h-44 w-full flex items-end justify-center mb-3">
                <AnimatePresence>
                  {pile.map((card, j) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: -120 }}
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
              <button
                onClick={() => onInspectPile(i)}
                className="font-mono text-xs font-bold tracking-widest bg-white text-[#0a0a0a] px-4 py-2.5 border-2 border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors w-full"
              >
                INSPEKSI P{i + 1}
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (phase === 'ask-pile') {
    const isLastPile = currentAskPile === PILE_COUNT - 1
    return (
      <section>
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          06 / QUERY · R{round}
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">
          Apakah kartumu di P{currentAskPile + 1}?
        </h3>
        <p className="font-mono text-xs text-[#737373] mb-5">
          c* = <span className="text-[#c41e3a] font-bold">{selectedCard?.label}</span>
          <span className="ml-3 text-[#737373]">klik tombol INSPEKSI untuk lihat isi tumpukan</span>
        </p>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6">
          {piles.map((pile, i) => {
            const isCurrent = i === currentAskPile
            const isPast = i < currentAskPile
            return (
              <motion.div
                key={i}
                animate={isCurrent ? { scale: 1.04 } : { scale: 1 }}
                className={`flex flex-col items-center p-2 border ${isCurrent ? 'border-[#c41e3a] bg-[#fafaf7]' : isPast ? 'border-[#e5e5e5] opacity-50' : 'border-[#0a0a0a]'}`}
              >
                <div className="font-mono text-[10px] text-[#737373] tracking-widest mb-2">
                  P{i + 1} · {pile.length}
                  {isPast && <span className="ml-1">✗</span>}
                  {isCurrent && <span className="ml-1 text-[#c41e3a]">←</span>}
                </div>
                <div className="relative h-44 w-full flex items-end justify-center mb-3">
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
                <button
                  onClick={() => onInspectPile(i)}
                  className="font-mono text-xs font-bold tracking-widest bg-white text-[#0a0a0a] px-3 py-2.5 border-2 border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors w-full"
                >
                  INSPEKSI P{i + 1}
                </button>
              </motion.div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onAnswer(true)}
            className="font-mono text-xs font-bold tracking-widest bg-[#0a0a0a] text-white px-6 py-2.5 hover:bg-[#c41e3a] transition-colors"
          >
            YA
          </button>
          {!isLastPile && (
            <button
              onClick={() => onAnswer(false)}
              className="font-mono text-xs font-bold tracking-widest bg-white text-[#0a0a0a] px-6 py-2.5 border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors"
            >
              TIDAK
            </button>
          )}
        </div>
        {isLastPile && (
          <p className="font-body italic text-xs text-[#737373] mt-3">
            Tumpukan terakhir. Kartu pasti di sini.
          </p>
        )}
      </section>
    )
  }

  if (phase === 'collecting' && pickedPile !== null) {
    return (
      <section>
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          07 / UPDATE · R{round}
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-5">
          P{pickedPile + 1} disisihkan.
        </h3>
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {piles.map((pile, i) => {
            const isPicked = i === pickedPile
            return (
              <div
                key={i}
                className={`flex flex-col items-center p-2 border ${isPicked ? 'border-[#0a0a0a] bg-[#fafaf7] scale-105' : 'border-[#e5e5e5] opacity-30'} transition-all`}
              >
                <div className="font-mono text-[10px] text-[#737373] tracking-widest mb-2">
                  P{i + 1}{isPicked && ' · ★'}
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
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  if (phase === 'final-reveal' && finalThree.length === 3) {
    return (
      <section className="py-6">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          08 / CONVERGE
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl mb-2">Tiga kartu tersisa.</h3>
        <p className="font-body text-sm text-[#737373] italic mb-6 max-w-md">
          |W₂| = 3. Kartu pengguna pasti ada di antaranya.
        </p>

        <div className="flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
          {finalThree.map((card, i) => {
            const revealed = i < revealIndex
            const isUserCard = selectedCard?.id === card.id
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="font-mono text-[10px] text-[#737373] tracking-widest mb-2">
                  {i + 1}/3
                </div>
                <motion.div
                  animate={
                    isUserCard && revealed
                      ? { scale: [1, 1.15, 1], rotateZ: [0, -3, 0] }
                      : { scale: 1, rotateZ: 0 }
                  }
                  transition={{ duration: 0.5, repeat: isUserCard && revealed ? 1 : 0 }}
                >
                  <MiniCard card={card} size="lg" faceDown={!revealed} highlight={isUserCard && revealed} />
                </motion.div>
                {isUserCard && revealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[10px] text-[#c41e3a] font-bold tracking-widest mt-2"
                  >
                    KARTUMU
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {revealIndex < 3 && !autoReveal && (
          <button
            onClick={onTriggerReveal}
            className="font-mono text-xs font-bold tracking-widest bg-[#c41e3a] text-white px-7 py-3 hover:bg-[#0a0a0a] transition-colors"
          >
            BUKA KARTU
          </button>
        )}
      </section>
    )
  }

  if (phase === 'trick-reveal' && selectedCard) {
    return (
      <section className="py-10">
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-3">
          09 / RESOLVE
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl mb-2 leading-tight">
          Percobaan berhasil.
        </h2>
        <p className="font-body text-base text-[#404040] mb-2">
          Kartu pengguna ditemukan:{' '}
          <span className="font-mono font-bold text-[#c41e3a] text-lg">{selectedCard.label}</span>
        </p>
        <p className="font-body text-sm text-[#737373] mb-8 max-w-md">
          Operasi selesai. Determinisme terjaga sepanjang proses.
        </p>
        <button
          onClick={onReset}
          className="font-mono text-xs font-bold tracking-widest bg-[#0a0a0a] text-white px-7 py-3 hover:bg-[#c41e3a] transition-colors"
        >
          ULANG
        </button>
      </section>
    )
  }

  return null
}
