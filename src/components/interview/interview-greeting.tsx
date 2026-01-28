"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2 } from "lucide-react"

interface InterviewGreetingProps {
  voiceEnabled: boolean
  onVoiceEnabledChange: (enabled: boolean) => void
  onStartInterview: () => void
}

export function InterviewGreeting({
  voiceEnabled,
  onVoiceEnabledChange,
  onStartInterview,
}: InterviewGreetingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border/40 bg-card rounded-xl shadow-lg">
        <div className="p-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">
              <span className="bg-gradient-to-r from-accent via-[oklch(0.5_0.18_200)] to-[oklch(0.55_0.2_280)] bg-clip-text text-transparent">
                Live Coding Interview
              </span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
              You're about to start a real-time coding interview. You'll solve problems, explain your thinking, and
              receive instant feedback from your AI interviewer.
            </p>
          </div>

          <Card className="bg-secondary/50 border border-border/40 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Interview Process:</h3>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-3">
                <span className="flex-none font-medium text-accent">1.</span>
                <span>You'll receive coding problems to solve</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none font-medium text-accent">2.</span>
                <span>Explain your approach and code in real-time</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none font-medium text-accent">3.</span>
                <span>Get feedback and suggestions from your interviewer</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none font-medium text-accent">4.</span>
                <span>Receive a final evaluation with detailed scores</span>
              </li>
            </ol>
          </Card>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => onVoiceEnabledChange(e.target.checked)}
                className="w-4 h-4 rounded accent-accent"
              />
              <span className="text-sm text-foreground">Enable voice interaction (optional)</span>
            </label>
            {voiceEnabled && (
              <Card className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground">Microphone enabled - you can speak your answers</span>
              </Card>
            )}
          </div>

          <Button
            onClick={onStartInterview}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
          >
            Start Interview
          </Button>
        </div>
      </Card>
    </div>
  )
}
