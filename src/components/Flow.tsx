import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { flowOrder, jevStageId, stages } from '../data/pipeline'

function stageById(id: string) {
  return stages.find((s) => s.id === id)!
}

/**
 * A pipeline node: pulsing ring + time + title. Clicking navigates to the
 * stage detail page.
 */
function Node({ id, delay }: { id: string; delay: number }) {
  const s = stageById(id)
  return (
    <Link to={`/stage/${s.id}`} className="group relative z-10 block w-40 shrink-0 sm:w-44">
      <motion.span
        className="absolute -inset-2 rounded-2xl"
        style={{ boxShadow: `0 0 0 1px ${s.accent}33` }}
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 transition-colors group-hover:border-zinc-600">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: s.accent }}>
          {s.time}
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug text-zinc-100">{s.title}</p>
        <p className="mt-1 text-xs leading-snug text-zinc-500">{s.tagline}</p>
      </div>
    </Link>
  )
}

/**
 * Animated data packet travelling left-to-right along a connector.
 */
function Packet({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.span
      className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
      style={{ background: color, boxShadow: `0 0 12px 2px ${color}` }}
      initial={{ left: '0%', opacity: 0 }}
      animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, delay, ease: 'linear' }}
    />
  )
}

function Connector({ delay, color }: { delay: number; color: string }) {
  return (
    <div className="relative h-px w-16 shrink-0 self-center bg-zinc-800 sm:w-24">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 12px)`,
        }}
      />
      <Packet delay={delay} color={color} />
    </div>
  )
}

export function FlowDiagram() {
  const jev = stageById(jevStageId)
  return (
    <div>
      <div className="rail flex items-stretch gap-0 overflow-x-auto pb-4">
        {flowOrder.map((id, i) => (
          <div key={id} className="flex items-stretch">
            <Node id={id} delay={i * 0.55} />
            {i < flowOrder.length - 1 && (
              <Connector delay={i * 0.55} color={stageById(flowOrder[i + 1]).accent} />
            )}
          </div>
        ))}
      </div>
      {/* Jev observer: side branch off 14:00, dashed, non-blocking */}
      <div className="mt-2 flex items-center gap-4 pl-1">
        <div className="flex flex-col items-center">
          <div className="h-8 w-px bg-zinc-800" />
          <div
            className="h-px w-10"
            style={{
              background: `repeating-linear-gradient(90deg, ${jev.accent}66 0 5px, transparent 5px 10px)`,
            }}
          />
        </div>
        <Link
          to={`/stage/${jev.id}`}
          className="group relative block w-64 rounded-2xl border border-dashed p-4 transition-colors hover:border-zinc-500"
          style={{ borderColor: `${jev.accent}55` }}
        >
          <motion.span
            className="absolute -inset-1.5 rounded-2xl"
            style={{ boxShadow: `0 0 0 1px ${jev.accent}22` }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: jev.accent }}>
            {jev.time} · observer
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-100">{jev.title}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Watches, logs, never touches the trade. Branch off 14:00.
          </p>
        </Link>
      </div>
    </div>
  )
}

/**
 * Expandable component card: click to drill into inputs / rules / outputs
 * with a layout animation. Used on stage detail pages.
 */
import type { StageComponent } from '../data/pipeline'

export function DrillCard({ component, accent }: { component: StageComponent; accent: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      layout
      onClick={() => setOpen((o) => !o)}
      className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-zinc-600"
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: accent, background: `${accent}14` }}
          >
            {component.tag}
          </span>
          <h3 className="mt-2 text-base font-semibold text-zinc-100">{component.title}</h3>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="mt-1 text-xl leading-none text-zinc-500"
        >
          +
        </motion.span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {component.points.map((p) => (
          <li key={p} className="text-sm leading-snug text-zinc-400">
            <span style={{ color: accent }} className="mr-2">·</span>
            {p}
          </li>
        ))}
      </ul>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="mt-4 grid gap-3 border-t border-zinc-800 pt-4 sm:grid-cols-3">
          <DrillSection label="Inputs" items={component.inputs} accent={accent} />
          <DrillSection label="Rules" items={component.rules} accent={accent} />
          <DrillSection label="Outputs" items={component.outputs} accent={accent} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function DrillSection({ label, items, accent }: { label: string; items: string[]; accent: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="text-xs leading-snug text-zinc-400">
            <span className="mr-1.5" style={{ color: accent }}>▸</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
