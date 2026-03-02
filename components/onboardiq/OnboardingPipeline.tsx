'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  GitBranch,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Filter,
  MoreHorizontal,
  Eye,
  Target,
} from 'lucide-react'

const INSIGHTS_ID = '69a1936a78bb4ecc77c12d22'

interface PipelineHire {
  name: string
  role: string
  stage: string
  daysInStage: number
  completion: number
  risk: string
  sentiment: number
  avatar: string
}

interface OnboardingPipelineProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

const STAGES = [
  { key: 'pre_boarding', label: 'Pre-boarding', color: 'from-stone-500/20 to-stone-600/20', border: 'border-stone-500/30' },
  { key: 'week_1', label: 'Week 1', color: 'from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30' },
  { key: 'month_1', label: 'Month 1', color: 'from-orange-500/20 to-amber-600/20', border: 'border-orange-500/30' },
  { key: 'month_2', label: 'Month 2', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { key: 'month_3', label: 'Month 3', color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30' },
  { key: 'graduated', label: 'Graduated', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
]

const SAMPLE_PIPELINE: PipelineHire[] = [
  { name: 'Sarah Chen', role: 'Software Engineer', stage: 'month_1', daysInStage: 12, completion: 55, risk: 'low', sentiment: 8.2, avatar: 'SC' },
  { name: 'James Park', role: 'UX Designer', stage: 'month_1', daysInStage: 18, completion: 60, risk: 'medium', sentiment: 6.5, avatar: 'JP' },
  { name: 'Maria Lopez', role: 'Sales Rep', stage: 'week_1', daysInStage: 7, completion: 30, risk: 'high', sentiment: 5.1, avatar: 'ML' },
  { name: 'Alex Kumar', role: 'Data Analyst', stage: 'month_2', daysInStage: 5, completion: 78, risk: 'low', sentiment: 9.0, avatar: 'AK' },
  { name: 'Emily Taylor', role: 'Product Manager', stage: 'month_3', daysInStage: 8, completion: 88, risk: 'low', sentiment: 8.8, avatar: 'ET' },
  { name: 'Ryan Foster', role: 'DevOps Engineer', stage: 'pre_boarding', daysInStage: 2, completion: 10, risk: 'low', sentiment: 7.5, avatar: 'RF' },
  { name: 'Lisa Wang', role: 'Marketing Lead', stage: 'graduated', daysInStage: 0, completion: 100, risk: 'low', sentiment: 9.2, avatar: 'LW' },
  { name: 'Tom Harris', role: 'QA Engineer', stage: 'week_1', daysInStage: 4, completion: 25, risk: 'low', sentiment: 7.8, avatar: 'TH' },
]

function getRiskStyle(risk: string) {
  switch (risk) {
    case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    default: return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  }
}

export default function OnboardingPipeline({ sampleMode, onActiveAgent }: OnboardingPipelineProps) {
  const [pipeline] = useState<PipelineHire[]>(SAMPLE_PIPELINE)
  const [selectedHire, setSelectedHire] = useState<PipelineHire | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  const stagesWithHires = STAGES.map(stage => ({
    ...stage,
    hires: pipeline.filter(h => h.stage === stage.key),
  }))

  const totalHires = pipeline.length
  const atRisk = pipeline.filter(h => h.risk === 'high' || h.risk === 'medium').length
  const avgCompletion = Math.round(pipeline.reduce((sum, h) => sum + h.completion, 0) / totalHires)
  const graduated = pipeline.filter(h => h.stage === 'graduated').length

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Active', value: totalHires.toString(), sub: 'new hires', icon: Users, color: 'text-primary' },
          { label: 'At Risk', value: atRisk.toString(), sub: 'need attention', icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, sub: 'across all hires', icon: Target, color: 'text-accent' },
          { label: 'Graduated', value: graduated.toString(), sub: 'this quarter', icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Pipeline View Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          Onboarding Pipeline
        </h4>
        <div className="flex items-center gap-2">
          <div className="glass-sm rounded-lg flex overflow-hidden">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 flex gap-3 min-h-0 overflow-x-auto pb-2">
          {stagesWithHires.map((stage) => (
            <div key={stage.key} className="flex-1 min-w-[180px] glass-card p-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${stage.color}`} />
                  <span className="text-xs font-semibold">{stage.label}</span>
                </div>
                <Badge className="glass-badge text-[9px]">{stage.hires.length}</Badge>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {stage.hires.map((hire, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHire(hire)}
                    className={`w-full text-left p-2.5 rounded-xl glass-sm transition-all duration-200 hover:scale-[1.02] ${
                      selectedHire?.name === hire.name ? 'glass-active' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">
                        {hire.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{hire.name}</p>
                        <p className="text-[9px] text-muted-foreground">{hire.role}</p>
                      </div>
                    </div>
                    <Progress value={hire.completion} className="h-1 mb-1.5" />
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground">{hire.completion}%</span>
                      <Badge variant="outline" className={`text-[8px] px-1 ${getRiskStyle(hire.risk)}`}>{hire.risk}</Badge>
                    </div>
                  </button>
                ))}
                {stage.hires.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-[10px] text-muted-foreground">No hires</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="flex-1 glass-card p-4 overflow-y-auto">
          <div className="space-y-2">
            {pipeline.map((hire, i) => {
              const stage = STAGES.find(s => s.key === hire.stage)
              return (
                <button
                  key={i}
                  onClick={() => setSelectedHire(hire)}
                  className={`w-full text-left p-3 rounded-xl glass-sm flex items-center gap-4 transition-all hover:scale-[1.002] ${
                    selectedHire?.name === hire.name ? 'glass-active' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {hire.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{hire.name}</p>
                    <p className="text-[10px] text-muted-foreground">{hire.role}</p>
                  </div>
                  <Badge className={`glass-badge text-[9px] ${stage?.border}`}>{stage?.label}</Badge>
                  <div className="w-24">
                    <Progress value={hire.completion} className="h-1.5" />
                    <p className="text-[9px] text-muted-foreground text-right mt-0.5">{hire.completion}%</p>
                  </div>
                  <div className="text-center w-12">
                    <p className="text-xs font-semibold">{hire.sentiment}</p>
                    <p className="text-[9px] text-muted-foreground">Mood</p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${getRiskStyle(hire.risk)}`}>{hire.risk}</Badge>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />{hire.daysInStage}d
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Hire Detail */}
      {selectedHire && (
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
            {selectedHire.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-sm">{selectedHire.name}</h4>
              <Badge variant="outline" className={`text-[9px] ${getRiskStyle(selectedHire.risk)}`}>{selectedHire.risk} risk</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{selectedHire.role} -- {selectedHire.completion}% complete -- Sentiment: {selectedHire.sentiment}/10</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="glass-button text-xs text-foreground h-8">
              <Eye className="h-3 w-3 mr-1.5" /> View Details
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs h-8 rounded-lg">
              Run Checkpoint
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
