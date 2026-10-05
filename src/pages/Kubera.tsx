import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { kuberaFacts, kuberaRouters } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const facts: [string, string][] = [
  ['Repo', kuberaFacts.repo],
  ['Base', kuberaFacts.base],
  ['Role', kuberaFacts.role],
  ['Universe', kuberaFacts.universe],
]

export default function Kubera() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Kubera' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        App · the pipeline's home base
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Kubera: the book, the discovery, the universe
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Everything the wheel jobs decide on lives here: the live book with per-account
        reserve math, the deterministic candidate screen, the theme-organized watchlist
        universe, momentum scores and correlation peers. The 13:30, 14:00 and 14:30 runs
        read Kubera first; vendors and engines are second opinions.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Endpoints the pipeline uses
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {kuberaRouters.map((r, i) => (
          <motion.div
            key={r.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-mono text-[13px] font-semibold text-amber-200">{r.name}</h3>
              <span className="shrink-0 rounded-md border border-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                {r.kind}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{r.detail}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Universe discipline
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Theme-organized, never label-grouped</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            Watchlists are stories — US Oncology Biotech, GLP-1 &amp; Obesity, Gene &amp; Cell
            Therapy — not "high growth" buckets. A ticker can live in several themes at once;
            a gate-kill never drops a name from attention.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Shortlisted To Buy is read-only</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            wl_shortlisted is manually curated. Jobs read it for discovery and never add,
            remove or reorder it. The pruner protects holdings and legacy names the same way.
          </p>
        </div>
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
        <Link to="/stage/ecosystem" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          ← Ticker ecosystem
        </Link>
        <Link to="/stage/recommend" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          14:00 recommendations →
        </Link>
      </div>
    </div>
  )
}
