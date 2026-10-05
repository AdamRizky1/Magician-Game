export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type SuitColor = 'red' | 'black'

export interface PokerCard {
  id: string
  rank: string
  rankValue: number
  suit: Suit
  color: SuitColor
  label: string
}

export type GamePhase =
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
