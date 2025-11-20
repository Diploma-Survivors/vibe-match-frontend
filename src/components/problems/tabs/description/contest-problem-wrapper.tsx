'use client';

import { useProblemDescription } from '@/hooks/use-problem-description';
import type { ProblemDescription } from '@/types/problems';
import React from 'react';
import { ResizableDivider } from './dividers/resizable-divider';
import { DescriptionPanel } from './panels/description-panel/description-panel';
import { EditorPanel } from './panels/editor-panel/editor-panel';
import { SampleTestCasesPanel } from './panels/sample-testcases-panel/sample-testcases-panel';
import { SubmitResultTab } from './panels/submit-result/submit-result-tab';

interface ContestProblemWrapperProps {
  problem: ProblemDescription;
  showSubmissions?: boolean;
  contestMode?: boolean;
}

export default function ContestProblemWrapper({
  problem,
  showSubmissions = false,
  contestMode = false,
}: ContestProblemWrapperProps) {
  const {
    containerRef,
    rightPanelRef,

    // Layout state
    leftWidth,
    editorHeight,
    isHorizontalDragging,
    isVerticalDragging,

    // Test cases state
    testCases,
    activeTestCase,
    setActiveTestCase,

    // Code execution state
    isRunning,
    isSubmitting,
    testResults,
    submitResults,
    runError,

    // Event handlers
    handleHorizontalMouseDown,
    handleVerticalMouseDown,
    handleRun,
    handleSubmit,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,
    clearSubmitResults,
  } = useProblemDescription({
    problem,
  });

  return (
    <div className="h-full">
      <div
        ref={containerRef}
        className="flex h-full gap-0 relative bg-slate-50 dark:bg-slate-900"
        style={{
          height: contestMode ? '100%' : 'calc(100vh - 60px)',
        }}
      >
        {/* Left Panel - Problem Description or Submit Result */}
        {isSubmitting || submitResults ? (
          <SubmitResultTab
            width={leftWidth}
            result={submitResults}
            isSubmitting={isSubmitting}
            onClose={clearSubmitResults}
          />
        ) : (
          <DescriptionPanel problem={problem} width={leftWidth} />
        )}

        {/* Horizontal Resizer */}
        <ResizableDivider
          direction="horizontal"
          isDragging={isHorizontalDragging}
          onMouseDown={handleHorizontalMouseDown}
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
              contestMode={contestMode}
              height={editorHeight}
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
              runError={runError}
              isRunning={isRunning}
              onTestCaseAdd={handleTestCaseAdd}
              onTestCaseDelete={handleTestCaseDelete}
              onTestCaseChange={handleTestCaseChange}
              onActiveTestCaseChange={setActiveTestCase}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
