import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export type SeqStep = {
  from: number
  to: number
  label: string
}

type Props = {
  title: string
  blurb: string
  actors: string[]
  steps: SeqStep[]
  accent: string
  intervalMs?: number
}

const centre = (i: number, n: number) => ((i + 0.5) / n) * 100

/**
 * An auto-playing sequence diagram: steps light up one at a time on a
 * loop, with a dot travelling along the active arrow. Hover pauses;
 * clicking a step jumps to it.
 */
export default function SequenceDiagram({
  title,
  blurb,
  actors,
  steps,
  accent,
  intervalMs = 1600,
}: Props) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = window.setInterval(() => {
      setActive((a) => (a + 1) % steps.length)
    }, intervalMs)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [paused, steps.length, intervalMs])

  const n = actors.length

  return (
    <div
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">{blurb}</p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="shrink-0 rounded-full border border-zinc-700/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-200"
        >
          {paused ? '▶ play' : '❚❚ pause'}
        </button>
      </div>

      {/* actor headers */}
      <div className="relative mt-5">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {actors.map((a) => (
            <div key={a} className="flex justify-center px-1">
              <span
                className="rounded-lg border px-2 py-1.5 text-center font-mono text-[10.5px] font-semibold leading-tight"
                style={{ borderColor: `${accent}66`, color: accent, background: '#101014' }}
              >
                {a}
              </span>
            </div>
          ))}
        </div>

        {/* lifelines + steps */}
        <div className="relative mt-1">
          {actors.map((a, i) => (
            <span
              key={a}
              className="pointer-events-none absolute inset-y-0 border-l border-dashed border-zinc-800"
              style={{ left: `${centre(i, n)}%` }}
            />
          ))}
          {steps.map((s, i) => {
            const state = i === active ? 'active' : i < active ? 'done' : 'todo'
            const self = s.from === s.to
            const left = Math.min(centre(s.from, n), centre(s.to, n))
            const width = Math.abs(centre(s.to, n) - centre(s.from, n))
            const mid = (centre(s.from, n) + centre(s.to, n)) / 2
            const dirRight = s.to >= s.from
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative block h-14 w-full rounded-lg transition-colors ${
                  state === 'active' ? 'bg-white/[0.04]' : ''
                }`}
                style={{ opacity: state === 'todo' ? 0.45 : 1 }}
              >
                {/* step number */}
                <span
                  className="absolute left-1 top-1 font-mono text-[9.5px]"
                  style={{ color: state === 'active' ? accent : '#52525b' }}
                >
                  {i + 1}
                  {state === 'done' ? ' ✓' : ''}
                </span>
                {self ? (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-zinc-700/70 bg-[#101014] px-2 py-1 text-[10.5px] text-zinc-300"
                    style={{ left: `calc(${centre(s.from, n)}% + 10px)` }}
                  >
                    ↺ {s.label}
                  </span>
                ) : (
                  <>
                    {/* the line */}
                    <span
                      className="absolute top-1/2 h-px -translate-y-1/2"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        background: state === 'active' ? accent : '#3f3f46',
                      }}
                    />
                    {/* arrowhead */}
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-[10px] leading-none"
                      style={{
                        left: dirRight
                          ? `calc(${centre(s.to, n)}% - 9px)`
                          : `calc(${centre(s.to, n)}% - 1px)`,
                        color: state === 'active' ? accent : '#52525b',
                        transform: `translateY(-50%) ${dirRight ? '' : 'scaleX(-1)'}`,
                      }}
                    >
                      ▶
                    </span>
                    {/* travelling dot on the active step */}
                    {state === 'active' && (
                      <motion.span
                        key={`dot-${active}`}
                        className="absolute top-1/2 h-2 w-2 rounded-full"
                        style={{
                          background: accent,
                          boxShadow: `0 0 10px 2px ${accent}55`,
                          marginTop: -4,
                        }}
                        initial={{ left: `calc(${centre(s.from, n)}% - 4px)` }}
                        animate={{ left: `calc(${centre(s.to, n)}% - 4px)` }}
                        transition={{
                          duration: Math.min(intervalMs / 1000 - 0.35, 1.3),
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                    {/* label */}
                    <span
                      className="absolute top-[3px] max-w-[46%] -translate-x-1/2 truncate rounded px-1 text-center text-[10.5px] leading-tight"
                      style={{ left: `${mid}%`, color: state === 'active' ? '#e4e4e7' : '#a1a1aa' }}
                      title={s.label}
                    >
                      {s.label}
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* progress dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`step ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 18 : 6,
              background: i === active ? accent : '#3f3f46',
            }}
          />
        ))}
      </div>
    </div>
  )
}
