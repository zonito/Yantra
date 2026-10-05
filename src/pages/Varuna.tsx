import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { varunaConventions, varunaFacts, varunaRouters } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const facts: [string, string][] = [
  ['Repo', varunaFacts.repo],
  ['Base', varunaFacts.base],
  ['Role', varunaFacts.role],
  ['Contract', varunaFacts.contract],
]

export default function Varuna() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Varuna' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
        App · cache-first data plane
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Varuna: one envelope for every vendor
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Varuna fans out to vendors (FMP, Massive, Yahoo, FINRA), caches aggressively, and
        serves everything behind one envelope with TTLs, circuit breakers and per-source
        cache metadata. Every engine — Agni, Airavata, Drona, Vidhura, Kubera — reads
        through it. Nothing in the pipeline touches a vendor directly.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Routes
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {varunaRouters.map((r, i) => (
          <motion.div
            key={r.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-mono text-[13px] font-semibold text-sky-200">{r.name}</h3>
              <span className="shrink-0 rounded-md border border-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                {r.kind}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{r.detail}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Calling conventions
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {varunaConventions.map((c, i) => (
          <motion.div
            key={c.title}
            className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.04] p-5"
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
        <Link to="/stage/backfill" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          ← Nightly IV backfill
        </Link>
        <Link to="/agni" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          Agni engine →
        </Link>
      </div>
    </div>
  )
}
