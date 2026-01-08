import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Bold,
  Code,
  Heading1,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';

interface MarkdownToolbarProps {
  onAction: (action: string) => void;
}

export default function MarkdownToolbar({ onAction }: MarkdownToolbarProps) {
  const tools = [
    { icon: Heading1, label: 'Heading', action: 'heading' },
    { icon: Bold, label: 'Bold', action: 'bold' },
    { icon: Italic, label: 'Italic', action: 'italic' },
    { icon: List, label: 'Bulleted List', action: 'list' },
    { icon: ListOrdered, label: 'Numbered List', action: 'ordered-list' },
    { icon: Code, label: 'Code Block', action: 'code' },
    { icon: LinkIcon, label: 'Link', action: 'link' },
    { icon: Quote, label: 'Quote', action: 'quote' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
      {tools.map((tool) => (
        <Tooltip key={tool.action} content={tool.label}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-800"
            onClick={() => onAction(tool.action)}
          >
            <tool.icon className="w-4 h-4" />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
