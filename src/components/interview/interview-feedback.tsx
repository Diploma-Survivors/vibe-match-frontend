"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface InterviewFeedbackProps {
  interviewTime: number
}

export function InterviewFeedback({ interviewTime }: InterviewFeedbackProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8 border-border/40 bg-gradient-to-br from-accent/10 to-background rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Feedback</h1>
          <p className="text-muted-foreground">Interview duration: {formatTime(interviewTime)}</p>
        </Card>

        <Card className="p-8 border-border/40 bg-card rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Overall Evaluation</h2>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            Great job on your interview! You demonstrated solid problem-solving skills and communicated your approach
            clearly. Your code was clean and efficient, showing good understanding of data structures and algorithms.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Problem Solving", score: 88 },
            { label: "Communication", score: 85 },
            { label: "Code Quality", score: 92 },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 border-border/40 bg-card rounded-xl shadow-sm">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{item.score}</div>
                <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-border/40 bg-card rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Strengths</h2>
          <ul className="space-y-3">
            {[
              "Clear explanation of your approach before coding",
              "Good use of hash maps for optimization",
              "Considered edge cases and potential improvements",
              "Communicated effectively with the interviewer",
            ].map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-none w-2 h-2 rounded-full bg-accent mt-2" />
                <span className="text-muted-foreground text-pretty">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 border-border/40 bg-card rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Areas for Improvement</h2>
          <ul className="space-y-3">
            {[
              "Consider testing your code with edge cases before submission",
              "Could have discussed space-time trade-offs in more detail",
              "Practice verbalizing your thought process while coding",
            ].map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-none w-2 h-2 rounded-full bg-[oklch(0.65_0.2_25)] mt-2" />
                <span className="text-muted-foreground text-pretty">{improvement}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex gap-4">
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300">
            View Detailed Report
          </Button>
          <Button variant="outline" className="flex-1">
            Schedule Another Interview
          </Button>
        </div>
      </div>
    </div>
  )
}
