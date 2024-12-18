'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { TooltipProvider } from './ui/tooltip'

interface ProvidersProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Providers: FC<ProvidersProps> = ({ children }) => {

    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
    )
}

export default Providers