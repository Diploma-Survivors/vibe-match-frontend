'use client';

import { useProblemDescription } from '@/hooks/use-problem-description';
import type { ProblemDetail as ProblemDetailType } from '@/types/problems';
import React from 'react';
import { ContestInfoHeader } from './contest-info-header';
import { EditorPanel } from './panel/editor-panel';
import { ProblemDescriptionPanel } from './panel/problem-description-panel';
import { SampleTestCasesPanel } from './panel/sample-testcases-panel';
import { ResizableDivider } from './resizable-divider';

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
  const {
    containerRef,
    rightPanelRef,
    leftWidth,
    editorHeight,
    isDragging,
    isVerticalDragging,
    testCases,
    activeTestCase,
    setActiveTestCase,
    isRunning,
    isSubmitting,
    output,
    testResults,
    handleMouseDown,
    handleVerticalMouseDown,
    handleRun,
    handleSubmit,
    handleTestCaseSave,
    handleTestCaseEdit,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,
  } = useProblemDescription({
    problem,
    showContestInfo,
    contestName,
    contestTimeRemaining,
  });

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
            <SampleTestCasesPanel
              height={100 - editorHeight}
              testCases={testCases}
              activeTestCase={activeTestCase}
              testResults={testResults}
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
