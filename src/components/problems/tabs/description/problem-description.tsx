'use client';

import { useProblemDescription } from '@/hooks/use-problem-description';
import type { ProblemDetail as ProblemDetailType } from '@/types/problems';
import React from 'react';
import { ResizableDivider } from './dividers/resizable-divider';
import { DescriptionPanel } from './panels/description-panel/description-panel';
import { EditorPanel } from './panels/editor-panel/editor-panel';
import { SampleTestCasesPanel } from './panels/sample-testcases-panel/sample-testcases-panel';
import { SubmitResultTab } from './panels/submit-result/submit-result-tab';

interface ProblemDescriptionProps {
  problem: ProblemDetailType;
}

export default function ProblemDescription({
  problem,
}: ProblemDescriptionProps) {
  const {
    containerRef, // Ref chính để resize ngang (trái/phải)
    rightPanelRef, // Ref panel phải để resize dọc (editor/test cases)

    // Layout state - Kích thước và trạng thái resize
    leftWidth, // Phần trăm chiều rộng panel trái (problem description)
    editorHeight, // Phần trăm chiều cao editor trong panel phải
    isHorizontalDragging, // Đang kéo divider ngang
    isVerticalDragging, // Đang kéo divider dọc

    // Test cases state - Quản lý test cases
    testCases, // Mảng test cases với input/output
    activeTestCase, // Index test case đang chọn
    setActiveTestCase, // Function thay đổi test case active

    // Code execution state - Chạy và submit code
    isRunning, // Đang chạy code (Run button)
    isSubmitting, // Đang submit code (Submit button)
    testResults, // Kết quả từ test case execution (SSE data)
    submitResults, // Kết quả từ submit (SSE data)
    runError, // Lỗi khi gọi API run (nếu có)

    // Event handlers - Xử lý tương tác user
    handleHorizontalMouseDown, // Bắt đầu resize ngang
    handleVerticalMouseDown, // Bắt đầu resize dọc
    handleRun, // Chạy code với sample test cases
    handleSubmit, // Submit code để đánh giá cuối
    handleTestCaseSave, // Lưu thay đổi test case
    handleTestCaseEdit, // Toggle edit mode cho test case
    handleTestCaseChange, // Cập nhật input/output của test case
    handleTestCaseAdd, // Thêm test case mới
    handleTestCaseDelete, // Xóa test case
    clearSubmitResults, // Đóng submit panel
  } = useProblemDescription({
    problem,
  });

  return (
    <div className="h-full">
      <div
        ref={containerRef}
        className="flex h-full gap-0 relative bg-slate-50 dark:bg-slate-900"
        style={{
          height: 'calc(100vh - 60px)',
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
