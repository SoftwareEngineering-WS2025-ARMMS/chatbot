import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { ICondition } from '@/types/condition'
import { BotIcon, UserIcon } from 'lucide-react'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import type { ChatMessage } from '@/types/message'

interface MessageProps {
    condition: ICondition
    message: ChatMessage
}

const ChatMessage = forwardRef<HTMLDivElement, MessageProps>(({ message, condition, ...props }, ref) => {

    return (
        <div className={cn('group relative mb-4 flex items-start ')} {...props}>

            <div className={cn('flex h-10 w-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-md shadow',
                message.role === 'user' ? 'bg-background text-muted-foreground' : 'bg-secondary')}
            >
                {/* Edit Icon of Human and AI here */}

                {message.role === 'user' ? <UserIcon /> : <BotIcon />}
                {/* e.g. for human img: {message.role === 'user' ? <UserIcon /> : <div className='relative h-10 w-10'><Image src={"/human_picture.jpg"} fill={true} sizes='200x200' style={{ objectFit: "cover" }} alt="Human" className='overflow-hidden' /></div>} */}
                {/* e.g. for neutral img: {message.role === 'user' ? <UserIcon /> : <div className='relative h-10 w-10'/>} */}
            </div>



            <div className="ml-4 flex-1 overflow-hidden px-1">

                {/* Edit Name of Human and AI here */}
                <p className='font-bold text-sm'>{message.role === "user" ? "You" : "Assistant"}</p>

                {message.content === '' && (
                    <div className="flex text-xl">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse" style={{ animationDelay: '333ms' }}>.</span>
                        <span className="animate-pulse" style={{ animationDelay: '666ms' }}>.</span>
                    </div>
                )}

                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p className="mb-2 last:mb-0">{children}</p>
                        }
                    }}
                >
                    {message.content}
                </MemoizedReactMarkdown>
            </div>
        </div>
    )
}
)

ChatMessage.displayName = 'Message'

export default ChatMessage