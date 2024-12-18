import { CheckSquare } from 'lucide-react'
import { FC, useContext } from 'react'
import { ChatContext } from './ChatContext'

interface EmptyScreenProps {

}

const CompleteScreen: FC<EmptyScreenProps> = ({ }) => {

    const { condition } = useContext(ChatContext)

    return <div className='flex flex-col items-center justify-center gap-2 text-center my-auto'>
        <CheckSquare className='h-8 w-8 text-green-700' />
        <h3 className='font-semibold text-xl'>
            Complete: {condition?.startScreenTitle}
        </h3>
        <p className='text-zinc-500 text-sm'>Great! Now please continue to the next page of the survey.</p>
        <p className='text-zinc-500 text-sm'>Not done? No problem - just click on &quot;back to task&quot;.</p>
    </div>
}

export default CompleteScreen