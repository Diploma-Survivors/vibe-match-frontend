"use client"

import { Card } from "@/components/ui/card"
import MonacoEditor from "@/components/problems/tabs/description/panels/editor-panel/monaco-editor"

interface InterviewEditorProps {
  currentLanguageId: number
  onLanguageChange: (languageId: number) => void
  currentCode: string
  onCodeChange: (code: string) => void
}

export function InterviewEditor({
  currentLanguageId,
  onLanguageChange,
  currentCode,
  onCodeChange,
}: InterviewEditorProps) {
  return (
    <Card className="flex flex-col h-full border-border/40 bg-card rounded-xl shadow-sm overflow-hidden">
      <MonacoEditor
        currentLanguageId={currentLanguageId}
        onCurrentLanguageIdChange={onLanguageChange}
        currentCode={currentCode}
        onCurrentCodeChange={onCodeChange}
      />
    </Card>
  )
}
