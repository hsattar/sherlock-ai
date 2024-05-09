'use client'

import { useEffect, useRef, useState } from "react"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'

export default function Home() {

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [threadId, setThreadId] = useState('')
  const [loading, setLoading] = useState(true)

  const handleSendMessage = async () => {
    if (userInput.trim().length > 0 ) {
      const response = await axios.post('/assistant', { threadId })
      const threadIdGenerated = response.data.threadId
      localStorage.setItem('threadId', threadIdGenerated)
      const messagesToSave = JSON.stringify([...messages, { role: 'user', content: userInput }])
      localStorage.setItem('messages', messagesToSave)
      setMessages(prev => [...prev, { role: 'user', content: userInput }])
      setUserInput('')
    }
  }

  useEffect(() => {
    const threadId = localStorage.getItem('threadId')
    threadId && setThreadId(threadId)

    const messages = localStorage.getItem('messages')
    messages && setMessages(JSON.parse(messages))
    setLoading(false)
  }, [])

  useEffect(() => {
    lastMessageRef.current && lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center">
        <img src="/logo-dark.png" className="h-8" />
      </header>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="space-y-4">

        { messages.length > 0 ? (
          <>
          { messages.map(({ role, content }, index) => (
            <>
            { role === 'user' ? (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className="flex items-start justify-end">
                <div className="mr-3 bg-blue-500 text-white rounded-md p-4 max-w-[70%]">
                  <p>{content}</p>
                </div>
                <Avatar>
                  <AvatarImage alt="Me" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className="flex items-start">
                <Avatar>
                  <AvatarImage alt="Sherlock AI" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-white rounded-md p-4 max-w-[70%]">
                  <p className="text-gray-800">{content}</p>
                </div>
              </div>
            ) }
            </>
          )) }
          </>
        ) : (
          <div className="flex flex-grow justify-center items-center h-[75vh] lg:h-[80vh]">
            { loading ? <span className="loading loading-dots loading-lg"></span> : <p className="text-center text-3xl select-none">Hello, I&apos;m Sherlock AI. How can I help you today?</p> }
          </div>
        ) }

        </div>
      </div>

      <div className="bg-gray-100 p-4 flex items-center">
        <Input
          type="text"
          placeholder="Ask me something..."
          className="flex-1 mr-4 bg-white border-none focus:ring-0"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => { e.key === 'Enter' && handleSendMessage() }}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>

    </div>
  )
}

interface IMessage {
  role: 'user' | 'ai'
  content: string
}
