// src/app/problems/[id]/page.tsx

import { redirect } from "next/navigation";


export default async function ProblemPage({ params }: {params: Promise<{id: string}>; }) {
  const resolvedParams = await params;
  redirect(`/problems/${resolvedParams.id}/problem`);
}
