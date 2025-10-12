import type React from 'react';

interface ResizableDividerProps {
  direction: 'horizontal' | 'vertical';
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export function ResizableDivider({
  direction,
  isDragging,
  onMouseDown,
}: ResizableDividerProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`${
        isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize my-3'
      } bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex-shrink-0 ${
        isDragging ? 'bg-blue-500 dark:bg-blue-400' : ''
      }`}
      onMouseDown={onMouseDown}
    >
      <div className="h-full w-full flex items-center justify-center">
        <div
          className={`${
            isHorizontal ? 'w-0.5 h-8' : 'h-0.5 w-8'
          } bg-slate-400 dark:bg-slate-500 rounded-full opacity-50`}
        />
      </div>
    </div>
  );
}
