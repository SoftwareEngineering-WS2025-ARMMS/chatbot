import { Button } from '../ui/button'
import { useEffect, useRef } from 'react'
import { useChatContext } from './ChatContext'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { ButtonScrollToBottom } from '../button-scroll-to-bottom'
import { ArrowLeft, CheckCheck, CornerDownLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import Textarea from 'react-textarea-autosize'


interface ChatInputProps {
    isDisabled?: boolean
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
    const { message, setMessage, isLoading, submitMessage, handleInputChange, messageHistory, conditionIsComplete, setConditionIsComplete } =
        useChatContext()

    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
            <ButtonScrollToBottom />
            <div className="mx-auto sm:max-w-2xl sm:px-4">
                <div className="flex h-10 items-center justify-center mb-1">
                    {messageHistory?.length >= 2 && (
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => {
                                setConditionIsComplete(prev => !prev)
                            }}
                            className="bg-background"
                        >
                            {conditionIsComplete ? <ArrowLeft className="mr-2 h-4 w-4" /> : <CheckCheck className="mr-2 h-4 w-4" />}
                            {conditionIsComplete ? "Back to task" : "I am done!"}
                        </Button>
                    )}
                </div>

                <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
                    <form
                        ref={formRef}
                        onSubmit={e => {
                            e.preventDefault()
                            if (!message?.trim()) return
                            submitMessage()
                        }}
                    >
                        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pr-8 sm:rounded-md sm:border sm:pr-12">
                            <Textarea
                                data-gramm="false" //Disable Grammarly
                                onKeyDown={onKeyDown}
                                ref={inputRef}
                                tabIndex={0}
                                rows={1}
                                value={message}
                                onChange={event => handleInputChange(event)}
                                placeholder="Send a message."
                                spellCheck={false}
                                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm border-none"
                                disabled={conditionIsComplete}
                            />

                            <div className="absolute right-0 top-4 sm:right-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="submit" size="icon" disabled={isLoading || message === ''} className='h-8 w-8'>
                                            <CornerDownLeft className="h-5 w-5" />
                                            <span className="sr-only">Send message</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Send message</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
