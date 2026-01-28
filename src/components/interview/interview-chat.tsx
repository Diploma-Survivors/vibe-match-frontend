"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { useRef, useEffect } from "react"

export interface Message {
  id: string
  sender: "interviewer" | "candidate"
  text: string
  timestamp: Date
}

interface InterviewChatProps {
  messages: Message[]
  inputText: string
  onInputChange: (text: string) => void
  onSendMessage: () => void
}

export function InterviewChat({
  messages,
  inputText,
  onInputChange,
  onSendMessage,
}: InterviewChatProps) {
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-full border-border/40 bg-card rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 bg-muted/30 flex-shrink-0">
        <h3 className="font-semibold text-foreground text-sm">Interviewer Chat</h3>
      </div>

      <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "candidate" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm break-words ${
                msg.sender === "candidate"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary text-foreground border border-border/40"
              }`}
            >
              <p className="whitespace-pre-wrap text-pretty">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border/40 bg-muted/30 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-background text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/20 border border-border/40 transition-all"
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputText.trim()}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
