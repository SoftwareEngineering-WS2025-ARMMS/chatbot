"use Server"
import ChatWrapper from "@/components/chat/ChatWrapper";
import { createChat } from "@/types/chat";


export interface PageProps {
    params: {
        conditionId: string
        responseId: string
    }
}


export default async function Home({ params }: PageProps) {

    try {
        const chat = await createChat( params.conditionId, params.responseId)
        return (
            <ChatWrapper chat={chat} />
        )

    } catch (error) {
        console.error(error)
        return <div>
            <p>Error creating chat from conditionId: {params.conditionId}</p>
            <p>{String(error)}</p>
        </div>
    }
}
