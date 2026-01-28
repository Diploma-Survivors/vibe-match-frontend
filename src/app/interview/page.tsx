"use client"

import { useState, useRef, useEffect } from "react"
import { InterviewGreeting } from "@/components/interview/interview-greeting"
import { InterviewHeader } from "@/components/interview/interview-header"
import { InterviewChat, type Message } from "@/components/interview/interview-chat"
import { InterviewEditor } from "@/components/interview/interview-editor"
import { ResizableDivider } from "@/components/interview/resizable-divider"
import { InterviewFeedback } from "@/components/interview/interview-feedback"

type InterviewPhase = "greeting" | "active" | "feedback"

export default function LiveInterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("greeting")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "interviewer",
      text: "Hello! I'm excited to talk with you today. We'll be working through a coding problem together. Feel free to think out loud and ask questions. Let's start with an easy problem to warm up.",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [interviewTime, setInterviewTime] = useState(0)
  const [currentLanguageId, setCurrentLanguageId] = useState(46)
  const [code, setCode] = useState("function solution() {\n  // Start coding here\n}")

  const [dividerPos, setDividerPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (phase !== "active") return
    const timer = setInterval(() => {
      setInterviewTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  const handleMouseDown = () => {
    isDraggingRef.current = true
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const newPos = ((e.clientX - rect.left) / rect.width) * 100

    if (newPos >= 30 && newPos <= 70) {
      setDividerPos(newPos)
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleStartInterview = () => {
    setPhase("active")
    setMessages([
      {
        id: "1",
        sender: "interviewer",
        text: "Perfect! Let's get started. Here's your first problem:\n\nGiven an array of integers, find the maximum product of any two elements.",
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "candidate",
      text: inputText,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputText("")

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "interviewer",
        text: "Great approach! Can you walk me through your logic? What would be the time complexity of your solution?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  if (phase === "greeting") {
    return (
      <InterviewGreeting
        voiceEnabled={voiceEnabled}
        onVoiceEnabledChange={setVoiceEnabled}
        onStartInterview={handleStartInterview}
      />
    )
  }

  if (phase === "active") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <InterviewHeader
          interviewTime={interviewTime}
          voiceEnabled={voiceEnabled}
          onVoiceToggle={() => setVoiceEnabled(!voiceEnabled)}
          onRunCode={() => console.log("Run code")}
          onSubmit={() => console.log("Submit")}
        />

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          className="flex flex-1 overflow-hidden"
        >
          <div style={{ width: `${dividerPos}%` }} className="flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-hidden">
              <InterviewChat
                messages={messages}
                inputText={inputText}
                onInputChange={setInputText}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>

          <ResizableDivider onMouseDown={handleMouseDown} />

          <div style={{ width: `${100 - dividerPos}%` }} className="flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-hidden">
              <InterviewEditor
                currentLanguageId={currentLanguageId}
                onLanguageChange={setCurrentLanguageId}
                currentCode={code}
                onCodeChange={setCode}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <InterviewFeedback interviewTime={interviewTime} />
}
