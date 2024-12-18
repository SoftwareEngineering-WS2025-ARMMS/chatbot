'use client'

import { FC } from 'react'
import { ChatContextProvider } from './ChatContext'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import { IChat } from '@/types/chat'
import ChatHeader from './ChatHeader'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useContext } from 'react'; // Änderung 2205




interface ChatWrapperProps {
    chat: IChat
}

const ChatWrapper: FC<ChatWrapperProps> = ({ chat }) => {
    const searchParams = useSearchParams()
    const responseId = searchParams.get("responseId")

    return <ChatContextProvider chat={chat} responseId={responseId}>
        <ChatHeader />
        {/* <ControlPanel /> */}
        <div className='pb-[140px] pt-4 md:pt-10'>
            <ChatMessageList />
            <ChatInput />
        </div>
    </ChatContextProvider>
}

export default ChatWrapper

