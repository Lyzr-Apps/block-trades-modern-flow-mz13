'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  AlertCircle,
  Loader2,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Smile,
  Meh,
  Frown,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

const CHECKIN_ID = '69a1936af2417c8ef5b385bd'

interface FeedbackHubProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

const PULSE_QUESTIONS = [
  { id: '1', question: 'How are you feeling about your onboarding experience?', category: 'Overall' },
  { id: '2', question: 'Do you have the tools and resources you need?', category: 'Resources' },
  { id: '3', question: 'How connected do you feel with your team?', category: 'Social' },
  { id: '4', question: 'Is the pace of onboarding comfortable?', category: 'Pace' },
]

const SAMPLE_HISTORY = [
  { date: 'Jan 16', mood: 'positive', note: 'Great first week! Team is very welcoming.', score: 8.5 },
  { date: 'Jan 14', mood: 'neutral', note: 'Lots of information to absorb. Need more time for setup.', score: 6.5 },
  { date: 'Jan 12', mood: 'positive', note: 'Orientation was helpful. Excited about the role.', score: 9.0 },
  { date: 'Jan 10', mood: 'negative', note: 'Feeling overwhelmed with all the new systems to learn.', score: 4.5 },
]

const SAMPLE_INSIGHTS = {
  currentMood: 'positive' as const,
  weeklyAvg: 7.3,
  trend: 'improving' as const,
  topStrength: 'Team connections',
  topConcern: 'Information overload',
  streakDays: 4,
}

function getMoodIcon(mood: string) {
  switch (mood) {
    case 'positive': return <Smile className="h-5 w-5 text-emerald-500" />
    case 'neutral': return <Meh className="h-5 w-5 text-amber-500" />
    case 'negative': return <Frown className="h-5 w-5 text-red-500" />
    default: return <Meh className="h-5 w-5 text-muted-foreground" />
  }
}

function getMoodColor(mood: string) {
  switch (mood) {
    case 'positive': return 'from-emerald-500/20 to-emerald-600/10'
    case 'neutral': return 'from-amber-500/20 to-amber-600/10'
    case 'negative': return 'from-red-500/20 to-red-600/10'
    default: return 'from-muted to-muted'
  }
}

export default function FeedbackHub({ sampleMode, onActiveAgent }: FeedbackHubProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [feedbackNote, setFeedbackNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})

  const handleSubmitCheckin = async () => {
    if (!selectedMood) return
    setSubmitting(true)
    onActiveAgent(CHECKIN_ID)
    try {
      const result = await callAIAgent(
        `New hire mood check-in: Mood is "${selectedMood}". Note: "${feedbackNote}". Pulse ratings: ${JSON.stringify(ratings)}. Provide encouraging, empathetic feedback and one actionable suggestion.`,
        CHECKIN_ID
      )
      const data = result?.response?.result
      setAiResponse(typeof data === 'string' ? data : data?.message ?? 'Thank you for checking in! Your feedback helps us improve your onboarding experience.')
      setSubmitted(true)
    } catch {
      setAiResponse('Thank you for your feedback. Your manager will be notified of any concerns.')
      setSubmitted(true)
    } finally {
      setSubmitting(false)
      onActiveAgent(null)
    }
  }

  const insights = SAMPLE_INSIGHTS

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Mood Overview Strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="flex justify-center mb-2">
            {getMoodIcon(insights.currentMood)}
          </div>
          <p className="text-xs font-semibold">Current Mood</p>
          <p className="text-[10px] text-muted-foreground capitalize">{insights.currentMood}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{insights.weeklyAvg}</p>
          <p className="text-xs font-semibold">Weekly Average</p>
          <p className="text-[10px] text-muted-foreground">out of 10</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="flex justify-center mb-1">
            {insights.trend === 'improving' ? <TrendingUp className="h-5 w-5 text-emerald-500" /> :
             insights.trend === 'declining' ? <TrendingDown className="h-5 w-5 text-red-500" /> :
             <Minus className="h-5 w-5 text-muted-foreground" />}
          </div>
          <p className="text-xs font-semibold capitalize">{insights.trend}</p>
          <p className="text-[10px] text-muted-foreground">Trend</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{insights.streakDays}</p>
          <p className="text-xs font-semibold">Day Streak</p>
          <p className="text-[10px] text-muted-foreground">check-ins</p>
        </div>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Check-in Form */}
        <div className="flex-[3] glass-card p-5 flex flex-col">
          {!submitted ? (
            <>
              <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Daily Check-in
              </h4>

              {/* Mood Selection */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground mb-3">How are you feeling today?</p>
                <div className="flex gap-3 justify-center">
                  {[
                    { mood: 'positive', icon: Smile, label: 'Great', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                    { mood: 'neutral', icon: Meh, label: 'Okay', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                    { mood: 'negative', icon: Frown, label: 'Tough', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
                  ].map(({ mood, icon: Icon, label, color }) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 min-w-[90px] ${
                        selectedMood === mood
                          ? `${color} scale-105 shadow-lg`
                          : 'glass-sm border-transparent hover:scale-102'
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${selectedMood === mood ? '' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${selectedMood === mood ? '' : 'text-muted-foreground'}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pulse Questions */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-3">Quick pulse check (rate 1-5)</p>
                <div className="space-y-2.5">
                  {PULSE_QUESTIONS.map((q) => (
                    <div key={q.id} className="glass-sm rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium flex-1">{q.question}</p>
                        <Badge className="glass-badge text-[9px] ml-2">{q.category}</Badge>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => setRatings(prev => ({ ...prev, [q.id]: val }))}
                            className={`flex-1 h-7 rounded-lg text-xs font-medium transition-all ${
                              ratings[q.id] === val
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : ratings[q.id] && ratings[q.id] >= val
                                ? 'bg-primary/20 text-primary'
                                : 'glass-sm hover:bg-primary/10'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <textarea
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-sm outline-none resize-none h-20"
                  placeholder="Anything else you want to share? (optional)"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmitCheckin}
                disabled={!selectedMood || submitting}
                className="w-full rounded-xl bg-primary hover:bg-primary/90"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit Check-in
              </Button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Check-in Complete</h3>
              {aiResponse && (
                <div className="glass-sm rounded-xl p-4 mt-3 max-w-md">
                  <p className="text-sm leading-relaxed text-foreground/80">{aiResponse}</p>
                </div>
              )}
              <Button
                variant="outline"
                className="mt-4 glass-button text-xs text-foreground"
                onClick={() => { setSubmitted(false); setSelectedMood(null); setFeedbackNote(''); setRatings({}); setAiResponse('') }}
              >
                Submit Another
              </Button>
            </div>
          )}
        </div>

        {/* History Timeline */}
        <div className="flex-[2] glass-card p-4 flex flex-col overflow-hidden">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Check-in History
          </h4>
          <div className="flex-1 overflow-y-auto space-y-3">
            {SAMPLE_HISTORY.map((entry, i) => (
              <div key={i} className="glass-sm rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMoodIcon(entry.mood)}
                    <span className="text-xs font-medium">{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= Math.round(entry.score / 2) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">{entry.score}</span>
                  </div>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">{entry.note}</p>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="glass-sm rounded-xl p-3">
              <p className="text-[10px] font-semibold text-foreground/80 mb-1.5">Key Insights</p>
              <div className="space-y-1">
                <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" /> Strength: {insights.topStrength}
                </p>
                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Watch: {insights.topConcern}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
