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
type EmployeeSection = 'concierge' | 'tasks' | 'progress' | 'knowledge'
type ManagerSection = 'dashboard' | 'team' | 'checkpoint' | 'coaching' | 'knowledge'

interface SidebarItem {
  key: string
  label: string
  description: string
  icon: React.ElementType
}

const EMPLOYEE_SECTIONS: SidebarItem[] = [
  { key: 'concierge', label: 'AI Concierge', description: 'Chat with your assistant', icon: MessageCircle },
  { key: 'tasks', label: 'Daily Tasks', description: 'Today\'s checklist', icon: CheckSquare },
  { key: 'progress', label: 'Progress & Milestones', description: 'Track your journey', icon: TrendingUp },
  { key: 'knowledge', label: 'Knowledge Base', description: 'Policies & documents', icon: Database },
]

const MANAGER_SECTIONS: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'KPIs & risk alerts', icon: LayoutDashboard },
  { key: 'team', label: 'Team Overview', description: 'View hire details', icon: Users },
  { key: 'checkpoint', label: 'Checkpoint Review', description: '30/60/90-day reviews', icon: Clipboard },
  { key: 'coaching', label: 'Coaching', description: 'Suggestions & enablement', icon: MessageSquare },
  { key: 'knowledge', label: 'Knowledge Base', description: 'Playbooks & docs', icon: Database },
]

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
      <div className="min-h-screen bg-background text-foreground flex" style={{ letterSpacing: '0.01em', lineHeight: '1.65' }}>
        {/* Left Sidebar */}
        <aside className="w-60 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col flex-shrink-0">
          {/* Logo */}
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-semibold text-lg tracking-wide text-foreground leading-tight">OnboardIQ</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Intelligent Onboarding</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[hsl(var(--sidebar-border))]" />

          {/* View Toggle */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center bg-secondary/60 rounded-lg p-0.5 border border-border/20">
              <button
                onClick={() => setActiveView('employee')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all duration-200',
                  isEmployeeView
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Users className="h-3.5 w-3.5" />
                Employee
              </button>
              <button
                onClick={() => setActiveView('manager')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all duration-200',
                  !isEmployeeView
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Manager
              </button>
            </div>
          </div>

          <Separator className="bg-[hsl(var(--sidebar-border))]" />

          {/* Section Navigation */}
          <nav className="flex-1 p-2 space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-3 pt-2 pb-1.5">
              {isEmployeeView ? 'Employee Sections' : 'Manager Sections'}
            </p>
            {currentSections.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentSection(item.key)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150',
                    isActive
                      ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-sm'
                      : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.label}</p>
                    <p className={cn(
                      'text-[10px] leading-tight mt-0.5',
                      isActive ? 'text-[hsl(var(--sidebar-primary-foreground))]/70' : 'text-muted-foreground'
                    )}>{item.description}</p>
                  </div>
                </button>
              )
            })}
          </nav>

          <Separator className="bg-[hsl(var(--sidebar-border))]" />

          {/* Agent Status */}
          <div className="p-2">
            <button
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">AI Agents</span>
              <div className="flex items-center gap-1.5">
                {activeAgentId && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <Badge variant="secondary" className="text-[9px] px-1.5 h-4">{AGENTS.length}</Badge>
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
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors',
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
          <header className="h-14 bg-card border-b border-border/20 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="font-serif font-semibold text-base tracking-wide">
                {isEmployeeView ? (
                  <>
                    {employeeSection === 'concierge' && 'AI Concierge'}
                    {employeeSection === 'tasks' && 'Daily Tasks'}
                    {employeeSection === 'progress' && 'Progress & Milestones'}
                    {employeeSection === 'knowledge' && 'Knowledge Base'}
                  </>
                ) : (
                  <>
                    {managerSection === 'dashboard' && 'Dashboard'}
                    {managerSection === 'team' && 'Team Overview'}
                    {managerSection === 'checkpoint' && 'Checkpoint Review'}
                    {managerSection === 'coaching' && 'Coaching Suggestions'}
                    {managerSection === 'knowledge' && 'Knowledge Base'}
                  </>
                )}
              </h2>
              <Badge variant="outline" className="text-[10px] border-border/30">
                {isEmployeeView ? 'New Hire' : 'HR Manager'}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {/* Agent Activity */}
              {activeAgentId && (
                <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">{AGENTS.find(a => a.id === activeAgentId)?.name ?? 'Agent'} processing...</span>
                </div>
              )}

              <Separator orientation="vertical" className="h-6 bg-border/30" />

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
