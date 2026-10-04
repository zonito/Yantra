import { useState } from 'react'
import { motion } from 'framer-motion'
import { gaps, metricGroups, watchRisks, type Gap } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

function GapCard({ gap, i }: { gap: Gap; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      layout
      onClick={() => setOpen((o) => !o)}
      className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-600"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.06, 0.3), duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-red-400/10 px-2.5 py-1 font-mono text-xs font-bold text-red-300">
          {gap.id}
        </span>
        <h3 className="text-sm font-semibold text-zinc-100">{gap.title}</h3>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
          {[
            ['Mechanism', gap.mechanism],
            ['Failure mode', gap.failure],
            ['Target state', gap.target],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{k}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-300">{v}</p>
            </div>
          ))}
        </div>
      </motion.div>
      {!open && <p className="mt-3 text-[11px] text-zinc-600">Tap for mechanism · failure mode · target state</p>}
    </motion.div>
  )
}

export default function Gaps() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Gaps' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Next iteration
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Five gaps to fix inside Kubera
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        The highest-leverage changes before adding another execution layer.
      </p>

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {gaps.map((g, i) => (
          <GapCard key={g.id} gap={g} i={i} />
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Watch · secondary operating risks
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {watchRisks.map((w) => (
          <span key={w} className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400">
            {w}
          </span>
        ))}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Observability to build toward
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metricGroups.map((m) => (
          <div key={m.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-zinc-100">{m.title}</h3>
            <ul className="mt-2 space-y-1">
              {m.items.map((it) => (
                <li key={it} className="font-mono text-[11px] text-zinc-500">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
