'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  LayoutDashboard,
  BookOpen,
  Bot,
  ChevronRight,
  Activity,
  Shield,
  Compass,
  Target,
  MessageSquare,
  BarChart3,
  Sparkles,
  CircleDot,
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

const NAV_ITEMS: { key: ViewType; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'employee', label: 'Employee View', icon: Users, description: 'Onboarding concierge' },
  { key: 'manager', label: 'Manager View', icon: LayoutDashboard, description: 'Command center' },
  { key: 'knowledge', label: 'Knowledge Base', icon: BookOpen, description: 'Document management' },
]

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>('employee')
  const [sampleMode, setSampleMode] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [showAgentPanel, setShowAgentPanel] = useState(false)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex" style={{ letterSpacing: '0.01em', lineHeight: '1.65' }}>
        {/* Sidebar */}
        <aside className="w-64 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col flex-shrink-0">
          {/* Logo */}
          <div className="p-5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-semibold text-lg tracking-wide text-foreground">OnboardIQ</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Intelligent Onboarding</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[hsl(var(--sidebar-border))]" />

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]'
                      : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]'
                  )}
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className={cn('text-[10px]', isActive ? 'text-[hsl(var(--sidebar-primary-foreground))]/70' : 'text-muted-foreground')}>{item.description}</p>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              )
            })}
          </nav>

          <Separator className="bg-[hsl(var(--sidebar-border))]" />

          {/* Agent Status */}
          <div className="p-3">
            <button
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
            >
              <span className="text-xs font-medium text-[hsl(var(--sidebar-foreground))]">AI Agents</span>
              <div className="flex items-center gap-1.5">
                {activeAgentId && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <Badge variant="secondary" className="text-[9px] px-1.5">{AGENTS.length}</Badge>
              </div>
            </button>

            {showAgentPanel && (
              <div className="mt-1 space-y-0.5 max-h-52 overflow-y-auto">
                {AGENTS.map((agent) => {
                  const Icon = agent.icon
                  const isActive = activeAgentId === agent.id
                  return (
                    <div
                      key={agent.id}
                      className={cn(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors',
                        isActive ? 'bg-accent/20' : ''
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        {isActive && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-[10px] font-medium truncate', isActive ? 'text-accent-foreground' : 'text-[hsl(var(--sidebar-foreground))]')}>{agent.name}</p>
                        <p className="text-[8px] text-muted-foreground truncate">{agent.purpose}</p>
                      </div>
                      {isActive && (
                        <CircleDot className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <header className="h-14 bg-card border-b border-border/20 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="font-serif font-semibold text-base tracking-wide">
                {activeView === 'employee' && 'Employee Concierge'}
                {activeView === 'manager' && 'Manager Command Center'}
                {activeView === 'knowledge' && 'Knowledge Base'}
              </h2>
              <Badge variant="outline" className="text-[10px] border-border/30">
                {activeView === 'employee' && 'New Hire'}
                {activeView === 'manager' && 'HR Manager'}
                {activeView === 'knowledge' && 'Admin'}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Agent Activity Indicator */}
              {activeAgentId && (
                <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">{AGENTS.find(a => a.id === activeAgentId)?.name ?? 'Agent'} processing...</span>
                </div>
              )}

              {/* Sample Data Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
                <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={setSampleMode} />
              </div>
            </div>
          </header>

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
      </div>
    </ErrorBoundary>
  )
}
