import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { kamadhenuFacts, kamadhenuRouters } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const facts: [string, string][] = [
  ['Repo', kamadhenuFacts.repo],
  ['Base', kamadhenuFacts.base],
  ['Role', kamadhenuFacts.role],
]

export default function Kamadhenu() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Kamadhenu' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300/80">
        App · commodities
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Kamadhenu: commodities for the macro sleeve
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Kamadhenu reads curated commodity markets — oil, gold, copper — with macro
        context and related news, feeding the macro sleeve of the daily briefings.
        It is not part of the wheel pipeline.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Routes
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {kamadhenuRouters.map((r, i) => (
          <motion.div
            key={r.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-mono text-[13px] font-semibold text-orange-200">{r.name}</h3>
              <span className="shrink-0 rounded-md border border-zinc-700/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                {r.kind}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{r.detail}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        One gotcha
      </h2>
      <div className="mt-4 rounded-2xl border border-orange-300/20 bg-orange-300/[0.04] p-5">
        <p className="text-xs leading-relaxed text-zinc-400">{kamadhenuFacts.gotcha}</p>
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
        <Link to="/rashi" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          ← Rashi
        </Link>
        <Link to="/bhisma" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          Bhisma →
        </Link>
      </div>
    </div>
  )
}
