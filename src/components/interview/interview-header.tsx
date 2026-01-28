"use client"

import { Button } from "@/components/ui/button"
import { Clock, Mic, MicOff } from "lucide-react"

interface InterviewHeaderProps {
  interviewTime: number
  voiceEnabled: boolean
  onVoiceToggle: () => void
  onRunCode: () => void
  onSubmit: () => void
  isRunning?: boolean
  isSubmitting?: boolean
}

export function InterviewHeader({
  interviewTime,
  voiceEnabled,
  onVoiceToggle,
  onRunCode,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}: InterviewHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-bold text-accent">
            <Clock className="w-5 h-5" />
            {formatTime(interviewTime)}
          </div>
          <div className="border-l border-border/40 pl-4">
            <h3 className="font-semibold text-foreground text-sm">Problem</h3>
            <p className="text-xs text-muted-foreground">Maximum Product Subarray</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onVoiceToggle}
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
          >
            {voiceEnabled ? (
              <>
                <Mic className="w-3 h-3 mr-1.5" />
                Voice On
              </>
            ) : (
              <>
                <MicOff className="w-3 h-3 mr-1.5" />
                Voice Off
              </>
            )}
          </Button>
          <Button
            onClick={onRunCode}
            disabled={isRunning}
            size="sm"
            variant="secondary"
            className="h-8 text-xs"
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
                Running
              </>
            ) : (
              "Run Code"
            )}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            size="sm"
            className="h-8 bg-accent text-accent-foreground hover:bg-accent/90 text-xs shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                Submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
