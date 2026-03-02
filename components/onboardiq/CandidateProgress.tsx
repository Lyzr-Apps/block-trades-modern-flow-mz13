'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
  Shield,
  XCircle,
  FileText,
  BookOpen,
  Monitor,
  Target,
  Activity,
  ArrowRight,
  Loader2,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  TrendingDown,
  Minus,
  AlertCircle,
  CircleDot,
} from 'lucide-react'
import { callAIAgent, AIAgentResponse } from '@/lib/aiAgent'

const INSIGHTS_AGENT_ID = '69a1936a78bb4ecc77c12d22'

interface CandidateProgressProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

// Journey stages in order
const JOURNEY_STAGES = [
  { key: 'pre_boarding', label: 'Pre-boarding', icon: FileText, description: 'Paperwork & access setup' },
  { key: 'week_1', label: 'Week 1', icon: Users, description: 'Orientation & team intros' },
  { key: 'month_1', label: 'Month 1', icon: BookOpen, description: 'Training & tool adoption' },
  { key: 'month_2', label: 'Month 2', icon: Monitor, description: 'Role ramp & projects' },
  { key: 'month_3', label: 'Month 3', icon: Target, description: 'Performance & autonomy' },
  { key: 'graduated', label: 'Graduated', icon: CheckCircle2, description: 'Fully onboarded' },
]

interface StageDetail {
  status: 'completed' | 'current' | 'blocked' | 'upcoming'
  daysSpent: number
  expectedDays: number
  completedTasks: number
  totalTasks: number
  blockers: string[]
  completedDate?: string
}

interface CandidateJourney {
  name: string
  role: string
  startDate: string
  currentStage: string
  overallCompletion: number
  riskLevel: string
  sentiment: number
  rampVelocity: number
  avatar: string
  stuckSince?: number // days stuck in current stage
  stages: Record<string, StageDetail>
  complianceItems: { name: string; status: string; category: string; dueDate: string }[]
  recentActivity: { action: string; date: string; type: 'success' | 'warning' | 'info' }[]
}

const SAMPLE_CANDIDATES: CandidateJourney[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    startDate: 'Jan 15',
    currentStage: 'month_1',
    overallCompletion: 55,
    riskLevel: 'low',
    sentiment: 8.2,
    rampVelocity: 72,
    avatar: 'SC',
    stuckSince: 0,
    stages: {
      pre_boarding: { status: 'completed', daysSpent: 5, expectedDays: 5, completedTasks: 8, totalTasks: 8, blockers: [], completedDate: 'Jan 14' },
      week_1: { status: 'completed', daysSpent: 7, expectedDays: 7, completedTasks: 12, totalTasks: 12, blockers: [], completedDate: 'Jan 22' },
      month_1: { status: 'current', daysSpent: 14, expectedDays: 23, completedTasks: 6, totalTasks: 15, blockers: [] },
      month_2: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 10, blockers: [] },
      month_3: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 8, blockers: [] },
      graduated: { status: 'upcoming', daysSpent: 0, expectedDays: 0, completedTasks: 0, totalTasks: 1, blockers: [] },
    },
    complianceItems: [
      { name: 'I-9 Verification', status: 'complete', category: 'Legal', dueDate: 'Jan 15' },
      { name: 'NDA Signed', status: 'complete', category: 'Legal', dueDate: 'Jan 15' },
      { name: 'Security Training', status: 'pending', category: 'Security', dueDate: 'Feb 10' },
      { name: 'W-4 Tax Form', status: 'complete', category: 'Tax', dueDate: 'Jan 18' },
    ],
    recentActivity: [
      { action: 'Completed first sprint demo', date: '2 days ago', type: 'success' },
      { action: 'Passed code review process training', date: '3 days ago', type: 'success' },
      { action: 'Started CI/CD pipeline module', date: '4 days ago', type: 'info' },
    ],
  },
  {
    name: 'James Park',
    role: 'UX Designer',
    startDate: 'Jan 10',
    currentStage: 'month_1',
    overallCompletion: 60,
    riskLevel: 'medium',
    sentiment: 6.5,
    rampVelocity: 58,
    avatar: 'JP',
    stuckSince: 5,
    stages: {
      pre_boarding: { status: 'completed', daysSpent: 4, expectedDays: 5, completedTasks: 8, totalTasks: 8, blockers: [], completedDate: 'Jan 9' },
      week_1: { status: 'completed', daysSpent: 7, expectedDays: 7, completedTasks: 10, totalTasks: 12, blockers: [], completedDate: 'Jan 17' },
      month_1: { status: 'blocked', daysSpent: 19, expectedDays: 23, completedTasks: 5, totalTasks: 14, blockers: ['Design tool license pending', 'Missed 1:1 with design lead'] },
      month_2: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 10, blockers: [] },
      month_3: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 8, blockers: [] },
      graduated: { status: 'upcoming', daysSpent: 0, expectedDays: 0, completedTasks: 0, totalTasks: 1, blockers: [] },
    },
    complianceItems: [
      { name: 'I-9 Verification', status: 'complete', category: 'Legal', dueDate: 'Jan 10' },
      { name: 'NDA Signed', status: 'complete', category: 'Legal', dueDate: 'Jan 10' },
      { name: 'Security Training', status: 'pending', category: 'Security', dueDate: 'Feb 5' },
      { name: 'Benefits Enrollment', status: 'pending', category: 'HR', dueDate: 'Feb 8' },
    ],
    recentActivity: [
      { action: 'Design tool license request submitted', date: '1 day ago', type: 'warning' },
      { action: 'Missed scheduled 1:1 with design lead', date: '2 days ago', type: 'warning' },
      { action: 'Completed brand guidelines review', date: '5 days ago', type: 'success' },
    ],
  },
  {
    name: 'Maria Lopez',
    role: 'Sales Representative',
    startDate: 'Jan 8',
    currentStage: 'week_1',
    overallCompletion: 30,
    riskLevel: 'high',
    sentiment: 5.1,
    rampVelocity: 40,
    avatar: 'ML',
    stuckSince: 12,
    stages: {
      pre_boarding: { status: 'completed', daysSpent: 7, expectedDays: 5, completedTasks: 6, totalTasks: 8, blockers: [], completedDate: 'Jan 7' },
      week_1: { status: 'blocked', daysSpent: 19, expectedDays: 7, completedTasks: 4, totalTasks: 12, blockers: ['I-9 verification overdue', 'CRM access not provisioned', 'Training modules incomplete'] },
      month_1: { status: 'upcoming', daysSpent: 0, expectedDays: 23, completedTasks: 0, totalTasks: 15, blockers: [] },
      month_2: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 10, blockers: [] },
      month_3: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 8, blockers: [] },
      graduated: { status: 'upcoming', daysSpent: 0, expectedDays: 0, completedTasks: 0, totalTasks: 1, blockers: [] },
    },
    complianceItems: [
      { name: 'I-9 Verification', status: 'overdue', category: 'Legal', dueDate: 'Jan 11' },
      { name: 'Direct Deposit', status: 'overdue', category: 'Finance', dueDate: 'Jan 15' },
      { name: 'NDA Signed', status: 'complete', category: 'Legal', dueDate: 'Jan 8' },
      { name: 'Security Training', status: 'pending', category: 'Security', dueDate: 'Feb 1' },
    ],
    recentActivity: [
      { action: 'Compliance deadline missed: I-9 form', date: '4 hours ago', type: 'warning' },
      { action: 'Sentiment score dropped below 5.5', date: '1 day ago', type: 'warning' },
      { action: 'Completed team intro meeting', date: '3 days ago', type: 'success' },
    ],
  },
  {
    name: 'Alex Kumar',
    role: 'Data Analyst',
    startDate: 'Jan 12',
    currentStage: 'month_2',
    overallCompletion: 78,
    riskLevel: 'low',
    sentiment: 9.0,
    rampVelocity: 85,
    avatar: 'AK',
    stuckSince: 0,
    stages: {
      pre_boarding: { status: 'completed', daysSpent: 3, expectedDays: 5, completedTasks: 8, totalTasks: 8, blockers: [], completedDate: 'Jan 11' },
      week_1: { status: 'completed', daysSpent: 6, expectedDays: 7, completedTasks: 12, totalTasks: 12, blockers: [], completedDate: 'Jan 18' },
      month_1: { status: 'completed', daysSpent: 20, expectedDays: 23, completedTasks: 15, totalTasks: 15, blockers: [], completedDate: 'Feb 7' },
      month_2: { status: 'current', daysSpent: 12, expectedDays: 30, completedTasks: 5, totalTasks: 10, blockers: [] },
      month_3: { status: 'upcoming', daysSpent: 0, expectedDays: 30, completedTasks: 0, totalTasks: 8, blockers: [] },
      graduated: { status: 'upcoming', daysSpent: 0, expectedDays: 0, completedTasks: 0, totalTasks: 1, blockers: [] },
    },
    complianceItems: [
      { name: 'I-9 Verification', status: 'complete', category: 'Legal', dueDate: 'Jan 12' },
      { name: 'Security Training', status: 'complete', category: 'Security', dueDate: 'Jan 25' },
      { name: 'W-4 Tax Form', status: 'complete', category: 'Tax', dueDate: 'Jan 15' },
      { name: 'Benefits Enrollment', status: 'complete', category: 'HR', dueDate: 'Jan 30' },
    ],
    recentActivity: [
      { action: 'Passed security training certification', date: '5 hours ago', type: 'success' },
      { action: 'Completed first data pipeline project', date: '2 days ago', type: 'success' },
      { action: 'Started advanced SQL training module', date: '3 days ago', type: 'info' },
    ],
  },
  {
    name: 'Emily Taylor',
    role: 'Product Manager',
    startDate: 'Jan 5',
    currentStage: 'month_3',
    overallCompletion: 88,
    riskLevel: 'low',
    sentiment: 8.8,
    rampVelocity: 92,
    avatar: 'ET',
    stuckSince: 0,
    stages: {
      pre_boarding: { status: 'completed', daysSpent: 4, expectedDays: 5, completedTasks: 8, totalTasks: 8, blockers: [], completedDate: 'Jan 4' },
      week_1: { status: 'completed', daysSpent: 7, expectedDays: 7, completedTasks: 12, totalTasks: 12, blockers: [], completedDate: 'Jan 12' },
      month_1: { status: 'completed', daysSpent: 21, expectedDays: 23, completedTasks: 15, totalTasks: 15, blockers: [], completedDate: 'Feb 2' },
      month_2: { status: 'completed', daysSpent: 28, expectedDays: 30, completedTasks: 10, totalTasks: 10, blockers: [], completedDate: 'Mar 1' },
      month_3: { status: 'current', daysSpent: 8, expectedDays: 30, completedTasks: 3, totalTasks: 8, blockers: [] },
      graduated: { status: 'upcoming', daysSpent: 0, expectedDays: 0, completedTasks: 0, totalTasks: 1, blockers: [] },
    },
    complianceItems: [
      { name: 'I-9 Verification', status: 'complete', category: 'Legal', dueDate: 'Jan 5' },
      { name: 'NDA Signed', status: 'complete', category: 'Legal', dueDate: 'Jan 5' },
      { name: 'Security Training', status: 'complete', category: 'Security', dueDate: 'Jan 20' },
      { name: 'Benefits Enrollment', status: 'complete', category: 'HR', dueDate: 'Jan 25' },
    ],
    recentActivity: [
      { action: 'Led first product review meeting', date: '1 day ago', type: 'success' },
      { action: 'Completed stakeholder mapping exercise', date: '3 days ago', type: 'success' },
      { action: 'Started OKR planning for Q2', date: '4 days ago', type: 'info' },
    ],
  },
]

function getRiskColor(level: string) {
  switch (level?.toLowerCase()) {
    case 'critical': case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'medium': case 'warning': return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'low': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

function getStageStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-500 text-white'
    case 'current': return 'bg-primary text-primary-foreground'
    case 'blocked': return 'bg-destructive text-white'
    case 'upcoming': return 'bg-muted text-muted-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

function getStageConnectorColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-500'
    case 'current': return 'bg-primary'
    case 'blocked': return 'bg-destructive'
    default: return 'bg-muted'
  }
}

function getComplianceStatusIcon(status: string) {
  switch (status) {
    case 'complete': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
    case 'pending': return <Clock className="h-3.5 w-3.5 text-amber-600" />
    case 'overdue': return <XCircle className="h-3.5 w-3.5 text-destructive" />
    default: return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'success': return <CheckCircle2 className="h-3 w-3 text-emerald-600" />
    case 'warning': return <AlertTriangle className="h-3 w-3 text-amber-600" />
    default: return <Activity className="h-3 w-3 text-primary" />
  }
}

export default function CandidateProgress({ sampleMode, onActiveAgent }: CandidateProgressProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateJourney | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const candidates = sampleMode ? SAMPLE_CANDIDATES : SAMPLE_CANDIDATES
  const selected = selectedCandidate ?? (sampleMode ? SAMPLE_CANDIDATES[2] : null) // Default to Maria (high risk) to show blockers

  // Summary stats
  const blockedCount = candidates.filter(c => {
    const stages = Object.values(c.stages)
    return stages.some(s => s.status === 'blocked')
  }).length
  const atRiskCount = candidates.filter(c => c.riskLevel === 'high' || c.riskLevel === 'medium').length
  const avgCompletion = candidates.length > 0 ? Math.round(candidates.reduce((s, c) => s + c.overallCompletion, 0) / candidates.length) : 0

  return (
    <div className="flex flex-col h-full gap-4">
      {statusMessage && (
        <div className="px-4 py-2 glass-sm rounded-xl text-sm text-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Summary Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground font-medium">Total Hires</span>
              <Users className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xl font-serif font-semibold">{candidates.length}</span>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground font-medium">Blocked</span>
              <Lock className="h-3.5 w-3.5 text-destructive" />
            </div>
            <span className="text-xl font-serif font-semibold text-destructive">{blockedCount}</span>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground font-medium">At Risk</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <span className="text-xl font-serif font-semibold text-amber-700">{atRiskCount}</span>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground font-medium">Avg Completion</span>
              <Target className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <span className="text-xl font-serif font-semibold">{avgCompletion}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Main content: candidate list + journey detail */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Candidate List */}
        <div className="w-72 flex flex-col glass-card overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-border/20">
            <h3 className="font-serif font-semibold text-sm tracking-wide flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Candidates
            </h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {candidates.map((candidate, i) => {
                const isBlocked = Object.values(candidate.stages).some(s => s.status === 'blocked')
                const isSelected = selected?.name === candidate.name
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`w-full text-left p-3 rounded-md border transition-all ${isSelected ? 'glass-active' : 'glass-sm hover:scale-[1.002]'}`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {candidate.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{candidate.name}</p>
                        <p className="text-[10px] text-muted-foreground">{candidate.role}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] ${getRiskColor(candidate.riskLevel)}`}>
                        {candidate.riskLevel}
                      </Badge>
                    </div>

                    {/* Mini journey bar */}
                    <div className="flex items-center gap-0.5">
                      {JOURNEY_STAGES.map((stage, j) => {
                        const stageData = candidate.stages[stage.key]
                        const status = stageData?.status ?? 'upcoming'
                        return (
                          <div
                            key={j}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              status === 'completed' ? 'bg-emerald-500' :
                              status === 'current' ? 'bg-primary' :
                              status === 'blocked' ? 'bg-destructive animate-pulse' :
                              'bg-muted'
                            }`}
                          />
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">{candidate.overallCompletion}% complete</span>
                      {isBlocked && (
                        <span className="text-[9px] text-destructive font-medium flex items-center gap-0.5">
                          <Lock className="h-2.5 w-2.5" /> Blocked
                        </span>
                      )}
                      {candidate.stuckSince != null && candidate.stuckSince > 3 && !isBlocked && (
                        <span className="text-[9px] text-amber-600 font-medium flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> {candidate.stuckSince}d stalled
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Journey Detail Panel */}
        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <div className="space-y-4">
              {/* Candidate Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-serif font-semibold ${
                    Object.values(selected.stages).some(s => s.status === 'blocked')
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected.role}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Started {selected.startDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getRiskColor(selected.riskLevel)}>
                    {selected.riskLevel} risk
                  </Badge>
                  <div className="text-right">
                    <p className="text-lg font-serif font-semibold">{selected.overallCompletion}%</p>
                    <p className="text-[10px] text-muted-foreground">overall</p>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2.5 glass-sm rounded-xl">
                  <p className="text-lg font-serif font-semibold">{selected.rampVelocity}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    <Zap className="h-2.5 w-2.5" /> Ramp Velocity
                  </p>
                </div>
                <div className="text-center p-2.5 glass-sm rounded-xl">
                  <p className="text-lg font-serif font-semibold">{selected.sentiment}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    <Activity className="h-2.5 w-2.5" /> Sentiment
                  </p>
                </div>
                <div className="text-center p-2.5 glass-sm rounded-xl">
                  <p className={`text-lg font-serif font-semibold ${(selected.stuckSince ?? 0) > 5 ? 'text-destructive' : ''}`}>
                    {selected.stuckSince ?? 0}d
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> In Current Stage
                  </p>
                </div>
              </div>

              {/* Visual Journey Timeline */}
              <Card className="glass-card">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Onboarding Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-0">
                    {JOURNEY_STAGES.map((stage, i) => {
                      const stageData = selected.stages[stage.key]
                      if (!stageData) return null
                      const Icon = stage.icon
                      const isLast = i === JOURNEY_STAGES.length - 1
                      const taskPct = stageData.totalTasks > 0 ? Math.round((stageData.completedTasks / stageData.totalTasks) * 100) : 0
                      const isOverTime = stageData.daysSpent > stageData.expectedDays && stageData.status !== 'completed' && stageData.status !== 'upcoming'

                      return (
                        <div key={stage.key} className="flex items-stretch gap-4 relative">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center w-10 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${getStageStatusColor(stageData.status)}`}>
                              {stageData.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : stageData.status === 'blocked' ? (
                                <Lock className="h-4 w-4" />
                              ) : stageData.status === 'current' ? (
                                <CircleDot className="h-4 w-4" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 flex-1 min-h-[16px] ${getStageConnectorColor(stageData.status)}`} />
                            )}
                          </div>

                          {/* Stage content */}
                          <div className={`flex-1 pb-4 ${isLast ? '' : ''}`}>
                            <div className={`p-3 rounded-xl border transition-all ${
                              stageData.status === 'blocked'
                                ? 'glass-card border-destructive/30 bg-gradient-to-r from-red-500/5 to-red-600/5'
                                : stageData.status === 'current'
                                ? 'glass-card border-primary/30'
                                : stageData.status === 'completed'
                                ? 'glass-sm border-emerald-500/20'
                                : 'glass-sm opacity-60'
                            }`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold">{stage.label}</h4>
                                  {stageData.status === 'blocked' && (
                                    <Badge variant="outline" className="text-[9px] bg-destructive/10 text-destructive border-destructive/20">
                                      Blocked
                                    </Badge>
                                  )}
                                  {stageData.status === 'current' && (
                                    <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                                      In Progress
                                    </Badge>
                                  )}
                                  {stageData.completedDate && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> {stageData.completedDate}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{stage.description}</span>
                              </div>

                              {/* Progress bar for non-upcoming stages */}
                              {stageData.status !== 'upcoming' && (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <Progress value={taskPct} className="h-1.5 flex-1" />
                                    <span className="text-[10px] font-medium text-muted-foreground w-16 text-right">
                                      {stageData.completedTasks}/{stageData.totalTasks} tasks
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="h-2.5 w-2.5" />
                                      {stageData.daysSpent}d spent
                                      {stageData.expectedDays > 0 && <span className="text-muted-foreground/70"> / {stageData.expectedDays}d expected</span>}
                                    </span>
                                    {isOverTime && (
                                      <span className="text-destructive flex items-center gap-0.5 font-medium">
                                        <AlertTriangle className="h-2.5 w-2.5" />
                                        {stageData.daysSpent - stageData.expectedDays}d over time
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Blockers */}
                              {stageData.blockers.length > 0 && (
                                <div className="mt-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                                  <p className="text-[10px] font-semibold text-destructive mb-1 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Blockers ({stageData.blockers.length})
                                  </p>
                                  {stageData.blockers.map((blocker, j) => (
                                    <div key={j} className="flex items-start gap-1.5 ml-1 mb-0.5">
                                      <XCircle className="h-3 w-3 text-destructive flex-shrink-0 mt-0.5" />
                                      <p className="text-xs text-foreground">{blocker}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Row: Compliance + Recent Activity */}
              <div className="grid grid-cols-2 gap-4">
                {/* Compliance Items */}
                <Card className="glass-card">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" /> Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {selected.complianceItems.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border ${
                            item.status === 'overdue'
                              ? 'glass-card border-l-2 border-l-destructive border-destructive/20'
                              : 'glass-sm'
                          }`}
                        >
                          {getComplianceStatusIcon(item.status)}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${item.status === 'overdue' ? 'text-destructive' : ''}`}>
                              {item.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.category} - Due {item.dueDate}
                            </p>
                          </div>
                          <Badge variant="outline" className={`text-[9px] ${
                            item.status === 'complete' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' :
                            item.status === 'overdue' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            'bg-amber-500/10 text-amber-700 border-amber-500/20'
                          }`}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-card">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" /> Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {selected.recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2 glass-sm rounded-lg">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            activity.type === 'success' ? 'bg-emerald-500/10' :
                            activity.type === 'warning' ? 'bg-amber-500/10' :
                            'bg-primary/10'
                          }`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed">{activity.action}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full glass-sm flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">Select a Candidate</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Choose a candidate from the list to view their full onboarding journey and identify where they may be stuck.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
