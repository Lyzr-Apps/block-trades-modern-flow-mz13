'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Calendar,
  Users,
  ChevronRight,
  Loader2,
  ArrowRight,
  Bell,
  Target,
  TrendingDown,
  Mail,
  Video,
  FileText,
  RefreshCw,
  Star,
  Eye,
} from 'lucide-react'

const ENABLEMENT_ID = '69a1936afcc35a3ce836847e'
const INSIGHTS_ID = '69a1936a78bb4ecc77c12d22'

interface ActionItem {
  id: string
  title: string
  description: string
  type: 'urgent' | 'followup' | 'scheduled' | 'suggestion'
  hireName: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  dueDate: string
  action: string
  status: 'pending' | 'done' | 'snoozed'
}

interface ActionCenterProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

const SAMPLE_ACTIONS: ActionItem[] = [
  { id: '1', title: 'Maria Lopez - Stalled Progress', description: 'Onboarding completion stuck at 30% for 5 days. Multiple training modules incomplete.', type: 'urgent', hireName: 'Maria Lopez', priority: 'critical', dueDate: 'Today', action: 'Schedule 1:1 meeting', status: 'pending' },
  { id: '2', title: 'James Park - Low Tool Adoption', description: 'Only 45% of recommended design tools set up. May need peer pairing session.', type: 'urgent', hireName: 'James Park', priority: 'high', dueDate: 'Today', action: 'Assign buddy session', status: 'pending' },
  { id: '3', title: 'Sarah Chen - 30-Day Checkpoint Due', description: 'Approaching 30-day mark. Schedule formal checkpoint review.', type: 'scheduled', hireName: 'Sarah Chen', priority: 'medium', dueDate: 'Jan 20', action: 'Run checkpoint review', status: 'pending' },
  { id: '4', title: 'Team Sentiment Check', description: 'Weekly team pulse survey is due. 3 new hires have not responded.', type: 'followup', hireName: 'Multiple', priority: 'medium', dueDate: 'Jan 18', action: 'Send reminders', status: 'pending' },
  { id: '5', title: 'Alex Kumar - Exceeding Expectations', description: 'Ramp velocity at 85%, ahead of schedule. Consider accelerated track.', type: 'suggestion', hireName: 'Alex Kumar', priority: 'low', dueDate: 'This week', action: 'Review accelerated path', status: 'pending' },
  { id: '6', title: 'Emily Taylor - Ready for Graduation', description: '88% completion, excellent sentiment. Prepare graduation review.', type: 'suggestion', hireName: 'Emily Taylor', priority: 'medium', dueDate: 'Jan 22', action: 'Prepare graduation', status: 'pending' },
  { id: '7', title: 'Compliance Docs Overdue', description: 'Maria Lopez has 2 overdue compliance documents. Send escalation reminder.', type: 'urgent', hireName: 'Maria Lopez', priority: 'critical', dueDate: 'Overdue', action: 'Escalate to HR', status: 'pending' },
  { id: '8', title: 'New Hire Welcome - Ryan Foster', description: 'Ryan starts next Monday. Ensure pre-boarding tasks are assigned.', type: 'scheduled', hireName: 'Ryan Foster', priority: 'high', dueDate: 'Jan 22', action: 'Assign tasks', status: 'pending' },
]

function getTypeIcon(type: string) {
  switch (type) {
    case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'followup': return <Bell className="h-4 w-4 text-amber-500" />
    case 'scheduled': return <Calendar className="h-4 w-4 text-primary" />
    case 'suggestion': return <Star className="h-4 w-4 text-emerald-500" />
    default: return <Zap className="h-4 w-4 text-muted-foreground" />
  }
}

function getTypeStyle(type: string) {
  switch (type) {
    case 'urgent': return 'from-red-500/10 to-red-600/5 border-red-500/20'
    case 'followup': return 'from-amber-500/10 to-amber-600/5 border-amber-500/20'
    case 'scheduled': return 'from-blue-500/10 to-indigo-500/5 border-blue-500/20'
    case 'suggestion': return 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20'
    default: return ''
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    default: return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  }
}

function getActionIcon(action: string) {
  if (action.includes('meeting') || action.includes('1:1')) return <Video className="h-3 w-3" />
  if (action.includes('email') || action.includes('Send') || action.includes('reminder')) return <Mail className="h-3 w-3" />
  if (action.includes('review') || action.includes('checkpoint')) return <FileText className="h-3 w-3" />
  return <ArrowRight className="h-3 w-3" />
}

export default function ActionCenter({ sampleMode, onActiveAgent }: ActionCenterProps) {
  const [actions, setActions] = useState<ActionItem[]>(SAMPLE_ACTIONS)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')

  const filteredActions = actions.filter(a => {
    if (filter === 'all') return a.status !== 'done'
    return a.type === filter && a.status !== 'done'
  })

  const urgentCount = actions.filter(a => a.type === 'urgent' && a.status !== 'done').length
  const pendingCount = actions.filter(a => a.status === 'pending').length
  const doneToday = actions.filter(a => a.status === 'done').length

  const markDone = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'done' as const } : a))
  }

  const handleGetSuggestions = async () => {
    setLoading(true)
    onActiveAgent(ENABLEMENT_ID)
    try {
      const result = await callAIAgent(
        'Review the current onboarding action items and provide prioritized recommendations for the manager. Focus on at-risk hires and upcoming deadlines.',
        ENABLEMENT_ID
      )
      const data = result?.response?.result
      setAiSuggestion(typeof data === 'string' ? data : data?.message ?? 'Prioritize Maria Lopez - schedule an immediate 1:1 to address stalled progress and compliance gaps.')
    } catch {
      setAiSuggestion('Focus on urgent items first: address stalled progress for at-risk hires, then handle overdue compliance documents.')
    } finally {
      setLoading(false)
      onActiveAgent(null)
    }
  }

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 bg-gradient-to-br from-red-500/5 to-red-600/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Urgent</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500">{urgentCount}</p>
          <p className="text-[10px] text-muted-foreground">need immediate action</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">total actions</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Completed Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-500">{doneToday}</p>
          <p className="text-[10px] text-muted-foreground">well done!</p>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="glass-card p-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            AI Priority Assistant
          </h4>
          <Button
            size="sm"
            onClick={handleGetSuggestions}
            disabled={loading}
            className="glass-button text-xs text-foreground h-7 px-3"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Get Suggestions
          </Button>
        </div>
        {aiSuggestion ? (
          <p className="text-sm leading-relaxed text-foreground/80">{aiSuggestion}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Click "Get Suggestions" for AI-powered action prioritization</p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        <div className="glass-sm rounded-lg flex overflow-hidden">
          {[
            { key: 'all', label: 'All' },
            { key: 'urgent', label: 'Urgent' },
            { key: 'followup', label: 'Follow-up' },
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'suggestion', label: 'Suggestions' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Badge className="glass-badge text-[10px]">{filteredActions.length} actions</Badge>
      </div>

      {/* Action Items List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`glass-card p-4 bg-gradient-to-r ${getTypeStyle(action.type)} transition-all hover:scale-[1.002]`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getTypeIcon(action.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{action.title}</h4>
                  <Badge variant="outline" className={`text-[8px] px-1 ${getPriorityStyle(action.priority)}`}>{action.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{action.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="h-2.5 w-2.5" /> {action.hireName}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {action.dueDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => markDone(action.id)}
                  className="bg-primary hover:bg-primary/90 text-xs h-7 px-3 rounded-lg"
                >
                  {getActionIcon(action.action)}
                  <span className="ml-1.5">{action.action}</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markDone(action.id)}
                  className="glass-button text-xs h-7 px-3 text-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filteredActions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl glass-sm flex items-center justify-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
            </div>
            <h3 className="font-semibold text-base mb-1">All Clear</h3>
            <p className="text-xs text-muted-foreground">No pending actions in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
