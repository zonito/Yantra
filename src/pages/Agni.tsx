import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { agniCaveats, agniFacts, agniRouters } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const facts: [string, string][] = [
  ['Repo', agniFacts.repo],
  ['Base', agniFacts.base],
  ['Protocols', agniFacts.protocols],
  ['Data plane', agniFacts.dataPlane],
  ['Pipeline role', agniFacts.role],
]

export default function Agni() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Agni' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
        Engine · options intelligence
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Agni: what the options market is pricing
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Agni turns the nightly IV history and live option chains into decision context —
        richness, fear pricing, tail honesty and dealer positioning. It is positioning
        context for the 14:00 pass and the yield screens for discovery. It never triggers
        an entry.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Routers
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {agniRouters.map((r, i) => (
          <motion.div
            key={r.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-mono text-sm font-semibold text-emerald-200">{r.name}</h3>
              <span className="shrink-0 rounded-md border border-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                {r.kind}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{r.detail}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Read it with the caveats attached
      </h2>
      <p className="mt-2 max-w-2xl text-xs text-zinc-500">
        Agni's numbers are quoted with their validation flags — never clean. These are the
        standing caveats from the Sep 2026 validation study.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {agniCaveats.map((c, i) => (
          <motion.div
            key={c.title}
            className="rounded-2xl border border-red-400/20 bg-red-400/[0.03] p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-zinc-100">{c.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{c.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Facts
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
        {facts.map(([k, v], i) => (
          <div
            key={k}
            className={`grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-4 ${i % 2 ? 'bg-zinc-900/30' : ''}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{k}</p>
            <p className="text-xs leading-relaxed text-zinc-300">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/stage/agni" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          ← Agni node in the flow
        </Link>
        <Link to="/stage/recommend" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          14:00 recommendations →
        </Link>
      </div>
    </div>
  )
}
