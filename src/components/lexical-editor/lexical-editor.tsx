import React, { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

// IMPORTANT: Import the same Theme and Nodes used in your Editor
import ExampleTheme from './theme';

// --- HELPER: Sync State for Async Data ---
function ReadOnlyUpdatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;

    // Check if we need to update to avoid unnecessary parsing
    editor.getEditorState().read(() => {
      const currentJson = JSON.stringify(editor.getEditorState());
      if (currentJson !== value) {
        try {
          const newState = editor.parseEditorState(value);
          editor.setEditorState(newState);
        } catch (e) {
          console.error('Lexical ReadOnly: Failed to parse state', e);
        }
      }
    });
  }, [value, editor]);

  return null;
}

// --- MAIN COMPONENT ---
interface ReadOnlyEditorProps {
  value: string; // The JSON string
}

export default function ReadOnlyEditor({ value }: ReadOnlyEditorProps) {
  const editorConfig = {
    namespace: 'ReadOnlyContent',
    // 1. Critical for Read Only mode
    editable: false,
    // 2. Must match the nodes used to create the content
    nodes: [
      // HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, LinkNode
    ],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
    // 3. Initial load
    editorState: value ? value : undefined,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      {/* Styling: removed borders/bg colors to blend into the page */}
      <div className="editor-container relative">
        <div className="editor-inner relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input outline-none resize-none"
                readOnly={true}
              />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />

          {/* Handles updates if 'value' changes after mount */}
          {value && <ReadOnlyUpdatePlugin value={value} />}
        </div>
      </div>
    </LexicalComposer>
  );
}
