
import { mockProblems } from "@/lib/data/mock-problems";
import ProblemDetail from "@/components/problem/problem-detail-tab";

export default async function ProblemDescriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const problemId = params.id;
  const problem = mockProblems.find((p) => p.id === problemId);

  if (!problem) return null;

  return (
    <ProblemDetail 
      problem={problem}
      showContestInfo={false}
    />
  );
}


// "use client";

// import { Button } from "@/components/ui/button";
// import { mockProblems } from "@/lib/data/mock-problems";
// import { Copy, Timer, MemoryStick, FileText } from "lucide-react";
// import { ProblemSidebar } from "@/components/problem";
// import { MonacoSubmitEditor } from "@/components/editor";
// import { useParams } from "next/navigation";
// import React, { useState, useRef, useCallback } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   AlertCircle,
//   BarChart3,
//   Bot,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Code,
//   Code2,
//   MessageCircle,
//   Play,
//   Plus,
//   Search,
//   Send,
//   Share,
//   Sparkles,
//   TestTube,
//   X,
//   XCircle,
// } from "lucide-react";

// export default function ProblemDescriptionPage() {
//   const [isRunning, setIsRunning] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [output, setOutput] = useState("");
//   const [activeTestCase, setActiveTestCase] = useState(0);
//   const params = useParams();
//   const problemId = params.id as string;
//   const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//   const [submissions, setSubmissions] = useState<
//     Array<{
//       id: number;
//       timestamp: string;
//       status:
//         | "Accepted"
//         | "Wrong Answer"
//         | "Time Limit Exceeded"
//         | "Runtime Error";
//       runtime: string;
//       memory: string;
//       score: number;
//     }>
//   >([]);

//   // Resizable panel state for horizontal (left/right)
//   const [leftWidth, setLeftWidth] = useState(40); // percentage
//   const [isDragging, setIsDragging] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Resizable panel state for vertical (editor/test cases)
//   const [editorHeight, setEditorHeight] = useState(60); // percentage
//   const [isVerticalDragging, setIsVerticalDragging] = useState(false);
//   const rightPanelRef = useRef<HTMLDivElement>(null);

//   // Horizontal resizer handlers
//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!isDragging || !containerRef.current) return;

//       const containerRect = containerRef.current.getBoundingClientRect();
//       const containerWidth = containerRect.width;
//       const mouseX = e.clientX - containerRect.left;
//       const newLeftWidth = (mouseX / containerWidth) * 100;

//       // Constrain between 30% and 80%
//       const constrainedWidth = Math.min(Math.max(newLeftWidth, 30), 80);
//       setLeftWidth(constrainedWidth);
//     },
//     [isDragging]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   // Vertical resizer handlers
//   const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsVerticalDragging(true);
//   }, []);

//   const handleVerticalMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!isVerticalDragging || !rightPanelRef.current) return;

//       const panelRect = rightPanelRef.current.getBoundingClientRect();
//       const panelHeight = panelRect.height;
//       const mouseY = e.clientY - panelRect.top;
//       const newEditorHeight = (mouseY / panelHeight) * 100;

//       // Constrain between 30% and 80%
//       const constrainedHeight = Math.min(Math.max(newEditorHeight, 30), 80);
//       setEditorHeight(constrainedHeight);
//     },
//     [isVerticalDragging]
//   );

//   const handleVerticalMouseUp = useCallback(() => {
//     setIsVerticalDragging(false);
//   }, []);

//   // Add global mouse event listeners
//   React.useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       document.body.style.cursor = "col-resize";
//       document.body.style.userSelect = "none";
//     }

//     if (isVerticalDragging) {
//       document.addEventListener("mousemove", handleVerticalMouseMove);
//       document.addEventListener("mouseup", handleVerticalMouseUp);
//       document.body.style.cursor = "row-resize";
//       document.body.style.userSelect = "none";
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//       document.removeEventListener("mousemove", handleVerticalMouseMove);
//       document.removeEventListener("mouseup", handleVerticalMouseUp);
//       document.body.style.cursor = "";
//       document.body.style.userSelect = "";
//     };
//   }, [isDragging, isVerticalDragging, handleMouseMove, handleMouseUp, handleVerticalMouseMove, handleVerticalMouseUp]);

//   const handleTestCaseSave = (id: number) => {
//     handleTestCaseEdit(id);
//   };

//   const handleTestCaseEdit = (id: number) => {
//     setTestCases((prev) =>
//       prev.map((testCase) =>
//         testCase.id === id
//           ? { ...testCase, isEditing: !testCase.isEditing }
//           : testCase
//       )
//     );
//   };

//   const handleTestCaseChange = (
//     id: number,
//     field: "input" | "output",
//     value: string
//   ) => {
//     setTestCases((prev) =>
//       prev.map((testCase) =>
//         testCase.id === id ? { ...testCase, [field]: value } : testCase
//       )
//     );
//   };

//   const handleTestCaseAdd = () => {
//     const newTestCase = {
//       id: Date.now(),
//       input: "",
//       output: "",
//       isEditing: true,
//     };
//     setTestCases((prev) => [...prev, newTestCase]);
//     setActiveTestCase(testCases.length);
//   };

//   const handleTestCaseDelete = (id: number) => {
//     setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
//     if (activeTestCase >= testCases.length - 1) {
//       setActiveTestCase(Math.max(0, testCases.length - 2));
//     }
//   };

//   const [testCases, setTestCases] = useState([
//     {
//       id: 1,
//       input: "5",
//       output: "1 1 2 1 4",
//       isEditing: false,
//     },
//     {
//       id: 2,
//       input: "10",
//       output: "1 1 2 1 4 2 6 1 6 2",
//       isEditing: false,
//     },
//     {
//       id: 3,
//       input: "3",
//       output: "1 1 2",
//       isEditing: false,
//     },
//   ]);

//   const problem = mockProblems.find((p) => p.id === problemId);

//   if (!problem) return null;

//   const handleRun = async () => {
//     setIsRunning(true);
//     setOutput("Running...");

//     setTimeout(() => {
//       setOutput(
//         "Sample Input: 5\\nSample Output: 1 1 2 3 5\\n\\nExecution time: 0.12s\\nMemory used: 2.4 MB\\n\\n✅ Test passed!"
//       );
//       setIsRunning(false);
//     }, 2000);
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setOutput("Submitting...");

//     setTimeout(() => {
//       const statusOptions: Array<
//         "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
//       > = ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"];
//       const randomStatus =
//         statusOptions[Math.floor(Math.random() * statusOptions.length)];

//       const newSubmission = {
//         id: submissions.length + 1,
//         timestamp: new Date().toLocaleString(),
//         status: Math.random() > 0.3 ? ("Accepted" as const) : randomStatus,
//         runtime: `${(Math.random() * 2).toFixed(2)}s`,
//         memory: `${(Math.random() * 50 + 10).toFixed(1)}MB`,
//         score: Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 60 + 20),
//       };

//       setSubmissions([newSubmission, ...submissions]);
//       setOutput(
//         `✅ Submission #${newSubmission.id} completed!\n\nStatus: ${
//           newSubmission.status
//         }\nRuntime: ${newSubmission.runtime}\nMemory: ${
//           newSubmission.memory
//         }\nScore: ${
//           newSubmission.score
//         }/100\n\nTest case 1: Passed (0.08s)\nTest case 2: Passed (0.12s)\nTest case 3: ${
//           newSubmission.status === "Accepted" ? "Passed" : "Failed"
//         } (0.15s)`
//       );
//       setIsSubmitting(false);
//     }, 3000);
//   };

//   const copyToClipboard = (text: string, index: number) => {
//     navigator.clipboard.writeText(text);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const sampleCases = [
//     {
//       input: "5",
//       output: "1 1 2 3 5",
//       explanation: "First 5 Fibonacci numbers",
//     },
//     {
//       input: "8",
//       output: "1 1 2 3 5 8 13 21",
//       explanation: "First 8 Fibonacci numbers",
//     },
//   ];

//   return (
//     <div 
//       ref={containerRef}
//       className="flex h-full gap-0 relative"
//       style={{ height: "calc(100vh - 60px)" }}
//     >
//       {/* Left Panel - Problem Description */}
//       <div 
//         className="overflow-y-auto pb-4"
//         style={{ width: `${leftWidth}%` }}
//       >
//         <div className="pr-3 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
//           <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
//           <div className="p-8 space-y-8" style={{ borderWidth: 1, borderRadius: "inherit" }}>

//               {/* Problem Title Header */}
//               <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
//                   {problem.title}
//                 </h1>
//                 <div className="flex items-center gap-4 flex-wrap">
//                   <div
//                     className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
//                       problem.difficulty === "Dễ"
//                         ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
//                         : problem.difficulty === "Trung bình"
//                         ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
//                         : "bg-gradient-to-r from-red-400 to-red-500 text-white"
//                     }`}
//                   >
//                     {problem.difficulty}
//                   </div>
//                   <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
//                     <Timer className="w-4 h-4" />
//                     2.0s time limit
//                   </div>
//                   <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
//                     <MemoryStick className="w-4 h-4" />
//                     256MB memory
//                   </div>
//                   <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
//                     <FileText className="w-4 h-4" />
//                     {problem.points} điểm
//                   </div>
//                 </div>
//               </div>

//               {/* Problem Description */}
//               <section>
//                 <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
//                   Mô tả bài toán
//                 </h2>
//                 <div className="prose prose-slate dark:prose-invert max-w-none">
//                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
//                     Cho số nguyên dương <strong>N</strong>, liệt kê phi hàm euler
//                     của các số từ 1 tới N và in ra màn hình.
//                   </p>
//                   <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
//                     Phi hàm euler của số <strong>X</strong> hiển số lượng số
//                     nguyên tố cùng nhau với <strong>X</strong> nằm trong khoảng từ
//                     [1, X].
//                   </p>
//                 </div>
//               </section>

//               {/* Input Format */}
//               <section>
//                 <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
//                   Đầu vào
//                 </h2>
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
//                   <p className="text-slate-700 dark:text-slate-300">
//                     • Số nguyên N
//                   </p>
//                 </div>
//               </section>

//               {/* Constraints */}
//               <section>
//                 <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
//                   Giới hạn
//                 </h2>
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
//                   <p className="text-slate-700 dark:text-slate-300">• 1≤N≤10^6</p>
//                 </div>
//               </section>

//               {/* Output Format */}
//               <section>
//                 <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
//                   Đầu ra
//                 </h2>
//                 <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
//                   <p className="text-slate-700 dark:text-slate-300">
//                     • In ra phi hàm euler của các số từ 1 tới N
//                   </p>
//                 </div>
//               </section>

//               {/* Sample Cases */}
//               <section>
//                 <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
//                   Ví dụ
//                 </h2>
//                 {sampleCases.map((testCase, index) => (
//                   <div
//                     key={`testcase-${index}-${testCase.input.slice(0, 10)}`}
//                     className="mb-6 last:mb-0"
//                   >
//                     <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
//                       Test case {index + 1}
//                     </h3>

//                     {/* Input */}
//                     <div className="mb-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
//                           Input
//                         </h4>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             copyToClipboard(testCase.input, index * 2)
//                           }
//                           className="h-6 px-2 text-xs"
//                         >
//                           <Copy className="w-3 h-3 mr-1" />
//                           {copiedIndex === index * 2 ? "Copied!" : "Copy"}
//                         </Button>
//                       </div>
//                       <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
//                         <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">
//                           {testCase.input}
//                         </code>
//                       </div>
//                     </div>

//                     {/* Output */}
//                     <div className="mb-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
//                           Output
//                         </h4>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             copyToClipboard(testCase.output, index * 2 + 1)
//                           }
//                           className="h-6 px-2 text-xs"
//                         >
//                           <Copy className="w-3 h-3 mr-1" />
//                           {copiedIndex === index * 2 + 1 ? "Copied!" : "Copy"}
//                         </Button>
//                       </div>
//                       <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
//                         <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">
//                           {testCase.output}
//                         </code>
//                       </div>
//                     </div>

//                     {/* Explanation */}
//                     {testCase.explanation && (
//                       <div className="text-sm text-slate-600 dark:text-slate-400 italic">
//                         {testCase.explanation}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </section>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Horizontal Resizer */}
//       <div
//         className={`w-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-col-resize transition-colors flex-shrink-0 ${
//           isDragging ? "bg-blue-500 dark:bg-blue-400" : ""
//         }`}
//         onMouseDown={handleMouseDown}
//       >
//         <div className="h-full w-full flex items-center justify-center">
//           <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-500 rounded-full opacity-50"></div>
//         </div>
//       </div>

//       {/* Right Panel - Editor and Test Cases */}
//       <div 
//         ref={rightPanelRef}
//         className="flex flex-col overflow-hidden pb-4"
//         style={{ width: `${100 - leftWidth}%` }}
//       >
//         <div className="pl-3 flex flex-col h-full gap-0">
          
//           {/* Editor Section */}
//           <div 
//             className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
//             style={{ height: `${editorHeight}%` }}
//           >
//             <div className="h-full flex flex-col">
//               <div className="flex-1 min-h-0">
//                 <MonacoSubmitEditor
//                   onRun={handleRun}
//                   onSubmit={handleSubmit}
//                   isRunning={isRunning}
//                   isSubmitting={isSubmitting}
//                 />
//               </div>

//               {/* Output Section */}
//               {output && (
//                 <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
//                       <CheckCircle className="w-4 h-4 text-white" />
//                     </div>
//                     <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                       Execution Result
//                     </h4>
//                   </div>
//                   <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-inner max-h-32 overflow-y-auto">
//                     <pre className="text-green-400 dark:text-green-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
//                       {output}
//                     </pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Vertical Resizer */}
//           <div
//             className={`h-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-row-resize transition-colors flex-shrink-0 my-3 ${
//               isVerticalDragging ? "bg-blue-500 dark:bg-blue-400" : ""
//             }`}
//             onMouseDown={handleVerticalMouseDown}
//           >
//             <div className="h-full w-full flex items-center justify-center">
//               <div className="h-0.5 w-8 bg-slate-400 dark:bg-slate-500 rounded-full opacity-50"></div>
//             </div>
//           </div>

//           {/* Test Cases Section */}
//           <div 
//             className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden flex flex-col"
//             style={{ height: `${100 - editorHeight}%` }}
//           >
//             {/* Test Cases Header */}
//             <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//                     <TestTube className="w-4 h-4 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
//                       Sample Test Cases
//                     </h3>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">
//                       Test your code with these examples
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleRun}
//                   disabled={isRunning}
//                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
//                 >
//                   {isRunning ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
//                       Running...
//                     </>
//                   ) : (
//                     <>
//                       <Play className="w-4 h-4 mr-2" />
//                       Test Run
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>

//             {/* Test Cases Content */}
//             <div className="p-6 flex-1 overflow-y-auto">
//               {/* Test Case Tabs */}
//               <div className="flex items-center gap-2 mb-6 overflow-x-auto">
//                 {testCases.map((testCase, index) => (
//                   <button
//                     key={testCase.id}
//                     onClick={() => setActiveTestCase(index)}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
//                       activeTestCase === index
//                         ? "bg-blue-500 text-white shadow-md"
//                         : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
//                     }`}
//                   >
//                     Case {index + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={handleTestCaseAdd}
//                   className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-1"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span className="text-sm font-medium">Add</span>
//                 </button>
//               </div>

//               {/* Active Test Case Content */}
//               {testCases[activeTestCase] && (
//                 <div className="space-y-6">
//                   {/* Input Section */}
//                   <div>
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                         <span className="text-blue-500">📥</span>
//                         Input
//                       </h4>
//                       {testCases.length > 1 && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             handleTestCaseDelete(testCases[activeTestCase].id)
//                           }
//                           className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                         >
//                           <X className="w-3 h-3" />
//                         </Button>
//                       )}
//                     </div>
//                     {testCases[activeTestCase].isEditing ? (
//                       <div className="space-y-2">
//                         <textarea
//                           value={testCases[activeTestCase].input}
//                           onChange={(e) =>
//                             handleTestCaseChange(
//                               testCases[activeTestCase].id,
//                               "input",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Enter input values..."
//                           className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
//                         />
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             onClick={() =>
//                               handleTestCaseSave(testCases[activeTestCase].id)
//                             }
//                             className="bg-green-600 hover:bg-green-700 text-white text-xs"
//                           >
//                             Save
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               handleTestCaseEdit(testCases[activeTestCase].id)
//                             }
//                             className="text-xs"
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div
//                         onClick={() =>
//                           handleTestCaseEdit(testCases[activeTestCase].id)
//                         }
//                         className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-xs text-slate-500 dark:text-slate-400">
//                             Click to edit
//                           </span>
//                           <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
//                         </div>
//                         <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
//                           {testCases[activeTestCase].input || "Enter input..."}
//                         </pre>
//                       </div>
//                     )}
//                   </div>

//                   {/* Output Section */}
//                   <div>
//                     <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
//                       <span className="text-green-500">📤</span>
//                       Expected Output
//                     </h4>
//                     {testCases[activeTestCase].isEditing ? (
//                       <textarea
//                         value={testCases[activeTestCase].output}
//                         onChange={(e) =>
//                           handleTestCaseChange(
//                             testCases[activeTestCase].id,
//                             "output",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Enter expected output..."
//                         className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
//                       />
//                     ) : (
//                       <div
//                         onClick={() =>
//                           handleTestCaseEdit(testCases[activeTestCase].id)
//                         }
//                         className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-xs text-slate-500 dark:text-slate-400">
//                             Click to edit
//                           </span>
//                           <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
//                         </div>
//                         <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
//                           {testCases[activeTestCase].output ||
//                             "Enter expected output..."}
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Test Case Navigation */}
//               {testCases.length > 1 && (
//                 <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setActiveTestCase(Math.max(0, activeTestCase - 1))
//                     }
//                     disabled={activeTestCase === 0}
//                     className="flex items-center gap-2"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                     Previous
//                   </Button>
//                   <span className="text-sm text-slate-600 dark:text-slate-400">
//                     {activeTestCase + 1} of {testCases.length}
//                   </span>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setActiveTestCase(
//                         Math.min(testCases.length - 1, activeTestCase + 1)
//                       )
//                     }
//                     disabled={activeTestCase === testCases.length - 1}
//                     className="flex items-center gap-2"
//                   >
//                     Next
//                     <ChevronRight className="w-4 h-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }