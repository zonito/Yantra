import { motion } from 'framer-motion'
import { hedgeDoctrine } from '../data/pipeline'
import { Breadcrumb } from '../components/Layout'

const accent = '#22d3ee'

export default function Hedge() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Compounder hedge' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
        Hedge doctrine · set 9 Oct 2026
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Collar the compounders before the drop
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        The shares are the 20% growth engine — and the drawdown risk. High-stack
        positions get single-name collars, bought when puts are cheap: at
        resistance in good times, or on a fear spike while the position is still whole.
      </p>

      <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">The bar</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-200">{hedgeDoctrine.bar}</p>
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        The two triggers
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {hedgeDoctrine.triggers.map((t, i) => (
          <motion.div
            key={t.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
              Trigger {i + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-100">{t.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{t.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Structure
      </h2>
      <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
        {hedgeDoctrine.structure.map((s, i) => (
          <div
            key={s.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold"
                style={{ color: accent, background: `${accent}14` }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Roster · levels as of 9 Oct 2026
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
        <div className="hidden grid-cols-[64px_72px_96px_80px_96px_1fr] gap-2 border-b border-zinc-800 bg-zinc-900/60 px-5 py-3 sm:grid">
          {['Ticker', 'Value', 'Resistance', 'Hedge zone', 'Support', 'Status'].map((h) => (
            <p key={h} className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{h}</p>
          ))}
        </div>
        {hedgeDoctrine.roster.map((r, i) => (
          <div
            key={r.ticker}
            className={`grid gap-1 px-5 py-4 sm:grid-cols-[64px_72px_96px_80px_96px_1fr] sm:gap-2 ${i % 2 ? 'bg-zinc-900/30' : ''}`}
          >
            <p className="font-mono text-sm font-semibold text-zinc-100">{r.ticker}</p>
            <p className="text-xs text-zinc-400">{r.value}</p>
            <p className="text-xs text-zinc-400">{r.resistance}</p>
            <p className="text-xs font-medium" style={{ color: accent }}>{r.hedgeZone}</p>
            <p className="text-xs text-zinc-400">{r.support}</p>
            <p className="text-xs text-zinc-500">{r.status}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Mechanism</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{hedgeDoctrine.mechanism}</p>
      </div>
    </div>
  )
}
