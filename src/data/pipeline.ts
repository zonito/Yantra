// Yantra data model — the living Kubera Wheel Pipeline Architecture.
// Pipeline changes update THIS file first; the static Molang snapshot is
// re-exported from it. Facts sourced from the 4 Oct 2026 architecture
// runbook, AGENTS.md and MEMORY.md. Nothing here is invented.

export interface FlowItem {
  label: string;
  detail: string;
  /** node id this output feeds, when it hands off downstream */
  to?: string;
}

export interface SubComponent {
  name: string;
  detail: string;
}

export interface PipelineNode {
  id: string;
  time: string;
  title: string;
  tagline: string;
  summary: string;
  accent: string;
  /** observer branches never touch the trade */
  observer?: boolean;
  /** deeper page for this node, when one exists */
  link?: string;
  linkLabel?: string;
  inputs: FlowItem[];
  subcomponents: SubComponent[];
  outputs: FlowItem[];
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  nodes: PipelineNode[];
}

export const phases: Phase[] = [
  {
    id: 'universe',
    title: 'Universe',
    subtitle: 'Tickers enter through one door. Human intent outranks automation.',
    nodes: [
      {
        id: 'ecosystem',
        time: 'Continuous',
        title: 'Ticker ecosystem',
        tagline: 'Curate the universe before anything is scored',
        summary:
          'The tradeable universe is curated before any scoring runs. The live book and explicit human adds come first; automated screens are the last resort, never the first.',
        accent: '#f59e0b',
        link: '/kubera',
        linkLabel: 'Open the Kubera book',
        inputs: [
          { label: 'Wheel book + holdings', detail: 'Open positions and portfolio holdings lead the hunt; exposure is understood before any new-risk search.' },
          { label: 'Shortlist to Buy', detail: 'Read-only hunting ground of 36 high-intent names. Never added to, removed from, or reordered by jobs.' },
          { label: 'Theme watchlists', detail: '22 theme/story lists (neoclouds, AI semis, space/defense/quantum…). A gate-kill never drops a name from attention.' },
          { label: 'Human adds', detail: 'Dashboard edits, Telegram /add, explicit API changes, and the 06:30 briefing sync preserve high-intent ideas.' },
          { label: '22:00 automated screens', detail: 'Five sector targets with market-cap, valuation, direction, volume and leverage filters — only after book-first sources are exhausted.' },
        ],
        subcomponents: [
          { name: 'Watchlist store', detail: 'watchlists.json is the single universe read by the API, screener, briefing sync, scheduler and pruner.' },
          { name: 'WatchlistPruner', detail: 'FULL mode only. Removes low, declining names after grace rules; protects holdings and legacy names; manual removal stays available.' },
          { name: 'Universe sync', detail: 'The 06:30 briefing sync carries curated additions into the shared store so nothing high-intent is lost.' },
        ],
        outputs: [
          { label: 'Curated ticker universe', detail: 'One ranked, deduplicated universe every downstream stage reads from.', to: 'sutradhara' },
        ],
      },
      {
        id: 'sutradhara',
        time: 'Every 5 min',
        title: 'Sutradhara scoring',
        tagline: 'Stale evidence gets recomputed — nothing else',
        summary:
          'A resource-aware freshness engine, not a one-shot stock ranker. It plans bounded work, fans eight evidence agents out, and blends them into one comparable score per ticker.',
        accent: '#a78bfa',
        link: '/machinery',
        linkLabel: 'Open the scoring engine',
        inputs: [
          { label: 'Ticker universe', detail: 'The curated universe from the ecosystem stage.' },
          { label: 'Varuna option chains', detail: 'Native chain dependency — Sutradhara reads contracts directly from Varuna.' },
          { label: 'Event invalidations', detail: 'Earnings, corporate actions and news that retire cached evidence immediately.' },
          { label: 'Staleness queue', detail: 'Manual queue first, then event invalidations, then stale holdings, then stale watchlist names.' },
        ],
        subcomponents: [
          { name: 'Scheduler', detail: 'Every 5 minutes it plans bounded work: manual queue → event invalidations → stale holdings → stale watchlist names.' },
          { name: 'Eight evidence agents', detail: 'Fundamental, valuation, quantitative, sentiment, options, technical, volume and recovery — each on its own clock. Technical and volume can age within a day; fundamental and valuation are deliberately weekly.' },
          { name: 'Deterministic synthesis', detail: 'Confidence-weighted blend → agreement stretch → conviction gate → signal band, with a disagreement record kept.' },
        ],
        outputs: [
          { label: 'Scored evidence per ticker', detail: 'One comparable composite score with confidence, feeding discovery and context.', to: 'recommend' },
        ],
      },
    ],
  },
  {
    id: 'evidence',
    title: 'Evidence',
    subtitle: 'Volatility truth: what the options market is pricing, with no gaps.',
    nodes: [
      {
        id: 'backfill',
        time: '00:05',
        title: 'Nightly IV backfill',
        tagline: 'Prepare the volatility history',
        summary:
          'One JSONL record per screener-universe ticker, appended before the trading day begins. Idempotent: a ticker with today’s record is skipped.',
        accent: '#38bdf8',
        link: '/varuna',
        linkLabel: 'Open the Varuna data plane',
        inputs: [
          { label: 'Screener universe tickers', detail: 'Every name the 14:00 discovery pass can consider.' },
          { label: 'Varuna federation', detail: 'iv-backfill jobs on localhost:8400; the chain source of truth.' },
          { label: 'Expiry + earnings calendar', detail: 'So history is aligned to tradeable expiries and event windows.' },
        ],
        subcomponents: [
          { name: 'Backfill scheduler', detail: 'launchd timer at 00:05 local; stdout/stderr to logs/wheel-iv-backfill.{stdout,stderr}.log.' },
          { name: 'Chain snapshotter', detail: 'scripts/backfill_iv.py --profile "US Extended" --watchlist wl_shortlisted; writes cache/iv_history/{SYM}.jsonl.' },
          { name: 'History store', detail: 'Append-only per-ticker IV series. Never duplicates a record for the same ticker and day.' },
        ],
        outputs: [
          { label: 'Complete IV history', detail: 'Gap-free volatility series per ticker, ready for analytics.', to: 'agni' },
        ],
      },
      {
        id: 'agni',
        time: 'Nightly',
        title: 'Agni IV analytics',
        tagline: 'What the options market is pricing',
        summary:
          'Turns raw IV history into decision context: richness, fear pricing, tail honesty and dealer positioning. Context only — Agni never triggers an entry.',
        accent: '#34d399',
        link: '/agni',
        linkLabel: 'Open the Agni engine',
        inputs: [
          { label: 'IV history', detail: 'The gap-free series from the nightly backfill.' },
          { label: 'Live option chains', detail: 'Current surfaces for term structure and wall computation.' },
        ],
        subcomponents: [
          { name: 'IVR + IV percentile', detail: 'ivr.rank — where current volatility sits against its own history. The richness read.' },
          { name: 'Volatility risk premium', detail: 'Implied vs realized vol: is the market overpaying for fear?' },
          { name: 'Breach Ratio', detail: 'Tail honesty: realized 21-day band-breach rate vs the 31.7% theoretical. High IVR + low ratio is the premium-selling filter.' },
          { name: 'Term structure + walls', detail: 'Backwardation/stress reads; max call-GEX and min put-GEX strikes as trigger levels.' },
        ],
        outputs: [
          { label: 'Volatility context per ticker', detail: 'IVR, VRP, Breach Ratio and walls consumed by the 14:00 pass as positioning context.', to: 'recommend' },
        ],
      },
    ],
  },
  {
    id: 'decide',
    title: 'Decide',
    subtitle: 'Verdicts before money: every name gets a verdict, only the strongest become setups.',
    nodes: [
      {
        id: 'scoop',
        time: 'Sun 21:00',
        title: 'Bottom scoop',
        tagline: 'Read bottom positioning ahead of the flip',
        summary:
          'Reads bottom positioning on Sunday night so entries stage before Airavata flips — instead of chasing the flip after the easy money is gone.',
        accent: '#c084fc',
        inputs: [
          { label: 'Short % float + days to cover', detail: 'Squeeze fuel: how crowded the short side is.' },
          { label: 'RSI vs support', detail: 'Capitulation math against the computed 126-day low.' },
          { label: 'Gamma state + put-GEX walls', detail: 'Dealer positioning from the Agni read.' },
          { label: 'Skew / term structure / VRP', detail: 'How fear is priced across the surface.' },
          { label: 'Catalyst proximity', detail: 'What could force the move, and when.' },
        ],
        subcomponents: [
          { name: 'Squeeze-fuel gauge', detail: 'Flags SQUEEZE_LOADED when shorts are crowded into support.' },
          { name: 'Capitulation detector', detail: 'Volume climax + washed-out RSI marks CAPITULATION_EARLY.' },
          { name: 'Wall-test reader', detail: 'Price action at put-GEX walls decides WALL_TEST_BINARY.' },
          { name: 'Catalyst check', detail: 'Binary events near the wall get named, not averaged away.' },
        ],
        outputs: [
          { label: 'Bottom flags', detail: 'SQUEEZE_LOADED / CAPITULATION_EARLY / WALL_TEST_BINARY per name — Monday dimmer input.', to: 'dimmer' },
        ],
      },
      {
        id: 'dimmer',
        time: '13:30',
        title: 'Momentum dimmer',
        tagline: 'A verdict for every name in the universe',
        summary:
          'Reads the deterministic candidate API, assigns Full / Half / Skip to the complete 14:00 universe, and runs the sleeve and regime-governor logic. The dimmer is a ceiling for new puts, never a gate on existing positions.',
        accent: '#fbbf24',
        inputs: [
          { label: 'Ranked candidates', detail: 'The deterministic wheel-candidates API snapshot.' },
          { label: 'Bottom-scoop flags', detail: "Sunday night's positioning read sharpens the one-line why." },
          { label: 'Sleeve state', detail: 'Monthly momentum sleeve: 5–8 names, 15% trailing stops, dual-flip exits.' },
          { label: 'Regime governor', detail: 'Breadth vs 40%: halve put sales below it. 1.0x / 0.5x multiplier plus a tail hedge from ~10% of monthly premium.' },
        ],
        subcomponents: [
          { name: 'Full / Half / Skip verdicts', detail: 'Bullish = full size, neutral = half, bearish = skip. A composite-agent SELL can only downgrade Full to Skip.' },
          { name: 'dimmer-verdicts.json', detail: 'The written verdict file the 14:00 pass reads first.' },
          { name: 'Sleeve logic', detail: 'Dual-flip exits and 15% trailing stops manage the monthly momentum sleeve.' },
          { name: 'Regime governor', detail: 'Market-breadth governor on new risk: below 40% dual-bullish, put sales halve.' },
        ],
        outputs: [
          { label: 'Dimmer verdicts', detail: 'Full / Half / Skip per name — the ceiling the 14:00 pass builds under.', to: 'recommend' },
        ],
      },
      {
        id: 'recommend',
        time: '14:00',
        title: 'Recommendations',
        tagline: 'Three strong ideas — or fewer',
        summary:
          'Handles positions first, targets rolls at 28–21 DTE, and uses the deterministic candidate API only as supplemental discovery. Candidates clear hard gates, then pass six context inputs before ≤3 ideas are staged to Google Tasks.',
        accent: '#34d399',
        link: '/airavata',
        linkLabel: 'Open the Airavata engine',
        inputs: [
          { label: 'Wheel book', detail: 'Positions first: rolls targeted at 28–21 DTE for net credit, never under 14 DTE.' },
          { label: 'Candidate API', detail: 'Deterministic ranked snapshot — supplemental discovery only, never displacing a book or watchlist name.' },
          { label: 'Dimmer verdicts', detail: 'The 13:30 ceiling: Full permits normal sizing, Skip rejects.' },
          { label: 'Sutradhara scores', detail: 'Composite evidence scores with confidence.' },
          { label: 'Macro calendar', detail: 'Fresh 45-day Tier-1 calendar (FOMC, CPI, PCE, NFP, OPEX). Thin IVR + Tier-1 event in-window = kill.' },
          { label: 'Airavata posture', detail: 'Reliability-weighted only: tier + n + probability, or it carries no weight. Advisory, never a hard gate.' },
          { label: 'Agni positioning', detail: 'Walls as trigger levels, gamma regime for sizing — never an entry trigger.' },
        ],
        subcomponents: [
          { name: 'Book-first discovery', detail: 'Existing book (rolls, take-profit redeploys, covered-strangle legs) → Shortlist → holdings → theme lists → screens.' },
          { name: 'New-put screen', detail: '0.08–0.35 absolute delta; 28/35/42/49 DTE ladder with equal capital per rung.' },
          { name: 'Hard gates', detail: 'Margin cushion, expiry existence, earnings window, option liquidity, reserve math, thesis intact. A contradiction here pauses the idea.' },
          { name: 'Six context inputs', detail: 'The delta-context block: momentum, posture, positioning, correlation cluster, event flags, reserve headroom.' },
          { name: 'Macro event gate', detail: 'Tier-1 macro inside the DTE window demotes a rung or kills; Tier-2 names a caveat with trimmed size.' },
          { name: 'Staging', detail: 'Three strong ideas or fewer → Google Tasks “Pending Trades” as TICKER strike EXPIRY xN (account). Zero is a valid output.' },
        ],
        outputs: [
          { label: 'Staged trade setups', detail: 'Ranked candidates with every gate recorded, waiting for final pricing.', to: 'finalize' },
          { label: 'Jev observation set', detail: 'Each ranked new-put candidate is handed to the Jev shadow after the briefing is composed.', to: 'jev' },
        ],
      },
      {
        id: 'jev',
        time: '14:00+',
        title: 'Jev shadow',
        tagline: 'Watches, logs, never touches the trade',
        summary:
          'An observer branch off 14:00. After the briefing is composed, each ranked new-put candidate gets two Jev judgments. Fail-open and invisible in the briefing — it cannot alter gates, sizing, the IV queue or execution.',
        accent: '#f472b6',
        observer: true,
        link: '/jev',
        linkLabel: 'Open the Jev page',
        inputs: [
          { label: 'Ranked new-put candidates', detail: 'The 14:00 shortlist, handed over after briefing composition.' },
          { label: 'Airavata reliability snapshot', detail: 'Tier, n and probability are ground truth; Jev judges only the boundary.' },
        ],
        subcomponents: [
          { name: 'Position-size question', detail: 'Full / half / skip per candidate, with confidence.' },
          { name: 'Posture-weight question', detail: 'Full / half / ignore for the Airavata posture given its reliability tier.' },
        ],
        outputs: [
          { label: 'shadow-log.jsonl', detail: 'Verdict, confidence, latency and tokens per candidate. Scored after 4 weeks / 30 candidates; failing shadows are removed.' },
        ],
      },
      {
        id: 'finalize',
        time: '14:30',
        title: 'Finalize-only',
        tagline: 'Reprice and validate — no new discovery',
        summary:
          'Reads contract bid/ask/last by strike and expiry from Varuna/Massive chain snapshots, then validates liquidity, cluster, lead-lag, beta and earnings dates. Finalizes executable limits only while live quotes are available.',
        accent: '#fb923c',
        inputs: [
          { label: 'Staged candidates', detail: 'The ≤3 setups from 14:00.' },
          { label: 'Chain snapshots', detail: 'Varuna/Massive bid/ask/last by strike and expiry.' },
          { label: 'Peer earnings dates', detail: 'Next-earnings check from the correlation peer feed.' },
        ],
        subcomponents: [
          { name: 'Quote verification', detail: 'Live bid/ask/last per contract. One retry after 5 minutes on null quotes, then finalize off live last prints as success-with-caveats.' },
          { name: 'Liquidity + cluster checks', detail: 'Option liquidity gate; one candidate per correlation cluster, preferring the laggard of a diverged pair.' },
          { name: 'Lead-lag + beta validation', detail: 'Beta-aware strike widths; no pairs logic in bear regimes.' },
          { name: 'Executable limit pricer', detail: 'Limit orders only, per-account reserve math, explicit Zonito-or-Nikhila label.' },
        ],
        outputs: [
          { label: 'Final limits', detail: 'Executable limits patched into the Pending Trades task notes. Dead candidates completed with reason.', to: 'execute' },
        ],
      },
    ],
  },
  {
    id: 'act',
    title: 'Act',
    subtitle: 'A human decides; the ledger keeps score.',
    nodes: [
      {
        id: 'execute',
        time: 'On approval',
        title: 'Human execution',
        tagline: 'Zonito accepts, changes, or rejects',
        summary:
          'No component in this pipeline guarantees or places the trade. The human reviews each finalized setup against the book and the day’s tape, then works the order.',
        accent: '#f87171',
        inputs: [
          { label: 'Finalized setups', detail: 'Limits, expiries and account labels from 14:30.' },
          { label: 'Live tape', detail: 'The human’s read on the day’s price action before working the order.' },
        ],
        subcomponents: [
          { name: 'Review', detail: 'Accept, change, or reject each setup. A verdict overridden is not a verdict withheld.' },
          { name: 'IBKR order entry', detail: 'Limit orders; short puts carry GTC take-profit buybacks at 60% profit capture (buy back at 40% of opening credit).' },
          { name: 'Reserve discipline', detail: 'Daily new risk near one third of available reserve per account; 1.5x notional ceiling, 1.75x red zone.' },
        ],
        outputs: [
          { label: 'Live positions', detail: 'Filled short puts and covered calls, managed to 60% take-profit or roll.', to: 'outcomes' },
        ],
      },
      {
        id: 'hedge',
        time: 'Continuous',
        title: 'Compounder hedge',
        tagline: 'Collar the high-stack names before the drop',
        summary:
          'Single-name collars on equity positions above $75K. Two triggers, both buy protection before the drop: a daily close within 5% below resistance with a bullish trend, or a financial/geopolitical fear spike while the position is still whole. Never index, never after the selloff.',
        accent: '#22d3ee',
        link: '/hedge',
        linkLabel: 'Open the hedge doctrine',
        inputs: [
          { label: 'Position state files', detail: '## Hedge plan per compounder: resistance, support, hedge zone and notional band. The morning loop reads them and flags candidates.' },
          { label: 'Drona levels', detail: 'Support and resistance per name; the 5% band below resistance is the technical trigger zone.' },
          { label: 'Fear read', detail: 'VIX spikes, macro shocks, sector-wide de-risking — the event trigger, independent of price.' },
        ],
        subcomponents: [
          { name: 'High-stack bar', detail: 'Positions above $75K only (9 Oct 2026: MU, MRVL, NBIS, IREN, TEM, INTC). RKLB at $63K does not clear it.' },
          { name: 'Put spread, 2–3 months', detail: 'Long leg at/near support, 30–50% of position notional. Spread caps the cost; outright puts are not bought.' },
          { name: 'Call-funded collar', detail: 'Where a covered-call ladder exists (MU, MRVL, INTC), the collected call premium funds the put leg.' },
          { name: 'Liquidity filter', detail: 'Thin-option names stay unhedged regardless of size.' },
        ],
        outputs: [
          { label: 'Collared compounders', detail: 'Downside protection on the 20% growth engine, bought when puts are cheap.', to: 'outcomes' },
        ],
      },
      {
        id: 'outcomes',
        time: 'Continuous',
        title: 'Outcome tracking',
        tagline: 'Every premium dollar accounted for',
        summary:
          'IBKR transaction exports with FIFO lot matching power premium, reserve, realized P&L and resolved win-rate reporting. The one known gap: realized behavior does not yet calibrate discovery.',
        accent: '#94a3b8',
        inputs: [
          { label: 'IBKR transaction exports', detail: 'Both accounts, month-to-date CSVs.' },
        ],
        subcomponents: [
          { name: 'FIFO lot matching', detail: 'Every close matched to its open for true realized premium.' },
          { name: 'Premium + reserve accounting', detail: 'Only realized premium counts toward the $500k goal; open positions are held out until they resolve.' },
          { name: 'Win-rate reporting', detail: 'Resolved-trade win rate (assignments excluded; breakeven counts as a win), reserve bands, realized P&L.' },
        ],
        outputs: [
          { label: 'Resolved-trade evidence', detail: 'Performance truth for the next iteration. Known gap: it does not yet feed back into discovery, scores, or gates.' },
        ],
      },
    ],
  },
];

/** flat pipeline order for prev/next navigation */
export const nodeOrder = [
  'ecosystem',
  'sutradhara',
  'backfill',
  'agni',
  'scoop',
  'dimmer',
  'recommend',
  'finalize',
  'execute',
  'hedge',
  'outcomes',
];

export const observerNodeId = 'jev';

export const allNodes: PipelineNode[] = phases.flatMap((p) => p.nodes);

export function nodeById(id: string | undefined): PipelineNode | undefined {
  return allNodes.find((n) => n.id === id);
}

export function phaseOfNode(id: string): Phase | undefined {
  return phases.find((p) => p.nodes.some((n) => n.id === id));
}

export function nodeNeighbors(id: string): { prev: PipelineNode | null; next: PipelineNode | null } {
  const idx = nodeOrder.indexOf(id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? nodeById(nodeOrder[idx - 1]) ?? null : null,
    next: idx < nodeOrder.length - 1 ? nodeById(nodeOrder[idx + 1]) ?? null : null,
  };
}

// ---------------------------------------------------------------------------
// Supporting machinery
// ---------------------------------------------------------------------------

export interface AgentView {
  name: string;
  weight: string;
  clock: string;
  detail: string;
  /** proposed weight after the 4 Oct 2026 rebalance review; null = keep */
  proposed: string | null;
  /** one-line reason for the proposed change */
  why: string;
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
  { name: 'Fundamental', weight: '22%', clock: '168h', detail: 'Growth, quality, balance sheet', proposed: null, why: 'Keep. Own-worthiness is the anchor for the wheel.' },
  { name: 'Valuation', weight: '18%', clock: '168h', detail: 'DCF, multiples, margin of safety', proposed: '10%', why: 'DCF has almost no predictive power over a 30–45 day put; it double-counts Fundamental.' },
  { name: 'Quantitative', weight: '18%', clock: '24h', detail: 'Risk-adjusted return, factors, tails', proposed: '22%', why: 'Tails are the actual business risk in put selling.' },
  { name: 'Sentiment', weight: '12%', clock: '72h', detail: 'News, analysts, flows, transcripts', proposed: null, why: 'Fine as is.' },
  { name: 'Options', weight: '12%', clock: '24h', detail: 'Raw Varuna chains: IV, flow, OI, liquidity, squeeze', proposed: '14%', why: 'IV richness is the income itself.' },
  { name: 'Technical', weight: '8%', clock: '1h', detail: 'Momentum, trend, volatility, levels', proposed: '10%', why: 'The freshest view deserves enough weight to matter when the tape turns.' },
  { name: 'Volume', weight: '5%', clock: '1h', detail: 'Liquidity, participation, friction', proposed: null, why: 'Fine; option liquidity is checked downstream anyway.' },
  { name: 'Recovery', weight: '5%', clock: '24h', detail: 'Drawdown depth, duration, recovery', proposed: null, why: 'Fine.' },
];

/** 4 Oct 2026 rebalance review notes (proposed, not yet implemented) */
export const rebalanceNotes = [
  'Clock vs weight mismatch: Technical + Volume refresh hourly but carry only 13% combined; Fundamental + Valuation refresh weekly but carry 40%. In a fast week the score is anchored by stale evidence unless confidence decays aggressively on the 168h views.',
  'The composite’s job is own-worthiness (what is safe to own if assigned). Timing belongs to the 13:30 dimmer, pricing to the 14:00 gates — the weights do not need to carry either.',
  'Structural gap: realized put outcomes do not feed back into these weights. The outcome loop should own future recalibration once it exists.',
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
// Compounder hedge doctrine (set 2026-10-09)
// ---------------------------------------------------------------------------

export const hedgeDoctrine = {
  bar: 'Equity positions above $75K get collar treatment. Hedge only what is owned \u2014 never index (no QQQ/SPY).',
  triggers: [
    {
      title: 'Technical: resistance touch',
      body: 'Daily close within 5% below resistance with a bullish trend. Puts are cheapest when the stock is strong and complacency is highest \u2014 the "good times" entry.',
    },
    {
      title: 'Event: fear spike',
      body: 'Financial or geopolitical fear spike (VIX spike, macro shock, sector-wide de-risking) while the position is still whole. The trigger is the fear itself \u2014 never buy the hedge after the drop.',
    },
  ],
  structure: [
    { title: 'Put spread, 2-3 months', body: 'Long leg at/near support. Spread caps the cost; outright puts are not bought.' },
    { title: '30-50% of position notional', body: 'Protect the compounder, never neutralize it.' },
    { title: 'Call-funded collar', body: 'Where a covered-call ladder exists, collected call premium funds the put leg \u2014 the cheapest hedge is the one the wheel already paid for.' },
    { title: 'Liquidity filter', body: 'Thin-option names stay unhedged regardless of size.' },
  ],
  /** roster as of 2026-10-09; levels move with Drona, the bar does not */
  roster: [
    { ticker: 'MU', value: '$707K', resistance: '$1,108.72', hedgeZone: '$1,053+', support: '$1,022.90', status: 'Watch \u2014 7% below zone, bullish' },
    { ticker: 'MRVL', value: '$565K', resistance: '$301.27', hedgeZone: '$286+', support: '$213.63', status: 'Watch \u2014 10% below zone, bullish' },
    { ticker: 'NBIS', value: '$405K', resistance: '$255.10', hedgeZone: '$242+', support: '$203.87', status: 'Standby \u2014 16% below zone, neutral' },
    { ticker: 'IREN', value: '$204K', resistance: '$49.37', hedgeZone: '$46.90+', support: '$35.24', status: 'No hedge \u2014 bearish, 38% below zone' },
    { ticker: 'TEM', value: '$81K', resistance: '$89.09', hedgeZone: '$84.60+', support: '$57.72', status: 'Watch \u2014 bullish' },
    { ticker: 'INTC', value: '$78K', resistance: '$127.44', hedgeZone: '$121+', support: '$94.52', status: 'Watch \u2014 bullish' },
  ],
  mechanism: 'Triggers live in each position state file (## Hedge plan). The morning report loop reads them and flags candidates \u2014 no per-stock watch jobs.',
};

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

// ---------------------------------------------------------------------------
// Engine deep dives — Agni, Airavata, and the supporting cast
// ---------------------------------------------------------------------------

export interface EngineRouter {
  name: string;
  kind: string;
  detail: string;
}

export const agniFacts = {
  repo: 'zonito/agni-source',
  base: 'http://127.0.0.1:3002 (tailnet 100.125.239.56:3002)',
  protocols: 'tRPC (queries GET, mutations POST, URL-encoded JSON input) + a small REST surface',
  dataPlane: 'Reads Varuna through a typed server/varuna.ts client — never vendors directly. Same cache-first discipline as Airavata.',
  role: 'Volatility truth for the pipeline: IV richness, fear pricing, tail honesty, dealer positioning. Advisory context at 14:00 — never an entry trigger.',
};

export const agniRouters: EngineRouter[] = [
  { name: 'signals.get', kind: 'tRPC query', detail: 'Full TickerSignals payload: spot, chainContracts, ivr.rank/ivp, VRP, put/call ratios, skew, GEX walls (callWall/putWall/zeroGamma), regime, composite verdict. The one call the 14:00 pass leans on.' },
  { name: 'signals.refresh', kind: 'tRPC mutation', detail: 'Evicts the signal + raw-chain caches and reloads. 60s per-target cooldown on force refreshes.' },
  { name: 'flow.get', kind: 'tRPC query', detail: 'Unusual-activity analytics: per-expiry call/put volume and OI with put/call ratios, plus strike parity chains with call/put IV spread. Borrow-stress flags: htb at -0.05, severe at -0.15, unverified when quote-backing is missing.' },
  { name: 'odds.get', kind: 'tRPC query', detail: 'Odds Lab: expected-move bands, event decomposition, strike ladder, Monte Carlo wall odds, seller edge score. Consumes cached signals.get + flow.get.' },
  { name: 'breachRatio.get', kind: 'tRPC query', detail: 'Directional 30d expected-move breach ratios (upside / downside / overall vs 0.3173 theoretical). Retrospective mode at 90d; contemporaneous mode with dated IV at 126–252d. Quadrants: puts-favored, calls-favored, both-calm, both-jumpy.' },
  { name: 'action.get / action.lab', kind: 'tRPC query', detail: 'Actionability read and lab variants over the signal payload.' },
  { name: 'historical.get', kind: 'tRPC query', detail: 'Historical signal snapshots for prior-session comparisons.' },
  { name: 'GET /v1/options/yield-screen', kind: 'REST', detail: 'Deterministic put/call screener: ranked contracts with delta, DTE, OI, volume, IV, simple annualized yield, cash required and warnings. Excludes sub-21-DTE, earnings-window and illiquid legs.' },
  { name: 'GET /v1/options/yield', kind: 'REST', detail: 'Exact-leg pricing for one symbol/expiry/strike/side. Live prefers bid; last-print is indicative only.' },
];

export const agniCaveats = [
  { title: 'Backtest edge stats are hardcoded', body: 'Identical boilerplate across tickers — never quote a p-value or hit rate from Agni. The VRP edgeNote contradicts its own quintile badge on most names.' },
  { title: 'Five tickers run on proxy IV', body: 'MIRM, VKTX, HIMS, NVO, SOFI: ~248d realized-vol proxy with only a handful of real snapshots. Their IVR/IVP/VRP percentiles are indicative only; breachRatio falls back to retrospective mode for them.' },
  { title: 'volRegime does not discriminate', body: 'Reads "stressed" on every name tested — ignore it as a signal.' },
  { title: 'No history for positioning series', body: 'No historical GEX, skew or VRP series anywhere in the stack. Every Agni read is point-in-time context.' },
  { title: 'What survives validation', body: 'GEX walls as trigger levels, netGex sign for sizing (not direction), chainContracts as the liquidity check (BBIO 52 / MIRM 40 = thin). Usage order: momentum, posture context, Agni positioning context, price trigger.' },
];

export const airavataFacts = {
  repo: 'zonito/airavata',
  base: 'http://127.0.0.1:3000 (tailnet 100.125.239.56:3000)',
  protocols: 'tRPC only — no REST routes. Public procedures need no session; refresh/watchlist/digest mutations are protected.',
  engine: 'The airavata.* procedures delegate to runEngine in server/airavata.ts, which spawns the Python engine. Full payload schema lives there.',
  dataPlane: 'Reads Varuna through a typed server/varuna.ts client (X-Varuna-Source: AIRAVATA, loopback-only base URL guard) — never vendors directly.',
  role: 'Smart-money regime context for the pipeline: posture plus its reliability receipt, consumed at 13:30 and 14:00 as advisory only — never a hard gate on its own.',
};

export const airavataRouters: EngineRouter[] = [
  { name: 'airavata.posture', kind: 'tRPC query', detail: 'Smart-money posture for one symbol: NEW ENTRIES ALLOWED / REDUCE ONLY / CASH PRIORITY, with d25/d15/d5 drawdown counters, mom63, guidance, whyBlocked and the per-session history behind the verdict.' },
  { name: 'airavata.postureBatch', kind: 'tRPC query', detail: 'Multi-symbol posture in one call (1–20 symbols, engine concurrency 5). Prefer this over hand-crafted HTTP batching — batch cardinality comes from the path, not the input keys.' },
  { name: 'airavata.accuracy', kind: 'tRPC query', detail: 'Historical hit-rate and reliability stats per symbol: entry and exit tiers with sample sizes. This is the reliability data quoted alongside every posture read.' },
  { name: 'airavata.evidence', kind: 'tRPC query', detail: 'The evidence the engine saw behind the current posture.' },
  { name: 'airavata.state', kind: 'tRPC query', detail: 'Combined engine-state payload per symbol — what the dashboard single-ticker view is built from.' },
  { name: 'airavata.strategy / .sim / .flipTrades', kind: 'tRPC query', detail: 'Leveraged-strategy backtest, portfolio simulation, and flip-trade backtest payloads for research and validation.' },
  { name: 'refresh.* / watchlist.* / digest.*', kind: 'tRPC mutations', detail: 'Protected: force-refresh a symbol or list (60s cooldown), watchlist membership, digest reads.' },
];

export const airavataReliability = [
  { title: 'Every posture carries a receipt', body: 'Tier (A/B/C), sample size n and probability from the weekly airavata_reliability.json snapshot. A posture quoted without tier, n and probability carries no weight.' },
  { title: 'Weight scales with reliability', body: 'Tier A (or strong B with adequate n): strong sizing dial; CASH PRIORITY then demands exceptional edge and shrunk size. Tier C or thin n: noted, never moves size.' },
  { title: 'The flip arrives late and whipsaws', body: 'Median 104 days after the 126d low, 102% of 63d gains pre-flip, 98% whipsaw within 63d. NEW ENTRIES ALLOWED is a take-profit/derisk marker, never an entry signal.' },
  { title: 'Jev judges the boundary', body: 'The weighting shadow asks Jev full/half/ignore on the posture given tier, n and probability — snapshot numbers are ground truth, Jev judges only thin-reliability and noisy-context boundaries.' },
];

export const satelliteApps: { name: string; port: string; role: string; detail: string }[] = [
  { name: 'Kamadhenu', port: ':3005', role: 'Commodities', detail: 'Commodity briefs and detail reads for the macro sleeve of the briefings — not part of the wheel pipeline.' },
  { name: 'Rashi', port: ':3007', role: 'Forex', detail: '65 currencies: rates, convert, history. Serves the briefings — not part of the wheel pipeline.' },
  { name: 'Bhisma', port: ':3010', role: 'Health only', detail: 'Programmatic reads go through its internal functions; treat its published hit rates with skepticism. Not part of the wheel pipeline.' },
];

// ---------------------------------------------------------------------------
// Pipeline apps with full pages — Kubera, Varuna, Drona, Vidhura
// ---------------------------------------------------------------------------

export const kuberaFacts = {
  repo: 'zonito/kubera',
  base: 'http://100.125.239.56:8000',
  role: "The pipeline's home base: the wheel book, the deterministic discovery API, the watchlist universe, momentum and correlation. The 13:30/14:00/14:30 jobs read here first.",
  universe: 'watchlists.json is the single universe every downstream stage reads. Lists are organized by theme/story (US Oncology Biotech, GLP-1 & Obesity…), never by grouping labels. "Shortlisted To Buy" (wl_shortlisted) is read-only — never added to, removed from, or reordered by jobs.',
};

export const kuberaRouters: EngineRouter[] = [
  { name: 'POST /api/v1/wheel-strategy/summary', kind: 'book', detail: 'The wheel book: open positions with per-account reserve_net_of_credit, covered/uncovered contracts, shares_at_open, win rate, MTD realized premium. The standing read path for reserve math.' },
  { name: 'GET /api/v1/wheel/candidates', kind: 'discovery', detail: 'Deterministic ranked put-candidate snapshot (TTL-guarded, 1h). Gates enforced: composite ≥ 60, dual-bullish, percentile > 50, no earnings within 45d, IV-rank floor, one per cluster. POST /api/v1/wheel/candidates/refresh forces a rescan (~10–30s).' },
  { name: 'POST /api/v1/portfolios/metrics', kind: 'portfolio', detail: 'Holdings, values and risk metrics per profile; margin_insights.accounts[] gives per-account net_liquidation, cash, available_funds, cushion_pct. /price-refresh is the fast price-only variant.' },
  { name: 'GET /api/v1/momentum/scores', kind: 'momentum', detail: 'Dual momentum signal, cross-sectional percentile, RSI, VaR95, sortino for ~450 tickers in one pull. Powers the 13:30 dimmer.' },
  { name: 'GET /api/v1/agents/scores/{symbol}', kind: 'composite', detail: 'Composite AI score with sub-scores, briefing, risks and catalysts per ticker.' },
  { name: 'GET /api/v1/correlation/peers/{symbol}', kind: 'pairs', detail: '90-day empirical correlation peers with beta, lead-lag days, regime correlation splits and cluster assignment. Computed weekly.' },
  { name: 'GET /api/v1/watchlists', kind: 'universe', detail: 'Theme watchlist index (?metadata_only=true); per-list detail for tickers. The curated universe the pipeline hunts in.' },
  { name: 'GET /api/v1/stock/news', kind: 'news', detail: 'Recent news per symbol batch — folded into binary-event timing at 14:00.' },
  { name: 'GET /api/v1/transactions/recent', kind: 'ledger', detail: 'Per-account shares, avg_price and trade counts (Zonito vs Nikhila) — the source for unencumbered-share math in the covered-call scan.' },
  { name: 'POST /api/v1/screener/run', kind: 'screen', detail: 'Ad-hoc screens; GET /api/v1/screener/presets for saved ones. Supplemental discovery only.' },
];

export const varunaFacts = {
  repo: 'zonito/varuna',
  base: 'http://127.0.0.1:8400 (tailnet 100.125.239.56:8400)',
  role: 'The cache-first data plane under every engine. Vendors (FMP, Massive, Yahoo, FINRA, EODHD) sit behind one envelope with TTLs and circuit breakers; nothing in the pipeline touches a vendor directly.',
  contract: 'docs/contract.md and docs/openapi.json are generated from the FastAPI route table by scripts/contract_gen.py — never hand-edited. docs/endpoints.md is the hand-written operator guide.',
};

export const varunaRouters: EngineRouter[] = [
  { name: 'POST /v1/varuna/options/overview', kind: 'batch', detail: 'One aggregated row per symbol (1–60): quote/change/volume, live ATM IV30/IV90 from a bounded chain read, IV history from the permanent store, EOD bars. Per-symbol failures never fail the batch.' },
  { name: 'POST /v1/varuna/jobs/iv-backfill', kind: 'jobs', detail: 'Nightly IV history backfill per ticker (00:05 launchd). GET /v1/varuna/jobs/iv-backfill/{ticker} reports status.' },
  { name: 'GET /v1/vendors/massive/options/chain/{symbol}', kind: 'massive', detail: 'Chain snapshot with strike/expiry filters and pagination. /chain-complete/{symbol} for the full multi-expiry surface in one call; /contract/{symbol}/{contract} for a single contract.' },
  { name: 'GET /v1/vendors/massive/options/iv-history/{symbol}', kind: 'massive', detail: 'Reconstructed EOD IV points from the permanent store. from+to required; compute=false is read-only and never fans out to vendors.' },
  { name: 'POST /v1/vendors/fmp/query', kind: 'fmp', detail: 'Escape hatch: {endpoint, params} — covers economic-calendar, earnings and everything without a shorthand. batch-query and watchlist-quotes batch it.' },
  { name: 'GET /v1/vendors/fmp/earnings/{symbol}', kind: 'fmp', detail: 'Earnings events including upcoming (verified: NVDA 18 Nov 2026). Shorthands also exist for quote, ohlcv, fundamentals, shares-float, institutional-ownership.' },
  { name: 'GET /v1/vendors/yahoo/chart/{symbol}', kind: 'yahoo', detail: 'OHLCV chart data; /holders/{symbol} for institutional holders (the Vidhura read path). CBOE is disabled server-side (503 provider_disabled).' },
  { name: 'GET /v1/sources/finra/short-interest/{symbol}', kind: 'sources', detail: 'Latest FINRA short-interest print; /history adds max_points. Generic POST /v1/sources/{provider}/{resource} proxies anything else.' },
  { name: 'GET /v1/apps/{app}/…', kind: 'proxies', detail: 'Thin proxies to downstream apps (agni signals, airavata posture + premium-lab, drona/vidura premium-lab). Quick checks only — prefer each app’s native protocol.' },
  { name: 'GET /, /recent-requests, /recent-errors, /outbound', kind: 'ops', detail: 'Internal ops dashboard (excluded from the contract): live request/error/outbound tracing per X-Varuna-Source caller.' },
];

export const varunaConventions = [
  { title: 'One header, every call', body: 'X-Varuna-Source identifies the caller (Molang, Agni, Airavata…). The ops dashboard attributes latency, hit rate and errors per source from it.' },
  { title: 'One envelope', body: 'Success: {ok:true, code, data}. Errors: {ok:false, code, error:{type, message, trace_id, vendor, retry_after_s}} — the trace_id goes in every bug report.' },
  { title: 'Cache metadata on every vendor payload', body: '{vendor, fetched_at, cache:{hit, stale, ttl_s}}. Check cache.hit before assuming freshness; stale is served with stale:true rather than failing.' },
  { title: 'Rate limits and breakers', body: '429s carry error.type=rate_limited with retry_after_s — back off, never hammer. Per-provider circuit breakers at /v1/varuna/breakers/status.' },
];

export const dronaFacts = {
  repo: 'zonito/drona',
  base: 'http://100.125.239.56:3008',
  role: 'Technicals input for the pipeline: support/resistance/trend/RSI reads consumed at 14:00 for entries, exits and strike geometry.',
};

export const dronaRouters: EngineRouter[] = [
  { name: 'GET /api/v1/stocks/{symbol}', kind: 'record', detail: 'Canonical Drona market-data record: quote/profile fields plus derived context.' },
  { name: 'GET /api/v1/stocks/{symbol}/technical', kind: 'analysis', detail: 'Computed indicators, composite score, summary, event study and return distribution. Does not return the full ten-year candle series.' },
  { name: 'GET /api/v1/stocks/{symbol}/premium-lab', kind: 'compact', detail: 'Cached technical summary the pipeline actually reads: support, resistance, trend, RSI, Bollinger state.' },
];

export const dronaCaveats = [
  { title: 'RSI buckets do not predict', body: 'On 454 tickers / 5y: RSI<30 forward returns match the base rate. Only proximity to the 126d high carries signal.' },
  { title: 'Drona support is not the 126d low', body: 'Median absolute gap 16.5%; only 20% within 2%. Use as a secondary reference level — capitulation math runs on the computed 126d low.' },
  { title: 'Drona RSI is redundant', body: 'Correlation 0.883 with a self-computed RSI — compute it directly instead of paying for the read.' },
];

export const vidhuraFacts = {
  repo: 'No public repo found — documented from verified usage only',
  base: 'http://100.125.239.56:3009',
  role: 'Valuation input for the pipeline: P/E, P/B, analyst targets and ratings consumed at 14:00 for the fundamentals read.',
};

export const vidhuraReads: EngineRouter[] = [
  { name: 'GET /api/v1/stocks/{symbol}/valuation', kind: 'verified', detail: 'P/E, P/B, analyst target/upside, rating and assessment per ticker — the read the 14:00 pass uses. Verified live in the wheel job.' },
  { name: 'GET /v1/apps/vidura/premium-lab/{symbol}', kind: 'via Varuna', detail: 'Thin Varuna proxy for quick checks; prefer the native route for real reads.' },
];

export const vidhuraCaveats = [
  { title: 'Coverage is partial', body: '93/454 tickers in the validation sample — missing never means low. Treat absence as unknown, not as a signal.' },
  { title: 'High short interest is orthogonal', body: 'High short % flags beaten-down names but is statistically independent of technicals (R² 0.031). Keep it as its own gauge, not a technical confirm.' },
];

// ---------------------------------------------------------------------------
// Briefings satellites — Kamadhenu, Rashi, Bhisma
// ---------------------------------------------------------------------------

export const kamadhenuFacts = {
  repo: 'zonito/kamadhenu',
  base: 'http://100.125.239.56:3005',
  role: 'Commodities read for the macro sleeve of the briefings — oil, gold, copper and curated markets with macro context and related news. Not part of the wheel pipeline.',
  gotcha: 'Commodity envelopes carry an error: null field alongside data, so naive "error" in response checks false-positive. Check ok / error.value, not key presence.',
};

export const kamadhenuRouters: EngineRouter[] = [
  { name: 'GET /api/v1/commodities', kind: 'overview', detail: 'Curated commodity overview: quote, intraday change, ranges, and 90-day sparkline.' },
  { name: 'GET /api/v1/commodities/brief', kind: 'tape', detail: 'Bounded market-tape projection for 1–4 curated markets: metadata, live quote timestamp, EOD 1W/1M changes, 52-week range position, 90-session realized volatility.' },
  { name: 'GET /api/v1/commodities/{symbol}', kind: 'detail', detail: 'Quote, daily and intraday history, derived insights, category-peer and macro context, related news.' },
];

export const rashiFacts = {
  repo: 'No endpoints doc found — documented from verified usage only',
  base: 'http://100.125.239.56:3007',
  role: 'Forex read for the briefings — rates, convert, history. Not part of the wheel pipeline.',
  gotcha: 'Covers 65 currencies, not the quoted 138. Quote the real number.',
};

export const rashiRouters: EngineRouter[] = [
  { name: 'GET /api/v1/health', kind: 'health', detail: 'Service status.' },
  { name: 'GET /api/v1/currencies', kind: 'list', detail: 'The 65 covered currencies.' },
  { name: 'GET /api/v1/rates', kind: 'rates', detail: 'Current FX rates.' },
  { name: 'GET /api/v1/convert', kind: 'convert', detail: 'Convert between currencies.' },
  { name: 'GET /api/v1/history', kind: 'history', detail: 'Historical rate series.' },
];

export const bhismaFacts = {
  repo: 'zonito/bhisma',
  base: 'http://100.125.239.56:3010',
  role: 'Congressional-trading and whale-tracking surface: disclosed lawmaker trades, tracked managers, holdings, insider scores. Feeds the briefings — not part of the wheel pipeline.',
  gotcha: 'Treat its published hit rates with skepticism — inflated by counting sells as wins.',
};

export const bhismaSurface: EngineRouter[] = [
  { name: 'getSnapshot', kind: 'internal', detail: 'Full market snapshot: officials with disclosed trades (trade date, filed date, disclosure lag, amounts), tracked whale managers and holdings. Cached 30 minutes.' },
  { name: 'getInstitutionProfile', kind: 'internal', detail: 'One whale/institution: holdings, sector mix, activity.' },
  { name: 'getOfficialProfile', kind: 'internal', detail: 'One lawmaker: trades, top tickers, buy/sell counts.' },
  { name: 'getExplorer', kind: 'internal', detail: 'Per-ticker view: congressional trades and whale holdings touching the symbol.' },
  { name: 'getSectorDirectory', kind: 'internal', detail: 'Sectors ranked by disclosed USD, plus per-sector detail.' },
  { name: 'getInsiderScores', kind: 'internal', detail: 'Insider score rankings.' },
];
