'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
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
  MessageCircle,
  CheckSquare,
  TrendingUp,
  Clipboard,
  Gift,
  Heart,
  GraduationCap,
  GitBranch,
  Zap,
} from 'lucide-react'

import EmployeeConcierge from '@/components/onboardiq/EmployeeConcierge'
import ManagerCommandCenter from '@/components/onboardiq/ManagerCommandCenter'

// Agent info for status display
const AGENTS = [
  { id: '69a1939b12618822e8a2dcd9', name: 'Orchestrator', purpose: 'Routes employee queries', icon: Compass },
  { id: '69a19384fcc35a3ce8368482', name: 'Day Zero', purpose: 'Pre-boarding & docs', icon: Shield },
  { id: '69a19369fcc35a3ce836847c', name: 'Tool Concierge', purpose: 'Policies & tools', icon: Sparkles },
  { id: '69a19369177bcf99abd099e8', name: 'Role Ramp', purpose: 'Milestones & training', icon: Target },
  { id: '69a1936af2417c8ef5b385bd', name: 'Check-In', purpose: 'Sentiment & culture', icon: MessageSquare },
  { id: '69a1936af0b6b0621c8ec9a3', name: 'Checkpoint', purpose: '30/60/90-day reviews', icon: BarChart3 },
  { id: '69a1936a78bb4ecc77c12d22', name: 'Insights', purpose: 'Analytics & risks', icon: Activity },
  { id: '69a1936afcc35a3ce836847e', name: 'Enablement', purpose: 'Coaching suggestions', icon: BookOpen },
]

type ViewType = 'employee' | 'manager'

// Section definitions for each view
type EmployeeSection = 'concierge' | 'tasks' | 'progress' | 'buddy' | 'learning' | 'feedback' | 'welcome' | 'knowledge'
type ManagerSection = 'dashboard' | 'team' | 'pipeline' | 'checkpoint' | 'coaching' | 'compliance' | 'actions' | 'knowledge'

interface SidebarItem {
  key: string
  label: string
  description: string
  icon: React.ElementType
  badge?: string
}

const EMPLOYEE_SECTIONS: SidebarItem[] = [
  { key: 'concierge', label: 'AI Concierge', description: 'Chat with your assistant', icon: MessageCircle },
  { key: 'welcome', label: 'Welcome Kit', description: 'Setup checklist & links', icon: Gift, badge: 'Start' },
  { key: 'tasks', label: 'Daily Tasks', description: 'Today\'s checklist', icon: CheckSquare },
  { key: 'progress', label: 'Progress', description: 'Milestones & journey', icon: TrendingUp },
  { key: 'learning', label: 'Learning Path', description: 'Courses & modules', icon: GraduationCap },
  { key: 'buddy', label: 'Buddy System', description: 'Your onboarding buddy', icon: Users },
  { key: 'feedback', label: 'Feedback Hub', description: 'Check-ins & pulse', icon: Heart },
  { key: 'knowledge', label: 'Knowledge Base', description: 'Policies & documents', icon: Database },
]

const MANAGER_SECTIONS: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'KPIs & risk alerts', icon: LayoutDashboard },
  { key: 'pipeline', label: 'Pipeline', description: 'Kanban board view', icon: GitBranch, badge: 'New' },
  { key: 'team', label: 'Team Overview', description: 'View hire details', icon: Users },
  { key: 'actions', label: 'Action Center', description: 'Priority task queue', icon: Zap, badge: '3' },
  { key: 'checkpoint', label: 'Checkpoints', description: '30/60/90-day reviews', icon: Clipboard },
  { key: 'coaching', label: 'Coaching', description: 'Enablement tools', icon: MessageSquare },
  { key: 'compliance', label: 'Compliance', description: 'Documents & tracking', icon: Shield },
  { key: 'knowledge', label: 'Knowledge Base', description: 'Playbooks & docs', icon: Database },
]

// Header title mapping
function getSectionTitle(view: ViewType, section: string): string {
  const all = [...EMPLOYEE_SECTIONS, ...MANAGER_SECTIONS]
  return all.find(s => s.key === section)?.label ?? section
}

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>('employee')
  const [employeeSection, setEmployeeSection] = useState<EmployeeSection>('concierge')
  const [managerSection, setManagerSection] = useState<ManagerSection>('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [showAgentPanel, setShowAgentPanel] = useState(false)

  const isEmployeeView = activeView === 'employee'
  const currentSections = isEmployeeView ? EMPLOYEE_SECTIONS : MANAGER_SECTIONS
  const currentSection = isEmployeeView ? employeeSection : managerSection
  const setCurrentSection = (key: string) => {
    if (isEmployeeView) setEmployeeSection(key as EmployeeSection)
    else setManagerSection(key as ManagerSection)
  }

  return (
    <div className="min-h-screen glass-gradient-bg text-foreground flex" style={{ letterSpacing: '0.01em', lineHeight: '1.65' }}>
      {/* Left Sidebar */}
      <aside className="w-[252px] glass-sidebar flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-wide text-foreground leading-tight">OnboardIQ</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Intelligent Onboarding</p>
            </div>
          </div>
        </div>

        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        {/* View Toggle */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center glass-sm rounded-xl p-1">
            <button
              onClick={() => setActiveView('employee')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-300',
                isEmployeeView
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="h-3.5 w-3.5" />
              Employee
            </button>
            <button
              onClick={() => setActiveView('manager')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-300',
                !isEmployeeView
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Manager
            </button>
          </div>
        </div>

        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        {/* Section Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-3 pt-2 pb-1.5">
            {isEmployeeView ? 'Your Workspace' : 'Management'}
          </p>
          {currentSections.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.key
            return (
              <button
                key={item.key}
                onClick={() => setCurrentSection(item.key)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                  isActive
                    ? 'glass-active bg-primary/12 shadow-sm'
                    : 'hover:bg-white/20 text-foreground/80 hover:text-foreground'
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-white/30 text-muted-foreground'
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-[13px] font-medium leading-tight',
                    isActive ? 'text-primary' : ''
                  )}>{item.label}</p>
                  <p className={cn(
                    'text-[10px] leading-tight mt-0.5',
                    isActive ? 'text-primary/60' : 'text-muted-foreground'
                  )}>{item.description}</p>
                </div>
                {item.badge && (
                  <Badge className={cn(
                    'text-[9px] px-1.5 h-4',
                    item.badge === 'New' || item.badge === 'Start'
                      ? 'bg-primary/15 text-primary border-primary/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  )}>
                    {item.badge}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        {/* Agent Status */}
        <div className="p-2">
          <button
            onClick={() => setShowAgentPanel(!showAgentPanel)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/20 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">AI Agents</span>
            <div className="flex items-center gap-1.5">
              {activeAgentId && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <Badge className="glass-badge text-[9px] px-1.5 h-4">{AGENTS.length}</Badge>
              {showAgentPanel ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </div>
          </button>
          {showAgentPanel && (
            <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto px-1">
              {AGENTS.map((agent) => {
                const Icon = agent.icon
                const isActive = activeAgentId === agent.id
                return (
                  <div
                    key={agent.id}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all',
                      isActive ? 'glass-sm' : ''
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[10px] font-medium truncate', isActive ? 'text-foreground' : 'text-foreground/60')}>{agent.name}</p>
                    </div>
                    {isActive && <CircleDot className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" />}
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
        <header className="h-14 glass-lg px-6 flex items-center justify-between flex-shrink-0 border-b border-white/20">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-base tracking-wide">
              {getSectionTitle(activeView, currentSection)}
            </h2>
            <Badge className="glass-badge text-[10px]">
              {isEmployeeView ? 'New Hire' : 'HR Manager'}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {/* Agent Activity */}
            {activeAgentId && (
              <div className="flex items-center gap-2 text-xs glass-sm px-3 py-1.5 rounded-full text-foreground/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">{AGENTS.find(a => a.id === activeAgentId)?.name ?? 'Agent'} processing...</span>
              </div>
            )}

            <div className="w-px h-6 bg-border/30" />

            {/* Sample Data */}
            <div className="flex items-center gap-2">
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
              <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={setSampleMode} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-5 overflow-hidden">
          {activeView === 'employee' && (
            <EmployeeConcierge
              sampleMode={sampleMode}
              onActiveAgent={setActiveAgentId}
              activeSection={employeeSection}
            />
          )}
          {activeView === 'manager' && (
            <ManagerCommandCenter
              sampleMode={sampleMode}
              onActiveAgent={setActiveAgentId}
              activeSection={managerSection}
            />
          )}
        </main>
      </div>
    </div>
  )
}
