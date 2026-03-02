'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  ChevronRight,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Lock,
  Unlock,
} from 'lucide-react'

interface ComplianceTrackerProps {
  sampleMode: boolean
  onActiveAgent: (id: string | null) => void
}

interface ComplianceItem {
  name: string
  category: string
  status: 'complete' | 'pending' | 'overdue' | 'waived'
  dueDate: string
  hireName: string
  priority: string
}

const SAMPLE_COMPLIANCE: ComplianceItem[] = [
  { name: 'I-9 Employment Eligibility', category: 'Legal', status: 'complete', dueDate: 'Jan 15', hireName: 'Sarah Chen', priority: 'critical' },
  { name: 'W-4 Tax Withholding', category: 'Tax', status: 'complete', dueDate: 'Jan 15', hireName: 'Sarah Chen', priority: 'critical' },
  { name: 'NDA Signed', category: 'Legal', status: 'complete', dueDate: 'Jan 12', hireName: 'Sarah Chen', priority: 'high' },
  { name: 'Security Training', category: 'Security', status: 'pending', dueDate: 'Jan 22', hireName: 'Sarah Chen', priority: 'high' },
  { name: 'I-9 Employment Eligibility', category: 'Legal', status: 'overdue', dueDate: 'Jan 10', hireName: 'Maria Lopez', priority: 'critical' },
  { name: 'Direct Deposit Form', category: 'Finance', status: 'overdue', dueDate: 'Jan 12', hireName: 'Maria Lopez', priority: 'medium' },
  { name: 'Equipment Agreement', category: 'IT', status: 'pending', dueDate: 'Jan 20', hireName: 'James Park', priority: 'medium' },
  { name: 'Benefits Enrollment', category: 'HR', status: 'pending', dueDate: 'Jan 25', hireName: 'James Park', priority: 'low' },
  { name: 'Code of Conduct', category: 'Legal', status: 'complete', dueDate: 'Jan 14', hireName: 'Alex Kumar', priority: 'high' },
  { name: 'Background Check Auth', category: 'Legal', status: 'complete', dueDate: 'Jan 8', hireName: 'Emily Taylor', priority: 'critical' },
  { name: 'HIPAA Training', category: 'Security', status: 'pending', dueDate: 'Jan 28', hireName: 'Alex Kumar', priority: 'high' },
  { name: 'Emergency Contacts', category: 'HR', status: 'pending', dueDate: 'Jan 20', hireName: 'Maria Lopez', priority: 'low' },
]

function getStatusIcon(status: string) {
  switch (status) {
    case 'complete': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'overdue': return <XCircle className="h-4 w-4 text-red-500" />
    case 'pending': return <Clock className="h-4 w-4 text-amber-500" />
    case 'waived': return <Unlock className="h-4 w-4 text-muted-foreground" />
    default: return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'complete': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 'overdue': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function ComplianceTracker({ sampleMode, onActiveAgent }: ComplianceTrackerProps) {
  const [filter, setFilter] = useState<string>('all')
  const [selectedHire, setSelectedHire] = useState<string>('all')

  const items = SAMPLE_COMPLIANCE
  const total = items.length
  const complete = items.filter(i => i.status === 'complete').length
  const overdue = items.filter(i => i.status === 'overdue').length
  const pending = items.filter(i => i.status === 'pending').length
  const complianceRate = Math.round((complete / total) * 100)

  const hireNames = ['all', ...new Set(items.map(i => i.hireName))]
  const categories = ['all', ...new Set(items.map(i => i.category))]

  const filteredItems = items.filter(item => {
    const matchStatus = filter === 'all' || item.status === filter
    const matchHire = selectedHire === 'all' || item.hireName === selectedHire
    return matchStatus && matchHire
  })

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <div className="relative inline-block mb-2">
            <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={(2 * Math.PI * 22) - (complianceRate / 100) * (2 * Math.PI * 22)}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{complianceRate}%</span>
            </div>
          </div>
          <p className="text-xs font-semibold">Compliance Rate</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Complete</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{complete}</p>
          <p className="text-[10px] text-muted-foreground">of {total} items</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Overdue</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">{overdue}</p>
          <p className="text-[10px] text-muted-foreground">need action</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-[10px] text-muted-foreground">upcoming</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdue > 0 && (
        <div className="glass-card p-3 bg-gradient-to-r from-red-500/5 to-red-600/5 border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600">{overdue} overdue compliance item{overdue > 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground">
              {items.filter(i => i.status === 'overdue').map(i => `${i.hireName}: ${i.name}`).join(' / ')}
            </p>
          </div>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs h-7 rounded-lg">
            Send Reminders
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="glass-sm rounded-lg flex overflow-hidden">
          {['all', 'complete', 'pending', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={selectedHire}
          onChange={(e) => setSelectedHire(e.target.value)}
          className="glass-input rounded-lg px-3 py-1.5 text-xs outline-none"
        >
          {hireNames.map((h) => (
            <option key={h} value={h}>{h === 'all' ? 'All Hires' : h}</option>
          ))}
        </select>
        <div className="flex-1" />
        <Badge className="glass-badge text-[10px]">{filteredItems.length} items</Badge>
      </div>

      {/* Compliance Items */}
      <div className="flex-1 glass-card p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredItems.map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl glass-sm flex items-center gap-3 transition-all hover:scale-[1.002] ${
                item.status === 'overdue' ? 'border-l-2 border-l-red-500' : ''
              }`}
            >
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium">{item.name}</p>
                  <Badge variant="outline" className={`text-[8px] px-1 ${getPriorityColor(item.priority)}`}>{item.priority}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{item.hireName} -- {item.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {item.dueDate}
                </p>
                <Badge variant="outline" className={`text-[9px] mt-0.5 ${getStatusStyle(item.status)}`}>{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance by Hire */}
      <div className="glass-card p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Compliance by Hire
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {[...new Set(items.map(i => i.hireName))].map((name) => {
            const hireItems = items.filter(i => i.hireName === name)
            const hireDone = hireItems.filter(i => i.status === 'complete').length
            const hireTotal = hireItems.length
            const pct = Math.round((hireDone / hireTotal) * 100)
            const hasOverdue = hireItems.some(i => i.status === 'overdue')
            return (
              <div key={name} className={`glass-sm rounded-xl p-2.5 text-center ${hasOverdue ? 'border border-red-500/20' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-[9px] font-bold text-primary mx-auto mb-1.5">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-[10px] font-medium truncate">{name.split(' ')[0]}</p>
                <Progress value={pct} className="h-1 mt-1.5" />
                <p className="text-[9px] text-muted-foreground mt-0.5">{hireDone}/{hireTotal}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
