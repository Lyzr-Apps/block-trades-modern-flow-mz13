'use client'

import React, { useState } from 'react'
import { callAIAgent, AIAgentResponse } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  Users,
  Loader2,
  Target,
  Shield,
  Zap,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Clipboard,
  MessageSquare,
  RefreshCw,
  Eye,
  Calendar,
  BarChart3,
  Award,
  UserCheck,
  Timer,
  Activity,
  ArrowUpRight,
  Smile,
  Meh,
  Frown,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import KnowledgeBasePanel from './KnowledgeBasePanel'
import OnboardingPipeline from './OnboardingPipeline'
import ComplianceTracker from './ComplianceTracker'
import ActionCenter from './ActionCenter'

const AGENT_IDS = {
  checkpoint: '69a1936af0b6b0621c8ec9a3',
  insights: '69a1936a78bb4ecc77c12d22',
  enablement: '69a1936afcc35a3ce836847e',
}

// Types
interface TeamMetrics {
  avg_completion: number
  avg_ramp_velocity: number
  at_risk_count: number
  compliance_rate: number
  total_hires: number
  on_track_count: number
}

interface HireDetail {
  name: string
  role: string
  start_date: string
  completion_percentage: number
  ramp_velocity: number
  sentiment_score: number
  risk_level: string
  risk_reasons: string[]
  tool_adoption: number
  compliance_status: string
}

interface RiskAlert {
  hire_name: string
  alert_type: string
  severity: string
  description: string
  recommended_action: string
}

interface Trends {
  completion_trend: string
  sentiment_trend: string
  velocity_trend: string
}

interface CheckpointData {
  checkpoint_type: string
  hire_summary: string
  evaluation_sections: {
    section_name: string
    rating: number
    description: string
    pre_filled_context: string
    areas_of_strength: string[]
    areas_of_improvement: string[]
  }[]
  overall_rating: number
  recommendations: string[]
  flags: { type: string; description: string }[]
  next_checkpoint_date: string
}

interface EnablementData {
  coaching_prompts: { topic: string; prompt: string; context: string; priority: string }[]
  risk_signals: { signal: string; severity: string; evidence: string; recommended_action: string }[]
  missed_tasks: { task: string; days_overdue: number; impact: string }[]
  skill_development: { area: string; current_level: string; target_level: string; suggestion: string }[]
  weekly_summary: string
  intervention_urgency: string
}

interface ManagerCommandCenterProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
  activeSection: string
}

const SAMPLE_METRICS: TeamMetrics = {
  avg_completion: 72,
  avg_ramp_velocity: 65,
  at_risk_count: 2,
  compliance_rate: 85,
  total_hires: 8,
  on_track_count: 6,
}

const SAMPLE_HIRES: HireDetail[] = [
  { name: 'Sarah Chen', role: 'Software Engineer', start_date: '2024-01-15', completion_percentage: 45, ramp_velocity: 72, sentiment_score: 8.2, risk_level: 'low', risk_reasons: [], tool_adoption: 80, compliance_status: 'complete' },
  { name: 'James Park', role: 'UX Designer', start_date: '2024-01-10', completion_percentage: 60, ramp_velocity: 58, sentiment_score: 6.5, risk_level: 'medium', risk_reasons: ['Low engagement with design tools', 'Missed 1:1 last week'], tool_adoption: 45, compliance_status: 'in_progress' },
  { name: 'Maria Lopez', role: 'Sales Representative', start_date: '2024-01-08', completion_percentage: 30, ramp_velocity: 40, sentiment_score: 5.1, risk_level: 'high', risk_reasons: ['Behind on training modules', 'Declining sentiment', 'Compliance docs overdue'], tool_adoption: 35, compliance_status: 'overdue' },
  { name: 'Alex Kumar', role: 'Data Analyst', start_date: '2024-01-12', completion_percentage: 78, ramp_velocity: 85, sentiment_score: 9.0, risk_level: 'low', risk_reasons: [], tool_adoption: 90, compliance_status: 'complete' },
  { name: 'Emily Taylor', role: 'Product Manager', start_date: '2024-01-05', completion_percentage: 88, ramp_velocity: 92, sentiment_score: 8.8, risk_level: 'low', risk_reasons: [], tool_adoption: 95, compliance_status: 'complete' },
]

const SAMPLE_ALERTS: RiskAlert[] = [
  { hire_name: 'Maria Lopez', alert_type: 'stalled', severity: 'critical', description: 'Onboarding progress has stalled at 30% for the past week. Multiple training modules remain incomplete.', recommended_action: 'Schedule an immediate 1:1 to identify blockers and create a catch-up plan.' },
  { hire_name: 'James Park', alert_type: 'low_engagement', severity: 'warning', description: 'Design tool adoption is below expectations. Only 45% of recommended tools have been set up.', recommended_action: 'Pair with a senior designer for a tool walkthrough session.' },
]

const SAMPLE_TRENDS: Trends = {
  completion_trend: 'improving',
  sentiment_trend: 'stable',
  velocity_trend: 'improving',
}

function parseAgentResponse(result: AIAgentResponse) {
  if (!result?.success) return null
  try {
    const data = result?.response?.result
    if (!data) return null
    if (typeof data === 'string') {
      try { return JSON.parse(data) } catch { return null }
    }
    return data
  } catch { return null }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'improving': return <TrendingUp className="h-4 w-4 text-emerald-600" />
    case 'declining': return <TrendingDown className="h-4 w-4 text-destructive" />
    default: return <Minus className="h-4 w-4 text-muted-foreground" />
  }
}

function getRiskColor(level: string) {
  switch (level?.toLowerCase()) {
    case 'critical': case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'medium': case 'warning': return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'low': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

function getComplianceIcon(status: string) {
  switch (status) {
    case 'complete': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
    case 'in_progress': return <Clock className="h-3.5 w-3.5 text-amber-600" />
    case 'overdue': return <XCircle className="h-3.5 w-3.5 text-destructive" />
    default: return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-1.5">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-2 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-2 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-3 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm leading-relaxed">{formatInlineMgr(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm leading-relaxed">{formatInlineMgr(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm leading-relaxed">{formatInlineMgr(line)}</p>
      })}
    </div>
  )
}

function formatInlineMgr(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} />
    )
  }
  return <div className="flex gap-0.5">{stars}</div>
}

export default function ManagerCommandCenter({ sampleMode, onActiveAgent, activeSection }: ManagerCommandCenterProps) {
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null)
  const [hires, setHires] = useState<HireDetail[]>([])
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [trends, setTrends] = useState<Trends | null>(null)
  const [selectedHire, setSelectedHire] = useState<HireDetail | null>(null)
  const [checkpointData, setCheckpointData] = useState<CheckpointData | null>(null)
  const [enablementData, setEnablementData] = useState<EnablementData | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [loadingCheckpoint, setLoadingCheckpoint] = useState(false)
  const [loadingEnablement, setLoadingEnablement] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const displayMetrics = sampleMode ? SAMPLE_METRICS : metrics
  const displayHires = sampleMode ? SAMPLE_HIRES : hires
  const displayAlerts = sampleMode ? SAMPLE_ALERTS : alerts
  const displayTrends = sampleMode ? SAMPLE_TRENDS : trends
  const displaySelected = selectedHire ?? (sampleMode ? SAMPLE_HIRES[0] : null)

  const handleRefreshInsights = async () => {
    setLoadingInsights(true)
    setStatusMessage('Refreshing team insights...')
    onActiveAgent(AGENT_IDS.insights)
    try {
      const result = await callAIAgent('Generate a comprehensive team onboarding insights report with metrics for all current hires.', AGENT_IDS.insights)
      const data = parseAgentResponse(result)
      if (data) {
        if (data.team_metrics) setMetrics(data.team_metrics)
        if (Array.isArray(data.hire_details)) setHires(data.hire_details)
        if (Array.isArray(data.risk_alerts)) setAlerts(data.risk_alerts)
        if (data.trends) setTrends(data.trends)
        setStatusMessage('Insights refreshed successfully')
      } else {
        setStatusMessage('Unable to parse insights data')
      }
    } catch {
      setStatusMessage('Failed to refresh insights')
    } finally {
      setLoadingInsights(false)
      onActiveAgent(null)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const handleRunCheckpoint = async (hire?: HireDetail | null) => {
    const target = hire ?? displaySelected
    if (!target) {
      setStatusMessage('Please select a hire first')
      setTimeout(() => setStatusMessage(''), 3000)
      return
    }
    setLoadingCheckpoint(true)
    setStatusMessage(`Running checkpoint review for ${target.name}...`)
    onActiveAgent(AGENT_IDS.checkpoint)
    try {
      const result = await callAIAgent(
        `Run a checkpoint review for ${target.name}, role: ${target.role}, started: ${target.start_date}, current completion: ${target.completion_percentage}%, ramp velocity: ${target.ramp_velocity}`,
        AGENT_IDS.checkpoint
      )
      const data = parseAgentResponse(result)
      if (data) {
        setCheckpointData(data as CheckpointData)
        setStatusMessage('Checkpoint review generated')
      } else {
        setStatusMessage('Unable to generate checkpoint review')
      }
    } catch {
      setStatusMessage('Failed to run checkpoint review')
    } finally {
      setLoadingCheckpoint(false)
      onActiveAgent(null)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const handleGetCoaching = async (hire?: HireDetail | null) => {
    const target = hire ?? displaySelected
    if (!target) {
      setStatusMessage('Please select a hire first')
      setTimeout(() => setStatusMessage(''), 3000)
      return
    }
    setLoadingEnablement(true)
    setStatusMessage(`Getting coaching suggestions for ${target.name}...`)
    onActiveAgent(AGENT_IDS.enablement)
    try {
      const result = await callAIAgent(
        `Provide coaching suggestions for manager regarding ${target.name}, role: ${target.role}, completion: ${target.completion_percentage}%, sentiment: ${target.sentiment_score}, risk level: ${target.risk_level}`,
        AGENT_IDS.enablement
      )
      const data = parseAgentResponse(result)
      if (data) {
        setEnablementData(data as EnablementData)
        setStatusMessage('Coaching suggestions ready')
      } else {
        setStatusMessage('Unable to generate coaching suggestions')
      }
    } catch {
      setStatusMessage('Failed to get coaching suggestions')
    } finally {
      setLoadingEnablement(false)
      onActiveAgent(null)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  if (activeSection === 'pipeline') {
    return <OnboardingPipeline sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }
  if (activeSection === 'compliance') {
    return <ComplianceTracker sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }
  if (activeSection === 'actions') {
    return <ActionCenter sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }

  // Knowledge Base section
  if (activeSection === 'knowledge') {
    return <KnowledgeBasePanel sampleMode={sampleMode} />
  }

  // Checkpoint Review section (dedicated full view)
  if (activeSection === 'checkpoint') {
    return (
      <div className="flex flex-col h-full gap-4">
        {statusMessage && (
          <div className="px-4 py-2 glass-sm rounded-xl text-sm text-accent-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {statusMessage}
          </div>
        )}

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Hire selector */}
          <div className="w-64 flex flex-col glass-card overflow-hidden flex-shrink-0">
            <div className="px-4 py-3 border-b border-border/20">
              <h3 className="font-serif font-semibold text-sm tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Select Hire
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {displayHires.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    <p className="text-xs">Load team data first</p>
                    <Button onClick={handleRefreshInsights} disabled={loadingInsights} size="sm" className="mt-2 text-xs">
                      {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Load Team
                    </Button>
                  </div>
                )}
                {displayHires.map((hire, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHire(hire)}
                    className={`w-full text-left p-2.5 rounded-md border transition-all ${displaySelected?.name === hire.name ? 'glass-active' : 'glass-sm hover:scale-[1.002]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                        {hire.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{hire.name}</p>
                        <p className="text-[10px] text-muted-foreground">{hire.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Checkpoint content */}
          <div className="flex-1 overflow-y-auto">
            {displaySelected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-serif font-semibold text-primary">
                      {displaySelected.name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">{displaySelected.name}</h3>
                      <p className="text-xs text-muted-foreground">{displaySelected.role} - Started {displaySelected.start_date}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleRunCheckpoint()} disabled={loadingCheckpoint} className="bg-primary hover:bg-primary/90">
                    {loadingCheckpoint ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
                    Run Checkpoint Review
                  </Button>
                </div>

                {loadingCheckpoint && (
                  <Card className="glass-card">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-5 w-1/3 glass-sm animate-pulse" />
                      <Skeleton className="h-4 w-full glass-sm animate-pulse" />
                      <Skeleton className="h-4 w-2/3 glass-sm animate-pulse" />
                      <Skeleton className="h-20 w-full glass-sm animate-pulse" />
                    </CardContent>
                  </Card>
                )}

                {checkpointData && !loadingCheckpoint && (
                  <Card className="glass-card border-l-4 border-l-accent">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-serif font-semibold flex items-center gap-2">
                        <Clipboard className="h-4 w-4 text-accent" />
                        Checkpoint Review: {checkpointData.checkpoint_type ?? 'Review'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {checkpointData.hire_summary && (
                        <div className="text-sm leading-relaxed">{renderMarkdown(checkpointData.hire_summary)}</div>
                      )}
                      {checkpointData.overall_rating != null && (
                        <div className="flex items-center gap-3 p-2 glass-sm rounded-xl">
                          <span className="text-sm font-medium">Overall Rating:</span>
                          {renderStars(checkpointData.overall_rating)}
                          <span className="text-sm font-serif font-semibold">{checkpointData.overall_rating}/5</span>
                        </div>
                      )}
                      {Array.isArray(checkpointData.evaluation_sections) && checkpointData.evaluation_sections.map((section, i) => (
                        <div key={i} className="p-3 glass-sm rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold">{section.section_name}</p>
                            {renderStars(section.rating ?? 0)}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{section.description}</p>
                          {Array.isArray(section.areas_of_strength) && section.areas_of_strength.length > 0 && (
                            <div className="mb-1">
                              <p className="text-[10px] font-semibold text-emerald-700">Strengths:</p>
                              {section.areas_of_strength.map((s, j) => <p key={j} className="text-[10px] text-muted-foreground ml-2">+ {s}</p>)}
                            </div>
                          )}
                          {Array.isArray(section.areas_of_improvement) && section.areas_of_improvement.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-amber-700">Areas to Improve:</p>
                              {section.areas_of_improvement.map((s, j) => <p key={j} className="text-[10px] text-muted-foreground ml-2">- {s}</p>)}
                            </div>
                          )}
                        </div>
                      ))}
                      {Array.isArray(checkpointData.recommendations) && checkpointData.recommendations.length > 0 && (
                        <div className="p-2.5 glass-sm rounded-xl">
                          <p className="text-xs font-semibold text-accent-foreground mb-1">Recommendations</p>
                          {checkpointData.recommendations.map((rec, i) => (
                            <p key={i} className="text-xs text-muted-foreground ml-2">- {rec}</p>
                          ))}
                        </div>
                      )}
                      {Array.isArray(checkpointData.flags) && checkpointData.flags.length > 0 && (
                        <div className="p-2.5 glass-card border-red-500/20 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-md">
                          <p className="text-xs font-semibold text-destructive mb-1">Flags</p>
                          {checkpointData.flags.map((flag, i) => (
                            <div key={i} className="flex items-start gap-1.5 ml-2 mb-1">
                              <Badge variant="outline" className={`text-[9px] px-1 ${getRiskColor(flag.type)}`}>{flag.type}</Badge>
                              <p className="text-xs text-muted-foreground">{flag.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {checkpointData.next_checkpoint_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Next checkpoint: {checkpointData.next_checkpoint_date}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {!checkpointData && !loadingCheckpoint && (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <Clipboard className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <h3 className="font-serif font-semibold text-lg mb-2">Run a Checkpoint Review</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">Click "Run Checkpoint Review" to generate a structured 30/60/90-day evaluation for the selected hire.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Clipboard className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <h3 className="font-serif font-semibold text-lg mb-2">Select a Hire</h3>
                <p className="text-sm text-muted-foreground">Choose a team member from the left to run their checkpoint review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Coaching section (dedicated full view)
  if (activeSection === 'coaching') {
    return (
      <div className="flex flex-col h-full gap-4">
        {statusMessage && (
          <div className="px-4 py-2 glass-sm rounded-xl text-sm text-accent-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {statusMessage}
          </div>
        )}

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Hire selector */}
          <div className="w-64 flex flex-col glass-card overflow-hidden flex-shrink-0">
            <div className="px-4 py-3 border-b border-border/20">
              <h3 className="font-serif font-semibold text-sm tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Select Hire
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {displayHires.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    <p className="text-xs">Load team data first</p>
                    <Button onClick={handleRefreshInsights} disabled={loadingInsights} size="sm" className="mt-2 text-xs">
                      {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Load Team
                    </Button>
                  </div>
                )}
                {displayHires.map((hire, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHire(hire)}
                    className={`w-full text-left p-2.5 rounded-md border transition-all ${displaySelected?.name === hire.name ? 'glass-active' : 'glass-sm hover:scale-[1.002]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                        {hire.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{hire.name}</p>
                        <p className="text-[10px] text-muted-foreground">{hire.role}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] ${getRiskColor(hire.risk_level)}`}>{hire.risk_level}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Coaching content */}
          <div className="flex-1 overflow-y-auto">
            {displaySelected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-serif font-semibold text-primary">
                      {displaySelected.name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold">{displaySelected.name}</h3>
                      <p className="text-xs text-muted-foreground">{displaySelected.role} - Risk: {displaySelected.risk_level}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleGetCoaching()} disabled={loadingEnablement} variant="outline">
                    {loadingEnablement ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                    Get Coaching Suggestions
                  </Button>
                </div>

                {loadingEnablement && (
                  <Card className="glass-card">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-5 w-1/3 glass-sm animate-pulse" />
                      <Skeleton className="h-4 w-full glass-sm animate-pulse" />
                      <Skeleton className="h-4 w-2/3 glass-sm animate-pulse" />
                      <Skeleton className="h-20 w-full glass-sm animate-pulse" />
                    </CardContent>
                  </Card>
                )}

                {enablementData && !loadingEnablement && (
                  <Card className="glass-card border-l-4 border-l-primary">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-serif font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          Coaching Suggestions
                        </CardTitle>
                        {enablementData.intervention_urgency && (
                          <Badge variant="outline" className={`text-[10px] ${enablementData.intervention_urgency === 'immediate' ? getRiskColor('critical') : enablementData.intervention_urgency === 'this_week' ? getRiskColor('warning') : getRiskColor('low')}`}>
                            {enablementData.intervention_urgency?.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <Tabs defaultValue="coaching" className="w-full">
                        <TabsList className="w-full h-8 text-xs">
                          <TabsTrigger value="coaching" className="text-xs flex-1">Coaching</TabsTrigger>
                          <TabsTrigger value="risks" className="text-xs flex-1">Risk Signals</TabsTrigger>
                          <TabsTrigger value="tasks" className="text-xs flex-1">Missed Tasks</TabsTrigger>
                          <TabsTrigger value="skills" className="text-xs flex-1">Skills</TabsTrigger>
                        </TabsList>

                        <TabsContent value="coaching" className="space-y-2 mt-3">
                          {enablementData.weekly_summary && (
                            <div className="p-2.5 glass-sm rounded-xl text-sm leading-relaxed">{renderMarkdown(enablementData.weekly_summary)}</div>
                          )}
                          {Array.isArray(enablementData.coaching_prompts) && enablementData.coaching_prompts.map((prompt, i) => (
                            <div key={i} className="p-3 glass-sm rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold">{prompt.topic}</p>
                                <Badge variant="outline" className={`text-[10px] ${getRiskColor(prompt.priority === 'high' ? 'high' : prompt.priority === 'medium' ? 'medium' : 'low')}`}>{prompt.priority}</Badge>
                              </div>
                              <p className="text-xs text-foreground leading-relaxed mb-1">{prompt.prompt}</p>
                              <p className="text-[10px] text-muted-foreground">{prompt.context}</p>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="risks" className="space-y-2 mt-3">
                          {Array.isArray(enablementData.risk_signals) && enablementData.risk_signals.map((signal, i) => (
                            <div key={i} className="p-3 glass-sm rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {signal.signal}</p>
                                <Badge variant="outline" className={`text-[10px] ${getRiskColor(signal.severity)}`}>{signal.severity}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{signal.evidence}</p>
                              <p className="text-xs text-accent-foreground bg-accent/10 px-2 py-1 rounded">{signal.recommended_action}</p>
                            </div>
                          ))}
                          {(!Array.isArray(enablementData.risk_signals) || enablementData.risk_signals.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">No risk signals detected</p>
                          )}
                        </TabsContent>

                        <TabsContent value="tasks" className="space-y-2 mt-3">
                          {Array.isArray(enablementData.missed_tasks) && enablementData.missed_tasks.map((task, i) => (
                            <div key={i} className="p-3 glass-sm rounded-xl flex items-start gap-3">
                              <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{task.task}</p>
                                <p className="text-xs text-destructive">{task.days_overdue} days overdue</p>
                                <p className="text-xs text-muted-foreground mt-1">{task.impact}</p>
                              </div>
                            </div>
                          ))}
                          {(!Array.isArray(enablementData.missed_tasks) || enablementData.missed_tasks.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">No missed tasks</p>
                          )}
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-2 mt-3">
                          {Array.isArray(enablementData.skill_development) && enablementData.skill_development.map((skill, i) => (
                            <div key={i} className="p-3 glass-sm rounded-xl">
                              <p className="text-sm font-semibold mb-1">{skill.area}</p>
                              <div className="flex items-center gap-2 text-xs mb-1">
                                <span className="text-muted-foreground">Current: <span className="font-medium text-foreground">{skill.current_level}</span></span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Target: <span className="font-medium text-accent-foreground">{skill.target_level}</span></span>
                              </div>
                              <p className="text-xs text-muted-foreground">{skill.suggestion}</p>
                            </div>
                          ))}
                          {(!Array.isArray(enablementData.skill_development) || enablementData.skill_development.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-4">No skill recommendations</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

                {!enablementData && !loadingEnablement && (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <h3 className="font-serif font-semibold text-lg mb-2">Get Coaching Suggestions</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">Click "Get Coaching Suggestions" to receive AI-generated 1:1 prompts, risk signals, and action recommendations.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <h3 className="font-serif font-semibold text-lg mb-2">Select a Hire</h3>
                <p className="text-sm text-muted-foreground">Choose a team member from the left to get coaching suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Team Overview section (full hire list + detail)
  if (activeSection === 'team') {
    return (
      <div className="flex flex-col h-full gap-4">
        {statusMessage && (
          <div className="px-4 py-2 glass-sm rounded-xl text-sm text-accent-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {statusMessage}
          </div>
        )}

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Team List */}
          <div className="w-[40%] flex flex-col glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-sm tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Team ({displayHires.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={handleRefreshInsights} disabled={loadingInsights} className="text-xs h-7 px-2">
                {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {displayHires.length === 0 && !loadingInsights && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No hire data yet</p>
                    <p className="text-xs mt-1">Click Refresh to load team insights</p>
                  </div>
                )}
                {loadingInsights && displayHires.length === 0 && (
                  <div className="space-y-3 p-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-2/3 glass-sm animate-pulse" />
                        <Skeleton className="h-3 w-1/2 glass-sm animate-pulse" />
                        <Skeleton className="h-2 w-full glass-sm animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}
                {displayHires.map((hire, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHire(hire)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${displaySelected?.name === hire.name ? 'glass-active' : 'glass-sm hover:scale-[1.002]'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {hire.name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{hire.name}</p>
                          <p className="text-[10px] text-muted-foreground">{hire.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${getRiskColor(hire.risk_level)}`}>
                        {hire.risk_level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hire.completion_percentage} className="h-1.5 flex-1" />
                      <span className="text-[10px] text-muted-foreground font-medium">{hire.completion_percentage}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Zap className="h-2.5 w-2.5" /> {hire.ramp_velocity}</span>
                      <span className="flex items-center gap-1">{getComplianceIcon(hire.compliance_status)} {hire.compliance_status?.replace(/_/g, ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
            {displaySelected ? (
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-serif font-semibold text-primary">
                        {displaySelected.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-lg">{displaySelected.name}</h3>
                        <p className="text-sm text-muted-foreground">{displaySelected.role}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Started {displaySelected.start_date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getRiskColor(displaySelected.risk_level)}`}>{displaySelected.risk_level} risk</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-2 glass-sm rounded-xl">
                      <p className="text-lg font-serif font-semibold">{displaySelected.completion_percentage}%</p>
                      <p className="text-[10px] text-muted-foreground">Completion</p>
                    </div>
                    <div className="text-center p-2 glass-sm rounded-xl">
                      <p className="text-lg font-serif font-semibold">{displaySelected.ramp_velocity}</p>
                      <p className="text-[10px] text-muted-foreground">Velocity</p>
                    </div>
                    <div className="text-center p-2 glass-sm rounded-xl">
                      <p className="text-lg font-serif font-semibold">{displaySelected.sentiment_score}</p>
                      <p className="text-[10px] text-muted-foreground">Sentiment</p>
                    </div>
                    <div className="text-center p-2 glass-sm rounded-xl">
                      <p className="text-lg font-serif font-semibold">{displaySelected.tool_adoption}%</p>
                      <p className="text-[10px] text-muted-foreground">Tool Adoption</p>
                    </div>
                  </div>

                  {Array.isArray(displaySelected.risk_reasons) && displaySelected.risk_reasons.length > 0 && (
                    <div className="mt-3 p-2.5 glass-card border-red-500/20 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-md">
                      <p className="text-xs font-semibold text-destructive mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Risk Factors</p>
                      {displaySelected.risk_reasons.map((reason, i) => (
                        <p key={i} className="text-xs text-muted-foreground ml-4">- {reason}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <div className="w-16 h-16 rounded-full glass-sm flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">Select a Team Member</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Choose a hire from the team list to view their details.</p>
                {!sampleMode && displayHires.length === 0 && (
                  <Button onClick={handleRefreshInsights} disabled={loadingInsights} className="mt-4 bg-primary hover:bg-primary/90">
                    {loadingInsights ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Load Team Insights
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Derived dashboard stats
  const avgSentiment = displayHires.length > 0 ? (displayHires.reduce((s, h) => s + h.sentiment_score, 0) / displayHires.length).toFixed(1) : '--'
  const avgToolAdoption = displayHires.length > 0 ? Math.round(displayHires.reduce((s, h) => s + h.tool_adoption, 0) / displayHires.length) : 0
  const onTrackPct = displayHires.length > 0 ? Math.round(((displayMetrics?.on_track_count ?? 0) / displayHires.length) * 100) : 0
  const sentimentPositive = displayHires.filter(h => h.sentiment_score >= 7.5).length
  const sentimentNeutral = displayHires.filter(h => h.sentiment_score >= 5 && h.sentiment_score < 7.5).length
  const sentimentNegative = displayHires.filter(h => h.sentiment_score < 5).length

  const RECENT_ACTIVITY = [
    { action: 'Emily Taylor completed 90-day milestone', time: '2 hours ago', type: 'success' as const },
    { action: 'Maria Lopez missed compliance deadline', time: '4 hours ago', type: 'warning' as const },
    { action: 'Alex Kumar passed security training', time: '5 hours ago', type: 'success' as const },
    { action: 'James Park sentiment dropped below 7.0', time: '1 day ago', type: 'warning' as const },
    { action: 'Sarah Chen completed first sprint demo', time: '1 day ago', type: 'success' as const },
    { action: 'Ryan Foster pre-boarding tasks assigned', time: '2 days ago', type: 'info' as const },
  ]

  // Default: Dashboard section
  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto">
      {/* Status Message */}
      {statusMessage && (
        <div className="px-4 py-2 glass-sm rounded-xl text-sm text-accent-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Row 1: Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Team Avg Completion</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{displayMetrics?.avg_completion ?? '--'}%</span>
              {displayTrends?.completion_trend && getTrendIcon(displayTrends.completion_trend)}
            </div>
            <Progress value={displayMetrics?.avg_completion ?? 0} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Avg Ramp Velocity</span>
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{displayMetrics?.avg_ramp_velocity ?? '--'}</span>
              {displayTrends?.velocity_trend && getTrendIcon(displayTrends.velocity_trend)}
            </div>
            <Progress value={displayMetrics?.avg_ramp_velocity ?? 0} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">At-Risk Hires</span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{displayMetrics?.at_risk_count ?? '--'}</span>
              <span className="text-xs text-muted-foreground">of {displayMetrics?.total_hires ?? '--'}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: displayMetrics?.total_hires ?? 0 }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (displayMetrics?.at_risk_count ?? 0) ? 'bg-destructive' : 'bg-emerald-500'}`} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Compliance Rate</span>
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{displayMetrics?.compliance_rate ?? '--'}%</span>
              {displayTrends?.sentiment_trend && getTrendIcon(displayTrends.sentiment_trend)}
            </div>
            <Progress value={displayMetrics?.compliance_rate ?? 0} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Avg Sentiment</span>
              <Smile className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{avgSentiment}</span>
              <span className="text-xs text-muted-foreground">/ 10</span>
            </div>
            <div className="flex gap-1 mt-2">
              {displayHires.map((h, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${h.sentiment_score >= 7.5 ? 'bg-emerald-500' : h.sentiment_score >= 5 ? 'bg-amber-500' : 'bg-red-500'}`} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Tool Adoption</span>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{avgToolAdoption}%</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <Progress value={avgToolAdoption} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">On-Track Rate</span>
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">{onTrackPct}%</span>
              <span className="text-xs text-muted-foreground">{displayMetrics?.on_track_count ?? '--'} hires</span>
            </div>
            <Progress value={onTrackPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">Avg Time to Productive</span>
              <Timer className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-semibold">28</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Target: 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alert Banner */}
      {(displayAlerts?.length ?? 0) > 0 && (
        <div className="glass-card border-red-500/20 bg-gradient-to-r from-red-500/5 to-red-600/5 p-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">{displayAlerts.length} hire{displayAlerts.length > 1 ? 's' : ''} need{displayAlerts.length === 1 ? 's' : ''} attention</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {displayAlerts.map((alert, i) => (
                <Badge key={i} variant="outline" className={`text-[10px] ${getRiskColor(alert.severity)}`}>
                  {alert.hire_name}: {alert.alert_type?.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
          <Button onClick={handleRefreshInsights} disabled={loadingInsights} variant="ghost" size="sm" className="text-xs h-7 px-2 flex-shrink-0">
            {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          </Button>
        </div>
      )}

      {/* Row 3: Sentiment + Funnel + Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sentiment Breakdown */}
        <Card className="glass-card">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Sentiment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Smile className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Positive (7.5+)</span>
                    <span className="text-xs font-semibold text-emerald-600">{sentimentPositive}</span>
                  </div>
                  <Progress value={displayHires.length > 0 ? (sentimentPositive / displayHires.length) * 100 : 0} className="h-1.5" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Meh className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Neutral (5-7.5)</span>
                    <span className="text-xs font-semibold text-amber-600">{sentimentNeutral}</span>
                  </div>
                  <Progress value={displayHires.length > 0 ? (sentimentNeutral / displayHires.length) * 100 : 0} className="h-1.5" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Frown className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Negative (&lt;5)</span>
                    <span className="text-xs font-semibold text-red-500">{sentimentNegative}</span>
                  </div>
                  <Progress value={displayHires.length > 0 ? (sentimentNegative / displayHires.length) * 100 : 0} className="h-1.5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Funnel */}
        <Card className="glass-card">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Onboarding Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {[
                { stage: 'Pre-boarding', count: 1, pct: 100 },
                { stage: 'Week 1', count: 1, pct: 87 },
                { stage: 'Month 1', count: 2, pct: 75 },
                { stage: 'Month 2', count: 1, pct: 50 },
                { stage: 'Month 3', count: 1, pct: 37 },
                { stage: 'Graduated', count: 2, pct: 25 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-20 text-right">{s.stage}</span>
                  <div className="flex-1 h-5 glass-sm rounded-md overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary/30 rounded-md flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${s.pct}%` }}
                    >
                      <span className="text-[9px] font-semibold text-primary-foreground">{s.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="glass-card">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 glass-sm rounded-lg">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Graduated This Month</span>
                </div>
                <span className="text-sm font-serif font-semibold">1</span>
              </div>
              <div className="flex items-center justify-between p-2.5 glass-sm rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium">Upcoming Checkpoints</span>
                </div>
                <span className="text-sm font-serif font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between p-2.5 glass-sm rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Active Hires</span>
                </div>
                <span className="text-sm font-serif font-semibold">{displayMetrics?.total_hires ?? '--'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 glass-sm rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium">Avg Completion Growth</span>
                </div>
                <span className="text-sm font-serif font-semibold text-emerald-600">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Team Progress + Recent Activity */}
      <div className="grid grid-cols-5 gap-4">
        {/* Team Progress */}
        <div className="col-span-3">
          <Card className="glass-card h-full">
            <CardHeader className="py-3 px-4 flex-row items-center justify-between">
              <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Team Progress
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleRefreshInsights} disabled={loadingInsights} className="text-xs h-7 px-2">
                {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-1 gap-2">
                {displayHires.map((hire, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 glass-sm rounded-lg hover:scale-[1.002] transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                      {hire.name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium truncate">{hire.name}</p>
                          <span className="text-[10px] text-muted-foreground">{hire.role}</span>
                        </div>
                        <Badge variant="outline" className={`text-[9px] ${getRiskColor(hire.risk_level)}`}>{hire.risk_level}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={hire.completion_percentage} className="h-1.5" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">{hire.completion_percentage}%</span>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Zap className="h-2.5 w-2.5" />{hire.ramp_velocity}</span>
                          <span className="flex items-center gap-0.5">
                            {hire.sentiment_score >= 7.5 ? <Smile className="h-2.5 w-2.5 text-emerald-500" /> : hire.sentiment_score >= 5 ? <Meh className="h-2.5 w-2.5 text-amber-500" /> : <Frown className="h-2.5 w-2.5 text-red-500" />}
                            {hire.sentiment_score}
                          </span>
                          <span className="flex items-center gap-0.5">{getComplianceIcon(hire.compliance_status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {displayHires.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>No hire data loaded</p>
                    <Button onClick={handleRefreshInsights} disabled={loadingInsights} size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-xs">
                      {loadingInsights ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Load Team Data
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 glass-sm rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.type === 'success' ? 'bg-emerald-500/10' :
                      item.type === 'warning' ? 'bg-amber-500/10' :
                      'bg-primary/10'
                    }`}>
                      {item.type === 'success' ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> :
                       item.type === 'warning' ? <AlertTriangle className="h-3 w-3 text-amber-600" /> :
                       <ArrowUpRight className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
