'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { uploadAndTrainDocument, getDocuments, deleteDocuments } from '@/lib/ragKnowledgeBase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  BookOpen,
  Wrench,
} from 'lucide-react'

const POLICIES_TOOLS_RAG_ID = '69a192faf572c99c0ffb79fb'
const ROLE_PLAYBOOKS_RAG_ID = '69a192fb00c2d274880f00ce'

interface KBDoc {
  id?: string
  fileName: string
  fileType: 'pdf' | 'docx' | 'txt'
  fileSize?: number
  status?: string
  uploadedAt?: string
}

interface KnowledgeBasePanelProps {
  sampleMode: boolean
}

function getFileIcon(fileType: string) {
  return <FileText className="h-4 w-4 text-primary" />
}

function formatFileSize(bytes: number | undefined) {
  if (!bytes) return '--'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function KnowledgeBasePanel({ sampleMode }: KnowledgeBasePanelProps) {
  const [policiesDocs, setPoliciesDocs] = useState<KBDoc[]>([])
  const [playbooksDocs, setPlaybooksDocs] = useState<KBDoc[]>([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)
  const [loadingPlaybooks, setLoadingPlaybooks] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadTarget, setUploadTarget] = useState<'policies' | 'playbooks' | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const policiesInputRef = useRef<HTMLInputElement>(null)
  const playbooksInputRef = useRef<HTMLInputElement>(null)

  const SAMPLE_POLICIES: KBDoc[] = [
    { fileName: 'Employee_Handbook_2024.pdf', fileType: 'pdf', fileSize: 2456000, status: 'active', uploadedAt: '2024-01-10' },
    { fileName: 'IT_Security_Policy.pdf', fileType: 'pdf', fileSize: 890000, status: 'active', uploadedAt: '2024-01-08' },
    { fileName: 'Benefits_Overview.docx', fileType: 'docx', fileSize: 340000, status: 'active', uploadedAt: '2024-01-05' },
    { fileName: 'PTO_Policy.txt', fileType: 'txt', fileSize: 12000, status: 'active', uploadedAt: '2024-01-03' },
  ]

  const SAMPLE_PLAYBOOKS: KBDoc[] = [
    { fileName: 'Engineering_Onboarding_Playbook.pdf', fileType: 'pdf', fileSize: 3100000, status: 'active', uploadedAt: '2024-01-12' },
    { fileName: 'Sales_Ramp_Guide.pdf', fileType: 'pdf', fileSize: 1800000, status: 'active', uploadedAt: '2024-01-11' },
    { fileName: 'Design_Team_Bootcamp.docx', fileType: 'docx', fileSize: 520000, status: 'active', uploadedAt: '2024-01-09' },
  ]

  const loadDocs = useCallback(async (ragId: string, setter: React.Dispatch<React.SetStateAction<KBDoc[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)
    try {
      const result = await getDocuments(ragId)
      if (result.success && Array.isArray(result.documents)) {
        setter(result.documents as KBDoc[])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!sampleMode) {
      loadDocs(POLICIES_TOOLS_RAG_ID, setPoliciesDocs, setLoadingPolicies)
      loadDocs(ROLE_PLAYBOOKS_RAG_ID, setPlaybooksDocs, setLoadingPlaybooks)
    }
  }, [sampleMode, loadDocs])

  const handleUpload = async (file: File, ragId: string, target: 'policies' | 'playbooks') => {
    setUploading(true)
    setUploadTarget(target)
    setStatusMessage(`Uploading ${file.name}...`)
    setStatusType('')
    try {
      const result = await uploadAndTrainDocument(ragId, file)
      if (result.success) {
        setStatusMessage(`${file.name} uploaded and trained successfully`)
        setStatusType('success')
        if (target === 'policies') {
          await loadDocs(POLICIES_TOOLS_RAG_ID, setPoliciesDocs, setLoadingPolicies)
        } else {
          await loadDocs(ROLE_PLAYBOOKS_RAG_ID, setPlaybooksDocs, setLoadingPlaybooks)
        }
      } else {
        setStatusMessage(result.error ?? 'Upload failed')
        setStatusType('error')
      }
    } catch {
      setStatusMessage('Upload failed')
      setStatusType('error')
    } finally {
      setUploading(false)
      setUploadTarget(null)
      setTimeout(() => { setStatusMessage(''); setStatusType('') }, 4000)
    }
  }

  const handleDelete = async (fileName: string, ragId: string, target: 'policies' | 'playbooks') => {
    setStatusMessage(`Deleting ${fileName}...`)
    setStatusType('')
    try {
      const result = await deleteDocuments(ragId, [fileName])
      if (result.success) {
        setStatusMessage(`${fileName} deleted`)
        setStatusType('success')
        if (target === 'policies') {
          setPoliciesDocs(prev => prev.filter(d => d.fileName !== fileName))
        } else {
          setPlaybooksDocs(prev => prev.filter(d => d.fileName !== fileName))
        }
      } else {
        setStatusMessage(result.error ?? 'Delete failed')
        setStatusType('error')
      }
    } catch {
      setStatusMessage('Delete failed')
      setStatusType('error')
    } finally {
      setTimeout(() => { setStatusMessage(''); setStatusType('') }, 3000)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, ragId: string, target: 'policies' | 'playbooks') => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file, ragId, target)
    }
    e.target.value = ''
  }

  const displayPolicies = sampleMode ? SAMPLE_POLICIES : policiesDocs
  const displayPlaybooks = sampleMode ? SAMPLE_PLAYBOOKS : playbooksDocs

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Status Message */}
      {statusMessage && (
        <div className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${statusType === 'success' ? 'glass-sm text-emerald-700' : statusType === 'error' ? 'glass-sm text-destructive' : 'glass-sm text-foreground'}`}>
          {statusType === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : statusType === 'error' ? <AlertCircle className="h-4 w-4 flex-shrink-0" /> : <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />}
          {statusMessage}
        </div>
      )}

      <div className="flex-1">
        <Tabs defaultValue="policies" className="h-full flex flex-col">
          <TabsList className="w-full justify-start h-10">
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" /> Policies & Tools
            </TabsTrigger>
            <TabsTrigger value="playbooks" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Role Playbooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="flex-1 mt-4">
            <Card className="glass-card h-full flex flex-col">
              <CardHeader className="py-3 px-4 flex-row items-center justify-between">
                <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  Policies & Tools Knowledge Base
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{displayPolicies.length} documents</Badge>
                  <input ref={policiesInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => onFileChange(e, POLICIES_TOOLS_RAG_ID, 'policies')} />
                  <Button size="sm" onClick={() => policiesInputRef.current?.click()} disabled={uploading && uploadTarget === 'policies'} className="text-xs h-7 bg-primary hover:bg-primary/90 rounded-lg">
                    {uploading && uploadTarget === 'policies' ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {loadingPolicies ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-background">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                          <div className="h-2 bg-muted rounded w-1/3 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayPolicies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No documents uploaded</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload PDF, DOCX, or TXT files to train the Tool Concierge agent</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayPolicies.map((doc, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md glass-sm border border-border/10 hover:border-border/30 transition-colors">
                        {getFileIcon(doc.fileType)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.fileName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{doc.fileType?.toUpperCase()}</span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                            {doc.uploadedAt && <span>{doc.uploadedAt}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{doc.status ?? 'active'}</Badge>
                        {!sampleMode && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doc.fileName, POLICIES_TOOLS_RAG_ID, 'policies')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playbooks" className="flex-1 mt-4">
            <Card className="glass-card h-full flex flex-col">
              <CardHeader className="py-3 px-4 flex-row items-center justify-between">
                <CardTitle className="text-sm font-serif font-semibold tracking-wide flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Role Playbooks Knowledge Base
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{displayPlaybooks.length} documents</Badge>
                  <input ref={playbooksInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => onFileChange(e, ROLE_PLAYBOOKS_RAG_ID, 'playbooks')} />
                  <Button size="sm" onClick={() => playbooksInputRef.current?.click()} disabled={uploading && uploadTarget === 'playbooks'} className="text-xs h-7 bg-primary hover:bg-primary/90 rounded-lg">
                    {uploading && uploadTarget === 'playbooks' ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {loadingPlaybooks ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-background">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                          <div className="h-2 bg-muted rounded w-1/3 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayPlaybooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No playbooks uploaded</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload role-specific playbooks for the Role Ramp agent</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {displayPlaybooks.map((doc, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md glass-sm border border-border/10 hover:border-border/30 transition-colors">
                        {getFileIcon(doc.fileType)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.fileName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{doc.fileType?.toUpperCase()}</span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                            {doc.uploadedAt && <span>{doc.uploadedAt}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{doc.status ?? 'active'}</Badge>
                        {!sampleMode && (
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(doc.fileName, ROLE_PLAYBOOKS_RAG_ID, 'playbooks')}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
