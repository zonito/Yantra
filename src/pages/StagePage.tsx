import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nodeById, nodeNeighbors, phaseOfNode } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'
import { OutputLink } from '../components/Flow'

function BandLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] font-bold text-amber-300/80">{n}</span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{children}</h2>
      <div className="h-px flex-1 bg-zinc-800/70" />
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-5" aria-hidden>
      <motion.span
        className="text-xl text-zinc-600"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        ↓
      </motion.span>
    </div>
  )
}

export default function StagePage() {
  const { id } = useParams()
  const node = nodeById(id)
  const [open, setOpen] = useState(true)
  if (!node) return <Navigate to="/" replace />

  const phase = phaseOfNode(node.id)
  const { prev, next } = nodeNeighbors(node.id)

  return (
    <div>
      <Breadcrumb
        trail={[
          { label: 'Flow', to: '/' },
          ...(phase ? [{ label: phase.title }] : []),
          { label: node.title },
        ]}
      />

      {/* header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: node.accent }}
        >
          {node.time}
          {node.observer ? ' · observer' : ''}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">{node.title}</h1>
        <p className="mt-1 text-sm text-zinc-400">{node.tagline}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">{node.summary}</p>
        {node.link && (
          <Link
            to={node.link}
            className="mt-3 inline-block text-xs font-medium text-amber-300 hover:text-amber-200"
          >
            {node.linkLabel ?? 'Open deep dive'} →
          </Link>
        )}
      </motion.div>

      {/* 1 · inputs */}
      <div className="mt-10">
        <BandLabel n="01">Inputs — what flows in</BandLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {node.inputs.map((inp, i) => (
            <motion.div
              key={inp.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
            >
              <h3 className="text-[13px] font-semibold text-zinc-100">{inp.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{inp.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <FlowArrow />

      {/* 2 · the component, expandable into sub-components */}
      <div>
        <BandLabel n="02">The component — tap to open its parts</BandLabel>
        <motion.div
          className="mt-4 overflow-hidden rounded-2xl border bg-zinc-900/60"
          style={{ borderColor: `${node.accent}44` }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          layout
        >
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 p-5 text-left"
          >
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: node.accent }}
              >
                {node.subcomponents.length} sub-components
              </p>
              <h3 className="mt-1 text-base font-semibold text-zinc-50">{node.title}</h3>
            </div>
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              className="text-xl leading-none text-zinc-500"
            >
              +
            </motion.span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-2.5 border-t border-zinc-800 p-5">
              {node.subcomponents.map((s, i) => (
                <motion.div
                  key={s.name}
                  className="rounded-xl bg-zinc-950/60 p-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: node.accent }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-[13px] font-semibold text-zinc-100">{s.name}</h4>
                  </div>
                  <p className="mt-1 pl-7 text-xs leading-relaxed text-zinc-500">{s.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <FlowArrow />

      {/* 3 · outputs */}
      <div>
        <BandLabel n="03">Outputs — what flows out</BandLabel>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {node.outputs.map((out, i) => (
            <motion.div
              key={out.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
              style={{ borderLeft: `3px solid ${node.accent}` }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
            >
              <h3 className="text-[13px] font-semibold text-zinc-100">{out.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{out.detail}</p>
              {out.to && <OutputLink to={out.to} />}
            </motion.div>
          ))}
        </div>
      </div>

      {/* prev / next */}
      <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6">
        <div>
          {prev && (
            <Link to={`/stage/${prev.id}`} className="group text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-zinc-600">Previous</span>
              <span className="text-zinc-300 group-hover:text-amber-200">← {prev.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link to={`/stage/${next.id}`} className="group text-sm">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-zinc-600">Next</span>
              <span className="text-zinc-300 group-hover:text-amber-200">{next.title} →</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
