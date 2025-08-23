// src/app/problems/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  useEffect(() => {
    // Redirect to problem description tab by default
    router.replace(`/problems/${problemId}/problem`);
  }, [problemId, router]);

  return null; // Or a loading spinner
}
