'use client'

import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Inline math via KaTeX. No styling, just typography.
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
        className={`my-3 overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} className={className} />
}

/**
 * Display formula block — monospace style, like code
 */
export function FormulaBox({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6">
      {title && (
        <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-2">
          {title}
        </div>
      )}
      <div className="border-l-2 border-[#c41e3a] pl-4 py-2 bg-[#fafaf7] overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

/**
 * Tahapan skenario — numbered, no decoration
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
    <div className="grid grid-cols-[40px_1fr] gap-3 my-4">
      <div className="font-mono text-sm text-[#737373] pt-0.5">
        {String(num).padStart(2, '0')}
      </div>
      <div>
        <h4 className="font-display font-bold text-base text-[#0a0a0a] mb-1">{title}</h4>
        <div className="font-body text-sm leading-relaxed text-[#404040]">{children}</div>
      </div>
    </div>
  )
}

/**
 * Insight — just bold paragraph with accent
 */
export function InsightBox({
  title = 'CATATAN',
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6 py-4 border-t border-b border-[#0a0a0a]">
      <div className="font-mono text-[10px] tracking-widest text-[#c41e3a] mb-2">
        {title}
      </div>
      <div className="font-body text-base leading-relaxed text-[#0a0a0a]">
        {children}
      </div>
    </div>
  )
}

/**
 * Definisi / Teorema — minimal labels
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
      <div className="font-mono text-[10px] tracking-widest text-[#737373] mb-2">
        {label} · {title}
      </div>
      <div className="font-body text-sm leading-relaxed text-[#0a0a0a] pl-3 border-l border-[#e5e5e5]">
        {children}
      </div>
    </div>
  )
}

/**
 * Inline variable — code style
 */
export function V({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[13px] text-[#c41e3a]">
      {children}
    </span>
  )
}
