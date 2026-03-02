'use client'

import React, { useState, useRef, useEffect } from 'react'
import { callAIAgent, AIAgentResponse } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Monitor,
  Users,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import EmployeeKnowledgeBase from './EmployeeKnowledgeBase'
import BuddySystem from './BuddySystem'
import LearningPath from './LearningPath'
import FeedbackHub from './FeedbackHub'
import WelcomeKit from './WelcomeKit'

const ORCHESTRATOR_ID = '69a1939b12618822e8a2dcd9'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  routedTo?: string
  category?: string
  actionItems?: ActionItem[]
  nextSteps?: string[]
  completionPercentage?: number
  currentPhase?: string
}

interface ActionItem {
  task: string
  category: string
  priority: string
  status: string
}

interface SampleTask {
  id: string
  task: string
  category: string
  completed: boolean
  priority: string
}

interface EmployeeConciergeProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
  activeSection: string
}

const PHASES = ['Pre-Start', 'Week 1', '30 Day', '60 Day', '90 Day']

const SAMPLE_TASKS: SampleTask[] = [
  { id: '1', task: 'Complete I-9 verification form', category: 'Documents', completed: true, priority: 'high' },
  { id: '2', task: 'Set up VPN and dev environment', category: 'Tools', completed: false, priority: 'high' },
  { id: '3', task: 'Team intro meeting with engineering', category: 'Meetings', completed: true, priority: 'medium' },
  { id: '4', task: 'Review company handbook', category: 'Culture', completed: false, priority: 'medium' },
  { id: '5', task: 'Complete security awareness training', category: 'Training', completed: false, priority: 'high' },
  { id: '6', task: 'Set up benefits enrollment', category: 'Documents', completed: false, priority: 'low' },
]

const SAMPLE_MILESTONES = [
  { label: 'Day 1 Orientation', completed: true, date: 'Jan 15' },
  { label: 'IT Setup Complete', completed: true, date: 'Jan 16' },
  { label: 'First Team Standup', completed: false, date: 'Jan 17' },
  { label: '1:1 with Manager', completed: false, date: 'Jan 20' },
  { label: 'First Sprint Demo', completed: false, date: 'Feb 1' },
]

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: 's1',
    role: 'assistant',
    content: 'Welcome to your onboarding journey! I\'m here to help you through every step. You\'re currently in **Week 1** with **45%** of your tasks completed.\n\nHere are your priorities for today:\n- Complete your I-9 verification\n- Set up your VPN access\n- Join the team intro meeting at 2pm\n\nFeel free to ask me about company policies, tool setup, or anything else!',
    timestamp: new Date(Date.now() - 3600000),
    routedTo: 'Day Zero Readiness',
    category: 'day_zero',
    completionPercentage: 45,
    currentPhase: 'Week 1',
  },
  {
    id: 's2',
    role: 'user',
    content: 'What documents do I still need to submit?',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: 's3',
    role: 'assistant',
    content: 'Based on your records, you still need to complete:\n\n1. **W-4 Tax Withholding Form** - Due by end of this week\n2. **Direct Deposit Authorization** - Due by Jan 20\n3. **Emergency Contact Information** - Due by Jan 18\n\nYou can find all forms in the HR portal under "New Hire Documents". Would you like me to walk you through any of these?',
    timestamp: new Date(Date.now() - 2400000),
    routedTo: 'Day Zero Readiness',
    category: 'day_zero',
    actionItems: [
      { task: 'Submit W-4 form', category: 'Documents', priority: 'high', status: 'pending' },
      { task: 'Submit direct deposit form', category: 'Documents', priority: 'medium', status: 'pending' },
      { task: 'Submit emergency contacts', category: 'Documents', priority: 'medium', status: 'pending' },
    ],
  },
]

function getCategoryIcon(category: string) {
  switch (category?.toLowerCase()) {
    case 'documents': return <FileText className="h-3.5 w-3.5" />
    case 'tools': return <Monitor className="h-3.5 w-3.5" />
    case 'meetings': return <Users className="h-3.5 w-3.5" />
    case 'training': return <BookOpen className="h-3.5 w-3.5" />
    default: return <Circle className="h-3.5 w-3.5" />
  }
}

function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'medium': return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'low': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-1.5">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm leading-relaxed">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm leading-relaxed">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

function parseAgentResponse(result: AIAgentResponse) {
  if (!result?.success) return null
  try {
    const data = result?.response?.result
    if (!data) return null
    if (typeof data === 'string') {
      try { return JSON.parse(data) } catch { return { message: data } }
    }
    return data
  } catch { return null }
}

export default function EmployeeConcierge({ sampleMode, onActiveAgent, activeSection }: EmployeeConciergeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS)
  const [completionPct, setCompletionPct] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('Pre-Start')
  const scrollRef = useRef<HTMLDivElement>(null)

  const displayMessages = sampleMode ? SAMPLE_MESSAGES : messages
  const displayTasks = sampleMode ? SAMPLE_TASKS : tasks
  const displayCompletion = sampleMode ? 45 : completionPct
  const displayPhase = sampleMode ? 'Week 1' : currentPhase

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayMessages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)
    onActiveAgent(ORCHESTRATOR_ID)

    try {
      const result = await callAIAgent(userMsg.content, ORCHESTRATOR_ID)
      const data = parseAgentResponse(result)
      const message = data?.message ?? result?.response?.message ?? 'I received your message. Let me help you with that.'
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: message,
        timestamp: new Date(),
        routedTo: data?.routed_to,
        category: data?.category,
        actionItems: Array.isArray(data?.action_items) ? data.action_items : undefined,
        nextSteps: Array.isArray(data?.next_steps) ? data.next_steps : undefined,
        completionPercentage: typeof data?.completion_percentage === 'number' ? data.completion_percentage : undefined,
        currentPhase: data?.current_phase,
      }
      setMessages(prev => [...prev, assistantMsg])
      if (typeof data?.completion_percentage === 'number') {
        setCompletionPct(data.completion_percentage)
      }
      if (data?.current_phase) {
        setCurrentPhase(data.current_phase)
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
      onActiveAgent(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
  }

  const phaseIndex = PHASES.indexOf(displayPhase)
  const completedTasks = displayTasks.filter(t => t.completed).length
  const totalTasks = displayTasks.length

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (displayCompletion / 100) * circumference

  // New employee sections
  if (activeSection === 'buddy') {
    return <BuddySystem sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }
  if (activeSection === 'learning') {
    return <LearningPath sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }
  if (activeSection === 'feedback') {
    return <FeedbackHub sampleMode={sampleMode} onActiveAgent={onActiveAgent} />
  }
  if (activeSection === 'welcome') {
    return <WelcomeKit sampleMode={sampleMode} />
  }

  // Knowledge Base section
  if (activeSection === 'knowledge') {
    return <EmployeeKnowledgeBase sampleMode={sampleMode} />
  }

  // Tasks section (full-width task list)
  if (activeSection === 'tasks') {
    return (
      <div className="flex flex-col h-full gap-4">
        {/* Mini progress at top */}
        <div className="flex items-center gap-4 p-4 glass-card">
          <div className="relative flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 96 96" className="transform -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-semibold font-serif">{displayCompletion}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-semibold text-sm tracking-wide mb-1">Task Progress</h3>
            <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
            <Progress value={(completedTasks / Math.max(totalTasks, 1)) * 100} className="h-1.5 mt-2" />
          </div>
        </div>

        {/* Task Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Documents', 'Tools', 'Meetings', 'Training', 'Culture'].map(cat => {
              const catTasks = displayTasks.filter(t => t.category === cat)
              if (catTasks.length === 0) return null
              const catDone = catTasks.filter(t => t.completed).length
              return (
                <Card key={cat} className="glass-card border-l-4 border-l-primary/40">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-2">{getCategoryIcon(cat)} {cat}</span>
                      <Badge variant="secondary" className="text-[10px]">{catDone}/{catTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {catTasks.map(task => (
                        <div key={task.id} className={`flex items-start gap-2.5 p-2.5 rounded-md border transition-colors ${task.completed ? 'bg-primary/5 border-primary/10' : 'glass-sm hover:border-border/30'}`}>
                          <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.task}</p>
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 mt-1 ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Progress & Milestones section (full-width)
  if (activeSection === 'progress') {
    return (
      <div className="flex flex-col h-full gap-4">
        {/* Large Progress Ring */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <div className="relative flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                  <circle cx="70" cy="70" r="58" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle cx="70" cy="70" r="58" fill="none" stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={(2 * Math.PI * 58) - (displayCompletion / 100) * (2 * Math.PI * 58)} className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold font-serif text-foreground">{displayCompletion}%</span>
                  <span className="text-xs text-muted-foreground">Complete</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-serif font-semibold text-lg tracking-wide text-foreground mb-4">Onboarding Journey</h3>
                <div className="flex items-center gap-1">
                  {PHASES.map((phase, i) => (
                    <React.Fragment key={phase}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i < phaseIndex ? 'bg-primary text-primary-foreground' : i === phaseIndex ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {i < phaseIndex ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1.5 whitespace-nowrap ${i === phaseIndex ? 'font-semibold text-accent-foreground' : 'text-muted-foreground'}`}>{phase}</span>
                      </div>
                      {i < PHASES.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-5 ${i < phaseIndex ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="text-center p-2 glass-sm rounded-md">
                    <p className="text-lg font-serif font-semibold">{completedTasks}</p>
                    <p className="text-[10px] text-muted-foreground">Tasks Done</p>
                  </div>
                  <div className="text-center p-2 glass-sm rounded-md">
                    <p className="text-lg font-serif font-semibold">{totalTasks - completedTasks}</p>
                    <p className="text-[10px] text-muted-foreground">Remaining</p>
                  </div>
                  <div className="text-center p-2 glass-sm rounded-md">
                    <p className="text-lg font-serif font-semibold">{displayPhase}</p>
                    <p className="text-[10px] text-muted-foreground">Current Phase</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Timeline */}
        <Card className="flex-1 glass-card overflow-hidden flex flex-col">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-serif font-semibold tracking-wide">Milestone Timeline</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 flex-1 overflow-y-auto">
            <div className="space-y-0">
              {(sampleMode ? SAMPLE_MILESTONES : SAMPLE_MILESTONES.map(m => ({ ...m, completed: false }))).map((milestone, i, arr) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {i < arr.length - 1 && (
                    <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${milestone.completed ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${milestone.completed ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-border'}`}>
                    {milestone.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 pb-5">
                    <p className={`text-sm font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{milestone.label}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />{milestone.date}
                    </p>
                  </div>
                  {milestone.completed && (
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Done</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default: AI Concierge section (chat + sidebar)
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Progress Header */}
      <div className="flex items-center gap-6 p-5 glass-card">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold font-serif text-foreground">{displayCompletion}%</span>
            <span className="text-[10px] text-muted-foreground">Complete</span>
          </div>
        </div>

        {/* Phase Stepper */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold font-serif tracking-wide text-foreground mb-3">Onboarding Progress</h3>
          <div className="flex items-center gap-1">
            {PHASES.map((phase, i) => (
              <React.Fragment key={phase}>
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i < phaseIndex ? 'bg-primary text-primary-foreground' : i === phaseIndex ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i < phaseIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 whitespace-nowrap ${i === phaseIndex ? 'font-semibold text-accent-foreground' : 'text-muted-foreground'}`}>{phase}</span>
                </div>
                {i < PHASES.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 ${i < phaseIndex ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Chat + Sidebar */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Area */}
        <div className="flex-[3] flex flex-col glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-serif font-semibold text-sm tracking-wide">Onboarding Assistant</h3>
            <Badge variant="secondary" className="text-[10px] ml-auto">Orchestrator</Badge>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {displayMessages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">Welcome to Lyzr Onboarding Intelligence</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">Ask me about your onboarding tasks, company policies, tool setup, team introductions, or anything else you need help with.</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {['What are my tasks for today?', 'How do I set up VPN?', 'Tell me about company culture'].map((q) => (
                    <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => { setInputValue(q) }}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass-sm'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-accent-foreground" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-lg px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass-sm'}`}>
                    {renderMarkdown(msg.content)}
                  </div>
                  {msg.routedTo && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span>Routed to: {msg.routedTo}</span>
                    </div>
                  )}
                  {Array.isArray(msg.actionItems) && msg.actionItems.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.actionItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs glass-sm rounded px-2.5 py-1.5">
                          {getCategoryIcon(item.category)}
                          <span className="flex-1">{item.task}</span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 ${getPriorityColor(item.priority)}`}>{item.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {Array.isArray(msg.nextSteps) && msg.nextSteps.length > 0 && (
                    <div className="mt-2 p-2.5 rounded glass-sm">
                      <p className="text-[10px] font-semibold text-accent-foreground mb-1">Next Steps:</p>
                      {msg.nextSteps.map((step, i) => (
                        <p key={i} className="text-xs text-muted-foreground ml-2">- {step}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full glass-sm flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
                </div>
                <div className="space-y-2 flex-1 max-w-[60%]">
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-4 w-2/3 bg-muted" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/20 glass-sm">
            <div className="flex gap-2">
              <Input
                placeholder="Ask your onboarding assistant..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 glass-input bg-background border-border/30 text-sm"
              />
              <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()} size="icon" className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex-[2] flex flex-col gap-4 min-h-0">
          {/* Daily Tasks */}
          <Card className="flex-1 glass-card overflow-hidden flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center justify-between">
                <span>Daily Tasks</span>
                <Badge variant="secondary" className="text-[10px]">{completedTasks}/{totalTasks}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex-1 overflow-y-auto">
              <div className="space-y-2">
                {displayTasks.map((task) => (
                  <div key={task.id} className={`flex items-start gap-2.5 p-2.5 rounded-md border transition-colors ${task.completed ? 'bg-primary/5 border-primary/10' : 'glass-sm hover:border-border/30'}`}>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.task}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {getCategoryIcon(task.category)}
                        <span className="text-[10px] text-muted-foreground">{task.category}</span>
                        <Badge variant="outline" className={`text-[9px] px-1 py-0 ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestone Timeline */}
          <Card className="glass-card">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-serif font-semibold tracking-wide">Milestone Timeline</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-0">
                {(sampleMode ? SAMPLE_MILESTONES : SAMPLE_MILESTONES.map(m => ({ ...m, completed: false }))).map((milestone, i, arr) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < arr.length - 1 && (
                      <div className={`absolute left-[9px] top-5 bottom-0 w-0.5 ${milestone.completed ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${milestone.completed ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-border'}`}>
                      {milestone.completed && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className={`text-xs font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{milestone.label}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />{milestone.date}
                      </p>
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
