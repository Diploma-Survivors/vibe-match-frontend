import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResizableOptions {
  initialLeftWidth?: number;
  initialEditorHeight?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minEditorHeight?: number;
  maxEditorHeight?: number;
}

export function useResizable({
  initialLeftWidth = 50,
  initialEditorHeight = 50,
  minLeftWidth = 30,
  maxLeftWidth = 80,
  minEditorHeight = 30,
  maxEditorHeight = 80,
}: UseResizableOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Resizable state
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [editorHeight, setEditorHeight] = useState(initialEditorHeight);
  const [isHorizontalDragging, setIsHorizontalDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);

  // Horizontal resizing handlers
  const handleHorizontalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsHorizontalDragging(true);
  }, []);

  const handleHorizontalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isHorizontalDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const newSize = (mouseX / containerWidth) * 100;
      const constrainedSize = Math.min(
        Math.max(newSize, minLeftWidth),
        maxLeftWidth
      );
      setLeftWidth(constrainedSize);
    },
    [isHorizontalDragging, minLeftWidth, maxLeftWidth]
  );

  // Vertical resizing handlers
  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsVerticalDragging(true);
  }, []);

  const handleVerticalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isVerticalDragging || !rightPanelRef.current) return;

      const containerRect = rightPanelRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const mouseY = e.clientY - containerRect.top;
      const newSize = (mouseY / containerHeight) * 100;
      const constrainedSize = Math.min(
        Math.max(newSize, minEditorHeight),
        maxEditorHeight
      );
      setEditorHeight(constrainedSize);
    },
    [isVerticalDragging, minEditorHeight, maxEditorHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsHorizontalDragging(false);
    setIsVerticalDragging(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isHorizontalDragging) {
      document.addEventListener('mousemove', handleHorizontalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    if (isVerticalDragging) {
      document.addEventListener('mousemove', handleVerticalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [
    isHorizontalDragging,
    isVerticalDragging,
    handleHorizontalMouseMove,
    handleMouseUp,
    handleVerticalMouseMove,
  ]);

  return {
    // Refs
    containerRef,
    rightPanelRef,

    // Layout state
    leftWidth,
    editorHeight,
    isHorizontalDragging,
    isVerticalDragging,

    // Handlers
    handleHorizontalMouseDown,
    handleVerticalMouseDown,
  };
}
