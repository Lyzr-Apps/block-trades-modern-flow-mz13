'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Users,
  LayoutDashboard,
  BookOpen,
  Bot,
  Activity,
  Shield,
  Compass,
  Target,
  MessageSquare,
  BarChart3,
  Sparkles,
  CircleDot,
  ChevronDown,
  ChevronUp,
  Database,
} from 'lucide-react'

import EmployeeConcierge from './sections/EmployeeConcierge'
import ManagerCommandCenter from './sections/ManagerCommandCenter'
import KnowledgeBasePanel from './sections/KnowledgeBasePanel'

// ErrorBoundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Agent info for status display
const AGENTS = [
  { id: '69a1939b12618822e8a2dcd9', name: 'Orchestrator', purpose: 'Routes employee queries to sub-agents', icon: Compass },
  { id: '69a19384fcc35a3ce8368482', name: 'Day Zero Readiness', purpose: 'Pre-boarding docs, IT, meetings', icon: Shield },
  { id: '69a19369fcc35a3ce836847c', name: 'Tool Concierge', purpose: 'Policies, tools, daily tasks', icon: Sparkles },
  { id: '69a19369177bcf99abd099e8', name: 'Role Ramp', purpose: 'Role-specific milestones & training', icon: Target },
  { id: '69a1936af2417c8ef5b385bd', name: 'Check-In Culture', purpose: 'Sentiment tracking & culture', icon: MessageSquare },
  { id: '69a1936af0b6b0621c8ec9a3', name: 'Checkpoint', purpose: '30/60/90-day reviews', icon: BarChart3 },
  { id: '69a1936a78bb4ecc77c12d22', name: 'Insights', purpose: 'Team analytics & risk alerts', icon: Activity },
  { id: '69a1936afcc35a3ce836847e', name: 'Enablement', purpose: 'Manager coaching suggestions', icon: BookOpen },
]

type ViewType = 'employee' | 'manager' | 'knowledge'

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>('employee')
  const [sampleMode, setSampleMode] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [showAgentPanel, setShowAgentPanel] = useState(false)

  const isEmployeeView = activeView === 'employee'
  const isManagerView = activeView === 'manager'
  const isKnowledgeView = activeView === 'knowledge'

  const handleToggle = () => {
    if (isKnowledgeView) {
      setActiveView('employee')
      return
    }
    setActiveView(isEmployeeView ? 'manager' : 'employee')
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ letterSpacing: '0.01em', lineHeight: '1.65' }}>
        {/* Header */}
        <header className="h-16 bg-card border-b border-border/20 px-6 flex items-center justify-between flex-shrink-0">
          {/* Left: Logo + Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg tracking-wide text-foreground leading-tight">OnboardIQ</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Intelligent Onboarding</p>
            </div>
          </div>

          {/* Center: Employee / Manager Toggle */}
          <div className="flex items-center">
            {!isKnowledgeView ? (
              <div className="flex items-center bg-secondary/60 rounded-full p-1 border border-border/20">
                <button
                  onClick={() => setActiveView('employee')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isEmployeeView
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  Employee View
                </button>
                <button
                  onClick={() => setActiveView('manager')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isManagerView
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Manager View
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView('employee')}
                  className="text-xs"
                >
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Back to Views
                </Button>
                <Badge variant="secondary" className="text-xs px-3 py-1">Knowledge Base</Badge>
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Agent Activity Indicator */}
            {activeAgentId && (
              <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">{AGENTS.find(a => a.id === activeAgentId)?.name ?? 'Agent'} processing...</span>
              </div>
            )}

            {/* Knowledge Base Button */}
            {!isKnowledgeView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView('knowledge')}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
              >
                <Database className="h-3.5 w-3.5 mr-1.5" />
                KB
              </Button>
            )}

            <Separator orientation="vertical" className="h-6 bg-border/30" />

            {/* Sample Data Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
              <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={setSampleMode} />
            </div>

            <Separator orientation="vertical" className="h-6 bg-border/30" />

            {/* Agent Status Dropdown */}
            <button
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className="relative flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-secondary/50"
            >
              <Bot className="h-3.5 w-3.5" />
              <span className="font-medium">Agents</span>
              <Badge variant="secondary" className="text-[9px] px-1.5 h-4">{AGENTS.length}</Badge>
              {activeAgentId && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {showAgentPanel ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </header>

        {/* Agent Status Dropdown Panel */}
        {showAgentPanel && (
          <div className="bg-card border-b border-border/20 px-6 py-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              {AGENTS.map((agent) => {
                const Icon = agent.icon
                const isActive = activeAgentId === agent.id
                return (
                  <div
                    key={agent.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors flex-shrink-0',
                      isActive
                        ? 'bg-accent/15 border-accent/30'
                        : 'bg-background border-border/10'
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-[11px] font-medium', isActive ? 'text-accent-foreground' : 'text-foreground')}>{agent.name}</p>
                      <p className="text-[9px] text-muted-foreground whitespace-nowrap">{agent.purpose}</p>
                    </div>
                    {isActive && (
                      <CircleDot className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-5 overflow-hidden">
          {activeView === 'employee' && (
            <EmployeeConcierge sampleMode={sampleMode} onActiveAgent={setActiveAgentId} />
          )}
          {activeView === 'manager' && (
            <ManagerCommandCenter sampleMode={sampleMode} onActiveAgent={setActiveAgentId} />
          )}
          {activeView === 'knowledge' && (
            <KnowledgeBasePanel sampleMode={sampleMode} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}
