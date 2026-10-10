import { motion } from 'framer-motion'
import { agentViews, rebalanceNotes, screenerFacts, sutradharaSteps } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

export default function Machinery() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Machinery' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Supporting machinery
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">The scoring engine</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Sutradhara is a resource-aware freshness engine, not a one-shot stock ranker. It decides
        which evidence is most stale or urgent, computes it, then persists a comparable score.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sutradharaSteps.map((s, i) => (
          <motion.div
            key={s.n}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <p className="text-2xl font-bold text-amber-300/70">{s.n}</p>
            <h3 className="mt-2 text-sm font-semibold text-zinc-100">{s.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{s.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Eight views, different clocks
      </h2>
      <p className="mt-2 max-w-2xl text-xs text-zinc-500">
        effective weightᵢ = configured weightᵢ × confidenceᵢ → blend → agreement
        stretch → conviction gate → signal band. Technical and volume can age within a day;
        fundamental and valuation are deliberately weekly.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agentViews.map((a, i) => (
          <motion.div
            key={a.name}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">{a.name}</h3>
              <span className="text-xs font-semibold text-amber-200">{a.weight}</span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">⟳ {a.clock}</p>
            <p className="mt-2 text-xs text-zinc-500">{a.detail}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Rebalance · 4 Oct 2026 · live in Kubera
      </h2>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
        The composite’s job is own-worthiness — what is safe to own if assigned. Timing belongs
        to the 13:30 dimmer, pricing to the 14:00 gates. Valuation was cut because DCF has almost
        no predictive power over a 30–45 day put and double-counts Fundamental; the freed weight
        went to tails (Quantitative), premium richness (Options) and the freshest read (Technical).
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <th className="px-4 py-3 font-semibold">View</th>
              <th className="px-4 py-3 font-semibold">Now</th>
              <th className="px-4 py-3 font-semibold">Proposed</th>
              <th className="px-4 py-3 font-semibold">Why</th>
            </tr>
          </thead>
          <tbody>
            {agentViews.map((a) => (
              <tr key={a.name} className="border-b border-zinc-800/60 last:border-0">
                <td className="px-4 py-2.5 font-semibold text-zinc-200">{a.name}</td>
                <td className="px-4 py-2.5 font-mono text-zinc-400">{a.weight}</td>
                <td className="px-4 py-2.5 font-mono">
                  {a.proposed ? (
                    <span className="font-semibold text-amber-200">{a.proposed}</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 leading-relaxed text-zinc-500">{a.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 space-y-2">
        {rebalanceNotes.map((n) => (
          <li key={n.slice(0, 24)} className="text-xs leading-relaxed text-zinc-500">
            <span className="mr-2 text-amber-300/80">•</span>
            {n}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Deterministic screener
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
        The scan-and-filter logic lives in Kubera code — not in job prompts. One ranked snapshot
        feeds the 13:30 dimmer and the 14:00 pass; contract selection stays downstream.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Service</p>
          <p className="mt-1 font-mono text-xs text-zinc-300">{screenerFacts.service}</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">{screenerFacts.cli}</p>
          <p className="mt-3 font-mono text-xs text-zinc-300">{screenerFacts.get}</p>
          <p className="mt-1 font-mono text-xs text-zinc-300">{screenerFacts.post}</p>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Snapshot contract
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {screenerFacts.snapshotFields.map((f) => (
              <span key={f} className="rounded-full bg-zinc-800/80 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Gates</p>
          <ul className="mt-2 space-y-1.5">
            {screenerFacts.gates.map((g) => (
              <li key={g} className="text-xs leading-snug text-zinc-400">
                <span className="mr-2 text-emerald-300">✓</span>
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Ranking</p>
          <p className="mt-1 text-xs text-zinc-400">{screenerFacts.ranking}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {screenerFacts.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
            <p className="text-2xl font-bold text-zinc-100">{s.n}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
