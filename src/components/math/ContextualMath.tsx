'use client'

import { Math } from './MathBlocks'
import type { GamePhase } from './types'
import type { PokerCard } from './types'

/**
 * ContextualMath — side panel yang update tiap game phase.
 * Menunjukkan operasi matematis yang SEDANG terjadi saat ini.
 */

interface ContextualMathProps {
  phase: GamePhase
  round: number
  rounds: number
  selectedCard: PokerCard | null
  piles: PokerCard[][]
  currentAskPile: number
  pickedPile: number | null
  workingDeckSize: number
  finalThreeSize: number
}

export function ContextualMath({
  phase,
  round,
  rounds,
  selectedCard,
  piles,
  currentAskPile,
  pickedPile,
  workingDeckSize,
  finalThreeSize,
}: ContextualMathProps) {
  return (
    <aside className="bg-[#0a0a0a] text-[#fafaf7] p-6 sm:p-7 lg:sticky lg:top-6 lg:self-start h-full lg:h-auto">
      {/* Header — minimal */}
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-mono text-[10px] tracking-widest text-[#737373]">
          MATH TRACE
        </span>
        <span className="font-mono text-[10px] text-[#737373]">
          phase: <span className="text-[#c41e3a]">{phase}</span>
        </span>
      </div>

      {/* Phase-specific math */}
      <PhaseMath
        phase={phase}
        round={round}
        rounds={rounds}
        selectedCard={selectedCard}
        piles={piles}
        currentAskPile={currentAskPile}
        pickedPile={pickedPile}
        workingDeckSize={workingDeckSize}
        finalThreeSize={finalThreeSize}
      />

      {/* Bottom invariant */}
      <div className="mt-8 pt-4 border-t border-[#262626]">
        <div className="font-mono text-[10px] text-[#737373] mb-1">INVARIANT</div>
        <div className="font-mono text-xs text-[#fafaf7] break-words">
          <Math tex="c^* \in \mathcal{W}_r" /> at all times
        </div>
      </div>
    </aside>
  )
}

function PhaseMath({
  phase,
  round,
  rounds,
  selectedCard,
  piles,
  currentAskPile,
  pickedPile,
  workingDeckSize,
  finalThreeSize,
}: ContextualMathProps) {
  switch (phase) {
    case 'intro':
      return (
        <Block label="INIT" desc="Initial state.">
          <Line label="DECK">
            <Math tex="\mathcal{D} = \{c_1, \ldots, c_{52}\}" />
          </Line>
          <Line label="CARDINALITY">
            <Math tex="|\mathcal{D}| = 52" />
          </Line>
          <Note>Standard poker deck. 13 ranks × 4 suits. Fixed reference set.</Note>
        </Block>
      )

    case 'shuffling':
      return (
        <Block label="SHUFFLE" desc="Uniform random permutation.">
          <Line label="OP">
            <Math tex="\sigma : [52] \to [52]" />
          </Line>
          <Line label="DIST">
            <Math tex="\sigma \sim \text{Uniform}(\mathfrak{S}_{52})" />
          </Line>
          <Line label="OUTPUT">
            <Math tex="\text{deck}' = \sigma(\mathcal{D})" />
          </Line>
          <Note>Random but uniform. Every permutation equally likely. Does not affect determinism of subsequent steps.</Note>
        </Block>
      )

    case 'reveal-selection':
      return (
        <Block label="SELECT" desc="User picks one card.">
          <Line label="INPUT">
            <Math tex="\text{deck}'" />
          </Line>
          <Line label="OP">
            <Math tex="\text{user picks } c^* \in \mathcal{D}" />
          </Line>
          <Line label="HIDDEN">
            <Math tex="c^* \perp \text{system}" />
          </Line>
          <Note>System does not observe this choice. Information asymmetry established.</Note>
        </Block>
      )

    case 'memorize':
      return (
        <Block label="MEMORIZE" desc="User internalizes c*.">
          <Line label="USER STATE">
            <Math tex="\text{knows}(c^*)" />
          </Line>
          <Line label="SYSTEM STATE">
            <Math tex="\text{blind}(c^*)" />
          </Line>
          {selectedCard && (
            <Line label="VALUE">
              <span className="font-mono text-[#c41e3a] font-bold">{selectedCard.label}</span>
            </Line>
          )}
          <Note>Information persists in user memory only. System has no read access.</Note>
        </Block>
      )

    case 'trick-prep':
      return (
        <Block label="NARROW" desc="System narrows to working set.">
          <Line label="OP">
            <Math tex="\mathcal{W}_0 := \{c^*\} \cup \text{sample}(\mathcal{D} \setminus \{c^*\}, 26)" />
          </Line>
          <Line label="SIZE">
            <Math tex="|\mathcal{W}_0| = 27" />
          </Line>
          <Line label="WHY 27">
            <Math tex="27 = 3^3" /> (clean 3-way convergence)
          </Line>
          {workingDeckSize > 0 && (
            <Line label="ACTUAL">
              <span className="font-mono text-xs text-[#fafaf7]">|W₀| = {workingDeckSize}</span>
            </Line>
          )}
          <Note>System ensures c* ∈ W₀. From here, every step is deterministic.</Note>
        </Block>
      )

    case 'dealing':
      return (
        <Block label={`DEAL · R${round}`} desc="Partition working set into 3 piles.">
          <Line label="INPUT">
            <Math tex={String.raw`\mathcal{W}_{${round - 1}}, \; |\mathcal{W}_{${round - 1}}| = N_{${round - 1}}`} />
          </Line>
          <Line label="OP">
            <Math tex={String.raw`\mathcal{W}_{${round - 1}} \to \{P_1, P_2, P_3\}`} />
          </Line>
          <Line label="PARTITION">
            <Math tex={String.raw`P_i = \{x \in \mathcal{W}_{${round - 1}} : \text{pos}(x) \equiv i \pmod{3}\}`} />
          </Line>
          <Line label="SIZES">
            {piles.map((p, i) => (
              <span key={i} className="font-mono text-xs text-[#fafaf7] mr-3">
                |P{i+1}|={p.length}
              </span>
            ))}
          </Line>
          <Note>Column-by-column deal. Each pile has ⌈N/3⌉ or ⌊N/3⌋ cards.</Note>
        </Block>
      )

    case 'ask-pile':
      return (
        <Block label={`QUERY · R${round}`} desc="System queries: c* ∈ P_i?">
          <Line label="QUERY">
            <Math tex={String.raw`\text{Is } c^* \in P_{${currentAskPile + 1}} \text{?}`} />
          </Line>
          <Line label="USER">
            <Math tex="t \in \{\text{yes}, \text{no}\}" />
          </Line>
          <Line label="TRUTH">
            <Math tex={String.raw`P(t = \text{yes} \mid c^* \in P_{${currentAskPile + 1}}) = 1`} />
          </Line>
          <Note>Honest answer required. System learns which pile contains c*.</Note>
        </Block>
      )

    case 'collecting':
      return (
        <Block label={`UPDATE · R${round}`} desc="Working set := chosen pile.">
          <Line label="INPUT">
            <Math tex={String.raw`t_{${round}} = ${pickedPile !== null ? pickedPile + 1 : '?'}`} />
          </Line>
          <Line label="OP">
            <Math tex={String.raw`\mathcal{W}_{${round}} := P_{${(pickedPile ?? 0) + 1}}`} />
          </Line>
          <Line label="INVARIANT">
            <Math tex={String.raw`c^* \in \mathcal{W}_{${round}}`} />
          </Line>
          <Note>Cardinality shrinks by factor 3. Invariant preserved.</Note>
        </Block>
      )

    case 'final-reveal':
      return (
        <Block label="CONVERGE" desc="Final 3 cards.">
          <Line label="RESULT">
            <Math tex={String.raw`|\mathcal{W}_{${rounds}}| = 3`} />
          </Line>
          <Line label="CONTAINS">
            <Math tex={String.raw`c^* \in \mathcal{W}_{${rounds}}`} />
          </Line>
          <Line label="SEQUENCE">
            <Math tex={String.raw`\mathcal{W}_{${rounds}} = \{c_1, c_2, c_3\}`} />
          </Line>
          <Note>Convergence theorem: after r rounds, |W_r| = |W₀|/3^r. With W₀=27, r=2: |W_2|=3.</Note>
        </Block>
      )

    case 'trick-reveal':
      return (
        <Block label="RESOLVE" desc="c* identified.">
          <Line label="EQUALS">
            <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          </Line>
          <Line label="WHERE">
            <Math tex="\mathcal{R} = \mathcal{D} \setminus \{c^*\}, \; |\mathcal{R}| = 51" />
          </Line>
          {selectedCard && (
            <Line label="VALUE">
              <span className="font-mono text-[#c41e3a] font-bold text-base">{selectedCard.label}</span>
            </Line>
          )}
          <Note>Set difference. The only element of D not in R is c*. Deterministic, no luck.</Note>
        </Block>
      )

    case 'completed':
      return (
        <Block label="DONE">
          <Line label="CONCLUSION">
            <Math tex="c^* = \mathcal{D} \setminus \mathcal{R}" />
          </Line>
          <Note>Operation complete. Determinism preserved throughout.</Note>
        </Block>
      )

    default:
      return null
  }
}

// ===== Sub-components =====
function Block({
  label,
  desc,
  children,
}: {
  label: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="font-mono text-xs font-bold text-[#fafaf7] tracking-wide">{label}</div>
        {desc && <div className="font-mono text-[10px] text-[#737373] mt-0.5">{desc}</div>}
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2 items-baseline">
      <span className="font-mono text-[10px] text-[#737373] tracking-wider">{label}</span>
      <div className="text-sm text-[#fafaf7] overflow-x-auto">{children}</div>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] leading-relaxed text-[#a3a3a3] italic pt-2">
      {children}
    </p>
  )
}
