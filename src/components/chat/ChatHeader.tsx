import { Info, MessageSquare } from 'lucide-react'
import { FC, useContext } from 'react'
import { ChatContext } from './ChatContext'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface ChatHeaderProps {
}

const ChatHeader: FC<ChatHeaderProps> = () => {

    const { condition, messageHistory } = useContext(ChatContext)

    if (messageHistory.length === 0) return null

    return <div className='sticky top-0 flex w-screen h-12 items-center justify-center transition-all gap-5 z-10 border-b bg-background/70 px-4 backdrop-blur'>
        <MessageSquare className='h-5 w-5 text-blue-500' />
        <h3 className='font-semibold text-xl'>
            {condition?.startScreenTitle}
        </h3>
        <Popover>
            <PopoverTrigger><Info height="18" /></PopoverTrigger>
            <PopoverContent><p>{condition?.startScreenMessage}</p></PopoverContent>
        </Popover>

    </div>
}


export default ChatHeader