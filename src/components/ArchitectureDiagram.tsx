/**
 * The IBKR architecture as one picture: two machines, three planes.
 * Edges are colour-coded by plane and carry a slow pulse dot so the eye
 * follows the direction of flow. Read = sky, control = amber,
 * session = violet, Flex/data = emerald, people = zinc, Yama = dashed.
 */

const READ = '#38bdf8'
const CONTROL = '#fbbf24'
const SESSION = '#a78bfa'
const DATA = '#34d399'
const PEOPLE = '#d4d4d8'
const MANAGE = '#a1a1aa'

type BoxSpec = {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  accent?: string
}

function Box({ x, y, w, h, title, sub, accent }: BoxSpec) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="#101014"
        stroke={accent ?? '#27272a'}
        strokeWidth={accent ? 1.4 : 1}
      />
      <text x={x + 14} y={y + 23} fill="#f4f4f5" fontSize={13.5} fontWeight={600}>
        {title}
      </text>
      <text x={x + 14} y={y + 41} fill="#a1a1aa" fontSize={10.5} fontFamily="ui-monospace, monospace">
        {sub}
      </text>
    </g>
  )
}

function Zone({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={18} fill="#0c0c10" stroke="#1f1f23" />
      <text x={x + 16} y={y + 22} fill="#71717a" fontSize={10.5} fontWeight={700} letterSpacing={2}>
        {label}
      </text>
    </g>
  )
}

function Edge({
  d,
  colour,
  dot,
  dotDur = 4,
  dashed = false,
}: {
  d: string
  colour: string
  dot?: boolean
  dotDur?: number
  dashed?: boolean
}) {
  return (
    <g fill="none">
      <path
        d={d}
        stroke={colour}
        strokeWidth={1.6}
        opacity={0.55}
        className={dashed ? undefined : 'flowline'}
        strokeDasharray={dashed ? '3 6' : undefined}
      />
      {dot && (
        <circle r={3.4} fill={colour}>
          <animateMotion dur={`${dotDur}s`} repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  )
}

function Label({ x, y, children, colour = '#a1a1aa' }: { x: number; y: number; children: string; colour?: string }) {
  return (
    <text x={x} y={y} fill={colour} fontSize={10.5} fontFamily="ui-monospace, monospace">
      {children}
    </text>
  )
}

export default function ArchitectureDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0a0a0e] p-3">
      <svg viewBox="0 0 1180 800" className="min-w-[980px]" role="img" aria-label="IBKR architecture diagram">
        {/* zones */}
        <Zone x={20} y={88} w={284} h={268} label="PEOPLE" />
        <Zone x={20} y={372} w={284} h={190} label="FILES + PHONE" />
        <Zone x={324} y={88} w={472} h={624} label="MAC STUDIO" />
        <Zone x={820} y={88} w={340} h={300} label="NIKHILA'S MAC" />
        <Zone x={820} y={420} w={340} h={292} label="INTERACTIVE BROKERS" />

        {/* edges: read plane */}
        <Edge d="M460 342 L460 358" colour={READ} />
        <Edge d="M384 358 C336 296 336 226 384 176" colour={READ} dot dotDur={3.4} />
        <Edge d="M990 174 L990 190" colour={READ} />
        <Edge d="M900 190 C840 84 640 78 520 112" colour={READ} dot dotDur={5.2} />
        {/* edges: control plane */}
        <Edge d="M540 424 C596 360 596 250 566 176" colour={CONTROL} dot dotDur={3.8} />
        <Edge d="M420 424 C420 396 420 372 420 344" colour={CONTROL} dot dotDur={2.6} />
        <Edge d="M840 284 C700 330 620 260 560 182" colour={CONTROL} dot dotDur={5} />
        <Edge d="M880 312 C870 380 840 392 780 390" colour={CONTROL} dot dotDur={3.2} />
        {/* edges: session plane */}
        <Edge d="M552 452 C620 440 648 396 664 346" colour={SESSION} dot dotDur={3} />
        <Edge d="M776 314 C850 360 890 440 920 516" colour={SESSION} dot dotDur={4.4} />
        <Edge d="M776 386 C830 420 870 470 905 516" colour={SESSION} />
        <Edge d="M552 314 C680 340 790 400 872 450" colour={SESSION} />
        <Edge d="M1060 174 C1060 300 1060 380 1040 450" colour={SESSION} />
        {/* edges: flex / data */}
        <Edge d="M552 215 C690 260 800 420 872 582" colour={DATA} dot dotDur={5.4} />
        <Edge d="M344 215 C300 250 284 320 282 400" colour={DATA} dot dotDur={3.6} />
        <Edge d="M284 420 C316 350 330 250 342 190" colour={DATA} />
        {/* edges: people */}
        <Edge d="M284 143 L342 143" colour={PEOPLE} />
        <Edge d="M284 152 C420 190 510 240 570 292" colour={PEOPLE} dot dotDur={4.6} />
        <Edge d="M284 224 C430 280 520 330 570 372" colour={PEOPLE} />
        <Edge d="M284 268 C306 230 322 196 340 168" colour={PEOPLE} />
        <Edge d="M620 240 C520 330 400 420 288 486" colour={PEOPLE} dot dotDur={4.8} />
        {/* edges: Yama management */}
        <Edge d="M674 174 L674 286" colour={MANAGE} dashed />
        <Edge d="M700 174 C720 250 720 300 706 356" colour={MANAGE} dashed />
        <Edge d="M600 174 C580 280 566 350 556 422" colour={MANAGE} dashed />

        {/* edge labels */}
        <Label x={318} y={240} colour={READ}>snapshots</Label>
        <Label x={676} y={76} colour={READ}>snapshots · tailnet</Label>
        <Label x={604} y={296} colour={CONTROL}>polls APPROVED · events</Label>
        <Label x={428} y={390} colour={CONTROL}>place / cancel</Label>
        <Label x={690} y={266} colour={CONTROL}>polls APPROVED · events</Label>
        <Label x={806} y={352} colour={CONTROL}>web cancels</Label>
        <Label x={622} y={408} colour={SESSION}>web cancels + tickle</Label>
        <Label x={706} y={352} colour={SESSION}>brokerage session</Label>
        <Label x={716} y={330} colour={DATA}>SendRequest · GetStatement</Label>
        <Label x={228} y={300} colour={DATA}>converted CSV</Label>
        <Label x={290} y={306} colour={DATA}>importer</Label>
        <Label x={288} y={134}>approves</Label>
        <Label x={408} y={180}>login + 2FA</Label>
        <Label x={416} y={268}>her login</Label>
        <Label x={238} y={206}>stages rows</Label>
        <Label x={420} y={352}>margin alerts</Label>
        <Label x={682} y={234} colour={MANAGE}>start/stop</Label>

        {/* people */}
        <Box x={40} y={118} w={244} h={50} title="Zonito" sub="approves in the panel" />
        <Box x={40} y={182} w={244} h={50} title="Nikhila" sub="her logins · her 2FA" />
        <Box x={40} y={246} w={244} h={50} title="Molang" sub="stages rows · watches feeds" />
        {/* files + phone */}
        <Box x={40} y={402} w={244} h={56} title="Transactions / IBKR" sub="<MonYY>.csv · the morning file" accent={DATA} />
        <Box x={40} y={474} w={244} h={48} title="Phone" sub="Pushover margin alerts" />

        {/* studio */}
        <Box x={344} y={118} w={208} h={56} title="Kubera" sub=":8000 · control plane + feeds" accent={CONTROL} />
        <Box x={572} y={118} w={204} h={56} title="Yama" sub=":3006 · service manager" accent={MANAGE} />
        <Box x={344} y={190} w={208} h={50} title="flex_pull" sub="06:45 daily · v0.2.7" accent={DATA} />
        <Box x={572} y={190} w={204} h={50} title="Varuna" sub=":8400 · Pushover + vendors" />
        <Box x={344} y={286} w={208} h={56} title="IB Gateway · Zonito" sub="socket :4001 · his login" accent={SESSION} />
        <Box x={572} y={286} w={204} h={56} title="CP Gateway · Zonito" sub=":5001 · zonito.setu.web" accent={SESSION} />
        <Box x={572} y={358} w={204} h={56} title="CP Gateway · Nikhila" sub=":5002 · nikhila.setu.web" accent={SESSION} />
        <Box x={344} y={358} w={208} h={50} title="Setu daemon" sub="read-only · zero placeOrder" accent={READ} />
        <Box x={344} y={424} w={208} h={56} title="setu-exec" sub="client 91 + 0 · v0.9.3" accent={CONTROL} />
        <text x={344} y={530} fill="#71717a" fontSize={11}>
          Both CP Gateways live here now — hers moved from her Mac on 29 Oct.
        </text>
        <text x={344} y={550} fill="#71717a" fontSize={11}>
          Yama starts, stops and health-checks the daemons and both gateways.
        </text>

        {/* nikhila's mac */}
        <Box x={840} y={118} w={300} h={56} title="IB Gateway · Nikhila" sub="socket :4001 · her login" accent={SESSION} />
        <Box x={840} y={190} w={300} h={50} title="Setu daemon" sub="read-only · her account only" accent={READ} />
        <Box x={840} y={256} w={300} h={56} title="setu-exec" sub="her account only · web → Studio :5002" accent={CONTROL} />

        {/* ibkr */}
        <Box x={840} y={452} w={300} h={50} title="Brokerage backends" sub="socket API sessions" />
        <Box x={840} y={518} w={300} h={50} title="Web API backend" sub="api.ibkr.com · CP sessions" />
        <Box x={840} y={584} w={300} h={50} title="Flex Web Service" sub="statement generation" />
        <text x={840} y={672} fill="#71717a" fontSize={11}>
          Sessions compete per username — never per account.
        </text>

        {/* legend */}
        <g fontSize={11} fontFamily="ui-monospace, monospace">
          <circle cx={36} cy={752} r={4} fill={READ} />
          <text x={48} y={756} fill="#a1a1aa">read plane</text>
          <circle cx={150} cy={752} r={4} fill={CONTROL} />
          <text x={162} y={756} fill="#a1a1aa">control plane</text>
          <circle cx={268} cy={752} r={4} fill={SESSION} />
          <text x={280} y={756} fill="#a1a1aa">session plane</text>
          <circle cx={386} cy={752} r={4} fill={DATA} />
          <text x={398} y={756} fill="#a1a1aa">flex / data</text>
          <circle cx={492} cy={752} r={4} fill={MANAGE} />
          <text x={504} y={756} fill="#a1a1aa">yama management</text>
        </g>
      </svg>
    </div>
  )
}
