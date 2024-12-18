"use client"
import { useRouter } from "next/navigation";

export interface PageProps {
    params: {
        conditionId: string
    }
}

// page to redirect to the condition with undefined responseId for testing
export default async function Home({ params }: PageProps) {
    const router = useRouter()
    router.push("/" + params.conditionId + "/undefined")

    return <></>
}
