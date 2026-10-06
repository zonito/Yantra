import { Component, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Flow', end: true },
  { to: '/machinery', label: 'Machinery' },
  { to: '/rules', label: 'Rules' },
  { to: '/quality', label: 'Quality' },
  { to: '/handoffs', label: 'Handoffs' },
  { to: '/gaps', label: 'Gaps' },
  { to: '/jev', label: 'Jev' },
]

const engineItems = [
  { to: '/agni', label: 'Agni' },
  { to: '/airavata', label: 'Airavata' },
  { to: '/kubera', label: 'Kubera' },
  { to: '/varuna', label: 'Varuna' },
  { to: '/drona', label: 'Drona' },
  { to: '/vidhura', label: 'Vidhura' },
]

const satelliteItems = [
  { to: '/kamadhenu', label: 'Kamadhenu' },
  { to: '/rashi', label: 'Rashi' },
  { to: '/bhisma', label: 'Bhisma' },
]

function NavDropdown({ label, items }: { label: string; items: { to: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  const active = items.some((i) => location.pathname === i.to)
  return (
    <div
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          active
            ? 'bg-amber-300/10 text-amber-200'
            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
        }`}
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 pt-1.5">
          <div className="w-40 rounded-xl border border-zinc-800 bg-[#101014] p-1.5 shadow-xl shadow-black/40">
            {items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-300/10 text-amber-200'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * A render crash anywhere below the header used to blank the whole page
 * silently. This shows the error instead, so a broken route is diagnosable.
 */
class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }
  static getDerivedStateFromError(e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
  componentDidCatch() {
    this.setState({ error: this.state.error })
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-red-200">This page failed to render</p>
          <p className="mt-2 font-mono text-xs text-red-300/70">{this.state.error}</p>
          <Link to="/" className="mt-4 inline-block text-xs text-amber-300 hover:text-amber-200">
            ← Back to the flow
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}

export function Breadcrumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
      {trail.map((t, i) => (
        <span key={t.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-zinc-700">/</span>}
          {t.to ? (
            <Link to={t.to} className="transition-colors hover:text-amber-300">
              {t.label}
            </Link>
          ) : (
            <span className="text-zinc-300">{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

function Shell() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-[#09090d]">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090d]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2.5">
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              यन्त्र <span className="text-amber-300">Yantra</span>
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-zinc-500 sm:inline">
              Kubera wheel pipeline
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-300/10 text-amber-200'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <NavDropdown label="Engines" items={engineItems} />
            <NavDropdown label="Satellites" items={satelliteItems} />
          </nav>
        </div>
      </header>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6"
      >
        <RouteErrorBoundary key={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </motion.main>
      <footer className="border-t border-zinc-800/80 py-6">
        <p className="mx-auto max-w-7xl px-4 text-[11px] text-zinc-600 sm:px-6">
          Yantra · interactive Kubera Wheel Pipeline Architecture · facts from the 4 Oct 2026 runbook
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Shell />
    </>
  )
}
