import { MessageSquare } from 'lucide-react'
import { FC, useContext } from 'react'
import { ChatContext } from './ChatContext'

interface EmptyScreenProps {

}

const StartScreen: FC<EmptyScreenProps> = ({ }) => {

    const { condition } = useContext(ChatContext)

    return <div className='flex flex-col items-center justify-center gap-2 text-center my-auto'>
        <MessageSquare className='h-8 w-8 text-blue-500' />
        <h3 className='font-semibold text-xl'>
            {condition?.startScreenMessage}
        </h3>
        <p className='text-zinc-500 text-sm'>
            {condition?.startScreenTitle}
        </p>
    </div>
}

export default StartScreen