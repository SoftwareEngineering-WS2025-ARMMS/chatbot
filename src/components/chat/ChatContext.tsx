import { ChangeEvent, Dispatch, ReactNode, SetStateAction, createContext, useContext, useRef, useState, } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { ChatMessage } from '@/types/message'
import { IChat } from '@/types/chat'
import { ICondition } from '@/types/condition'

type ChatContextType = {
    messageHistory: ChatMessage[]
    submitMessage: () => void
    setMessage: Dispatch<SetStateAction<string>>
    message: string
    handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    isLoading: boolean
    conditionIsComplete: boolean
    setConditionIsComplete: Dispatch<SetStateAction<boolean>>
    condition: ICondition
}


//hook that makes Context usable from everywhere in the app
export const useChatContext = () => useContext(ChatContext)

export const ChatContext = createContext<ChatContextType>({
    messageHistory: [],
    submitMessage: () => { },
    setMessage: () => { },
    message: '',
    handleInputChange: () => { },
    isLoading: false,
    condition: {} as ICondition,
    conditionIsComplete: false,
    setConditionIsComplete: () => { },
})

interface Props {
    chat: IChat
    responseId: string | null
    children: ReactNode
}

export const ChatContextProvider = ({ chat, responseId, children, }: Props) => {

    const { condition, messages: initialMessages } = chat
    const [conditionIsComplete, setConditionIsComplete] = useState<boolean>(false)

    const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([])
    const [message, setMessage] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const { toast } = useToast()
    const backupMessage = useRef('')

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message, messageHistory, chatId }: { message: string, messageHistory: ChatMessage[], chatId: string }) => {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    chatId,
                    responseId,
                    message,
                }),
            })

            if (!response.ok) {
                throw new Error(await response.json().then((res) => res.error) ?? 'Failed to send message')
            }

            return response.body
        },
        onMutate: async ({ message }) => {
            backupMessage.current = message
            setMessage('')

            // step 1
            //save old state
            const previousMessages = [...messageHistory]

            // step 3
            //optimistic update
            setMessageHistory((prev) => [
                ...prev,
                {
                    role: 'user',
                    content: message,
                },
                {
                    role: 'assistant',
                    content: "",
                },
            ])

            window.scrollTo({
                top: document.body.offsetHeight,
                behavior: 'smooth'
            })

            setIsLoading(true)

            return {
                previousMessages: previousMessages ?? [],
            }
        },
        onSuccess: async (stream) => {
            if (!stream) {
                return toast({
                    title: 'There was a problem sending this message',
                    description:
                        'Please refresh this page and try again',
                    variant: 'destructive',
                })
            }

            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false

            // accumulated response
            let accResponse = ''

            while (!done) {
                const { value, done: doneReading } =
                    await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)

                accResponse += chunkValue


                //Update message history with AI response
                setMessageHistory((prev) => {
                    const aiResponse = prev.slice(-1)[0]
                    aiResponse.content = accResponse
                    return [...prev]
                })
            }
        },
        onError: (error, __, context) => {

            console.log('error', context)
            setMessage(backupMessage.current)
            setMessageHistory(context?.previousMessages ?? [])

            toast({
                title: 'There was a problem sending this message!',
                description:
                    'Please contact the research team for assistance. Error: ' + error.message,
                variant: 'destructive',
            })


        },
        onSettled: async () => {
            setIsLoading(false)
        },
    })

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }

    const submitMessage = () => sendMessage({ message, messageHistory, chatId: chat.id })


    return (
        <ChatContext.Provider
            value={{
                messageHistory,
                submitMessage,
                message,
                setMessage,
                handleInputChange,
                isLoading,
                condition,
                conditionIsComplete,
                setConditionIsComplete
            }}>
            {children}
        </ChatContext.Provider>
    )
}