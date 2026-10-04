import { motion } from 'framer-motion'
import { qualityBlocks, qualityNotes, reliabilityPoints } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

export default function Quality() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Quality model' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Quality model
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Evidence ranks the idea. Independent risk gates protect the trade.
      </h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {qualityBlocks.map((b, i) => (
          <motion.div
            key={b.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <h3 className="text-sm font-semibold text-zinc-100">{b.title}</h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500">{b.subtitle}</p>
            <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">{b.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Standing interpretations
      </h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {qualityNotes.map((n, i) => (
          <motion.div
            key={n.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-amber-200">{n.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{n.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Reliability points · what the validation studies actually say
      </h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {reliabilityPoints.map((r, i) => (
          <motion.div
            key={r.title}
            className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.03] p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-zinc-100">{r.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
