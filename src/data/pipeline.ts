// Yantra data model — the living Kubera Wheel Pipeline Architecture.
// Pipeline changes update THIS file first; the static Molang snapshot is
// re-exported from it. Facts sourced from the 4 Oct 2026 architecture
// runbook, AGENTS.md and MEMORY.md. Nothing here is invented.

export interface StageComponent {
  id: string;
  title: string;
  tag: string;
  points: string[];
  inputs: string[];
  rules: string[];
  outputs: string[];
}

export interface Stage {
  id: string;
  time: string;
  title: string;
  tagline: string;
  summary: string;
  accent: string;
  components: StageComponent[];
}

export const stages: Stage[] = [
  {
    id: 'backfill',
    time: '00:05',
    title: 'Nightly IV backfill',
    tagline: 'Prepare the volatility history',
    summary:
      'One JSONL record per screener-universe ticker, appended before the trading day begins. Idempotent: a ticker with today\u2019s record is skipped.',
    accent: '#38bdf8',
    components: [
      {
        id: 'trigger',
        title: 'Trigger',
        tag: 'launchd',
        points: [
          'setup/launchd/com.kubera.wheel-iv-backfill.plist',
          'RunAtLoad=false · ProcessType=Background',
          'stdout/stderr \u2192 logs/wheel-iv-backfill.{stdout,stderr}.log',
        ],
        inputs: ['launchd timer at 00:05 local'],
        rules: ['Install reviewed 24 Sep 2026; copying the plist into ~/Library/LaunchAgents is still pending approval'],
        outputs: ['Script run with logging in place'],
      },
      {
        id: 'script',
        title: 'Backfill script',
        tag: 'script',
        points: [
          'scripts/backfill_iv.py --profile "US Extended" --watchlist wl_shortlisted',
          'Writes cache/iv_history/{SYM}.jsonl',
          'Idempotent: today\u2019s record present \u2192 ticker skipped',
        ],
        inputs: ['Screener universe tickers', 'Varuna federation on localhost:8400'],
        rules: ['Never duplicate a record for the same ticker and day'],
        outputs: ['Fresh IV history per ticker for the screener to prefer over live Agni'],
      },
    ],
  },
  {
    id: 'scoop',
    time: 'Sun 21:00',
    title: 'Bottom scoop',
    tagline: 'Read bottom positioning ahead of the flip',
    summary:
      'The weekly oversold-quality scan. Entries stage before Airavata flips to NEW ENTRIES ALLOWED instead of chasing it \u2014 the flip arrives late and whipsaws 98% of the time.',
    accent: '#a78bfa',
    components: [
      {
        id: 'gauges',
        title: 'Five gauges',
        tag: 'scan',
        points: [
          'Short % float + days to cover + short MoM trend (Vidhura holders)',
          'RSI vs support (Drona premium-lab)',
          'Gamma state + put GEX walls (options intel)',
          'Skew, term structure, VRP fear pricing',
          'Catalyst proximity',
        ],
        inputs: ['Vidhura short data', 'Drona RSI/support', 'Options-intel GEX', 'Agni skew/VRP'],
        rules: [
          'NEW ENTRIES ALLOWED is a take-profit/derisk marker, never an entry trigger',
          'Crash 21d \u2264 -25% \u2192 CRASH_WASHOUT; volume z>2 with RSI<35 \u2192 VOLUME_CLIMAX',
        ],
        outputs: ['Flagged names with predicted next event and entry expression'],
      },
      {
        id: 'flags',
        title: 'Flags',
        tag: 'signal',
        points: [
          'SQUEEZE_LOADED · CAPITULATION_EARLY · WALL_TEST_BINARY',
          'SHORTS_PRESSING · NO_FUEL',
          'CRASH_WASHOUT · VOLUME_CLIMAX (from the 28 Sep validation)',
        ],
        inputs: ['Gauge readings per name'],
        rules: ['Silent on routine weeks; alerts only on new flags or fired predictions'],
        outputs: ['Ranked survivors written to bottom-scoop/latest.md'],
      },
      {
        id: 'staging',
        title: 'Staging doctrine',
        tag: 'doctrine',
        points: [
          '42\u201363 DTE staging window',
          'Half now, half on wall-test or 5d-low-hold',
          '13:30 dimmer checks the 5d low-hold for Sunday-flagged names',
        ],
        inputs: ['Flagged survivors'],
        rules: ['Never overrides a dimmer verdict \u2014 sharpens the one-line why only'],
        outputs: ['Monday 13:30 dimmer input'],
      },
    ],
  },
  {
    id: 'dimmer',
    time: '13:30',
    title: 'Momentum dimmer',
    tagline: 'Verdict for every name in the universe',
    summary:
      'Forces the deterministic API refresh \u2014 warming the shared snapshot cache \u2014 then assigns Full / Half / Skip to the complete 14:00 universe and writes dimmer-verdicts.json.',
    accent: '#fbbf24',
    components: [
      {
        id: 'refresh',
        title: 'Cache warm',
        tag: 'api',
        points: [
          'POST /api/v1/wheel/candidates/refresh \u2014 forced rescan, ~10\u201330s',
          'One scan serves both 13:30 and 14:00 (shared 1-hour TTL)',
        ],
        inputs: ['Book-first universe: holdings, Shortlist to Buy, theme lists, sleeve names, open-put underlyings'],
        rules: ['A stale snapshot shrinks or skips API-dependent work with disclosure'],
        outputs: ['Ranked candidate snapshot inside the TTL'],
      },
      {
        id: 'verdicts',
        title: 'Dimmer verdicts',
        tag: 'verdict',
        points: [
          'Full · Half · Skip per ticker, with reason',
          'Includes Sunday bottom-scoop survivors on Monday',
          'Written to dimmer-verdicts.json',
        ],
        inputs: ['Ranked API candidates', 'Composite agent score (veto only)'],
        rules: [
          'Dimmer is a ceiling for new puts, never a gate on existing positions',
          'SELL or worse composite downgrades a Full verdict to Skip',
        ],
        outputs: ['Verdict file consumed by the 14:00 pass'],
      },
      {
        id: 'sleeve',
        title: 'Sleeve + governor',
        tag: 'overlay',
        points: [
          'Monthly momentum sleeve: 5\u20138 names, 15% trailing stop, dual-flip exit',
          'Regime governor: halve put sales when <40% of universe is dual-bullish',
          'Tail hedge funded by ~10% of monthly premium',
        ],
        inputs: ['Dimmer verdicts', 'Breadth + VIX reads'],
        rules: ['Sleeve exits, trailing stops, breadth and VIX logic unchanged by the screener migration'],
        outputs: ['Sleeve rebalance actions'],
      },
    ],
  },
  {
    id: 'recommend',
    time: '14:00',
    title: 'Recommendations',
    tagline: 'Stage three strong ideas \u2014 or fewer',
    summary:
      'Positions first, then book-first discovery. New puts screen inside 0.08\u20130.35 absolute delta; hard-gate survivors pass six context inputs before Google Tasks stages the candidates.',
    accent: '#34d399',
    components: [
      {
        id: 'discovery',
        title: 'Book-first discovery',
        tag: 'discover',
        points: [
          'Priority 1: open wheel positions + portfolio holdings',
          'Priority 2: Shortlist to Buy (read-only) + Portfolio',
          'Priority 3: theme watchlists, then momentum/agent screens',
        ],
        inputs: ['Live book', 'Holdings', 'Curated lists', 'Deterministic API snapshot'],
        rules: [
          'Never let a screener name displace a book/watchlist name that clears the gates',
          'Zero candidates is valid \u2014 no filler to meet a quota',
        ],
        outputs: ['Candidate shortlist for gating'],
      },
      {
        id: 'gates',
        title: 'Hard gates',
        tag: 'gate',
        points: [
          'Margin cushion · expiry exists in chain · no earnings in 45d',
          'Option liquidity: chainContracts \u2248 50+ (50\u201375 needs verified tight spreads)',
          'Reserve: net put notional vs combined IBKR equity',
          'Thesis intact',
        ],
        inputs: ['Candidate shortlist', 'Chain data', 'Account equity'],
        rules: [
          'Fail closed: a contradicting recommendation is paused, not debated',
          'Reserve >1.75\u00d7 pauses all new put sales until back below 1.75\u00d7',
        ],
        outputs: ['Gate survivors only'],
      },
      {
        id: 'delta',
        title: 'Six delta-context inputs',
        tag: 'context',
        points: [
          'Airavata posture + tier + n + probability \u2014 disclosed modifier only',
          'IV context: IVR<25 skip, IVR\u226550 use lower-delta end',
          'GEX regime: netGex sign as sizing modifier',
          'Dealer positioning: nearest heavy put-GEX below spot = support; prefer 0.5\u20133% above',
          'Events: fresh 45-day Tier-1/Tier-2 macro check, never cached',
          'Exposure: stacked assignment obligation per ticker and account',
        ],
        inputs: ['Gate survivors', 'Airavata snapshot', 'Agni signals/flow', 'Web macro calendar'],
        rules: [
          'Posture never sets the rung, narrows the band, or blocks entry',
          'Tier-1 event in-window with thin IVR kills; otherwise demote one rung and name the event',
        ],
        outputs: ['Baseline delta + decisive modifiers per candidate'],
      },
      {
        id: 'stage',
        title: 'Stage to ledger',
        tag: 'output',
        points: [
          'At most 3 new-put candidates \u2192 Google Tasks Pending Trades',
          'Task title: TICKER strike EXPIRY xN (account)',
          'All six context lines \u2192 task notes + iv-refresh-queue.md',
          'Chat briefing: chosen delta + 2\u20133 decisive modifiers only',
        ],
        inputs: ['Priced candidates'],
        rules: [
          'Live hours: opening limit 10% richer than executable premium',
          'Market closed: last-print yield is indicative, never executable',
          'Recommend limit orders only \u2014 the job never places trades',
        ],
        outputs: ['Pending Trades tasks', 'IV-refresh queue'],
      },
    ],
  },
  {
    id: 'jev',
    time: '14:00+',
    title: 'Jev shadow',
    tagline: 'An observer that never touches the trade',
    summary:
      'After the briefing is composed, each ranked new-put candidate goes to the TypeSafe Jev model for two observational judgments. Fail-open; nothing flows back into the run.',
    accent: '#f472b6',
    components: [
      {
        id: 'questions',
        title: 'Two questions',
        tag: 'observe',
        points: [
          'Position size: full / half / skip',
          'Airavata weight: full / half / ignore \u2014 given tier, n and probability',
          'One call per candidate; snapshot numbers are ground truth, Jev judges boundary cases only',
        ],
        inputs: ['Compact candidate state', 'Airavata posture + reliability tier + n + probability'],
        rules: ['Runs only after the briefing is fully composed', 'At most one retry per candidate on error'],
        outputs: ['Two judgments per candidate'],
      },
      {
        id: 'logging',
        title: 'Shadow log',
        tag: 'log',
        points: [
          'Appended to hidden_files/jev-shadow/shadow-log.jsonl',
          'Verdict, probabilities, confidence, latency, tokens per record',
          'Normal briefing and bookkeeping continue unchanged on any error',
        ],
        inputs: ['Jev responses'],
        rules: ['Shadow output never enters the live decision path \u2014 not the briefing, gates, sizing, tasks, queue, or 14:30'],
        outputs: ['Scoring dataset'],
      },
      {
        id: 'scoring',
        title: 'Promotion bar',
        tag: 'protocol',
        points: [
          'First review after 4 weeks or 30 scored candidates (~early Nov 2026)',
          'Sizing shadow: Jev Full must beat Skip on 21d forward return (non-overlapping 95% CIs); agreement with pipeline verdict >60%',
          'Weighting shadow: full-weight postures must predict 21d direction better than ignore-weight ones (non-overlapping CIs)',
          'Any shadow failing its bar is removed',
        ],
        inputs: ['Scored shadow log'],
        rules: ['Result reported unprompted in main chat'],
        outputs: ['Keep or ditch each shadow'],
      },
    ],
  },
  {
    id: 'finalize',
    time: '14:30',
    title: 'Finalize-only',
    tagline: 'Reprice and validate \u2014 no new discovery',
    summary:
      'Reads the staged queue, reprices from Varuna/Massive chain snapshots, and finalizes executable limits only while live quotes exist.',
    accent: '#fb923c',
    components: [
      {
        id: 'quotes',
        title: 'Chain quotes',
        tag: 'quote',
        points: [
          'Bid/ask/last by strike and expiry from /v1/vendors/massive/options/chain/{symbol}',
          'Agni signals/flow are advisory context only \u2014 never the quote source',
        ],
        inputs: ['IV-refresh queue', 'Staged Pending Trades tasks'],
        rules: ['Null bid/ask with market open: one retry after ~5 minutes, then staged limit vs live last print with caveat'],
        outputs: ['Validated quotes or a recorded caveat'],
      },
      {
        id: 'limits',
        title: 'Final limits',
        tag: 'finalize',
        points: [
          'Valid tasks receive final limits + refreshed live numbers in task notes',
          'Missing/invalid expiry \u2192 task completed with the reason in notes',
          'Market closed \u2192 stays pending; indicative last-print recorded, never claimed as final',
        ],
        inputs: ['Validated quotes'],
        rules: ['Success-with-caveats is a valid outcome; failure is reserved for genuinely incomplete runs'],
        outputs: ['Executable staged setups'],
      },
    ],
  },
  {
    id: 'execute',
    time: 'human',
    title: 'Review & execute',
    tagline: 'Zonito decides',
    summary:
      'Every result remains a recommendation. He accepts, changes, or rejects the setup \u2014 no component guarantees or places the trade.',
    accent: '#e879f9',
    components: [
      {
        id: 'decision',
        title: 'Human decision',
        tag: 'control',
        points: [
          'Accept, change, or reject each staged setup',
          'Every opened short option carries a GTC buyback at 40% of credit (60% premium capture)',
          'Rolls target 28\u201321 DTE, never below 14; broken thesis closes',
        ],
        inputs: ['Finalized staged setups'],
        rules: ['Stage \u2014 never execute. Limit orders only, never market orders'],
        outputs: ['Placed trades (by hand)'],
      },
      {
        id: 'outcomes',
        title: 'Outcome loop',
        tag: 'learn',
        points: [
          'IBKR transaction exports + FIFO lot matching',
          'Premium, reserve, realised P&L, resolved win-rate reporting',
          'Win rate excludes assignments; breakeven counts as a win \u2014 pair with assignment-adjusted outcomes',
        ],
        inputs: ['Broker exports'],
        rules: ['Known gap: realised behaviour does not yet calibrate discovery, scores, or gates'],
        outputs: ['Performance truth for the next iteration'],
      },
    ],
  },
];

export const flowOrder = ['backfill', 'scoop', 'dimmer', 'recommend', 'finalize', 'execute'];
export const jevStageId = 'jev';

// ---------------------------------------------------------------------------
// Supporting machinery
// ---------------------------------------------------------------------------

export interface AgentView {
  name: string;
  weight: string;
  clock: string;
  detail: string;
}

export const sutradharaSteps: { n: string; title: string; body: string }[] = [
  { n: '0', title: 'Command intake', body: 'Telegram commands and the manual queue run before routine work.' },
  { n: '1', title: 'Guardian picks a mode', body: 'CPU pressure sets FULL (LLM + cross-stock), LIGHT (Python-only, half the symbol cap) or SLEEP.' },
  { n: '2', title: 'Events invalidate', body: 'Cooldown-gated event detection lifts affected symbols above normal staleness work.' },
  { n: '3', title: 'Bounded plan', body: 'Priority: manual \u2192 event \u2192 holdings \u2192 watchlists. Max 10 symbols FULL, 5 LIGHT. ETFs and mutual funds out.' },
  { n: '4', title: 'Agents compute', body: 'Python evidence runs in parallel; LLM overlays and analysts run sequentially where enabled.' },
  { n: '5', title: 'Synthesis persists', body: 'Composite, confidence, relative strength, disagreement, conviction gate, turnaround stage and history are written for the API and jobs.' },
  { n: '6', title: 'Overlays + housekeeping', body: 'Cross-stock ranking, pruning, alerts, cleanup and cycle-state persistence.' },
];

export const agentViews: AgentView[] = [
  { name: 'Fundamental', weight: '22%', clock: '168h', detail: 'Growth, quality, balance sheet' },
  { name: 'Valuation', weight: '18%', clock: '168h', detail: 'DCF, multiples, margin of safety' },
  { name: 'Quantitative', weight: '18%', clock: '24h', detail: 'Risk-adjusted return, factors, tails' },
  { name: 'Sentiment', weight: '12%', clock: '72h', detail: 'News, analysts, flows, transcripts' },
  { name: 'Options', weight: '12%', clock: '24h', detail: 'Raw Varuna chains: IV, flow, OI, liquidity, squeeze' },
  { name: 'Technical', weight: '8%', clock: '1h', detail: 'Momentum, trend, volatility, levels' },
  { name: 'Volume', weight: '5%', clock: '1h', detail: 'Liquidity, participation, friction' },
  { name: 'Recovery', weight: '5%', clock: '24h', detail: 'Drawdown depth, duration, recovery' },
];

export const screenerFacts = {
  service: 'kubera/services/wheel_screener.py',
  cli: 'scripts/wheel_candidate_screen.py (manual / dry-run only)',
  get: 'GET /api/v1/wheel/candidates?profile=&watchlist= \u2014 TTL-guarded, 1 hour',
  post: 'POST /api/v1/wheel/candidates/refresh \u2014 forced rescan, ~10\u201330s',
  snapshotFields: ['as_of', 'cache_age_seconds', 'ttl_seconds', 'is_stale', 'stale_reason', 'per-source as-of timestamps', 'ranked candidates', 'rejected-with-reasons', 'added / removed / verdict_changed'],
  universe: ['Portfolio holdings', 'Shortlist to Buy (read-only)', 'Theme watchlists', 'Momentum-sleeve names', 'Underlyings of open short puts'],
  gates: [
    'Composite score \u2265 60',
    'Bullish dual momentum, above-median cross-sectional percentile',
    'No earnings within 45 days (23 Sep fix correctly rejected GS, JNJ at 20d)',
    'IV rank percentile floor 30',
    'One candidate per cluster \u2014 prefer the laggard',
  ],
  ranking: 'IV-rank percentile first, composite second \u00b7 verdict: standard or high-conviction',
  stats: [
    { n: '314', label: 'US names in the validated run' },
    { n: '1h', label: 'Snapshot TTL' },
    { n: '10\u201330s', label: 'Forced refresh' },
    { n: '2', label: 'Verdicts: standard / high-conviction' },
  ],
};

// ---------------------------------------------------------------------------
// Guardrails
// ---------------------------------------------------------------------------

export interface Rule {
  title: string;
  body: string;
}

export const rules1400: Rule[] = [
  { title: 'Start with the book, not the screen', body: 'Open positions, wheel book and holdings first; Shortlist to Buy and Portfolio next; generic screens last.' },
  { title: 'Roll inside the safer window', body: 'Target rolls at 28\u201321 DTE, never initiate below 14 DTE. Flag sub-28-DTE entries for gamma risk.' },
  { title: 'Turn failed rolls into dated follow-ups', body: 'Requalification conditions + revisit date as a Pending Trades task. Never let a failed roll vanish into chat.' },
  { title: 'Close when the thesis is broken', body: 'A broken setup is a close action, not a watch item. Capital first.' },
  { title: 'Three strong ideas \u2014 or fewer', body: 'At most three new-put candidates. One or two survivors means stop; never add filler.' },
  { title: 'Apply the ratified reserve bands', body: 'Net put notional vs combined IBKR equity. Ceiling 1.50\u00d7; 1.50\u20131.75\u00d7 flagged stretch; above 1.75\u00d7 pause new puts.' },
  { title: 'Restore the 10% NLV soft warning', body: 'Flag new obligation above 10% of destination account NLV. No fixed 20% exception.' },
  { title: 'Daily new-risk cap', body: 'New puts may consume ~one-third of each account\u2019s available put reserve per day; leftover rolls forward.' },
  { title: 'Validate expiry before writing', body: 'Listed, future-dated, inside the DTE window \u2014 before the IV queue or a task. Invalid expiry fails closed.' },
  { title: 'Screen broad, derive from context', body: 'Screen 0.08\u20130.35 absolute delta; derive baseline delta from all six context inputs after hard gates.' },
  { title: 'Read options flow between valid expiries', body: 'Agni flow.get is advisory: deepest-OI expiry, put/call positioning, verified borrow stress. Never a veto, never the limit price.' },
  { title: 'Keep Airavata posture advisory only', body: 'Label + tier + n + probability on every candidate. Never sets the rung, narrows the band, or blocks entry.' },
  { title: 'Keep Jev strictly observational', body: 'Run only after the briefing is composed. Log both judgments to JSONL. Fail open; alter nothing.' },
  { title: 'Name the account', body: 'Every recommendation routes to Zonito IBKR or Nikhila IBKR explicitly.' },
  { title: 'Keep Google Tasks authoritative', body: 'Pending Trades is the sole ledger; Notion is disabled. Title: TICKER strike EXPIRY xN (account).' },
  { title: 'Keep the complete context with the records', body: 'All six delta-context lines \u2192 task notes + IV queue. Chat quotes only the chosen delta + 2\u20133 modifiers.' },
  { title: 'Do not double-book risk', body: 'No new put for a ticker/account with an open put or active Pending Trades task.' },
  { title: 'Be honest about freshness', body: 'Quote price and IV timestamps. Stale inputs \u2192 shrink or skip the recommendation, with disclosure.' },
  { title: 'Call Agni on its current contract', body: 'URL-encode signals.get input. chainContracts \u224850 fails liquidity regardless of IVR; 50\u201375 needs verified tight spreads.' },
  { title: 'Stage a patient opening limit', body: 'Live hours: 10% richer than the executable premium reference. Keep source quote + timestamp in notes.' },
  { title: 'Do not turn closed-market prints into orders', body: 'Last-print yield outside hours is indicative only. Leave pending until live bid/ask arrives.' },
  { title: 'Keep the 60% GTC take-profit plan', body: 'Every new short option carries a buyback at 40% of opening credit. The 50% proposal was rejected.' },
  { title: 'Stage \u2014 never execute', body: 'Limit orders only. The jobs never place trades and never propose a market order.' },
];

export const rules1430: Rule[] = [
  { title: 'Finalize-only', body: 'Reprice, validate, invalidate or cancel what 14:00 staged. Never widen the slate.' },
  { title: 'Chain quotes, not Agni', body: 'Executable bid/ask comes from Varuna/Massive. Agni supplies IV, VRP, skew, GEX and flow context.' },
  { title: 'One retry, then a transparent fallback', body: 'Null bid/ask with market open: retry once after ~5 minutes, then keep the staged limit vs live last print, labelled.' },
  { title: 'Market closed means pending', body: 'Last prints stay indicative. Preserve the task and record the reason \u2014 never claim a finalized limit.' },
  { title: 'A completed fallback is not a failure', body: 'Report success-with-caveats when all available work is done.' },
  { title: 'Resolve visibly', body: 'Invalidated candidates close in Pending Trades with the reason; task state and chat outcome must agree.' },
];

export const reserveBands = [
  { band: '\u2264 1.50\u00d7', label: 'Normal operating band', note: '1.50\u00d7 remains the standing ceiling.' },
  { band: '1.50\u20131.75\u00d7', label: 'Stretch zone', note: 'New puts allowed, every recommendation flagged.' },
  { band: '> 1.75\u00d7', label: 'Red zone', note: 'Pause new put sales until back below 1.75\u00d7.' },
];

// ---------------------------------------------------------------------------
// Quality model
// ---------------------------------------------------------------------------

export const qualityBlocks = [
  {
    title: 'Primary evidence',
    subtitle: 'Business and setup',
    body: 'Fundamentals, catalysts, composite coverage, momentum, breadth and cluster context decide whether an idea is worth suggesting and how strongly it ranks.',
  },
  {
    title: 'Delta context',
    subtitle: 'Evidence-derived baseline, disclosed modifiers',
    body: 'Baseline delta comes from the full risk context inside the 0.08\u20130.35 screen. Airavata posture is disclosed on each candidate but never sets the rung.',
  },
  {
    title: 'Hard gates \u00b7 entry',
    subtitle: 'Capital and contract safety',
    body: 'Margin cushion, assignment sizing, listed future expiry, the earnings window and option liquidity must pass \u2014 before any context is weighed.',
  },
  {
    title: 'Hard gate \u00b7 lifecycle',
    subtitle: 'Thesis integrity',
    body: 'A thesis break closes the setup. GTC buybacks at 40% of credit and 28\u201321 DTE rolls are active-management rules, not substitutes for the gate.',
  },
];

export const qualityNotes = [
  {
    title: 'Airavata posture is advisory only',
    body: 'Label, reliability tier, sample size and probability ride along as disclosed modifiers. Airavata never sets the rung, narrows the band, blocks entry, or silently suppresses a viable setup. The weekly snapshot keeps checking calibration.',
  },
  {
    title: 'Jev is an observer, not a seventh gate',
    body: 'Full/Half/Skip and full/half/ignore are logged after composition for later evaluation. They cannot change the candidate, account, contract, limit, task, queue or briefing in the current run.',
  },
  {
    title: 'Dealer positioning guides strike geometry',
    body: 'Nearest heavy put-GEX strike below spot is dealer support; prefer 0.5\u20133% above it. No meaningful put GEX within ~5% below spot is a GEX desert: widen below it or skip.',
  },
  {
    title: 'Flow guides expiry context, not order pricing',
    body: 'flow.get shows where OI and participation concentrate. Put/call positioning and negative parity spreads are context, not directional truth. Exact bid/ask stays a Varuna/Massive job.',
  },
  {
    title: 'Do not optimise raw win rate alone',
    body: 'Resolved win rate excludes assignments and unconfirmed expiries; breakeven counts as a win. Pair it with assignment-adjusted outcomes, loss severity, max adverse excursion and capital utilisation.',
  },
  {
    title: 'Selectivity beats quota-filling',
    body: 'The three-candidate ceiling is not a target. \u201cSkip\u201d and a one-idea day are valid outcomes when the evidence does not support more risk.',
  },
];

// ---------------------------------------------------------------------------
// Handoffs
// ---------------------------------------------------------------------------

export interface Handoff {
  id: string;
  title: string;
  producer: string;
  artifact: string;
  consumer: string;
  contract: string;
  risk: string;
  riskKind: 'risk' | 'control';
}

export const handoffs: Handoff[] = [
  {
    id: 'watchlist',
    title: 'Watchlist membership',
    producer: 'Manual UI/API, Telegram queue, screener, briefing sync, pruner',
    artifact: 'watchlists.json \u2014 single universe for API, screener, briefing sync, scheduler, pruner',
    consumer: 'Sutradhara priority-4 planning, correlation universe, 14:00 book-first hunt',
    contract: 'Open positions and holdings lead; Shortlist to Buy and Portfolio follow; generic screens last. Membership provenance and net-flow health not yet explicit.',
    risk: 'SILENT UNIVERSE BLOAT',
    riskKind: 'risk',
  },
  {
    id: 'score',
    title: 'Agent score',
    producer: 'Eight agents + StockScoreSynthesizer',
    artifact: 'Per-symbol composite, confidence, relative strength, disagreement, conviction gate, turnaround stage, history',
    consumer: 'Deterministic Wheel Candidates API, reports, pruner',
    contract: 'The API enforces composite \u2265 60 before ranking. The 13:30/14:00 jobs no longer repeat a per-ticker composite check.',
    risk: 'STALE OR NON-COMPARABLE SCORE',
    riskKind: 'risk',
  },
  {
    id: 'snapshot',
    title: 'Shared candidate snapshot + dimmer verdict',
    producer: 'Wheel Candidates API + Momentum Wheel at 13:30',
    artifact: 'One-hour API snapshot + dimmer-verdicts.json',
    consumer: '13:30 sleeve rebalance screen, 14:00 recommendation pass',
    contract: 'A forced 13:30 refresh populates the ranked list; every candidate gets Full/Half/Skip + reason before 14:00 reads the same list.',
    risk: 'STALE OR MISSING VERDICT MUST FAIL VISIBLY',
    riskKind: 'risk',
  },
  {
    id: 'airavata',
    title: 'Airavata advisory context',
    producer: 'Airavata posture + weekly reliability snapshot',
    artifact: 'Posture label, reliability tier, sample size, probability',
    consumer: '13:30 sleeve report, 14:00 recommendation pass',
    contract: 'Posture arrives with tier, n and probability as a disclosed modifier. Never sets the rung, narrows the band, blocks entry or suppresses a viable setup.',
    risk: 'STALE OR WEAKLY CALIBRATED CONTEXT MUST BE LABELLED',
    riskKind: 'risk',
  },
  {
    id: 'jev-handoff',
    title: 'Jev shadow decisions',
    producer: 'TypeSafe Jev, called after the 14:00 briefing is composed',
    artifact: 'hidden_files/jev-shadow/shadow-log.jsonl \u2014 one record per ranked new-put candidate',
    consumer: 'Nobody in the live path \u2014 scoring review only',
    contract: 'Snapshot numbers are ground truth; Jev judges boundary cases only. Observational and fail-open.',
    risk: 'SHADOW OUTPUT MUST NEVER ENTER THE LIVE DECISION PATH',
    riskKind: 'control',
  },
  {
    id: 'flow',
    title: 'Agni options-flow advisory',
    producer: 'Agni flow.get, once per 14:00 candidate (URL-encoded)',
    artifact: 'Cached per-expiry call/put volume and OI, put/call ratios, strike participation, parity spread, cachedAt',
    consumer: '14:00 pass only \u2014 14:30 still sources executable quotes from Varuna/Massive',
    contract: 'Favour the strongest-OI expiry among valid dates; add positioning and borrow-stress notes. Unverified parity is labelled, never promoted.',
    risk: 'CACHED OR UNVERIFIED FLOW MUST NOT MASQUERADE AS A LIVE QUOTE',
    riskKind: 'risk',
  },
  {
    id: 'yield',
    title: 'Agni yield screen + single-leg yield',
    producer: 'Agni /v1/options/yield-screen and /v1/options/yield',
    artifact: 'Ranked contracts or one exact-leg calc: delta, DTE, OI, volume, IV, simple annualized yield, cash required, quote basis, warnings',
    consumer: '14:00 discovery + exact-leg review; mover radar put/call/buyback checks',
    contract: 'Screener excludes sub-21-DTE, earnings-window, illiquid and no-quote legs. Live prefers bid; last-print is indicative only.',
    risk: 'SIMPLE YIELD AND LAST PRINTS MUST NOT MASQUERADE AS EXECUTABLE RETURNS',
    riskKind: 'risk',
  },
  {
    id: 'ledger',
    title: 'IV-refresh queue + Pending Trades ledger',
    producer: '14:00 recommendation pass',
    artifact: 'iv-refresh-queue.md + Google Tasks Pending Trades (Notion disabled)',
    consumer: '14:30 finalize and pairs validator',
    contract: 'All six delta-context lines land in both the queue and task notes. Task title: TICKER strike EXPIRY xN (account).',
    risk: 'QUEUE AND TASK STATE MUST STAY CONSISTENT',
    riskKind: 'risk',
  },
];

// ---------------------------------------------------------------------------
// Gaps
// ---------------------------------------------------------------------------

export interface Gap {
  id: string;
  title: string;
  mechanism: string;
  failure: string;
  target: string;
}

export const gaps: Gap[] = [
  {
    id: 'G01',
    title: 'Universe growth is not governed',
    mechanism: 'Screener and briefing add daily; pruning is narrow and runs only after FULL cycles save scores.',
    failure: 'More names dilute the 10/5-symbol cycle caps, score ages drift upward, and the funnel degrades without an explicit alarm.',
    target: 'Membership event ledger, net-flow telemetry, score-age distribution, backlog SLO, review-only prune candidates.',
  },
  {
    id: 'G02',
    title: 'Freshness is not a wheel contract',
    mechanism: 'A composite can exist while fast agents or the whole score are too old for a live put decision.',
    failure: 'A technically valid response is operationally stale.',
    target: 'Per-agent age, coverage, degraded reasons, hard wheel eligibility, idempotent refresh queueing.',
  },
  {
    id: 'G03',
    title: 'The screener sees only green days',
    mechanism: 'Non-negative day change is mandatory.',
    failure: 'Healthy pullbacks never enter through automation, while continuation names are favoured after strength.',
    target: 'Separate trend-confirmation and controlled-pullback lanes \u2014 pullback lane report-only until proven.',
  },
  {
    id: 'G04',
    title: 'Degraded scores look too normal',
    mechanism: 'LLM failure reduces confidence, which silently changes effective weights after normalisation.',
    failure: 'Scores from different infrastructure states are treated as comparable.',
    target: 'Full provenance, synthesis fingerprint, explicit degraded state, fail-closed wheel readiness without breaking research views.',
  },
  {
    id: 'G05',
    title: 'Outcomes do not teach the funnel',
    mechanism: 'IBKR results feed the wheel tracker, not discovery or score diagnostics.',
    failure: 'The system cannot tell which gates, agents or ticker types actually protected downside.',
    target: 'Append-only outcome attribution, per-signal diagnostics, human-reviewed monthly calibration suggestions.',
  },
];

export const watchRisks = [
  'Lock contention',
  'Dead-symbol retries',
  'Queue age',
  'Handoff-file misses',
  '90-day correlation sample depth',
];

export const metricGroups = [
  { title: 'Universe health', items: ['net_adds_7d', 'score_age_p50 / p90', 'backlog_cycles_full/light', 'protected_vs_reviewable'] },
  { title: 'Scoring health', items: ['fresh_coverage_pct', 'degraded_synthesis_pct', 'queue_oldest_age', 'weight_drift_pct'] },
  { title: 'Decision-map effectiveness', items: ['hard_gate_rejections', 'hvn_lvn_outcome_split', 'flow_chain_coverage', 'borrow_stress_verified_pct', 'airavata_calibration'] },
  { title: 'Outcome quality', items: ['assignment_adjusted_hit_rate', 'loss_severity_p95', 'max_adverse_excursion', 'premium_per_capital_day'] },
];

// ---------------------------------------------------------------------------
// Reliability points (from validation studies)
// ---------------------------------------------------------------------------

export const reliabilityPoints = [
  {
    title: 'Airavata posture is reliability-weighted',
    body: 'Every posture read needs tier (A/B/C), sample size n and probability from the weekly snapshot. No tier, n and probability \u2014 no decision weight. Tier A or strong B: strong sizing dial. Tier C or thin n: context only.',
  },
  {
    title: 'Agni reads are point-in-time context',
    body: 'Backtest edge stats are hardcoded boilerplate \u2014 never quote a p-value or hit rate from Agni. Usable: GEX walls as trigger levels, netGex sign for sizing not direction, chainContracts as liquidity check. Agni is never an entry trigger.',
  },
  {
    title: 'Drona/Vidhura: most technicals are noise',
    body: 'On 454 tickers / 5y: RSI buckets and distance-to-126d-low do not predict. Only proximity to the 126d high carries signal. Vidhura covers 93/454 \u2014 missing does not mean low.',
  },
  {
    title: 'Breach Ratio is experimental',
    body: 'Downside ratio correctly signed but weak (CIs overlap) \u2014 experimental only, never a gate. Upside ratio inverted out of sample \u2014 demoted. Only extreme ratios (0.5 / 1.5) are actionable.',
  },
  {
    title: 'Bottom-scoop validation',
    body: 'The Airavata flip arrives median 104d after the 126d low with 102% of 63d gains pre-flip, and whipsaws 98% of the time. NEW ENTRIES ALLOWED is a take-profit marker, never an entry.',
  },
];

// ---------------------------------------------------------------------------
// Jev trial facts (MEMORY.md, 4 Oct 2026)
// ---------------------------------------------------------------------------

export const jevFacts = {
  connection: 'TypeSafe direct API as custom.typesafe (vault). Vercel AI Gateway connected but blocked on card verification \u2014 fallback only.',
  endpoint: 'POST https://api.typesafe.ai/v1/systemone \u00b7 model jev-latest \u2192 resolved jev-1.13.0',
  verified: 'MU test 4 Oct 2026: HALF at 86% confidence, 513 input tokens, ~$0.00002. First call took 7.8s, a retry took 467.5ms \u2014 inside the 70\u2013500ms vendor claim.',
  funding: 'Account funded with $5 on 4 Oct 2026 \u2014 roughly 39 months of the estimated workload.',
  skill: 'Skill: ~/workspace/skills/typesafe/bin/jev_direct.py',
};
