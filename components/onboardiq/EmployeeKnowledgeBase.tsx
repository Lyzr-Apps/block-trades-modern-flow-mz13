'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  BookOpen,
  Shield,
  Wrench,
  Download,
  Eye,
  Search,
  X,
  ChevronLeft,
  FolderOpen,
  Lock,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Users,
  Heart,
  DollarSign,
  GraduationCap,
  Briefcase,
} from 'lucide-react'

interface DocItem {
  id: string
  fileName: string
  fileType: 'pdf' | 'docx' | 'txt'
  fileSize: string
  category: 'policies' | 'playbooks'
  subcategory: string
  updatedAt: string
  description: string
  content: string
}

interface EmployeeKnowledgeBaseProps {
  sampleMode: boolean
}

const DOCUMENTS: DocItem[] = [
  // Policies & Tools
  {
    id: 'p1',
    fileName: 'Employee_Handbook_2024.pdf',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    category: 'policies',
    subcategory: 'General',
    updatedAt: 'Jan 10, 2024',
    description: 'Comprehensive guide to company policies, workplace standards, and employee expectations.',
    content: `EMPLOYEE HANDBOOK 2024
=======================

TABLE OF CONTENTS
1. Welcome Message
2. Company Mission & Values
3. Employment Policies
4. Code of Conduct
5. Workplace Standards
6. Benefits Overview

---

1. WELCOME MESSAGE

Welcome to the team! We are thrilled to have you join us. This handbook is designed to help you understand our company culture, policies, and the resources available to you as a valued member of our organization.

Our commitment is to provide a supportive, inclusive, and innovative work environment where every team member can thrive and contribute to our shared success.

---

2. COMPANY MISSION & VALUES

Mission: To deliver exceptional solutions that empower our clients and create lasting positive impact.

Core Values:
- Innovation: We embrace creative thinking and continuous improvement
- Integrity: We conduct business with honesty and transparency
- Collaboration: We believe in the power of teamwork
- Excellence: We strive for the highest standards in everything we do
- Respect: We value diverse perspectives and treat everyone with dignity

---

3. EMPLOYMENT POLICIES

3.1 Equal Employment Opportunity
We are an equal opportunity employer committed to diversity and inclusion. We do not discriminate based on race, color, religion, sex, national origin, age, disability, or any other protected characteristic.

3.2 At-Will Employment
Employment with our company is at-will, meaning either the employee or the company may terminate the employment relationship at any time, with or without cause.

3.3 Work Hours
Standard work hours are 9:00 AM to 5:30 PM, Monday through Friday. Flexible scheduling may be available with manager approval.

3.4 Remote Work Policy
Employees may work remotely up to 3 days per week with manager approval. Remote workers are expected to maintain regular communication and be available during core hours (10 AM - 3 PM).

---

4. CODE OF CONDUCT

4.1 Professional Behavior
All employees are expected to conduct themselves professionally, treat colleagues with respect, and maintain a positive work environment.

4.2 Confidentiality
Employees must protect confidential company information, client data, and proprietary materials. This obligation continues even after employment ends.

4.3 Conflicts of Interest
Employees must avoid situations where personal interests conflict with company interests. Any potential conflicts must be disclosed to management.

---

5. WORKPLACE STANDARDS

5.1 Dress Code
Business casual attire is appropriate for most work situations. Client-facing meetings may require business professional attire.

5.2 Communication
We encourage open, transparent communication. Use appropriate channels (Slack for quick questions, email for formal communication, meetings for collaborative discussions).

5.3 Health & Safety
We are committed to providing a safe and healthy work environment. Report any safety concerns to facilities management immediately.

---

6. BENEFITS OVERVIEW

- Health Insurance: Medical, dental, and vision coverage
- 401(k): Company match up to 4% of salary
- PTO: 20 days annually (increases with tenure)
- Parental Leave: 12 weeks paid leave
- Professional Development: $2,000 annual learning budget
- Wellness Program: Gym membership reimbursement

For detailed benefits information, please refer to the Benefits Overview document.`
  },
  {
    id: 'p2',
    fileName: 'IT_Security_Policy.pdf',
    fileType: 'pdf',
    fileSize: '890 KB',
    category: 'policies',
    subcategory: 'Security',
    updatedAt: 'Jan 8, 2024',
    description: 'IT security guidelines, password policies, data protection protocols, and acceptable use standards.',
    content: `IT SECURITY POLICY
====================

1. PURPOSE

This policy establishes guidelines to protect company information assets, systems, and data from unauthorized access, use, disclosure, disruption, modification, or destruction.

---

2. PASSWORD REQUIREMENTS

2.1 Password Standards
- Minimum 12 characters in length
- Must include uppercase, lowercase, numbers, and special characters
- Passwords must be changed every 90 days
- Cannot reuse the last 10 passwords
- Two-factor authentication (2FA) is required for all accounts

2.2 Account Security
- Lock your workstation when stepping away (Win+L or Cmd+Control+Q)
- Never share your login credentials
- Report suspected compromises immediately to IT Security

---

3. DATA CLASSIFICATION

3.1 Confidential
Client data, financial records, employee PII, trade secrets. Requires encryption at rest and in transit.

3.2 Internal
Internal communications, project plans, meeting notes. Standard access controls apply.

3.3 Public
Marketing materials, press releases, public-facing documentation. No special restrictions.

---

4. ACCEPTABLE USE

4.1 Company Devices
- Company-provided devices are for business use primarily
- Limited personal use is acceptable if it does not interfere with work
- Prohibited: downloading unauthorized software, accessing inappropriate content, bypassing security controls

4.2 Network Security
- Always use VPN when connecting from outside the office
- Do not connect to unsecured public WiFi networks for work purposes
- Report any suspicious emails to security@company.com

---

5. INCIDENT RESPONSE

If you suspect a security incident:
1. Do not attempt to investigate on your own
2. Contact IT Security immediately: security@company.com or ext. 5555
3. Preserve any evidence (screenshots, emails)
4. Document what you observed
5. Do not discuss the incident with unauthorized personnel

---

6. SOFTWARE & TOOLS

Approved tools list:
- Communication: Slack, Microsoft Teams, Zoom
- Productivity: Google Workspace, Microsoft Office 365
- Development: GitHub, VS Code, IntelliJ IDEA
- Design: Figma, Adobe Creative Suite
- Project Management: Jira, Asana

Installing unapproved software requires IT approval.`
  },
  {
    id: 'p3',
    fileName: 'Benefits_Overview.docx',
    fileType: 'docx',
    fileSize: '340 KB',
    category: 'policies',
    subcategory: 'HR',
    updatedAt: 'Jan 5, 2024',
    description: 'Complete breakdown of health insurance, 401(k), PTO, parental leave, and other employee benefits.',
    content: `EMPLOYEE BENEFITS OVERVIEW
===========================

Welcome! Below is a summary of the benefits available to you as a full-time employee. Benefits eligibility begins on the first of the month following your start date.

---

1. HEALTH INSURANCE

Medical Plans (choose one):
- PPO Plan: $150/month employee only, $400/month family
  - $500 individual deductible / $1,000 family
  - 80/20 coinsurance after deductible
  - $3,000 out-of-pocket maximum

- HMO Plan: $120/month employee only, $350/month family
  - $250 individual deductible / $750 family
  - $20 copay for primary care, $40 for specialists
  - $2,500 out-of-pocket maximum

- HDHP + HSA: $80/month employee only, $250/month family
  - $2,800 individual deductible / $5,600 family
  - Company contributes $500/year to HSA
  - 100% coverage after deductible

Dental: Delta Dental PPO included at no additional cost
Vision: VSP coverage included at no additional cost

---

2. RETIREMENT SAVINGS (401K)

- Immediate eligibility upon hire
- Company matches 100% of first 3% and 50% of next 2% (up to 4% total match)
- Vesting: 100% vested after 2 years
- Pre-tax and Roth options available
- Investment options from Vanguard, Fidelity, and T. Rowe Price

---

3. PAID TIME OFF (PTO)

- Years 0-2: 20 days per year
- Years 3-5: 25 days per year
- Years 6+: 30 days per year
- Sick Leave: 10 days per year (separate from PTO)
- Holidays: 11 paid company holidays
- Volunteer Day: 1 paid volunteer day per year

---

4. PARENTAL LEAVE

- Birth parents: 16 weeks paid leave
- Non-birth parents: 12 weeks paid leave
- Gradual return program available (part-time for 4 weeks)
- Adoption/foster assistance: $5,000 reimbursement

---

5. PROFESSIONAL DEVELOPMENT

- Annual learning budget: $2,000
- Conference attendance: up to 2 per year with manager approval
- Internal mentorship program
- Tuition reimbursement: up to $5,250/year for degree programs

---

6. WELLNESS & PERKS

- Gym membership: $50/month reimbursement
- Mental health: Free access to therapy sessions (BetterHelp)
- Commuter benefits: Pre-tax transit/parking deductions
- Employee referral bonus: $3,000 per successful hire
- Home office stipend: $500 one-time for remote workers`
  },
  {
    id: 'p4',
    fileName: 'PTO_Policy.txt',
    fileType: 'txt',
    fileSize: '12 KB',
    category: 'policies',
    subcategory: 'HR',
    updatedAt: 'Jan 3, 2024',
    description: 'Detailed PTO accrual rates, request procedures, carryover rules, and blackout periods.',
    content: `PTO (PAID TIME OFF) POLICY
===========================

1. OVERVIEW

Our PTO policy is designed to give employees flexibility in managing their time away from work. PTO encompasses vacation days, personal days, and mental health days.

---

2. ACCRUAL RATES

PTO accrues on a per-pay-period basis:
- 0-2 years of service: 20 days/year (1.54 days per bi-weekly pay period)
- 3-5 years of service: 25 days/year (1.92 days per bi-weekly pay period)
- 6+ years of service: 30 days/year (2.31 days per bi-weekly pay period)

PTO begins accruing from your first day of employment.

---

3. REQUESTING TIME OFF

- Submit PTO requests through our HR portal at least 5 business days in advance
- Requests of 5+ consecutive days require 2 weeks advance notice
- Manager approval required for all PTO requests
- During blackout periods, PTO is limited to emergencies

Blackout Periods:
- Last two weeks of December (peak season)
- First week of January (annual planning)
- Company-wide events as announced

---

4. CARRYOVER & PAYOUT

- Maximum carryover: 5 unused days per year
- Excess unused PTO will be forfeited on December 31
- Upon separation, accrued unused PTO will be paid out at your current rate
- No advance usage of unaccrued PTO

---

5. SICK LEAVE (SEPARATE FROM PTO)

- 10 sick days per year (non-accruing, available January 1)
- For illness, medical appointments, or caring for sick family members
- 3+ consecutive sick days require a doctor's note
- Unused sick days do not carry over or pay out

---

6. HOLIDAYS

The company observes the following paid holidays:
1. New Year's Day
2. Martin Luther King Jr. Day
3. Presidents' Day
4. Memorial Day
5. Independence Day
6. Labor Day
7. Columbus Day
8. Veterans Day
9. Thanksgiving Day
10. Day after Thanksgiving
11. Christmas Day`
  },
  {
    id: 'p5',
    fileName: 'Code_of_Conduct.pdf',
    fileType: 'pdf',
    fileSize: '680 KB',
    category: 'policies',
    subcategory: 'Legal',
    updatedAt: 'Jan 2, 2024',
    description: 'Standards of professional conduct, ethics guidelines, anti-harassment policy, and reporting procedures.',
    content: `CODE OF CONDUCT
=================

1. INTRODUCTION

This Code of Conduct outlines the fundamental principles and standards that guide our behavior as employees. Adherence to this code is a condition of employment.

---

2. CORE PRINCIPLES

2.1 Integrity
Act honestly and ethically in all business dealings. Never mislead clients, partners, or colleagues.

2.2 Respect
Treat all individuals with dignity and respect, regardless of position, background, or identity.

2.3 Accountability
Take responsibility for your actions and decisions. If you make a mistake, acknowledge it and work to correct it.

---

3. ANTI-HARASSMENT & DISCRIMINATION

We maintain a zero-tolerance policy for harassment and discrimination of any kind, including:
- Sexual harassment (verbal, physical, or visual)
- Bullying or intimidation
- Discrimination based on protected characteristics
- Retaliation against those who report violations

If you experience or witness harassment:
1. Report to your manager or HR immediately
2. Use the anonymous reporting hotline: 1-800-555-SAFE
3. Email: ethics@company.com

All reports are treated confidentially and investigated promptly.

---

4. ANTI-BRIBERY & CORRUPTION

- Never offer, promise, or accept bribes or kickbacks
- Business gifts must be modest (under $100) and disclosed
- Government interactions require pre-approval from Legal
- Maintain accurate financial records at all times

---

5. SOCIAL MEDIA POLICY

- Do not share confidential company information on social media
- When posting about the company, use good judgment
- Clearly identify personal opinions as your own
- Never harass or disparage colleagues, clients, or competitors online

---

6. REPORTING VIOLATIONS

Employees are encouraged to report suspected violations without fear of retaliation. Reports can be made:
- To your direct manager
- To HR department
- Through the anonymous ethics hotline
- Via email to ethics@company.com

Retaliation against good-faith reporters is strictly prohibited and grounds for termination.`
  },
  {
    id: 'p6',
    fileName: 'Equipment_Agreement.pdf',
    fileType: 'pdf',
    fileSize: '156 KB',
    category: 'policies',
    subcategory: 'IT',
    updatedAt: 'Dec 28, 2023',
    description: 'Terms for company-provided equipment including laptops, monitors, and accessories.',
    content: `EQUIPMENT AGREEMENT
=====================

This agreement governs the use and care of company-provided equipment.

---

1. ISSUED EQUIPMENT

Upon joining, you will receive:
- Laptop (MacBook Pro 14" or Dell XPS 15, based on role)
- External monitor (27" Dell UltraSharp or equivalent)
- Keyboard and mouse
- Headset for video calls
- Laptop bag/sleeve

Additional equipment may be requested through IT with manager approval.

---

2. EMPLOYEE RESPONSIBILITIES

2.1 Care & Maintenance
- Treat company equipment with reasonable care
- Keep equipment clean and in good working condition
- Install software updates promptly when notified
- Use provided carrying case for transport

2.2 Security
- Never leave equipment unattended in public places
- Enable disk encryption (FileVault/BitLocker)
- Lock your device when not in use
- Report lost or stolen equipment within 24 hours

2.3 Acceptable Use
- Equipment is provided primarily for business use
- Limited personal use is permitted
- Do not install unauthorized software
- Do not modify hardware without IT approval

---

3. RETURN POLICY

All company equipment must be returned:
- On or before your last day of employment
- In reasonable working condition
- With all accessories and peripherals
- To the IT department or via prepaid shipping label

Failure to return equipment may result in deduction from final paycheck.

---

4. DAMAGE & REPLACEMENT

- Normal wear and tear: No charge for replacement
- Accidental damage: Report to IT for assessment
- Negligent damage: Employee may be responsible for repair/replacement costs
- Theft: File a police report and notify IT within 24 hours

---

5. HOME OFFICE SETUP

Remote workers receive a one-time $500 stipend for home office setup, which may include:
- Standing desk or desk upgrade
- Ergonomic chair contribution
- Additional monitors
- Webcam or lighting equipment`
  },
  // Role Playbooks
  {
    id: 'r1',
    fileName: 'Engineering_Onboarding_Playbook.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    category: 'playbooks',
    subcategory: 'Engineering',
    updatedAt: 'Jan 12, 2024',
    description: 'Complete engineering onboarding guide covering dev environment setup, coding standards, and architecture overview.',
    content: `ENGINEERING ONBOARDING PLAYBOOK
=================================

Welcome to the Engineering team! This playbook will guide you through your first 90 days.

---

WEEK 1: FOUNDATIONS

Day 1 - Setup & Orientation
- [ ] Receive laptop and set up accounts
- [ ] Install development tools (VS Code, Git, Docker, Node.js)
- [ ] Clone the main repositories
- [ ] Set up VPN and access staging environment
- [ ] Meet your onboarding buddy

Day 2-3 - Architecture Overview
- [ ] Review system architecture documentation
- [ ] Understand our microservices structure
- [ ] Learn our API gateway patterns
- [ ] Review database schema and data models
- [ ] Walk through the CI/CD pipeline

Day 4-5 - Development Standards
- [ ] Read coding style guide
- [ ] Understand our Git workflow (feature branches, PRs, code review)
- [ ] Learn our testing strategy (unit, integration, e2e)
- [ ] Review error handling and logging conventions
- [ ] Complete your first "Good First Issue"

---

MONTH 1: BUILDING COMPETENCE

Weeks 2-4 Goals:
- [ ] Complete 3-5 small PRs with code review feedback
- [ ] Attend all team ceremonies (standup, planning, retro)
- [ ] Shadow a senior engineer during on-call rotation
- [ ] Document something that was unclear during onboarding
- [ ] Present at a team knowledge-sharing session

Key Technologies:
- Frontend: React, TypeScript, Next.js, Tailwind CSS
- Backend: Node.js, Python, PostgreSQL, Redis
- Infrastructure: AWS, Docker, Kubernetes, Terraform
- Monitoring: Datadog, PagerDuty, Sentry

---

MONTH 2: GROWING INDEPENDENCE

- [ ] Own a small feature end-to-end
- [ ] Participate in code reviews (both giving and receiving)
- [ ] Join architecture discussions
- [ ] Start contributing to technical documentation
- [ ] Complete security training for developers

---

MONTH 3: FULL CONTRIBUTION

- [ ] Lead a feature from design to deployment
- [ ] Mentor newer team members
- [ ] Contribute to sprint planning estimates
- [ ] Begin on-call rotation (with buddy support)
- [ ] Complete 30/60/90 day review with manager

---

CODING STANDARDS QUICK REFERENCE

Naming Conventions:
- Variables/functions: camelCase
- Classes/types: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case.ts

PR Guidelines:
- Keep PRs under 400 lines when possible
- Include clear description and testing notes
- Add screenshots for UI changes
- Link related Jira tickets
- At least 1 approval required before merge

Testing Requirements:
- Unit test coverage minimum: 80%
- Integration tests for all API endpoints
- E2E tests for critical user flows
- Performance benchmarks for data-heavy operations`
  },
  {
    id: 'r2',
    fileName: 'Sales_Ramp_Guide.pdf',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    category: 'playbooks',
    subcategory: 'Sales',
    updatedAt: 'Jan 11, 2024',
    description: 'Sales team ramp-up guide with product training, CRM setup, pitch deck walkthroughs, and quota expectations.',
    content: `SALES RAMP-UP GUIDE
=====================

Welcome to the Sales team! This guide will help you ramp up to full productivity within 90 days.

---

WEEK 1: PRODUCT & MARKET KNOWLEDGE

Day 1-2: Company & Product
- [ ] Complete product demo training
- [ ] Review all product feature documentation
- [ ] Understand our pricing tiers and packaging
- [ ] Study competitive landscape analysis
- [ ] Review ideal customer profiles (ICPs)

Day 3-5: Tools & Process
- [ ] Set up Salesforce CRM account
- [ ] Complete Salesforce training modules
- [ ] Set up Outreach for email sequences
- [ ] Review sales playbooks and battle cards
- [ ] Shadow 5 live sales calls

---

MONTH 1: SKILL BUILDING

Quota Expectations:
- Month 1: No quota (learning month)
- Month 2: 50% of full quota
- Month 3: 75% of full quota
- Month 4+: 100% of full quota

Activities:
- [ ] Deliver 3 practice pitches (recorded for feedback)
- [ ] Handle 10 inbound leads independently
- [ ] Make 50 outbound calls
- [ ] Send 100 personalized outreach emails
- [ ] Attend weekly sales training sessions

Key Metrics to Learn:
- Average deal size: $45,000 ARR
- Sales cycle: 45-60 days
- Win rate target: 25%
- Pipeline coverage: 3x quota

---

MONTH 2: EXECUTING

- [ ] Own full pipeline from prospecting to close
- [ ] Conduct 20+ discovery calls independently
- [ ] Deliver 10+ product demos
- [ ] Submit 5+ proposals
- [ ] Close your first deal

---

MONTH 3: SCALING

- [ ] Hit 75% of quota
- [ ] Build a healthy pipeline of 3x quota coverage
- [ ] Develop account plans for top 10 prospects
- [ ] Start contributing to team knowledge base
- [ ] Complete 90-day review with Sales Director

---

PITCH FRAMEWORK (SPICED)

S - Situation: Understand the prospect's current state
P - Pain: Identify specific challenges and pain points
I - Impact: Quantify the cost of the problem
C - Critical Event: Find the urgency driver
E - Decision: Understand the buying process
D - Decision Criteria: Align on evaluation criteria`
  },
  {
    id: 'r3',
    fileName: 'Design_Team_Bootcamp.docx',
    fileType: 'docx',
    fileSize: '520 KB',
    category: 'playbooks',
    subcategory: 'Design',
    updatedAt: 'Jan 9, 2024',
    description: 'Design team bootcamp covering design system, Figma workflows, user research processes, and review cycles.',
    content: `DESIGN TEAM BOOTCAMP
======================

Welcome to the Design team! Here is your guide to getting up to speed.

---

WEEK 1: TOOLS & SYSTEMS

Day 1-2: Figma Setup
- [ ] Get added to the Design team Figma workspace
- [ ] Review the component library and design tokens
- [ ] Understand our file naming and organization conventions
- [ ] Install required Figma plugins (Content Reel, Stark, Autoflow)
- [ ] Review 3 recent project files to understand our design patterns

Day 3-5: Design System Deep Dive
- [ ] Study our design system documentation
- [ ] Understand color palette, typography scale, and spacing system
- [ ] Review icon library and illustration guidelines
- [ ] Learn our responsive breakpoint strategy
- [ ] Practice creating screens using existing components

---

DESIGN SYSTEM OVERVIEW

Colors:
- Primary: Brand color for CTAs and key interactions
- Neutrals: 10-step gray scale for text and backgrounds
- Semantic: Success (green), Warning (amber), Error (red), Info (blue)
- Always ensure WCAG AA contrast ratios (4.5:1 for text)

Typography:
- Headings: Inter, semibold/bold
- Body: Inter, regular/medium
- Monospace: JetBrains Mono (code blocks)
- Scale: 12, 14, 16, 18, 20, 24, 30, 36, 48px

Spacing:
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- Use consistent spacing for padding, margins, and gaps

---

MONTH 1: INTEGRATION

- [ ] Participate in 5 design critique sessions
- [ ] Complete 2 small design tasks (icons, component updates)
- [ ] Conduct 1 user research session (shadowing)
- [ ] Review and provide feedback on 3 peer designs
- [ ] Present your work in team critique

---

DESIGN REVIEW PROCESS

1. Designer creates initial concepts
2. Internal design critique (team feedback)
3. Stakeholder review (PM, Engineering lead)
4. User testing (if applicable)
5. Final design handoff to engineering
6. QA review of implemented design

Handoff Best Practices:
- Use Figma dev mode for specs
- Include interaction annotations
- Document edge cases and error states
- Provide responsive behavior notes
- Link to relevant design system components`
  },
  {
    id: 'r4',
    fileName: 'Manager_Onboarding_Guide.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    category: 'playbooks',
    subcategory: 'Management',
    updatedAt: 'Jan 7, 2024',
    description: 'Guide for new managers covering team management, 1:1 frameworks, performance reviews, and leadership expectations.',
    content: `MANAGER ONBOARDING GUIDE
=========================

Congratulations on your management role! This guide covers everything you need to succeed as a people leader.

---

WEEK 1: GETTING ORIENTED

Day 1-2: Administrative Setup
- [ ] Review your team roster and org chart
- [ ] Set up 1:1 meetings with each direct report
- [ ] Access HR systems (HRIS, performance management)
- [ ] Review team budget and headcount plan
- [ ] Meet with your own manager to align on expectations

Day 3-5: Team Understanding
- [ ] Conduct listening sessions with each team member
- [ ] Review recent performance reviews and development plans
- [ ] Understand current projects and priorities
- [ ] Identify any urgent issues or pending decisions
- [ ] Review team norms and working agreements

---

1:1 MEETING FRAMEWORK

Frequency: Weekly, 30 minutes minimum

Agenda Template:
1. Check-in (5 min): How are you doing? Any blockers?
2. Updates (10 min): Progress on goals and projects
3. Development (10 min): Career growth, learning, feedback
4. Action Items (5 min): Commitments and next steps

Tips:
- Let the report drive the agenda
- Take notes and follow through on commitments
- Mix tactical and developmental conversations
- Hold 1:1s consistently (avoid canceling)

---

PERFORMANCE MANAGEMENT

Review Cycle:
- Quarterly check-ins (lightweight, developmental)
- Annual review (comprehensive, tied to compensation)
- Continuous feedback encouraged

Rating Scale:
1. Does Not Meet Expectations
2. Partially Meets Expectations
3. Meets Expectations
4. Exceeds Expectations
5. Significantly Exceeds Expectations

Feedback Framework (SBI):
- Situation: When and where did you observe the behavior?
- Behavior: What specific behavior did you observe?
- Impact: What was the result or effect?

---

MONTH 1-3: ESTABLISHING YOURSELF

Month 1: Listen and Learn
- Build relationships with team and stakeholders
- Avoid making major changes immediately
- Understand the current state thoroughly

Month 2: Assess and Plan
- Identify areas for improvement
- Begin developing your team strategy
- Start introducing small, positive changes

Month 3: Execute
- Implement agreed-upon changes
- Set clear expectations and goals
- Establish your management cadence`
  },
]

function getCategoryIcon(subcategory: string) {
  switch (subcategory) {
    case 'General': return <BookOpen className="h-4 w-4" />
    case 'Security': return <Shield className="h-4 w-4" />
    case 'HR': return <Heart className="h-4 w-4" />
    case 'Legal': return <Lock className="h-4 w-4" />
    case 'IT': return <Monitor className="h-4 w-4" />
    case 'Engineering': return <Wrench className="h-4 w-4" />
    case 'Sales': return <DollarSign className="h-4 w-4" />
    case 'Design': return <GraduationCap className="h-4 w-4" />
    case 'Management': return <Briefcase className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

function getFileTypeStyle(fileType: string) {
  switch (fileType) {
    case 'pdf': return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'docx': return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'txt': return 'bg-stone-500/10 text-stone-600 border-stone-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function EmployeeKnowledgeBase({ sampleMode }: EmployeeKnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'policies' | 'playbooks'>('all')
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null)

  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
    const matchesSearch = !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const policiesCount = DOCUMENTS.filter(d => d.category === 'policies').length
  const playbooksCount = DOCUMENTS.filter(d => d.category === 'playbooks').length

  const handleDownload = (doc: DocItem) => {
    const blob = new Blob([doc.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Document Viewer
  if (selectedDoc) {
    return (
      <div className="flex flex-col h-full gap-4">
        {/* Viewer Header */}
        <div className="glass-card p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDoc(null)}
            className="glass-button text-foreground h-8 px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{selectedDoc.fileName}</h3>
              <p className="text-[10px] text-muted-foreground">
                {selectedDoc.subcategory} -- {selectedDoc.fileSize} -- Updated {selectedDoc.updatedAt}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] ${getFileTypeStyle(selectedDoc.fileType)}`}>
            {selectedDoc.fileType.toUpperCase()}
          </Badge>
          <Button
            size="sm"
            onClick={() => handleDownload(selectedDoc)}
            className="bg-primary hover:bg-primary/90 text-xs h-8 px-3 rounded-lg"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>

        {/* Document Content */}
        <Card className="flex-1 glass-card overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                {selectedDoc.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Document List View
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Total Documents</span>
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{DOCUMENTS.length}</p>
          <p className="text-[10px] text-muted-foreground">available to you</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Policies & Tools</span>
            <Shield className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{policiesCount}</p>
          <p className="text-[10px] text-muted-foreground">company policies</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium">Role Playbooks</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{playbooksCount}</p>
          <p className="text-[10px] text-muted-foreground">role guides</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass-input border-border/30 text-sm h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="glass-sm rounded-lg flex overflow-hidden">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'policies' as const, label: 'Policies' },
            { key: 'playbooks' as const, label: 'Playbooks' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveCategory(f.key)}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                activeCategory === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Badge className="glass-badge text-[10px]">{filteredDocs.length} documents</Badge>
      </div>

      {/* Document Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="glass-card p-4 cursor-pointer group hover:scale-[1.005] transition-all"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(doc.subcategory)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{doc.fileName}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">{doc.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[9px] px-1.5 ${getFileTypeStyle(doc.fileType)}`}>
                      {doc.fileType.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {doc.updatedAt}
                    </span>
                    <Badge variant="secondary" className="text-[9px] px-1.5">{doc.subcategory}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc) }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); handleDownload(doc) }}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl glass-sm flex items-center justify-center mb-3">
              <Search className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="font-semibold text-base mb-1">No documents found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="glass-sm rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
        <span>These documents are read-only. Contact HR or your manager to request updates or additions.</span>
      </div>
    </div>
  )
}
