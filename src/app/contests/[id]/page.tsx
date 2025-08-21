"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContestIndexRedirect() {
    const params = useParams();
    const router = useRouter();
    const contestId = params.id as string;
    useEffect(() => {
        router.replace(`/contests/${contestId}/info`);
    }, [contestId, router]);
    return null; // could show loading spinner
}
