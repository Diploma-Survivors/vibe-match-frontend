'use client';

import CreateSolutionHeader from '@/components/problems/tabs/solutions/create/create-solution-header';
import CreateSolutionSkeleton from '@/components/problems/tabs/solutions/create/create-solution-skeleton';
import EditorSplitPane, {
  type EditorRef,
} from '@/components/problems/tabs/solutions/create/editor-split-pane';
import MarkdownToolbar from '@/components/problems/tabs/solutions/create/markdown-toolbar';
import TagLanguageSelector from '@/components/problems/tabs/solutions/create/tag-language-selector';
import { useDialog } from '@/components/providers/dialog-provider';
import { SolutionsService } from '@/services/solutions-service';
import { SubmissionsService } from '@/services/submissions-service';
import { toastService } from '@/services/toasts-service';
import type { RootState } from '@/store/index';
import { resetDraft, setDraft } from '@/store/slides/create-solution-slice';
import {
  type SubmissionDetailData,
  SubmissionStatus,
} from '@/types/submissions';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DEFAULT_MARKDOWN = `# Intuition

# Approach
<!-- {t('description')} -->

# Complexity
- Time complexity:
<!-- {t('time_complexity')} -->

- Space complexity:
<!-- {t('space_complexity')} -->

# Code
\`\`\`cpp []
// {t('code_placeholder')}
\`\`\`
`;

export default function CreateSolutionPage() {
  const { t } = useTranslation('problems');
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const problemId = params.id as string;
  // const submissionId = params.submissionId as string;
  // TODO: replace this hardcode later
  const submissionId = '51' as string;

  const { confirm } = useDialog();

  const editorRef = useRef<EditorRef>(null);

  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [submission, setSubmission] = useState<SubmissionDetailData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const drafts = useSelector((state: RootState) => state.createSolution.drafts);

  const loadDefaultContent = useCallback(async (sub: SubmissionDetailData) => {
    try {
      // If we already have the full detail from getSubmissionById, we might not need to call it again?
      // Actually getSubmissionById returns SubmissionDetailData, but setSubmission expects SubmissionListItem.
      // Let's check the types.
      // SubmissionsService.getSubmissionById returns ApiResponse<SubmissionDetailData>.
      // SubmissionListItem is a subset of SubmissionDetailData mostly.
      // But wait, in fetchSubmission I am calling getSubmissionById.

      // Re-using the sub object passed in which is the full detail now.
      const sourceCode = sub.sourceCode;
      const langName = sub.language.name.toLowerCase();

      let newContent = DEFAULT_MARKDOWN.replace('cpp []', `${langName} []`);
      newContent = newContent.replace(
        '// Code will be inserted here',
        sourceCode
      );
      setContent(newContent);
    } catch (error) {
      console.error('Error loading default content:', error);
    }
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;

      try {
        const response =
          await SubmissionsService.getSubmissionById(submissionId);
        const sub = response.data.data;

        setSubmission(sub);

        const draft = drafts[sub.id.toString()];
        if (draft) {
          setContent(draft);
        } else {
          await loadDefaultContent(sub);
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
        // Handle 404 or other errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [drafts, loadDefaultContent]);

  // Save draft on content change
  useEffect(() => {
    if (submission) {
      dispatch(
        setDraft({
          submissionId: submission.id.toString(),
          content,
        })
      );
    }
  }, [content, submission, dispatch]);

  const handleReset = async () => {
    if (submission) {
      const result = await confirm({
        title: 'Hủy bài viết',
        message: 'Bạn có muốn hủy bài viết không?',
        confirmText: 'Tiếp tục',
        cancelText: 'Hủy',
        color: 'red',
      });
      if (!result) return;
      dispatch(resetDraft(submission.id.toString()));
      await loadDefaultContent(submission);
    }
  };

  const handlePost = async () => {
    if (!title.trim()) {
      toastService.error('Hãy nhập tiêu đề cho solution');
      return;
    }
    if (!content.trim()) {
      toastService.error('Hãy nhập nội dung cho solution');
      return;
    }
    if (!submission) return;

    try {
      await SolutionsService.createSolution({
        problemId,
        title,
        content,
        tagIds: selectedTags,
        languageIds: selectedLanguages,
      });

      // Clear draft
      dispatch(resetDraft(submission.id.toString()));

      // Navigate back to solutions tab
      router.push(`/problems/${problemId}/solutions`);
    } catch (error) {
      console.error('Error creating solution:', error);
      alert('Failed to create solution');
    }
  };

  const handleCancel = async () => {
    const result = await confirm({
      title: 'Hủy bài viết',
      message: 'Bạn có muốn hủy bài viết không?',
      confirmText: 'Tiếp tục',
      cancelText: 'Hủy',
      color: 'red',
    });
    if (!result) return;
    // navigate back to the problem page
    router.push(`/problems/${problemId}/description`);
  };

  if (isLoading) {
    return <CreateSolutionSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-65px)] bg-white dark:bg-slate-950 flex flex-col overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full px-4 flex flex-col h-full">
        <CreateSolutionHeader
          title={title}
          setTitle={setTitle}
          onPost={handlePost}
          onCancel={handleCancel}
          onReset={handleReset}
        />

        <div className="py-2 space-y-4 flex-1 flex flex-col overflow-hidden">
          <TagLanguageSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            selectedLanguages={selectedLanguages}
            onLanguagesChange={setSelectedLanguages}
          />

          <div className="flex-1 flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <MarkdownToolbar
              onAction={(action: string) =>
                editorRef.current?.executeAction(action)
              }
            />
            <EditorSplitPane
              ref={editorRef}
              content={content}
              onChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
