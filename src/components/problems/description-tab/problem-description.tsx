'use client';

import { useCodeExecution } from '@/hooks/use-code-execution';
import { useResizable } from '@/hooks/use-resizable';
import { useTestCases } from '@/hooks/use-test-cases';
import type { ProblemDetail as ProblemDetailType } from '@/types/problems';
import React, { useRef, useEffect } from 'react';
import { ContestInfoHeader } from './contest-info-header';
import { EditorPanel } from './editor-panel';
import { ProblemDescriptionPanel } from './problem-description-panel';
import { ResizableDivider } from './resizable-divider';
import { TestCasesPanel } from './test-cases-panel';

interface ProblemDescriptionProps {
  problem: ProblemDetailType;
  showContestInfo?: boolean;
  contestName?: string;
  contestTimeRemaining?: string;
}

export default function ProblemDescription({
  problem,
  showContestInfo = false,
  contestName,
  contestTimeRemaining,
}: ProblemDescriptionProps) {
  console.log('aassacas', problem);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    size: leftWidth,
    isDragging,
    handleMouseDown,
    handleMouseMove: handleHorizontalMouseMove,
    handleMouseUp,
  } = useResizable({
    containerRef,
    initialSize: 50,
    minSize: 30,
    maxSize: 80,
  });

  const {
    size: editorHeight,
    isDragging: isVerticalDragging,
    handleMouseDown: handleVerticalMouseDown,
    handleMouseMove: handleVerticalMouseMoveRaw,
    handleMouseUp: handleVerticalMouseUp,
  } = useResizable({
    containerRef: rightPanelRef,
    initialSize: 60,
    minSize: 30,
    maxSize: 80,
  });

  const {
    testCases,
    activeTestCase,
    setActiveTestCase,
    handleTestCaseSave,
    handleTestCaseEdit,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,
  } = useTestCases(problem);

  const { isRunning, isSubmitting, output, handleRun, handleSubmit } =
    useCodeExecution();

  // Add global mouse event listeners
  useEffect(() => {
    const handleMouseMoveHorizontal = (e: MouseEvent) => {
      handleHorizontalMouseMove(e, 'horizontal');
    };

    const handleMouseMoveVertical = (e: MouseEvent) => {
      handleVerticalMouseMoveRaw(e, 'vertical');
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveHorizontal);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    if (isVerticalDragging) {
      document.addEventListener('mousemove', handleMouseMoveVertical);
      document.addEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveHorizontal);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMoveVertical);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [
    isDragging,
    isVerticalDragging,
    handleHorizontalMouseMove,
    handleMouseUp,
    handleVerticalMouseMoveRaw,
    handleVerticalMouseUp,
  ]);

  return (
    <div className="h-full">
      {/* Contest Info Header */}
      {showContestInfo && contestName && (
        <ContestInfoHeader
          contestName={contestName}
          contestTimeRemaining={contestTimeRemaining}
        />
      )}

      <div
        ref={containerRef}
        className="flex h-full gap-0 relative"
        style={{
          height: showContestInfo ? 'calc(100vh - 60px)' : 'calc(100vh - 60px)',
        }}
      >
        {/* Left Panel - Problem Description */}
        <ProblemDescriptionPanel problem={problem} width={leftWidth} />

        {/* Horizontal Resizer */}
        <ResizableDivider
          direction="horizontal"
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Editor and Test Cases */}
        <div
          ref={rightPanelRef}
          className="flex flex-col overflow-hidden pb-4"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="pl-3 flex flex-col h-full gap-0">
            {/* Editor Section */}
            <EditorPanel
              height={editorHeight}
              output={output}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onRun={handleRun}
              onSubmit={handleSubmit}
            />

            {/* Vertical Resizer */}
            <ResizableDivider
              direction="vertical"
              isDragging={isVerticalDragging}
              onMouseDown={handleVerticalMouseDown}
            />

            {/* Test Cases Section */}
            <TestCasesPanel
              height={100 - editorHeight}
              testCases={testCases}
              activeTestCase={activeTestCase}
              onTestCaseAdd={handleTestCaseAdd}
              onTestCaseDelete={handleTestCaseDelete}
              onTestCaseEdit={handleTestCaseEdit}
              onTestCaseSave={handleTestCaseSave}
              onTestCaseChange={handleTestCaseChange}
              onActiveTestCaseChange={setActiveTestCase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
