'use client'

import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Render rumus LaTeX pakai KaTeX.
 * Style: ink-on-paper, no borders, classic typography.
 */
export function Math({
  tex,
  block = false,
  className = '',
}: {
  tex: string
  block?: boolean
  className?: string
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        trust: true,
      })
    } catch (e) {
      console.error('KaTeX render error:', e)
      return tex
    }
  }, [tex, block])

  if (block) {
    return (
      <div
        className={`my-5 py-3 px-4 border-l-2 border-[#722637] bg-[#f5ecd5]/40 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} className={className} />
}

/**
 * Formula box — display dengan label artikel & nomor
 */
export function FormulaBox({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6 border-y-2 border-[#1a1410] py-5 px-2">
      {title && (
        <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-2">
          {title}
        </div>
      )}
      <div className="text-center text-[#1a1410] overflow-x-auto">{children}</div>
    </div>
  )
}

/**
 * Tahapan skenario — pakai numbered article style
 */
export function TahapBox({
  num,
  title,
  children,
}: {
  num: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="my-4 pl-4 border-l-2 border-[#d4c4a3]">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-[10px] text-[#722637] smallcaps tracking-widest">
          §1.{num}
        </span>
        <span className="font-display font-bold text-base text-[#1a1410]">{title}</span>
      </div>
      <div className="font-body text-sm leading-relaxed text-[#2c241b]">{children}</div>
    </div>
  )
}

/**
 * Insight box — pull quote style dengan left border burgundy
 */
export function InsightBox({
  title = 'Catatan Penting',
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6">
      <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-1">
        {title}
      </div>
      <div className="pullquote font-body">
        {children}
      </div>
    </div>
  )
}

/**
 * Definisi / Teorema — numbered article style
 */
export function DefBox({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="my-5">
      <div className="smallcaps text-[10px] text-[#722637] tracking-widest mb-1">
        {label} — {title}
      </div>
      <div className="font-body text-sm leading-relaxed text-[#2c241b] pl-4 border-l border-[#d4c4a3]">
        {children}
      </div>
    </div>
  )
}

/**
 * Inline variable — mono style
 */
export function V({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[13px] bg-[#e6dcc4] px-1 py-0.5 border border-[#d4c4a3]">
      {children}
    </span>
  )
}
