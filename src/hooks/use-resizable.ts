import { type RefObject, useCallback, useState } from 'react';

interface UseResizableOptions {
  containerRef: RefObject<HTMLElement | null>;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function useResizable({
  containerRef,
  initialSize = 50,
  minSize = 30,
  maxSize = 80,
}: UseResizableOptions) {
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent, direction: 'horizontal' | 'vertical') => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      if (direction === 'horizontal') {
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;
        const newSize = (mouseX / containerWidth) * 100;
        const constrainedSize = Math.min(Math.max(newSize, minSize), maxSize);
        setSize(constrainedSize);
      } else {
        const containerHeight = containerRect.height;
        const mouseY = e.clientY - containerRect.top;
        const newSize = (mouseY / containerHeight) * 100;
        const constrainedSize = Math.min(Math.max(newSize, minSize), maxSize);
        setSize(constrainedSize);
      }
    },
    [isDragging, containerRef, minSize, maxSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    size,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
