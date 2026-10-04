import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { flowOrder, stages } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'
import { DrillCard } from '../components/Flow'

export default function StagePage() {
  const { id } = useParams()
  const stage = stages.find((s) => s.id === id)
  if (!stage) return <Navigate to="/" replace />

  const idx = flowOrder.indexOf(stage.id)
  const prev = idx > 0 ? stages.find((s) => s.id === flowOrder[idx - 1]) : null
  const next =
    idx >= 0 && idx < flowOrder.length - 1
      ? stages.find((s) => s.id === flowOrder[idx + 1])
      : null

  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: stage.title }]} />
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: stage.accent }}
      >
        {stage.time}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">{stage.title}</h1>
      <p className="mt-1 text-sm text-zinc-400">{stage.tagline}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">{stage.summary}</p>

      <motion.div
        className="mt-8 grid gap-3 lg:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {stage.components.map((c) => (
          <DrillCard key={c.id} component={c} accent={stage.accent} />
        ))}
      </motion.div>

      <p className="mt-6 text-xs text-zinc-600">Tap a card to drill into its inputs, rules and outputs.</p>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
        <div>
          {prev && (
            <Link to={`/stage/${prev.id}`} className="group text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-zinc-600">Previous</span>
              <span className="text-zinc-300 group-hover:text-amber-200">\u2190 {prev.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link to={`/stage/${next.id}`} className="group text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-zinc-600">Next</span>
              <span className="text-zinc-300 group-hover:text-amber-200">{next.title} \u2192</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
