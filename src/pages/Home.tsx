import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlowDiagram } from '../components/Flow'
import { Breadcrumb } from '../components/Layout'

const sections = [
  { to: '/machinery', title: 'Machinery', body: 'Sutradhara, the scoring engine, and the deterministic screener.' },
  { to: '/rules', title: 'Rules', body: 'The 29 non-negotiables plus the ratified reserve bands.' },
  { to: '/quality', title: 'Quality model', body: 'Evidence ranks the idea; independent gates protect the trade.' },
  { to: '/handoffs', title: 'Handoffs', body: 'Where reliability is won or lost \u2014 eight boundaries, eight contracts.' },
  { to: '/gaps', title: 'Five gaps', body: 'The highest-leverage fixes before another execution layer.' },
  { to: '/jev', title: 'Jev shadow', body: 'The observer trial: two questions, a log, and a promotion bar.' },
]

export default function Home() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow' }]} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
          Current runbook · 4 Oct 2026
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          One funnel. Independent risk gates. Evidence at every handoff.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          From book-first discovery to a staged wheel setup \u2014 prioritizing existing exposure,
          accepting three strong ideas or fewer, and keeping Google Tasks as the sole Pending
          Trades ledger. Click any stage to go inside.
        </p>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <FlowDiagram />
      </motion.div>

      <div className="mt-14">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Supporting machinery
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06, duration: 0.35 }}
            >
              <Link
                to={s.to}
                className="block h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-amber-300/40 hover:bg-zinc-900"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{s.body}</p>
                <p className="mt-3 text-xs font-medium text-amber-300/90">Open \u2192</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
