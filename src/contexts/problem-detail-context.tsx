'use client';

import { useProblemDescription } from '@/hooks/use-problem-description';
import { ProblemsService } from '@/services/problems-service';
import { SubmissionsService } from '@/services/submissions-service';
import { setProblem } from '@/store/slides/problem-slice';
import type { ProblemDescription } from '@/types/problems';
import type { Language } from '@/types/submissions';
import { useParams } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useDispatch } from 'react-redux';

interface ProblemDetailContextType {
  problem: ProblemDescription | null;
  isLoading: boolean;
  languages: Language[];
  
  // From useProblemDescription
  containerRef: React.RefObject<HTMLDivElement | null>;
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
  leftWidth: number;
  editorHeight: number;
  isHorizontalDragging: boolean;
  isVerticalDragging: boolean;
  handleHorizontalMouseDown: (e: React.MouseEvent) => void;
  handleVerticalMouseDown: (e: React.MouseEvent) => void;
  
  testCases: any[]; // Replace with specific type if available
  activeTestCase: number;
  setActiveTestCase: (index: number) => void;
  handleTestCaseChange: (id: string, field: 'input' | 'output', value: string) => void;
  handleTestCaseAdd: () => void;
  handleTestCaseDelete: (id: string) => void;
  
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: any;
  submitResults: any;
  runError: any;
  handleRun: (sourceCode: string, languageId: number) => Promise<void>;
  handleSubmit: (sourceCode: string, languageId: number, contestId?: number) => Promise<void>;
  clearSubmitResults: () => void;
}

const ProblemDetailContext = createContext<ProblemDetailContextType | undefined>(
  undefined
);

export function ProblemDetailProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const problemId = params.id as string;
  const dispatch = useDispatch();

  const [problem, setProblemState] = useState<ProblemDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [languages, setLanguages] = useState<Language[]>([]);

  // 1. Fetch Problem and Languages
  useEffect(() => {
    if (!problemId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [problemData, langResponse] = await Promise.all([
          ProblemsService.getProblemById(problemId),
          SubmissionsService.getLanguageList(),
        ]);

        setProblemState(problemData);
        dispatch(setProblem(problemData)); // Keep redux sync for now
        setLanguages(langResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [problemId, dispatch]);

  // 2. Initialize Logic Hook (only when problem is loaded)
  // We need a dummy problem object if it's null to call the hook unconditionally,
  // or we can conditionally render the provider's content.
  // Better to conditionally render the children that need the hook data.
  // However, useProblemDescription calls hooks inside, so we must call it at top level.
  // We'll pass a partial/dummy object if loading, but real usage will wait for !isLoading.
  
  const problemDescriptionState = useProblemDescription({
    problem: problem || ({ id: problemId } as any),
  });

  if (isLoading || !problem) {
    return (
       // We can return a loading state here or just render children 
       // but children might fail if they expect context.
       // Let's return a skeleton or null, but ProblemLayout might want to show Skeleton.
       // Actually, we can return a partial context or handle nulls.
       // For simplicity, let's expose isLoading and let consumers handle skeletons.
       <ProblemDetailContext.Provider
         value={{
            isLoading: true,
            languages: [],
            ...problemDescriptionState, // This contains the dummy problem
            problem: null, // Override with null for consumers
         }}
       >
         {children}
       </ProblemDetailContext.Provider>
    );
  }

  return (
    <ProblemDetailContext.Provider
      value={{
        isLoading: false,
        languages,
        ...problemDescriptionState,
      }}
    >
      {children}
    </ProblemDetailContext.Provider>
  );
}

export function useProblemDetail() {
  const context = useContext(ProblemDetailContext);
  if (context === undefined) {
    throw new Error(
      'useProblemDetail must be used within a ProblemDetailProvider'
    );
  }
  return context;
}

