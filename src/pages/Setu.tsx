import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Breadcrumb } from '../components/Layout'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import SequenceDiagram, { type SeqStep } from '../components/SequenceDiagram'

const READ = '#38bdf8'
const CONTROL = '#fbbf24'
const SESSION = '#a78bfa'
const DATA = '#34d399'

const planes: { name: string; colour: string; body: string }[] = [
  {
    name: 'Read plane',
    colour: READ,
    body: 'Gateways → Setu daemons → Kubera. Complete snapshots only — values, positions, orders — with staleness stamped on every read and the cushion derived server-side. Margin alerts, the GTC coverage check and the panel all read from here.',
  },
  {
    name: 'Control plane',
    colour: CONTROL,
    body: 'Kubera staged rows → human approval → setu-exec → Gateway. The only path that can place or cancel an order. Kubera itself never talks to a Gateway; the executor is the single, gated transmitter.',
  },
  {
    name: 'Session plane',
    colour: SESSION,
    body: 'The Client Portal Gateways hold one Web API session per second username. That session is the only route to portal-born orders, which the socket API cannot address. Humans own the logins; Yama owns the watching.',
  },
]

const diagrams: {
  title: string
  blurb: string
  actors: string[]
  steps: SeqStep[]
  accent: string
}[] = [
  {
    title: 'Every minute: the live broker feed',
    blurb: 'The daemon asks, the Gateway answers, Kubera stores a complete snapshot. Nothing is partial: an incomplete read is labelled, never served as truth.',
    actors: ['IB Gateway', 'Setu daemon', 'Kubera', 'Panel + alerts'],
    accent: READ,
    steps: [
      { from: 0, to: 1, label: 'reqAccountUpdates · reqAllOpenOrders' },
      { from: 1, to: 2, label: 'POST complete snapshot (ingest token)' },
      { from: 2, to: 2, label: 'derive cushion server-side' },
      { from: 2, to: 3, label: 'fresh values, positions, orders' },
      { from: 2, to: 3, label: 'cushion < 20% / 10% → Pushover via Varuna' },
    ],
  },
  {
    title: 'Placing a GTC take-profit',
    blurb: 'The standard order flow. Molang stages, a human approves, the executor re-checks everything against the live book before it transmits.',
    actors: ['Molang', 'Kubera', 'Zonito', 'setu-exec', 'IB Gateway'],
    accent: CONTROL,
    steps: [
      { from: 0, to: 1, label: 'stage row · limit = 0.40 × premium' },
      { from: 2, to: 1, label: 'approve (auto-bypass: exact safe shape only)' },
      { from: 3, to: 1, label: 'poll APPROVED rows · 30s' },
      { from: 3, to: 3, label: 'gates: armed · fresh reads · duplicate · what-if ≤ +$50' },
      { from: 3, to: 4, label: 'placeOrder · orderRef = row id' },
      { from: 4, to: 3, label: 'WORKING · perm id issued' },
      { from: 3, to: 1, label: 'report placed · broker feed confirms' },
    ],
  },
  {
    title: 'Cancelling a hand order — the socket route',
    blurb: 'Orders placed in TWS or the Gateway carry a session id once binding is asserted. That id is the cancel handle; the binding call is client-0 only.',
    actors: ['Kubera', 'Zonito', 'setu-exec', 'IB Gateway'],
    accent: CONTROL,
    steps: [
      { from: 0, to: 0, label: 'stage cancel row · target = perm id' },
      { from: 1, to: 0, label: 'approve' },
      { from: 2, to: 3, label: 'client-0 side-connection · reqAutoOpenOrders' },
      { from: 2, to: 2, label: 'resolve perm id → session id' },
      { from: 2, to: 3, label: 'cancelOrder(session id)' },
      { from: 3, to: 2, label: 'error 202 = cancelled (counts as landed)' },
      { from: 2, to: 2, label: 'fresh read: gone → EXECUTED · streak +1' },
    ],
  },
  {
    title: 'Cancelling a portal order — the web route',
    blurb: 'Orders born in Client Portal never get a socket session id, so no socket cancel can ever reach them. The CP Gateway session is the only handle.',
    actors: ['setu-exec', 'CP Gateway', 'IBKR Web API', 'Broker feed'],
    accent: SESSION,
    steps: [
      { from: 0, to: 1, label: 'auth/status · session up? (tickled each cycle)' },
      { from: 0, to: 0, label: 'identity check on the target, before any DELETE' },
      { from: 0, to: 1, label: 'DELETE order (web order id)' },
      { from: 1, to: 2, label: "proxied on the login's session" },
      { from: 0, to: 3, label: 'verify: absent in Web API list AND broker feed' },
      { from: 3, to: 0, label: 'gone → EXECUTED · streak +1' },
    ],
  },
  {
    title: 'The 06:45 Flex fetch',
    blurb: 'The morning statement, fetched instead of downloaded by hand. The converter rebuilds the exact portal statement file from Flex sections, proven byte-exact against the real thing.',
    actors: ['launchd', 'flex_pull', 'IBKR Flex', 'Converter', 'Kubera'],
    accent: DATA,
    steps: [
      { from: 0, to: 1, label: 'daily 06:45 · run' },
      { from: 1, to: 2, label: 'SendRequest · token + query · MTD window' },
      { from: 2, to: 1, label: 'reference code · 1019 while generating' },
      { from: 1, to: 2, label: 'GetStatement poll · every 20s' },
      { from: 1, to: 3, label: 'Activity CSV in' },
      { from: 3, to: 1, label: 'statement CSV out · byte-exact mapping' },
      { from: 1, to: 1, label: 'validate: title + rows · any warning fails the job' },
      { from: 1, to: 4, label: 'atomic write <MonYY>.csv → importer books it' },
    ],
  },
  {
    title: 'CP Gateway session lifecycle',
    blurb: 'A session belongs to a username, not an account, and only a human with the 2FA can create one. Everything else — the tickle, the health state — is machinery around that fact.',
    actors: ['Human', 'Browser', 'CP Gateway', 'IBKR SSO', 'Yama'],
    accent: SESSION,
    steps: [
      { from: 0, to: 1, label: 'open https://localhost:5001' },
      { from: 1, to: 3, label: 'login + 2FA · zonito.setu.web' },
      { from: 3, to: 2, label: '"Client login succeeds" · session held here' },
      { from: 2, to: 4, label: 'auth/status + /iserver/accounts' },
      { from: 4, to: 4, label: 'SESSION_UP · right account verified' },
      { from: 2, to: 2, label: 'executor tickles each cycle · stays warm' },
      { from: 4, to: 0, label: 'restart → RUNNING_NO_SESSION → log in again' },
    ],
  },
]

const guardrails: [string, string][] = [
  [
    'The read daemon cannot trade',
    'Setu the daemon holds no order code at all. Anything that transmits lives in setu-exec, behind the arm, the kill switch and the gates.',
  ],
  [
    'One live order per row, ever',
    'Every transmitted order carries orderRef = its staged row id. An unknown outcome reconciles against the book by that ref — it is never blind-retried.',
  ],
  [
    'Approval is per order',
    'The panel is the control. Auto-approve exists for exactly one shape: a buy-to-close GTC at 0.40 × premium for the full short quantity. Everything else waits for a human.',
  ],
  [
    'Cancels verify before they claim',
    'A cancel reports success only after a fresh read shows the target gone. A target that is already gone is a clean no-op, not an error.',
  ],
  [
    'Fail closed, everywhere',
    'Stale feed, incomplete read, margin impact over +$50, a working duplicate: each refuses the row and says why. Silence is never treated as success.',
  ],
  [
    'The feed is the truth for right now',
    'Broker snapshots never write the ledger. Where they disagree, Kubera raises a reconciliation row instead of overwriting history.',
  ],
]

const facts: [string, string][] = [
  [
    'IB Gateway',
    'Socket API on port 4001, one per machine, each under its own login. Master API client id 91; a client-0 side-connection asserts the order binding that socket cancels rely on.',
  ],
  [
    'Setu daemon',
    'Read-only bridge beside each Gateway. Pushes complete snapshots of values, positions and orders to Kubera every minute (on change; 5-minute heartbeat). Contains zero placeOrder calls.',
  ],
  [
    'setu-exec',
    'v0.9.3. Polls Kubera every 30s for APPROVED rows belonging to its account only. The arm persists until disarm; live mode needs executor.json plus the .live file; the brake allows 25 transmissions a day, at least 60s apart.',
  ],
  [
    'CP Gateways',
    "Both on the Studio: port 5001 (zonito.setu.web) and 5002 (nikhila.setu.web, its IP allow-list locked to her machine and localhost). Build a27ed421 — the build IBKR ships today. Sessions compete per username, never per account.",
  ],
  [
    'Kubera',
    'Port 8000. The control plane: staged rows, approvals, per-account kill switches, the append-only event audit, and the broker feeds with server-side cushion. Kubera itself never talks to a Gateway.',
  ],
  [
    'Yama',
    'Port 3006. Starts, stops and health-checks the Setu services and both CP Gateways. Health means session state (SESSION_UP), never just a running process.',
  ],
  [
    'Flex pull',
    'v0.2.7, run by launchd at 06:45 daily. One token and query per login; converts the Activity CSV into the statement file the ledger imports. A 1025 lockout pauses it for an hour by design, rather than feeding the block.',
  ],
  [
    'Accounts',
    'U19377323 (Zonito) and U26948221 (Nikhila) only. The JISA account is explicitly out of scope for the wheel machinery.',
  ],
]

export default function Setu() {
  return (
    <div>
      <Breadcrumb trail={[{ label: 'Flow', to: '/' }, { label: 'Setu · IBKR architecture' }]} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
        Infrastructure · the broker bridges
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
        Setu: how the accounts connect
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        Setu — Sanskrit for <em>bridge</em> — is everything between the two Interactive Brokers
        accounts and the book: the Gateways, the read daemons, the guarded executors, the Client
        Portal gateways and the morning Flex fetch. Built across 23–29 Oct 2026, it replaced
        portal screenshots and hand-uploaded files with a live broker feed and a controlled
        order channel.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        The whole picture
      </h2>
      <div className="mt-4">
        <ArchitectureDiagram />
      </div>
      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-zinc-500">
        Pulses travel in the direction of flow. Two things worth noticing: Kubera sits at the
        centre but touches no Gateway directly, and Nikhila's executor reaches across the
        tailnet twice — her snapshots flow to Kubera on the Studio, and her web cancels flow
        back to her CP Gateway, which also lives on the Studio.
      </p>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Three planes, three rules
      </h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {planes.map((p, i) => (
          <motion.div
            key={p.name}
            className="rounded-2xl border bg-zinc-900/50 p-5"
            style={{ borderColor: `${p.colour}44` }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold" style={{ color: p.colour }}>
              {p.name}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{p.body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Use cases, step by step
      </h2>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
        Each diagram plays itself: watch the dot. Hover to pause, click any step to jump to it.
      </p>
      <div className="mt-4 grid items-start gap-3 xl:grid-cols-2">
        {diagrams.map((d) => (
          <SequenceDiagram key={d.title} {...d} />
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Guardrails the diagrams assume
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guardrails.map(([title, body], i) => (
          <motion.div
            key={title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{body}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Facts
      </h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
        {facts.map(([k, v], i) => (
          <div
            key={k}
            className={`grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-4 ${i % 2 ? 'bg-zinc-900/30' : ''}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{k}</p>
            <p className="text-xs leading-relaxed text-zinc-300">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/kubera" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          Kubera, the control plane →
        </Link>
        <Link to="/machinery" className="text-xs font-medium text-amber-300 hover:text-amber-200">
          The scoring machinery →
        </Link>
      </div>
    </div>
  )
}
