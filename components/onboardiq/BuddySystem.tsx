'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  MessageCircle,
  Calendar,
  Loader2,
  Send,
  Star,
  Clock,
  CheckCircle2,
  Heart,
  Coffee,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'

const ORCHESTRATOR_ID = '69a1939b12618822e8a2dcd9'

interface BuddyInfo {
  name: string
  role: string
  department: string
  expertise: string[]
  meetingTopics: string[]
  funFact: string
}

interface BuddySystemProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

const SAMPLE_BUDDY: BuddyInfo = {
  name: 'Alex Rivera',
  role: 'Senior Software Engineer',
  department: 'Platform Engineering',
  expertise: ['React', 'TypeScript', 'System Design', 'Mentorship'],
  meetingTopics: ['Dev environment walkthrough', 'Code review practices', 'Team culture & norms', 'Career growth at company'],
  funFact: 'Built an internal hackathon project that became a production feature!',
}

const SAMPLE_ACTIVITIES = [
  { title: 'Virtual Coffee Chat', time: 'Today at 2:00 PM', type: 'social', completed: false, icon: Coffee },
  { title: 'Codebase Tour', time: 'Tomorrow at 10:00 AM', type: 'technical', completed: false, icon: Lightbulb },
  { title: 'Intro to Team Norms', time: 'Jan 18, 3:00 PM', type: 'culture', completed: false, icon: Heart },
  { title: 'First Pair Programming', time: 'Jan 20, 11:00 AM', type: 'technical', completed: false, icon: Star },
]

const SAMPLE_CONVERSATION_STARTERS = [
  'What surprised you most when you first joined?',
  'What tools do you use daily that you recommend?',
  'Any tips for navigating the org structure?',
  'What is the team\'s approach to code reviews?',
]

export default function BuddySystem({ sampleMode, onActiveAgent }: BuddySystemProps) {
  const [buddy] = useState<BuddyInfo | null>(sampleMode ? SAMPLE_BUDDY : null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAskBuddy = async (q?: string) => {
    const msg = q ?? question
    if (!msg.trim()) return
    setLoading(true)
    onActiveAgent(ORCHESTRATOR_ID)
    try {
      const result = await callAIAgent(
        `I want to ask my onboarding buddy this question: ${msg}. Please respond as if you are a friendly senior colleague helping a new hire.`,
        ORCHESTRATOR_ID
      )
      const data = result?.response?.result
      setAnswer(typeof data === 'string' ? data : data?.message ?? 'Great question! Your buddy will follow up with a detailed answer.')
    } catch {
      setAnswer('Your buddy is currently unavailable. Try again shortly.')
    } finally {
      setLoading(false)
      onActiveAgent(null)
      setQuestion('')
    }
  }

  const displayBuddy = buddy ?? SAMPLE_BUDDY

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Buddy Profile Card */}
      <div className="glass-card p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 glass-sm flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
            {displayBuddy.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base">{displayBuddy.name}</h3>
              <Badge className="glass-badge text-[10px] text-primary border-primary/20">Your Buddy</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{displayBuddy.role}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{displayBuddy.department}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {displayBuddy.expertise.map((skill) => (
                <span key={skill} className="glass-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground/80">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <Button size="sm" className="glass-button text-xs text-foreground hover:text-primary flex-shrink-0">
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            Message
          </Button>
        </div>
        {displayBuddy.funFact && (
          <div className="mt-3 p-3 glass-sm rounded-xl">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><span className="font-medium text-foreground/80">Fun fact:</span> {displayBuddy.funFact}</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Scheduled Activities */}
        <div className="flex-1 glass-card p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Buddy Activities
            </h4>
            <Badge className="glass-badge text-[10px]">{SAMPLE_ACTIVITIES.length} scheduled</Badge>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {SAMPLE_ACTIVITIES.map((activity, i) => {
              const Icon = activity.icon
              return (
                <div key={i} className={`p-3 rounded-xl glass-sm flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${activity.completed ? 'opacity-60' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'social' ? 'bg-amber-500/10 text-amber-600' :
                    activity.type === 'technical' ? 'bg-primary/10 text-primary' :
                    'bg-pink-500/10 text-pink-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>{activity.title}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {activity.time}
                    </p>
                  </div>
                  {activity.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Ask Your Buddy + Conversation Starters */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Conversation Starters */}
          <div className="glass-card p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Conversation Starters
            </h4>
            <div className="space-y-1.5">
              {SAMPLE_CONVERSATION_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => { setQuestion(starter); handleAskBuddy(starter) }}
                  className="w-full text-left p-2.5 rounded-xl glass-sm text-xs leading-relaxed hover:scale-[1.01] transition-all duration-200 text-foreground/80 hover:text-foreground"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          {/* Ask Question */}
          <div className="flex-1 glass-card p-4 flex flex-col">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Ask Your Buddy
            </h4>
            {answer && (
              <div className="flex-1 mb-3 p-3 glass-sm rounded-xl overflow-y-auto">
                <p className="text-sm leading-relaxed text-foreground/90">{answer}</p>
              </div>
            )}
            <div className="flex gap-2 mt-auto">
              <input
                className="flex-1 glass-input rounded-xl px-3 py-2 text-sm outline-none"
                placeholder="Type a question for your buddy..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskBuddy()}
                disabled={loading}
              />
              <Button
                size="icon"
                onClick={() => handleAskBuddy()}
                disabled={loading || !question.trim()}
                className="rounded-xl bg-primary hover:bg-primary/90 h-9 w-9"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Topics Suggestions */}
      <div className="glass-card p-4">
        <h4 className="font-semibold text-sm mb-2.5 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Suggested Meeting Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {displayBuddy.meetingTopics.map((topic, i) => (
            <span key={i} className="glass-sm px-3 py-1.5 rounded-xl text-xs font-medium text-foreground/80">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
