import { useState } from 'react'
import { motion } from 'framer-motion'
import { reserveBands, rules1400, rules1430, type Rule } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

function RuleCard({ rule, n, accent }: { rule: Rule; n: number; accent: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.button
      layout
      onClick={() => setOpen((o) => !o)}
      className="w-full cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-colors hover:border-zinc-600"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold"
          style={{ color: accent, background: `${accent}14` }}
        >
          {String(n).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-100">{rule.title}</p>
          <motion.p
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden text-xs leading-relaxed text-zinc-500"
          >
            <span className="block pt-1.5">{rule.body}</span>
          </motion.p>
        </div>
      </div>
    </motion.button>
  )
}

export default function Rules() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Rules' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Guardrails
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        The operating rules that must survive every run
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        14:00 decides what may be staged; 14:30 only finalizes. Tap a rule for the detail.
      </p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        14:00 recommendation pass · 23 non-negotiables
      </h2>
      <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
        {rules1400.map((r, i) => (
          <RuleCard key={r.title} rule={r} n={i + 1} accent="#34d399" />
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        14:30 finalize pass · 6 rules
      </h2>
      <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
        {rules1430.map((r, i) => (
          <RuleCard key={r.title} rule={r} n={i + 1} accent="#fb923c" />
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Reserve bands · ratified 4 Oct 2026
      </h2>
      <p className="mt-2 max-w-2xl text-xs text-zinc-500">
        Net put notional divided by combined IBKR equity.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {reserveBands.map((b, i) => (
          <motion.div
            key={b.band}
            className="rounded-2xl border p-5"
            style={{
              borderColor: ['#34d39955', '#fbbf2455', '#f8717155'][i],
              background: `${['#34d399', '#fbbf24', '#f87171'][i]}0a`,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <p className="font-mono text-lg font-bold text-zinc-100">{b.band}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-200">{b.label}</p>
            <p className="mt-1 text-xs text-zinc-500">{b.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
