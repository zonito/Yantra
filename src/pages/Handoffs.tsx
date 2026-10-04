import { useState } from 'react'
import { motion } from 'framer-motion'
import { handoffs, type Handoff } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

function HandoffCard({ h, i }: { h: Handoff; i: number }) {
  const [open, setOpen] = useState(false)
  const control = h.riskKind === 'control'
  return (
    <motion.div
      layout
      onClick={() => setOpen((o) => !o)}
      className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-100">{h.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${
            control ? 'bg-emerald-400/10 text-emerald-300' : 'bg-red-400/10 text-red-300'
          }`}
        >
          {control ? 'CONTROL' : 'RISK'}
        </span>
      </div>
      <p className={`mt-2 font-mono text-[11px] leading-snug ${control ? 'text-emerald-300/80' : 'text-red-300/80'}`}>
        {h.risk}
      </p>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <dl className="mt-4 space-y-2.5 border-t border-zinc-800 pt-4">
          {[
            ['Producer', h.producer],
            ['Artifact', h.artifact],
            ['Consumer', h.consumer],
            ['Contract today', h.contract],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{k}</dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-zinc-300">{v}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
      {!open && (
        <p className="mt-3 text-[11px] text-zinc-600">Tap for producer · artifact · consumer · contract</p>
      )}
    </motion.div>
  )
}

export default function Handoffs() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Handoffs' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Handoffs
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Where reliability is won or lost
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Each boundary needs an explicit contract: who produces it, who consumes it, what
        \u201cfresh\u201d means, and how the consumer fails when it is absent.
      </p>
      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {handoffs.map((h, i) => (
          <HandoffCard key={h.id} h={h} i={i} />
        ))}
      </div>
    </div>
  )
}
