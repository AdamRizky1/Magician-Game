'use client'

import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Render rumus LaTeX pakai KaTeX.
 * Mendukung mode inline (default) dan display (block).
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
        className={`katex-block my-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} className={className} />
}

/**
 * Box untuk rumus utama (warna biru, mirip rumusbox di PDF)
 */
export function FormulaBox({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-5 bg-blue-950/40 border-2 border-blue-700/50 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-blue-800/40 px-4 py-2 text-blue-100 font-semibold text-sm border-b border-blue-700/50">
          {title}
        </div>
      )}
      <div className="p-5 text-center text-white overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

/**
 * Box untuk tahapan skenario (warna abu-abu, mirip tahapbox di PDF)
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
    <div className="my-3 bg-slate-800/40 border-l-4 border-slate-500 rounded-r-lg p-4">
      <div className="text-slate-200 font-semibold mb-1.5 flex items-baseline gap-2">
        <span className="text-amber-400 text-sm font-mono">TAHAP {num}</span>
        <span className="text-slate-300">— {title}</span>
      </div>
      <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * Box untuk insight (warna oranye, mirip insightbox di PDF)
 */
export function InsightBox({
  title = 'Insight Penting',
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="my-5 bg-amber-950/30 border-2 border-amber-600/50 rounded-lg p-4">
      <div className="text-amber-300 font-semibold mb-1.5 flex items-center gap-2 text-sm">
        <span>💡</span>
        <span>{title}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * Box untuk definisi/teorema (mirip tcolorbox theorem)
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
    <div className="my-4 bg-slate-800/30 border border-slate-600/50 rounded-lg overflow-hidden">
      <div className="bg-slate-700/40 px-4 py-1.5 text-slate-200 text-xs font-semibold border-b border-slate-600/50">
        <span className="text-emerald-400">{label}</span>{' '}
        <span className="text-slate-300">({title})</span>
      </div>
      <div className="p-4 text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

/**
 * Inline code-style notation untuk variabel himpunan
 */
export function V({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-emerald-300 bg-emerald-950/30 px-1.5 py-0.5 rounded text-sm">
      {children}
    </span>
  )
}
