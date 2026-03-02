'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Lock,
  Award,
  TrendingUp,
  ChevronRight,
  Loader2,
  Star,
  Zap,
  Target,
  Video,
  FileText,
  Code,
  Users,
} from 'lucide-react'

const ROLE_RAMP_ID = '69a19369177bcf99abd099e8'

interface LearningModule {
  id: string
  title: string
  description: string
  type: 'video' | 'reading' | 'hands-on' | 'quiz' | 'workshop'
  duration: string
  status: 'completed' | 'in_progress' | 'locked' | 'available'
  progress: number
  xp: number
  category: string
}

interface LearningPathProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

const SAMPLE_TRACKS = [
  {
    name: 'Technical Foundations',
    progress: 65,
    modules: 8,
    completed: 5,
    color: 'from-blue-500/20 to-indigo-500/20',
    icon: Code,
  },
  {
    name: 'Company & Culture',
    progress: 80,
    modules: 5,
    completed: 4,
    color: 'from-pink-500/20 to-rose-500/20',
    icon: Users,
  },
  {
    name: 'Tools & Workflows',
    progress: 40,
    modules: 6,
    completed: 2,
    color: 'from-emerald-500/20 to-teal-500/20',
    icon: Zap,
  },
  {
    name: 'Role-Specific Skills',
    progress: 20,
    modules: 10,
    completed: 2,
    color: 'from-amber-500/20 to-orange-500/20',
    icon: Target,
  },
]

const SAMPLE_MODULES: LearningModule[] = [
  { id: '1', title: 'Git Workflow & Branch Strategy', description: 'Learn our branching model and PR review process', type: 'hands-on', duration: '45 min', status: 'completed', progress: 100, xp: 50, category: 'Technical' },
  { id: '2', title: 'Architecture Overview', description: 'Understand our microservices architecture and domain model', type: 'video', duration: '30 min', status: 'completed', progress: 100, xp: 40, category: 'Technical' },
  { id: '3', title: 'CI/CD Pipeline Deep Dive', description: 'How our deployment pipeline works end to end', type: 'reading', duration: '20 min', status: 'in_progress', progress: 60, xp: 35, category: 'Technical' },
  { id: '4', title: 'Testing Best Practices', description: 'Unit, integration, and E2E testing standards', type: 'hands-on', duration: '60 min', status: 'available', progress: 0, xp: 60, category: 'Technical' },
  { id: '5', title: 'Company Values Workshop', description: 'Interactive session on our core values and mission', type: 'workshop', duration: '90 min', status: 'completed', progress: 100, xp: 75, category: 'Culture' },
  { id: '6', title: 'Security Awareness Training', description: 'Required security and compliance certification', type: 'quiz', duration: '30 min', status: 'available', progress: 0, xp: 45, category: 'Compliance' },
  { id: '7', title: 'Design System Introduction', description: 'Our component library, design tokens, and patterns', type: 'reading', duration: '25 min', status: 'locked', progress: 0, xp: 30, category: 'Tools' },
  { id: '8', title: 'First Feature Deployment', description: 'Deploy your first feature to staging environment', type: 'hands-on', duration: '120 min', status: 'locked', progress: 0, xp: 100, category: 'Technical' },
]

function getTypeIcon(type: string) {
  switch (type) {
    case 'video': return <Video className="h-3.5 w-3.5" />
    case 'reading': return <FileText className="h-3.5 w-3.5" />
    case 'hands-on': return <Code className="h-3.5 w-3.5" />
    case 'quiz': return <Award className="h-3.5 w-3.5" />
    case 'workshop': return <Users className="h-3.5 w-3.5" />
    default: return <BookOpen className="h-3.5 w-3.5" />
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'in_progress': return 'bg-primary/10 text-primary border-primary/20'
    case 'available': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    case 'locked': return 'bg-muted/50 text-muted-foreground border-border/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function LearningPath({ sampleMode, onActiveAgent }: LearningPathProps) {
  const [modules] = useState<LearningModule[]>(SAMPLE_MODULES)
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)
  const [recommendation, setRecommendation] = useState('')
  const [loadingRec, setLoadingRec] = useState(false)

  const totalXP = modules.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.xp, 0)
  const maxXP = modules.reduce((sum, m) => sum + m.xp, 0)
  const overallProgress = Math.round((modules.filter(m => m.status === 'completed').length / modules.length) * 100)

  const handleGetRecommendation = async () => {
    setLoadingRec(true)
    onActiveAgent(ROLE_RAMP_ID)
    try {
      const result = await callAIAgent(
        `Based on a new hire who has completed modules about Git, Architecture, and Company Values, with CI/CD in progress, what learning module should they focus on next and why?`,
        ROLE_RAMP_ID
      )
      const data = result?.response?.result
      setRecommendation(typeof data === 'string' ? data : data?.message ?? 'Focus on completing the CI/CD Pipeline module next, then move to Testing Best Practices.')
    } catch {
      setRecommendation('Complete the CI/CD module to unlock hands-on deployment training.')
    } finally {
      setLoadingRec(false)
      onActiveAgent(null)
    }
  }

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Overall Progress', value: `${overallProgress}%`, sub: `${modules.filter(m => m.status === 'completed').length}/${modules.length} modules`, color: 'text-primary' },
          { label: 'XP Earned', value: totalXP.toString(), sub: `of ${maxXP} total`, color: 'text-amber-600' },
          { label: 'Current Streak', value: '5 days', sub: 'Keep it going!', color: 'text-emerald-600' },
          { label: 'Time Invested', value: '4.5 hrs', sub: 'This week', color: 'text-accent' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Learning Tracks */}
      <div className="grid grid-cols-4 gap-3">
        {SAMPLE_TRACKS.map((track, i) => {
          const Icon = track.icon
          return (
            <div key={i} className="glass-card p-3.5 hover:scale-[1.02] transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-2.5`}>
                <Icon className="h-5 w-5 text-foreground/70" />
              </div>
              <p className="text-xs font-semibold mb-0.5">{track.name}</p>
              <p className="text-[10px] text-muted-foreground mb-2">{track.completed}/{track.modules} complete</p>
              <Progress value={track.progress} className="h-1.5" />
            </div>
          )
        })}
      </div>

      {/* Modules List + Detail */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Module List */}
        <div className="flex-[3] glass-card p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Learning Modules
            </h4>
            <Button
              size="sm"
              onClick={handleGetRecommendation}
              disabled={loadingRec}
              className="glass-button text-xs text-foreground h-7 px-3"
            >
              {loadingRec ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Star className="h-3 w-3 mr-1 text-amber-500" />}
              Get AI Recommendation
            </Button>
          </div>

          {recommendation && (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 glass-sm">
              <p className="text-xs leading-relaxed text-foreground/80">
                <span className="font-semibold text-primary">AI Recommendation: </span>
                {recommendation}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                disabled={mod.status === 'locked'}
                className={`w-full text-left p-3 rounded-xl glass-sm flex items-center gap-3 transition-all duration-200 ${
                  mod.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.005] cursor-pointer'
                } ${selectedModule?.id === mod.id ? 'glass-active' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  mod.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                  mod.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                  mod.status === 'locked' ? 'bg-muted text-muted-foreground' :
                  'bg-amber-500/10 text-amber-600'
                }`}>
                  {mod.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                   mod.status === 'locked' ? <Lock className="h-4 w-4" /> :
                   mod.status === 'in_progress' ? <Play className="h-4 w-4" /> :
                   getTypeIcon(mod.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium truncate">{mod.title}</p>
                    <Badge variant="outline" className={`text-[9px] px-1.5 ${getStatusStyle(mod.status)}`}>{mod.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{mod.description}</p>
                  {mod.status === 'in_progress' && (
                    <Progress value={mod.progress} className="h-1 mt-1.5" />
                  )}
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{mod.duration}</span>
                  <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1"><Zap className="h-2.5 w-2.5" />{mod.xp} XP</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-[2] glass-card p-5 flex flex-col">
          {selectedModule ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedModule.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                  'bg-primary/10 text-primary'
                }`}>
                  {getTypeIcon(selectedModule.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-0.5">{selectedModule.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedModule.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="glass-sm rounded-xl p-2.5 text-center">
                  <p className="text-xs font-semibold">{selectedModule.duration}</p>
                  <p className="text-[10px] text-muted-foreground">Duration</p>
                </div>
                <div className="glass-sm rounded-xl p-2.5 text-center">
                  <p className="text-xs font-semibold capitalize">{selectedModule.type}</p>
                  <p className="text-[10px] text-muted-foreground">Format</p>
                </div>
                <div className="glass-sm rounded-xl p-2.5 text-center">
                  <p className="text-xs font-semibold text-amber-600">{selectedModule.xp} XP</p>
                  <p className="text-[10px] text-muted-foreground">Reward</p>
                </div>
              </div>

              {selectedModule.status === 'in_progress' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs text-primary font-semibold">{selectedModule.progress}%</span>
                  </div>
                  <Progress value={selectedModule.progress} className="h-2" />
                </div>
              )}

              <div className="mt-auto">
                {selectedModule.status === 'completed' ? (
                  <div className="p-3 glass-sm rounded-xl text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-emerald-600">Module Completed</p>
                    <p className="text-xs text-muted-foreground">+{selectedModule.xp} XP earned</p>
                  </div>
                ) : selectedModule.status !== 'locked' ? (
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    {selectedModule.status === 'in_progress' ? 'Continue Learning' : 'Start Module'}
                  </Button>
                ) : (
                  <div className="p-3 glass-sm rounded-xl text-center">
                    <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Complete prerequisite modules to unlock</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl glass-sm flex items-center justify-center mb-3">
                <BookOpen className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold text-base mb-1">Select a Module</h3>
              <p className="text-xs text-muted-foreground max-w-[200px]">Click a module to view details and continue learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
