import ChatMessage from './ChatMessage'
import { FC, useContext, useEffect } from 'react'
import { ChatContext } from './ChatContext'
import StartScreen from './StartScreen'
import { Separator } from '../ui/separator'
import CompleteScreen from './CompleteScreen'

interface MessagesProps {

}

const ChatMessageList: FC<MessagesProps> = () => {
    const { messageHistory, isLoading, condition, conditionIsComplete: taskIsComplete } = useContext(ChatContext)

    useEffect(() => {
        console.log(messageHistory)
    }, [messageHistory])


    if (taskIsComplete) return <div className="flex flex-col mx-auto max-w-2xl px-4 flex-1">
        <CompleteScreen />
    </div>

    return (
        <div className="flex flex-col mx-auto max-w-2xl px-4 flex-1">
            {messageHistory.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} condition={condition} />

                    {index < messageHistory.length - 1 && <Separator className="my-4 md:my-7" />}
                </div>
            ))}


            {!messageHistory.length && <StartScreen />}
        </div>
    )
}

export default ChatMessageList