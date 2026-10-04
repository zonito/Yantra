import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nodeById, phases, type Phase, type PipelineNode } from '../data/pipeline'

function NodeCard({ node, index }: { node: PipelineNode; index: number }) {
  const outCount = node.outputs.length
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35, ease: 'easeOut' }}
    >
      <Link
        to={`/stage/${node.id}`}
        className={`group block h-full rounded-2xl bg-zinc-900/50 p-5 transition-colors hover:bg-zinc-900 ${
          node.observer ? 'border border-dashed' : 'border border-zinc-800 hover:border-zinc-600'
        }`}
        style={node.observer ? { borderColor: `${node.accent}55` } : undefined}
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: node.accent }}
          >
            {node.time}
            {node.observer ? ' · observer' : ''}
          </p>
          <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-300">
            →
          </span>
        </div>
        <h3 className="mt-2 text-[15px] font-semibold text-zinc-100">{node.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{node.tagline}</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          {node.inputs.length} in · {node.subcomponents.length} parts · {outCount} out
        </p>
      </Link>
    </motion.div>
  )
}

/** a single glow dot travelling slowly down the phase rail */
function RailDot({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-[5px] w-px bg-zinc-800/70">
      <motion.span
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
        style={{ background: accent, boxShadow: `0 0 12px 2px ${accent}` }}
        animate={{ top: ['2%', '98%', '2%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function PhaseSection({ phase, phaseIndex }: { phase: Phase; phaseIndex: number }) {
  const accent = phase.nodes[0]?.accent ?? '#f59e0b'
  return (
    <section className="relative mt-10 pl-7 first:mt-2">
      <RailDot accent={accent} />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] font-bold" style={{ color: accent }}>
          {String(phaseIndex + 1).padStart(2, '0')}
        </span>
        <h2 className="text-lg font-bold tracking-tight text-zinc-100">{phase.title}</h2>
        <p className="w-full text-xs leading-relaxed text-zinc-500">{phase.subtitle}</p>
      </div>
      <div
        className={`mt-5 grid gap-3 ${
          phase.nodes.length > 3 ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        {phase.nodes.map((n, i) => (
          <NodeCard key={n.id} node={n} index={phaseIndex * 3 + i} />
        ))}
      </div>
    </section>
  )
}

export function FlowDiagram() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          {phases.length} phases · {phases.reduce((a, p) => a + p.nodes.length, 0)} nodes
        </p>
        <p className="text-[11px] text-zinc-600">Tap any node to open its inputs, parts and outputs.</p>
      </div>
      {phases.map((p, i) => (
        <PhaseSection key={p.id} phase={p} phaseIndex={i} />
      ))}
      <p className="mt-10 border-t border-zinc-800/70 pt-4 text-[11px] leading-relaxed text-zinc-600">
        Dashed nodes are observers: they watch the pipeline and log, but never touch a trade.
        Everywhere else, each node’s outputs are the next node’s inputs.
      </p>
    </div>
  )
}

export function OutputLink({ to }: { to: string }) {
  const target = nodeById(to)
  if (!target) return null
  return (
    <Link
      to={`/stage/${to}`}
      className="mt-2 inline-block text-[11px] font-medium text-zinc-500 transition-colors hover:text-amber-200"
    >
      → feeds {target.title}
    </Link>
  )
}
