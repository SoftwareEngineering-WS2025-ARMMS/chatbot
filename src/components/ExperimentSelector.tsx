'use client'
import { FC, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ICondition } from '@/types/condition'
import { Edit2 } from 'lucide-react'

interface ExperimentSelectorProps {
    conditions: ICondition[]
}

const ExperimentSelector: FC<ExperimentSelectorProps> = ({ conditions }) => {

    const [selectedCondition, setSelectedCondition] = useState<ICondition | null>(null)

    return <div className='flex flex-col gap-10'>
        <div className="flex gap-12 flex-wrap pt-10">

            <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold">Conditions</h2>
                <ul className="flex flex-col gap-2">
                    {conditions.map(condition =>
                        <li key={condition.id} className="flex-1">
                            <Button variant={selectedCondition?.id === condition.id ? "secondary" : "outline"} onClick={() => setSelectedCondition(condition)}>
                                {condition.name}</Button>
                        </li>)}
                </ul>
            </div>
        </div>


        <div className="flex gap-5">
            <Button disabled={!selectedCondition}><Link href={`/${selectedCondition?.id}`}>Start Chat</Link></Button>
        </div>

        {selectedCondition && <p className='text-sm'>Slug: {`/${selectedCondition?.id}`} </p>}
    </div>
}

export default ExperimentSelector