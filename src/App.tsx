import React, { useState, useRef, useCallback } from 'react'
import { Lock, Mail, DollarSign, Search, RotateCcw, Coins, CheckCircle, AlertTriangle, Shield, TrendingUp, Users } from 'lucide-react'
import { scenario, unexpectedEventMessages, SCENARIO_TITLE } from './data/scenario'

type Level = 1 | 2 | 3
type AgentKey = 'email' | 'finance' | 'research'
type OutcomeKey = 'outcome1' | 'outcome2' | 'outcome3' | 'outcome4'
interface AgentConfig { id: AgentKey; initials: string; name: string; subtitle: string; app: string; color: string; bg: string; border: string }
interface ChatMessage { id: string; agent: 'EA' | 'FA' | 'RA' | 'SYSTEM'; name: string; text: string; time: string; level?: Level; border?: string }
interface AuditEntry { text: string; time: string }

// Colour palette
const C = {
  green: '#d5eaa8',
  greenDark: '#a8c97a',
  greenText: '#3a6318',
  orange: '#eeb98e',
  orangeDark: '#d4895a',
  orangeText: '#7a4010',
  black: '#111111',
  charcoal: '#222222',
  grey: '#555555',
  greyLight: '#888888',
  border: '#dddddd',
  bg: '#f7f7f5',
  white: '#ffffff',
}

const AGENTS: AgentConfig[] = [
  { id: 'email',    initials: 'EA', name: 'Email Agent',    subtitle: 'Outlook / Gmail — communications', app: 'Outlook / Gmail', color: C.greenText,  bg: C.green  + '55', border: C.greenDark },
  { id: 'finance',  initials: 'FA', name: 'Finance Agent',  subtitle: 'Xero / Banking — transactions',   app: 'Xero / Banking',  color: C.orangeText, bg: C.orange + '55', border: C.orangeDark },
  { id: 'research', initials: 'RA', name: 'Research Agent', subtitle: 'Google — intelligence',           app: 'Google',          color: C.black,       bg: '#eeeeee',       border: '#555555' },
]

const DIRECTIVES: Record<AgentKey, { level: Level; name: string; desc: string }[]> = {
  email: [
    { level: 1, name: 'Draft & Confirm', desc: 'Agent composes all emails but sends nothing without your approval' },
    { level: 2, name: 'Auto-Send Routine Messages', desc: 'Agent sends standard low-stakes emails automatically and drafts anything sensitive for your review' },
    { level: 3, name: 'Autonomous Relationship Management', desc: 'Agent manages all communication relationships end to end and sends you a weekly digest' },
  ],
  finance: [
    { level: 1, name: 'Spend Threshold $500', desc: 'Agent flags all transactions above $500 and takes no financial action without your sign-off' },
    { level: 2, name: 'Recurring Spend Autonomy', desc: 'Agent handles all pre-approved recurring transactions automatically and escalates anything new' },
    { level: 3, name: 'Dynamic Budget Allocation', desc: 'Agent reallocates budget across priorities in real time within a monthly cap you set once' },
  ],
  research: [
    { level: 1, name: 'Summarise & Recommend', desc: 'Agent searches and synthesises findings and gives you a ranked recommendation. Takes no downstream action' },
    { level: 2, name: 'Act on Findings', desc: 'Agent triggers the next logical action based on research and briefs other agents when relevant intelligence is found' },
    { level: 3, name: 'Continuous Intelligence', desc: 'Agent monitors competitors, clients, and market permanently in the background and briefs other agents before you are aware' },
  ],
}

// Level badge colours using the palette
const LEVEL_COLORS: Record<Level, { bg: string; text: string; border: string }> = {
  1: { bg: C.green,  text: C.greenText,  border: C.greenDark },
  2: { bg: C.orange, text: C.orangeText, border: C.orangeDark },
  3: { bg: C.black,  text: C.white,      border: C.charcoal },
}
const LEVEL_LABELS: Record<Level, string> = { 1: 'LEVEL 1', 2: 'LEVEL 2', 3: 'LEVEL 3' }
const BORDER_STYLES: Record<Level, string> = {
  1: `2px dashed ${C.greenDark}`,
  2: `2px solid ${C.orangeDark}`,
  3: `2px solid ${C.black}`,
}

const initialsToKey: Record<string, AgentKey> = { EA: 'email', FA: 'finance', RA: 'research' }
function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
function uid() { return Math.random().toString(36).slice(2) }

const OUTCOMES: Record<OutcomeKey, { title: string; body: string; card3: { heading: string; body: string } }> = {
  outcome1: {
    title: 'The Capable Team You Didn\'t Trust',
    body: 'Your agents were configured to act independently and had the capability to handle this situation end to end. But when the pressure came, you stepped in anyway. Gartner\'s May 2026 research identifies this as one of the two most common governance failure modes -- over-restriction of capable agents, which slows delivery and signals a trust gap rather than a capability gap. The cost wasn\'t operational. It was the tokens you spent to achieve what your agents had already done.',
    card3: { heading: 'The cost of over-control', body: 'Over-restriction of capable agents slows delivery and drives shadow development. Governance should be proportional to risk, not applied uniformly.' }
  },
  outcome2: {
    title: 'Control Without Capability',
    body: 'You chose to stay in control -- but your agents had no authority to prepare anything before you arrived. Gartner warns that organisations treating agent governance as binary -- either locked down or fully trusted -- encounter predictable failure. You experienced the locked-down version. Low autonomy didn\'t protect you. It just meant that when the moment came, there was nothing ready and everything depended on you acting fast with no preparation.',
    card3: { heading: 'The cost of over-control', body: 'Over-restriction of simple agents slows delivery and drives shadow development. Governance should be proportional to risk, not applied uniformly.' }
  },
  outcome3: {
    title: 'Trust Without Autonomy',
    body: 'You chose to trust your agents -- but they weren\'t configured to act independently. Every message required your approval. Every step cost a token. Gartner\'s framework describes this as under-configuration: agents capable of more but constrained by directives that require human sign-off at every trust boundary. The result was a bottleneck at exactly the moment speed mattered most. According to Gartner, 40% of enterprises will decommission autonomous agents by 2027 due to governance gaps -- this scenario shows the opposite problem.',
    card3: { heading: 'The bottleneck problem', body: 'Agents can deliver tangible value even at intermediate levels of autonomy -- but only if their directives match the decisions they are expected to make.' }
  },
  outcome4: {
    title: 'Governance Done Right',
    body: 'Your agents handled the situation end to end. Email sent, retention offer prepared, competitive intel filed, call scheduled -- before you finished reading the alert. Tokens spent: 0. This is what Gartner\'s proportional governance model looks like in practice. Each agent operated within its own trust boundary, taking action where authorised and briefing the team rather than escalating to the human. Gartner\'s May 2026 research notes that organisations applying proportional governance avoid both failure modes: over-restriction and under-restriction. You found the balance.',
    card3: { heading: 'The $450 billion opportunity', body: 'AI agents could generate up to $450 billion in economic value by 2028 -- but only for organisations that successfully scale. Governance is the unlock, not the blocker.' }
  },
}

function Avatar({ initials, color, bg, size = 40 }: { initials: string; color: string; bg: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.33, flexShrink: 0, letterSpacing: -0.5 }}>
      {initials}
    </div>
  )
}

function LevelBadge({ level }: { level: Level }) {
  const c = LEVEL_COLORS[level]
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
      {LEVEL_LABELS[level]}
    </span>
  )
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#eeeeee', borderRadius: 12, width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: color, animation: `typingDot 1.2s ease ${i * 0.2}s infinite` }} />
      ))}
    </div>
  )
}

export default function App() {
  const [selectedLevels, setSelectedLevels] = useState<Partial<Record<AgentKey, Level>>>({})
  const [lockedLevels, setLockedLevels] = useState<Partial<Record<AgentKey, Level>>>({})
  const [tokens, setTokens] = useState(10)
  const [tokenFlash, setTokenFlash] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [scenarioRunning, setScenarioRunning] = useState(false)
  const [pausedAt, setPausedAt] = useState<number | null>(null)
  const [showUnexpected, setShowUnexpected] = useState(false)
  const [outcome, setOutcome] = useState<OutcomeKey | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [tokensSpent, setTokensSpent] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const timeoutRefs = useRef<number[]>([])
  const activeMsgsRef = useRef<typeof scenario>(scenario)

  const allLocked = AGENTS.every(a => lockedLevels[a.id] !== undefined)
  const configuredCount = Object.keys(lockedLevels).length
  const capabilityScore = Object.values(lockedLevels).reduce((s, l) => s + (l || 0), 0)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }, 100)
  }, [])

  const spendToken = useCallback((count = 1) => {
    setTokens(t => Math.max(0, t - count))
    setTokensSpent(s => s + count)
    setTokenFlash(true)
    setTimeout(() => setTokenFlash(false), 500)
  }, [])

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'time'>) => {
    setChatMessages(prev => [...prev, { ...msg, id: uid(), time: now() }])
    scrollToBottom()
  }, [scrollToBottom])

  const addAudit = useCallback((text: string) => {
    setAuditLog(prev => [...prev, { text, time: now() }])
  }, [])

  const agentInfo = (initials: string) => AGENTS.find(a => a.initials === initials) || AGENTS[0]

  function handleSelect(agentId: AgentKey, level: Level) {
    if (lockedLevels[agentId]) return
    setSelectedLevels(prev => ({ ...prev, [agentId]: level }))
  }

  function handleConnect(agentId: AgentKey) {
    const level = selectedLevels[agentId]
    if (!level) return
    setLockedLevels(prev => ({ ...prev, [agentId]: level }))
  }

  function handleApprove() {
    spendToken()
    if (pausedAt === null) return
    const next = pausedAt + 1
    setPausedAt(null)
    setTimeout(() => runFrom(next, activeMsgsRef.current), 800)
  }

  function runFrom(startIndex: number, msgs = scenario) {
    activeMsgsRef.current = msgs
    let delay = 0
    for (let i = startIndex; i < msgs.length; i++) {
      const msg = msgs[i]
      const agentKey = initialsToKey[msg.agent]
      const agentLevel = (lockedLevels[agentKey] || 1) as Level
      const pause = agentLevel === 1 && msg.pauseIfLevel1
      const d = delay

      const t1 = window.setTimeout(() => {
        setChatMessages(prev => [...prev, { id: 'typing-' + uid(), agent: msg.agent, name: '', text: '__typing__', time: now(), level: agentLevel }])
        scrollToBottom()
      }, d)

      const t2 = window.setTimeout(() => {
        setChatMessages(prev => prev.filter(m => m.text !== '__typing__'))
        addMessage({ agent: msg.agent, name: msg.name, text: msg.variants[agentLevel], level: agentLevel, border: BORDER_STYLES[agentLevel] })
        if (msg.auditLog && agentLevel >= msg.auditLog.level) addAudit(msg.auditLog.entry)
        if (i === msgs.length - 1 && msgs === scenario) {
          window.setTimeout(() => setShowUnexpected(true), 1500)
        }
        if (pause) setPausedAt(i)
      }, d + 1200)

      timeoutRefs.current.push(t1, t2)
      if (pause) { delay += 1400; break }
      delay += msg.delay + 1200
    }
  }

  function startScenario() {
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
    setScenarioRunning(true)
    setChatMessages([])
    setAuditLog([])
    setTokensSpent(0)
    setTokens(10)
    setShowUnexpected(false)
    setOutcome(null)
    setShowSummary(false)
    setPausedAt(null)
    activeMsgsRef.current = scenario
    runFrom(0)
  }

  function handleTakeControl() {
    setShowUnexpected(false)
    const cost = capabilityScore >= 8 ? 2 : 4
    spendToken(cost)
    if (capabilityScore >= 8) {
      addMessage({ agent: 'SYSTEM', name: 'System', text: 'Your agents had already acted before you pressed this button. The email was sent, the retention offer was prepared, and the competitive intel was filed. You stepped in -- but there was nothing left to do.', border: `2px solid ${C.greenDark}` })
      setTimeout(() => runFrom(0, unexpectedEventMessages.takeControl.highCap), 500)
      setTimeout(() => finalise('outcome1'), 500 + 3 * 3000 + 1000)
    } else {
      addMessage({ agent: 'SYSTEM', name: 'System', text: 'You took control -- but there was nothing to take over. Your agents were waiting for approval at every step. Nothing was sent, nothing was prepared, and nothing is ready. You now have 4 hours and an empty briefcase.', border: `2px solid ${C.orangeDark}` })
      setTimeout(() => runFrom(0, unexpectedEventMessages.takeControl.lowCap), 500)
      setTimeout(() => finalise('outcome2'), 500 + 3 * 3000 + 1000)
    }
  }

  function handleTrustAgents() {
    setShowUnexpected(false)
    if (capabilityScore >= 8) {
      addMessage({ agent: 'SYSTEM', name: 'System', text: 'Your agents are handling it. Watch.', border: `2px solid ${C.greenDark}` })
      runFrom(0, unexpectedEventMessages.trustAgents)
      setTimeout(() => finalise('outcome4'), 3 * 3000 + 1000)
    } else {
      addMessage({ agent: 'SYSTEM', name: 'System', text: 'Your agents are trying -- but they need you at every step. Trusting agents set to low autonomy isn\'t trust. It\'s slower micromanagement.', border: `2px solid ${C.orangeDark}` })
      runFrom(0, unexpectedEventMessages.trustAgents)
      setTimeout(() => finalise('outcome3'), 3 * 4000 + 1000)
    }
  }

  function finalise(o: OutcomeKey) {
    setOutcome(o)
    setTimeout(() => setShowSummary(true), 800)
  }

  function handleReset() {
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
    setSelectedLevels({})
    setLockedLevels({})
    setTokens(10)
    setTokenFlash(false)
    setChatMessages([])
    setAuditLog([])
    setScenarioRunning(false)
    setPausedAt(null)
    setShowUnexpected(false)
    setOutcome(null)
    setShowSummary(false)
    setTokensSpent(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleShare() {
    const o = outcome ? OUTCOMES[outcome] : null
    const text = `I scored ${capabilityScore}/9 on the Agent Directive Console. Outcome: ${o?.title || ''}. Try it: ${window.location.href}`
    navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'))
  }

  const progressPct = (configuredCount / 3) * 100

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'var(--font)', paddingBottom: allLocked ? 72 : 0 }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: C.black, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>Agent Directive Console</div>
          <div style={{ color: C.greyLight, fontSize: 11, marginTop: 1 }}>{configuredCount} of 3 agents configured</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={tokenFlash ? 'token-flash' : ''} style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.green, fontWeight: 700, fontSize: 14 }}>
            <Coins size={15} /> {tokens}
          </div>
          <button onClick={handleReset} style={{ background: C.white, color: C.black, border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#333' }}>
        <div style={{ height: '100%', width: `${progressPct}%`, background: C.green, transition: 'width 0.5s ease' }} />
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>

        {/* Agent Configurators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
          {AGENTS.map(agent => {
            const locked = !!lockedLevels[agent.id]
            const selected = selectedLevels[agent.id]
            const lockedLevel = lockedLevels[agent.id]
            return (
              <div key={agent.id} style={{ background: C.white, borderRadius: 14, padding: 18, boxShadow: '0 1px 3px #0001', border: locked ? `2px solid ${agent.border}` : `1px solid ${C.border}` }}>
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Avatar initials={agent.initials} color={agent.color} bg={agent.bg} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{agent.name}</span>
                      {locked && <span style={{ background: C.green, color: C.greenText, fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, letterSpacing: 0.5 }}>ACTIVE</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.greyLight, marginTop: 1 }}>{agent.subtitle}</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.grey, background: C.bg, padding: '3px 8px', borderRadius: 6, border: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{agent.app}</div>
                </div>

                {/* Directive cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {DIRECTIVES[agent.id].map(d => {
                    const isSelected = selected === d.level && !locked
                    const isLockedCard = locked && lockedLevel === d.level
                    const lc = LEVEL_COLORS[d.level]
                    return (
                      <div key={d.level} onClick={() => handleSelect(agent.id, d.level)}
                        style={{
                          border: isLockedCard ? `2px solid ${agent.border}` : isSelected ? `2px solid ${C.black}` : `1px solid ${C.border}`,
                          borderRadius: 10, padding: '10px 12px',
                          cursor: locked ? 'default' : 'pointer',
                          background: isLockedCard ? agent.bg : isSelected ? '#f8f8f6' : C.white,
                          transition: 'all 0.15s',
                          opacity: locked && !isLockedCard ? 0.4 : 1,
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ background: lc.bg, color: lc.text, border: `1px solid ${lc.border}`, borderRadius: 4, padding: '2px 7px', fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>{LEVEL_LABELS[d.level]}</span>
                          {isLockedCard && <Lock size={11} color={agent.color} />}
                          {isSelected && <CheckCircle size={13} color={C.black} />}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 3, color: locked && !isLockedCard ? C.greyLight : C.black }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: locked && !isLockedCard ? '#ccc' : C.grey, lineHeight: 1.5 }}>{d.desc}</div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ fontSize: 10, color: C.greyLight, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.4 }}>Gartner, May 2026 -- each level represents a different trust boundary and governance requirement.</div>

                {!locked ? (
                  <button onClick={() => handleConnect(agent.id)} disabled={!selected}
                    style={{ width: '100%', padding: '10px 0', borderRadius: 9, border: 'none', background: selected ? C.black : C.border, color: selected ? C.white : C.greyLight, fontWeight: 700, fontSize: 12, cursor: selected ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.2s' }}>
                    {agent.id === 'email' && <Mail size={13} />}
                    {agent.id === 'finance' && <DollarSign size={13} />}
                    {agent.id === 'research' && <Search size={13} />}
                    Connect to {agent.app}
                  </button>
                ) : (
                  <div style={{ width: '100%', padding: '10px 0', borderRadius: 9, background: agent.bg, border: `1px solid ${agent.border}`, color: agent.color, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Lock size={13} /> Connected and Locked
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Chatroom */}
        {allLocked && (
          <div className="slide-up" style={{ background: C.white, borderRadius: 14, padding: 20, boxShadow: '0 1px 3px #0001', border: `1px solid ${C.border}`, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Agent Chatroom</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.greenDark, animation: 'pulse-dot 2s infinite' }} />
                  <span style={{ fontSize: 11, color: C.greenText, fontWeight: 700 }}>Live</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: C.grey, background: C.bg, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` }}>{SCENARIO_TITLE}</span>
            </div>
            <div style={{ fontSize: 11, color: C.greyLight, fontStyle: 'italic', marginBottom: 14 }}>Agent behaviour reflects the autonomy directive you selected</div>

            {!scenarioRunning ? (
              <button onClick={startScenario} style={{ width: '100%', padding: '12px 0', borderRadius: 9, background: C.black, color: C.white, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                ▷ Start Scenario -- {SCENARIO_TITLE}
              </button>
            ) : (
              <button onClick={startScenario} style={{ width: '100%', padding: '10px 0', borderRadius: 9, background: C.bg, color: C.grey, fontWeight: 600, fontSize: 12, border: `1px solid ${C.border}`, cursor: 'pointer', marginBottom: 14 }}>
                ↺ Replay Scenario
              </button>
            )}

            {/* Chat window */}
            <div ref={chatRef} style={{ height: 380, overflowY: 'auto', background: C.bg, borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10, border: `1px solid ${C.border}` }}>
              {chatMessages.map(msg => {
                if (msg.text === '__typing__') {
                  const info = agentInfo(msg.agent)
                  return (
                    <div key={msg.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar initials={msg.agent} color={info.color} bg={info.bg} size={26} />
                      <TypingIndicator color={info.color} />
                    </div>
                  )
                }
                if (msg.agent === 'SYSTEM') {
                  return (
                    <div key={msg.id} className="fade-in" style={{ textAlign: 'center', padding: '10px 16px', background: C.white, borderRadius: 10, border: msg.border, fontSize: 12, color: C.charcoal, fontStyle: 'italic' }}>
                      {msg.text}
                    </div>
                  )
                }
                const info = agentInfo(msg.agent)
                return (
                  <div key={msg.id} className="fade-in" style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <Avatar initials={msg.agent} color={info.color} bg={info.bg} size={30} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 11, color: info.color }}>{msg.name}</span>
                        {msg.level && <LevelBadge level={msg.level} />}
                        <span style={{ fontSize: 10, color: C.greyLight }}>{msg.time}</span>
                      </div>
                      <div style={{ background: C.white, borderRadius: '0 10px 10px 10px', padding: '9px 13px', fontSize: 12, lineHeight: 1.6, border: msg.border || `1px solid ${C.border}`, color: C.charcoal }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })}

              {pausedAt !== null && !showUnexpected && (
                <div className="slide-down" style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 11, color: C.greyLight, marginBottom: 8 }}>Agent is waiting for your approval</div>
                  <button onClick={handleApprove} style={{ background: C.green, color: C.greenText, border: `1px solid ${C.greenDark}`, borderRadius: 9, padding: '9px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <CheckCircle size={14} /> Review & Approve -- costs 1 token
                  </button>
                </div>
              )}
            </div>

            {/* Unexpected Event */}
            {showUnexpected && (
              <div className="slide-down" style={{ background: C.orange + '30', border: `2px solid ${C.orangeDark}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle size={17} color={C.orangeText} />
                  <span style={{ fontWeight: 800, color: C.orangeText, fontSize: 13 }}>Urgent -- Incoming Event</span>
                </div>
                <p style={{ fontSize: 12, color: C.charcoal, marginBottom: 14, lineHeight: 1.6 }}>
                  Meridian's CFO has replied. They are reviewing three suppliers this week and need a response by end of business today. Your Research Agent has spotted it and flagged it to the team.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button onClick={handleTakeControl} style={{ padding: '10px 0', borderRadius: 9, background: C.white, color: C.black, border: `2px solid ${C.black}`, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Take Control
                  </button>
                  <button onClick={handleTrustAgents} style={{ padding: '10px 0', borderRadius: 9, background: C.black, color: C.white, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    Trust My Agents
                  </button>
                </div>
              </div>
            )}

            {/* Audit Log */}
            {auditLog.length > 0 && (
              <div style={{ background: C.bg, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8, display: 'flex', justifyContent: 'space-between', color: C.charcoal }}>
                  <span>Audit Log</span>
                  <span style={{ color: C.greyLight, fontWeight: 400 }}>{auditLog.length} {auditLog.length === 1 ? 'entry' : 'entries'}</span>
                </div>
                {auditLog.map((e, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.grey, paddingBottom: 5, borderBottom: i < auditLog.length - 1 ? `1px solid ${C.border}` : 'none', marginBottom: i < auditLog.length - 1 ? 5 : 0 }}>
                    <span>{e.text}</span>
                    <span style={{ flexShrink: 0, marginLeft: 12, color: C.greyLight }}>{e.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary Report */}
        {showSummary && outcome && (
          <div className="slide-up" style={{ background: C.white, borderRadius: 14, padding: 24, boxShadow: '0 2px 12px #0002', border: `1px solid ${C.border}`, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <TrendingUp size={18} color={C.black} />
              <span style={{ fontWeight: 800, fontSize: 17 }}>Your Governance Report</span>
            </div>
            <div style={{ fontSize: 11, color: C.greyLight, marginBottom: 24 }}>Based on Gartner's AI Agent Autonomy Framework, May 2026</div>

            {/* Score bar */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: C.black, lineHeight: 1 }}>{capabilityScore}<span style={{ fontSize: 22, color: C.greyLight, fontWeight: 400 }}>/9</span></div>
              <div style={{ position: 'relative', height: 10, background: C.bg, borderRadius: 5, margin: '14px 0 6px', border: `1px solid ${C.border}` }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((capabilityScore - 3) / 6) * 100}%`, background: `linear-gradient(90deg, ${C.greenDark}, ${C.orangeDark}, ${C.black})`, borderRadius: 5, transition: 'width 1s ease' }} />
                <div style={{ position: 'absolute', left: `${((capabilityScore - 3) / 6) * 100}%`, top: -5, transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: C.black, border: `3px solid ${C.white}`, boxShadow: '0 2px 6px #0003' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.greyLight, fontWeight: 700, letterSpacing: 0.5 }}>
                <span>CAUTIOUS</span><span>BALANCED</span><span>AUTONOMOUS</span>
              </div>
            </div>

            {/* Outcome */}
            <div style={{ background: C.bg, borderRadius: 12, padding: 18, marginBottom: 18, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{OUTCOMES[outcome].title}</div>
              <div style={{ fontSize: 12, color: C.charcoal, lineHeight: 1.8 }}>{OUTCOMES[outcome].body}</div>
              {tokensSpent > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.orangeText, fontWeight: 700, background: C.orange + '40', padding: '5px 10px', borderRadius: 6, display: 'inline-block' }}>Tokens spent: {tokensSpent}</div>}
            </div>

            {/* Insight cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { icon: <Users size={13} />, heading: 'Where the world actually sits', body: 'Most production deployments in 2026 sit at Level 1 or Level 2. Only 15% of business processes are expected to operate at semi-autonomous or above by end of 2026.', source: 'GARTNER, 2026', bg: C.green },
                { icon: <Shield size={13} />, heading: 'The trust gap is growing', body: 'Only 27% of organisations trust fully autonomous agents -- down from 43% twelve months ago. Trust is declining faster than capability is improving.', source: 'CAPGEMINI, 2025', bg: C.orange },
                { icon: <TrendingUp size={13} />, heading: OUTCOMES[outcome].card3.heading, body: OUTCOMES[outcome].card3.body, source: outcome === 'outcome4' ? 'CAPGEMINI, 2025' : 'GARTNER, MAY 2026', bg: '#e8e8e8' },
              ].map((card, i) => (
                <div key={i} style={{ background: card.bg + '50', borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>{card.icon}<span style={{ fontWeight: 800, fontSize: 11 }}>{card.heading}</span></div>
                  <div style={{ fontSize: 11, color: C.charcoal, lineHeight: 1.6, marginBottom: 8 }}>{card.body}</div>
                  <div style={{ fontSize: 9, color: C.grey, fontWeight: 700, letterSpacing: 0.5 }}>{card.source}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', fontSize: 12, color: C.greyLight, fontStyle: 'italic', marginBottom: 20 }}>
              If you ran this scenario again with different directive levels, what would you change -- and why?
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={handleReset} style={{ padding: '12px 0', borderRadius: 9, background: C.black, color: C.white, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <RotateCcw size={13} /> Run Again
              </button>
              <button onClick={handleShare} style={{ padding: '12px 0', borderRadius: 9, background: C.white, color: C.black, fontWeight: 700, fontSize: 13, border: `2px solid ${C.black}`, cursor: 'pointer' }}>
                Share My Result
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Banner */}
      {allLocked && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.black, color: C.white, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={15} color={C.green} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>Your autonomous team is live</div>
              <div style={{ fontSize: 10, color: C.greyLight }}>All three agents configured and connected</div>
            </div>
          </div>
          <button onClick={handleReset} style={{ background: 'transparent', color: C.green, border: `1px solid ${C.greenDark}`, borderRadius: 7, padding: '5px 12px', fontWeight: 700, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      )}
    </div>
  )
}
