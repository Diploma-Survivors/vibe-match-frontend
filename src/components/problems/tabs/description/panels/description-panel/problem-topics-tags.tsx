import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { ChevronDown, Tag as TagIcon } from 'lucide-react';
import { useState } from 'react';

interface ProblemTopicsTagsProps {
  topics?: Topic[];
  tags?: Tag[];
}

export function ProblemTopicsTags({
  topics = [],
  tags = [],
}: ProblemTopicsTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(topics, tags);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-t border-slate-200 dark:border-slate-700"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-1">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
          <TagIcon className="w-4 h-4" />
          <span>Topics & Tags</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 pt-2 px-1 space-y-4">
          {topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800"
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {topics.length === 0 && tags.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400 italic">
              No topics or tags available.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
