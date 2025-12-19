import { ResizableDivider } from '@/components/problems/tabs/description/dividers/resizable-divider';
import MarkdownRenderer from '@/components/ui/markdown-renderer';
import { useResizable } from '@/hooks/use-resizable';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface EditorRef {
  executeAction: (action: string) => void;
}

interface EditorSplitPaneProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorSplitPane = forwardRef<EditorRef, EditorSplitPaneProps>(
  ({ content, onChange }, ref) => {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);

    const {
      containerRef,
      leftWidth,
      isHorizontalDragging,
      handleHorizontalMouseDown,
    } = useResizable({
      initialLeftWidth: 50,
      minLeftWidth: 20,
      maxLeftWidth: 80,
    });

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
    };

    useImperativeHandle(ref, () => ({
      executeAction: (action: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const selection = editor.getSelection();
        const model = editor.getModel();
        if (!selection || !model) return;

        const text = model.getValueInRange(selection);
        let newText = text;
        let cursorOffset = 0;

        switch (action) {
          case 'bold':
            newText = `**${text || 'bold text'}**`;
            cursorOffset = 2;
            break;
          case 'italic':
            newText = `*${text || 'italic text'}*`;
            cursorOffset = 1;
            break;
          case 'heading':
            newText = `# ${text || 'Heading'}`;
            cursorOffset = 2;
            break;
          case 'list':
            newText = `- ${text || 'List item'}`;
            cursorOffset = 2;
            break;
          case 'ordered-list':
            newText = `1. ${text || 'List item'}`;
            cursorOffset = 3;
            break;
          case 'code':
            newText = `\`\`\`\n${text || 'code'}\n\`\`\``;
            cursorOffset = 4;
            break;
          case 'quote':
            newText = `> ${text || 'Quote'}`;
            cursorOffset = 2;
            break;
          case 'link':
            newText = `[${text || 'Link text'}](url)`;
            cursorOffset = 1;
            break;
          case 'image':
            newText = `![${text || 'Image alt'}](url)`;
            cursorOffset = 2;
            break;
        }

        editor.executeEdits('toolbar', [
          {
            range: selection,
            text: newText,
            forceMoveMarkers: true,
          },
        ]);

        // Focus editor
        editor.focus();
      },
    }));

    const editorStyleWidth = `calc(${leftWidth}% - 2px)`;
    const previewStyleWidth = `calc(${100 - leftWidth}% - 2px)`;

    return (
      <div ref={containerRef} className="flex-1 flex relative overflow-hidden">
        {/* Editor */}
        <div
          style={{ width: editorStyleWidth }}
          className="h-full flex flex-col"
        >
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'off',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Divider */}
        <div className="w-1 flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors z-10">
          <ResizableDivider
            direction="horizontal"
            isDragging={isHorizontalDragging}
            onMouseDown={handleHorizontalMouseDown}
          />
        </div>

        {/* Preview */}
        <div
          style={{ width: previewStyleWidth }}
          className="h-full overflow-y-auto p-8 pt-0 bg-white dark:bg-slate-950 prose dark:prose-invert max-w-none"
        >
          <MarkdownRenderer content={content} />
        </div>
      </div>
    );
  }
);

EditorSplitPane.displayName = 'EditorSplitPane';

export default EditorSplitPane;
