# Interview Components

This directory contains modular, reusable components for the live coding interview feature.

## Architecture

The interview page is divided into smaller, focused components following clean architecture principles:

### Component Structure

```
interview/
├── interview-greeting.tsx      # Welcome screen with interview setup
├── interview-header.tsx        # Top header with timer and controls
├── interview-chat.tsx          # Chat interface for interviewer communication
├── interview-editor.tsx        # Code editor (reuses MonacoEditor)
├── resizable-divider.tsx       # Draggable divider for layout adjustment
├── interview-feedback.tsx      # Final evaluation and scores
└── index.ts                    # Barrel exports
```

## Components

### InterviewGreeting
Welcome screen shown before interview starts.

**Props:**
- `voiceEnabled: boolean` - Voice interaction toggle state
- `onVoiceEnabledChange: (enabled: boolean) => void` - Voice toggle handler
- `onStartInterview: () => void` - Start interview handler

**Features:**
- Gradient title matching global style system
- Interview process explanation
- Optional voice interaction setup
- Accent button with shadows

---

### InterviewHeader
Top navigation bar with interview controls.

**Props:**
- `interviewTime: number` - Elapsed time in seconds
- `voiceEnabled: boolean` - Voice state
- `onVoiceToggle: () => void` - Toggle voice
- `onRunCode: () => void` - Run code handler
- `onSubmit: () => void` - Submit handler
- `isRunning?: boolean` - Running state
- `isSubmitting?: boolean` - Submitting state

**Features:**
- Real-time timer display
- Voice toggle button
- Run and Submit buttons with loading states
- Problem information display

---

### InterviewChat
Real-time chat interface with the AI interviewer.

**Props:**
- `messages: Message[]` - Array of chat messages
- `inputText: string` - Current input value
- `onInputChange: (text: string) => void` - Input change handler
- `onSendMessage: () => void` - Send message handler

**Features:**
- Auto-scroll to latest message
- Distinct styling for candidate vs interviewer messages
- Enter key to send (Shift+Enter for new line)
- Independent scrolling
- Proper text wrapping with `text-pretty`

---

### InterviewEditor
Monaco code editor wrapper for writing code.

**Props:**
- `currentLanguageId: number` - Selected language ID
- `onLanguageChange: (languageId: number) => void` - Language change handler
- `currentCode: string` - Current code content
- `onCodeChange: (code: string) => void` - Code change handler

**Features:**
- Reuses existing `MonacoEditor` component
- Language selector with dropdown
- Format and copy code buttons
- Syntax highlighting
- Line numbers
- Auto-layout

---

### ResizableDivider
Draggable vertical divider for adjusting layout.

**Props:**
- `onMouseDown: () => void` - Mouse down handler

**Features:**
- Visual grip indicator on hover
- Smooth color transitions
- Constrained to 30%-70% width split
- Accent color on hover

---

### InterviewFeedback
Final evaluation screen with scores and feedback.

**Props:**
- `interviewTime: number` - Total interview duration

**Features:**
- Overall evaluation summary
- Score cards for different metrics
- Strengths and improvement areas
- Action buttons for next steps
- Gradient card backgrounds

## Design System Compliance

All components follow the global style system:

### Colors
- **Accent**: `oklch(0.55 0.18 160)` (green) for primary actions
- **Gradients**: Purple → Blue → Green for headings
- **Backgrounds**: `bg-card`, `bg-secondary/50` for surfaces
- **Borders**: `border-border/40` for subtle dividers
- **Shadows**: `shadow-lg shadow-accent/20` for elevated elements

### Typography
- Font family: Inter (sans) and Geist Mono (monospace)
- Text utilities: `text-balance` for headings, `text-pretty` for paragraphs
- Semantic heading structure

### Spacing
- Consistent padding: `p-4`, `p-8`, `px-4 py-3`
- Standard gaps: `gap-2`, `gap-3`, `gap-4`
- Rounded corners: `rounded-lg`, `rounded-xl`

### Layout
- Independent scroll containers
- Responsive flex layouts
- Proper overflow handling

## Usage Example

```tsx
import {
  InterviewGreeting,
  InterviewHeader,
  InterviewChat,
  InterviewEditor,
  ResizableDivider,
  InterviewFeedback,
  type Message
} from "@/components/interview"

// See src/app/interview/page.tsx for complete implementation
```

## Key Improvements from Original

1. **Modular Architecture**: Split 412-line monolithic component into 6 focused components
2. **Reusable Editor**: Uses existing Monaco editor instead of basic textarea
3. **Independent Scrolling**: Chat and editor scroll independently within their containers
4. **Global Style Compliance**: All colors, spacing, and patterns match design system
5. **Better UX**: Smoother animations, proper text wrapping, auto-scroll chat
6. **Type Safety**: Proper TypeScript interfaces for all props
7. **Accessibility**: Semantic HTML, keyboard support, proper ARIA labels

## Technical Details

### Layout Strategy
- Flex-based two-column layout with percentage widths
- Each column has `overflow-hidden` to contain scrolling
- Inner content uses `overflow-y-auto` for independent scrolling
- Divider constrained between 30%-70% to prevent extremes

### State Management
- Phase-based rendering (greeting → active → feedback)
- Refs for drag state and container measurements
- Event listeners for global mouse events during dragging
- Cleanup on component unmount

### Performance
- Auto-scroll only on message changes (useEffect with dependency)
- Throttled resize calculations during drag
- Lazy loading of Monaco editor
- Minimal re-renders with proper prop drilling
