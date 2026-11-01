import { describe, expect, it } from 'vitest'
import {
  agentViews,
  allNodes,
  nodeById,
  nodeNeighbors,
  nodeOrder,
  observerNodeId,
  phaseOfNode,
  phases,
} from './pipeline'

// Route paths declared in src/App.tsx (plus the dynamic stage route).
const KNOWN_ROUTES = new Set([
  'machinery',
  'setu',
  'rules',
  'quality',
  'handoffs',
  'gaps',
  'jev',
  'hedge',
  'agni',
  'airavata',
  'kubera',
  'varuna',
  'drona',
  'vidhura',
  'kamadhenu',
  'rashi',
  'bhisma',
])

describe('pipeline data integrity', () => {
  it('has unique node ids and non-empty phases', () => {
    const ids = allNodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(phases.length).toBeGreaterThan(0)
    for (const phase of phases) {
      expect(phase.nodes.length).toBeGreaterThan(0)
    }
  })

  it('every output hand-off target resolves to a real node', () => {
    for (const node of allNodes) {
      for (const out of node.outputs) {
        if (out.to) expect(nodeById(out.to), `${node.id} -> ${out.to}`).toBeDefined()
      }
    }
  })

  it('every deep-dive link resolves to a declared route', () => {
    for (const node of allNodes) {
      if (node.link) expect(KNOWN_ROUTES.has(node.link.replace(/^\//, ''))).toBe(true)
    }
  })

  it('agent weights sum to 100% (hand-check: 22+10+22+12+14+10+5+5)', () => {
    const total = agentViews.reduce((sum, a) => sum + parseFloat(a.weight), 0)
    expect(total).toBe(100)
  })

  it('the observer node is flagged and matches observerNodeId', () => {
    const observer = nodeById(observerNodeId)
    expect(observer?.observer).toBe(true)
  })
})

describe('nodeById / phaseOfNode', () => {
  it('finds a known node and misses unknown ids', () => {
    expect(nodeById('dimmer')?.title).toContain('Chalani')
    expect(nodeById('nope')).toBeUndefined()
    expect(nodeById(undefined)).toBeUndefined()
  })

  it('locates the phase containing a node', () => {
    expect(phaseOfNode('dimmer')?.id).toBe('decide')
    expect(phaseOfNode('nope')).toBeUndefined()
  })
})

describe('nodeNeighbors (pins current sequential chain)', () => {
  it('first node has no previous, last node has no next', () => {
    expect(nodeNeighbors('ecosystem')).toEqual({
      prev: null,
      next: nodeById('sutradhara'),
    })
    expect(nodeNeighbors('ledger').next).toBeNull()
    expect(nodeNeighbors('ledger').prev?.id).toBe('outcomes')
  })

  it('middle nodes link both ways in nodeOrder sequence', () => {
    const { prev, next } = nodeNeighbors('dimmer')
    expect(prev?.id).toBe('scoop')
    expect(next?.id).toBe('recommend')
    // nodeOrder and the phase node list agree on the sequential chain
    expect(nodeOrder).toEqual(allNodes.map((n) => n.id).filter((id) => id !== observerNodeId))
  })

  it('unknown ids and the observer have no sequential neighbours', () => {
    expect(nodeNeighbors('nope')).toEqual({ prev: null, next: null })
    // Jev is an observer branch off Yojana, deliberately outside the
    // sequential prev/next chain. Changing this changes rendered links.
    expect(nodeNeighbors(observerNodeId)).toEqual({ prev: null, next: null })
  })
})
