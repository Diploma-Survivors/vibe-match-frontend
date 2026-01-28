"use client"

import { GripVertical } from "lucide-react"

interface ResizableDividerProps {
  onMouseDown: () => void
}

export function ResizableDivider({ onMouseDown }: ResizableDividerProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 bg-border/40 hover:bg-accent/50 cursor-col-resize transition-colors flex items-center justify-center group flex-shrink-0"
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-accent" />
      </div>
    </div>
  )
}
