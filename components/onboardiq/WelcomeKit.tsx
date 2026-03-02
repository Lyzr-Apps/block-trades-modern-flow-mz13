'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Gift,
  CheckCircle2,
  Circle,
  MapPin,
  Wifi,
  Monitor,
  Coffee,
  Key,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  Building2,
  Phone,
  Mail,
  Globe,
  Shield,
  Laptop,
  Headphones,
} from 'lucide-react'

interface WelcomeKitProps {
  sampleMode: boolean
}

const SETUP_ITEMS = [
  { id: '1', title: 'Email & Calendar', description: 'Google Workspace account activated', icon: Mail, status: 'done', category: 'Accounts' },
  { id: '2', title: 'Slack Workspace', description: 'Join team channels and introduce yourself', icon: Globe, status: 'done', category: 'Communication' },
  { id: '3', title: 'VPN Access', description: 'Download and configure corporate VPN', icon: Shield, status: 'pending', category: 'Security' },
  { id: '4', title: 'Development Tools', description: 'IDE, Git, Docker, and local environment', icon: Laptop, status: 'pending', category: 'Tools' },
  { id: '5', title: 'Badge & Access Card', description: 'Pick up from security desk', icon: Key, status: 'pending', category: 'Access' },
  { id: '6', title: 'Equipment Setup', description: 'Laptop, monitor, and peripherals', icon: Monitor, status: 'done', category: 'Hardware' },
  { id: '7', title: 'Benefits Enrollment', description: 'Health, dental, vision, and 401k', icon: FileText, status: 'pending', category: 'HR' },
  { id: '8', title: 'Emergency Contacts', description: 'Update personal emergency information', icon: Phone, status: 'pending', category: 'HR' },
]

const QUICK_LINKS = [
  { title: 'Employee Handbook', icon: FileText, url: '#', type: 'PDF' },
  { title: 'IT Help Desk', icon: Headphones, url: '#', type: 'Portal' },
  { title: 'HR Self-Service', icon: Building2, url: '#', type: 'Portal' },
  { title: 'Learning Platform', icon: Globe, url: '#', type: 'App' },
  { title: 'Expense Reports', icon: FileText, url: '#', type: 'Portal' },
  { title: 'Office Map', icon: MapPin, url: '#', type: 'PDF' },
]

const OFFICE_INFO = [
  { label: 'WiFi Network', value: 'Corp-Secure', icon: Wifi },
  { label: 'Kitchen', value: 'Floor 3, East Wing', icon: Coffee },
  { label: 'Your Desk', value: 'Building A, Floor 4, Seat 42', icon: MapPin },
  { label: 'IT Support', value: 'x4357 or #it-help', icon: Monitor },
]

const KEY_CONTACTS = [
  { name: 'Sarah Thompson', role: 'Your Manager', department: 'Engineering', avatar: 'ST' },
  { name: 'Alex Rivera', role: 'Your Buddy', department: 'Platform', avatar: 'AR' },
  { name: 'Jamie Wilson', role: 'HR Partner', department: 'People Ops', avatar: 'JW' },
  { name: 'Pat Chen', role: 'IT Support', department: 'Infrastructure', avatar: 'PC' },
]

export default function WelcomeKit({ sampleMode }: WelcomeKitProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<Set<string>>(
    new Set(SETUP_ITEMS.filter(i => i.status === 'done').map(i => i.id))
  )

  const toggleItem = (id: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setupProgress = Math.round((completedItems.size / SETUP_ITEMS.length) * 100)
  const categories = [...new Set(SETUP_ITEMS.map(i => i.category))]

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Welcome Banner */}
      <div className="glass-card p-5 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 glass-shimmer">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 glass-sm flex items-center justify-center flex-shrink-0">
            <Gift className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Welcome to the Team!</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Here is everything you need to get started. Complete your setup checklist to hit the ground running.</p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="relative">
              <svg width="72" height="72" viewBox="0 0 72 72" className="transform -rotate-90">
                <circle cx="36" cy="36" r="30" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <circle cx="36" cy="36" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={(2 * Math.PI * 30) - (setupProgress / 100) * (2 * Math.PI * 30)}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">{setupProgress}%</span>
                <span className="text-[9px] text-muted-foreground">Setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Left: Setup Checklist */}
        <div className="flex-[3] flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Setup Items by Category */}
          {categories.map((cat) => {
            const items = SETUP_ITEMS.filter(i => i.category === cat)
            const catDone = items.filter(i => completedItems.has(i.id)).length
            return (
              <div key={cat} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">{cat}</h4>
                  <Badge className="glass-badge text-[9px]">{catDone}/{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const Icon = item.icon
                    const isDone = completedItems.has(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                          isDone ? 'glass-sm opacity-70' : 'glass-sm hover:scale-[1.005]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isDone ? 'bg-emerald-500/10' : 'bg-primary/10'
                        }`}>
                          {isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Icon className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{item.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                        </div>
                        {!isDone && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Quick Links, Office Info, Contacts */}
        <div className="flex-[2] flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Quick Links */}
          <div className="glass-card p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link, i) => {
                const Icon = link.icon
                return (
                  <button key={i} className="glass-sm rounded-xl p-2.5 flex items-center gap-2 hover:scale-[1.02] transition-all text-left">
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{link.title}</p>
                      <p className="text-[9px] text-muted-foreground">{link.type}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Office Info */}
          <div className="glass-card p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Office Guide
            </h4>
            <div className="space-y-2">
              {OFFICE_INFO.map((info, i) => {
                const Icon = info.icon
                return (
                  <div key={i} className="glass-sm rounded-xl p-2.5 flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{info.label}</p>
                      <p className="text-xs font-medium">{info.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Contacts */}
          <div className="glass-card p-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Key Contacts
            </h4>
            <div className="space-y-2">
              {KEY_CONTACTS.map((contact, i) => (
                <div key={i} className="glass-sm rounded-xl p-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{contact.name}</p>
                    <p className="text-[10px] text-muted-foreground">{contact.role}</p>
                  </div>
                  <Button size="icon" className="glass-button h-7 w-7 text-foreground">
                    <Mail className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
