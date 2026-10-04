import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Flow', end: true },
  { to: '/machinery', label: 'Machinery' },
  { to: '/rules', label: 'Rules' },
  { to: '/quality', label: 'Quality' },
  { to: '/handoffs', label: 'Handoffs' },
  { to: '/gaps', label: 'Gaps' },
  { to: '/jev', label: 'Jev' },
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
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
          </nav>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
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
