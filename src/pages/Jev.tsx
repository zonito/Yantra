import { motion } from 'framer-motion'
import { jevFacts } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const facts: [string, string][] = [
  ['Connection', jevFacts.connection],
  ['Endpoint', jevFacts.endpoint],
  ['Verified run', jevFacts.verified],
  ['Funding', jevFacts.funding],
  ['Client', jevFacts.skill],
]

export default function Jev() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Jev shadow' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-300/80">
        Shadow trial · live 4 Oct 2026
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        The observer that never touches the trade
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        After the 14:00 briefing is composed, every ranked new-put candidate is sent to the
        TypeSafe Jev decision model for two observational judgments. The run is fail-open;
        nothing flows back.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <motion.div
          className="rounded-2xl border border-pink-300/20 bg-pink-300/[0.04] p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Question 1</p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-100">Position size</h3>
          <p className="mt-2 font-mono text-sm text-pink-200">full / half / skip</p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Jev\u2019s independent read on how much size the candidate deserves.
          </p>
        </motion.div>
        <motion.div
          className="rounded-2xl border border-pink-300/20 bg-pink-300/[0.04] p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Question 2</p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-100">Airavata weight</h3>
          <p className="mt-2 font-mono text-sm text-pink-200">full / half / ignore</p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            How much weight the posture deserves, given the weekly snapshot\u2019s tier, n and
            probability. Snapshot numbers are ground truth \u2014 Jev judges boundary cases only.
          </p>
        </motion.div>
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Trial facts
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

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Scoring protocol
      </h2>
      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-sm text-zinc-300">
          First review after <span className="font-semibold text-zinc-100">4 weeks or 30 scored candidates</span>,
          whichever comes first \u2014 expected early November 2026, reported unprompted.
        </p>
        <ul className="mt-4 space-y-3">
          <li className="text-xs leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-200">Sizing shadow:</span> Jev\u2019s Full bucket must
            beat Skip on forward 21-trading-day returns with non-overlapping 95% confidence intervals,
            and agreement with the pipeline verdict must exceed 60%.
          </li>
          <li className="text-xs leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-200">Weighting shadow:</span> postures given full
            weight must predict the next 21-trading-day direction more accurately than ignored postures,
            with non-overlapping 95% confidence intervals.
          </li>
          <li className="text-xs leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-200">Ditch rule:</span> any shadow failing its bar is removed.
          </li>
        </ul>
      </div>
    </div>
  )
}
