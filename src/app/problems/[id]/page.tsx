// src/app/problems/[id]/page.tsx

import { redirect } from "next/navigation";

export default function ProblemPage({ params }: { params: { id: string } }) {
  redirect(`/problems/${params.id}/problem`);
}
