'use client'

import { FormEvent, useEffect, useRef, useState } from "react"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import ReactLoading from 'react-loading'
import ReactMarkdown from 'react-markdown'

export default function Home() {

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [threadId, setThreadId] = useState('')
  const [loading, setLoading] = useState(true)
  const [responseLoading, setResponseLoading] = useState(false)

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (userInput.trim().length > 0 ) {

      setMessages(prev => [...prev, { role: 'user', content: userInput }])
      setUserInput('')
      setResponseLoading(true)

      const response = await axios.post('/api/assistant', { threadId, message: { role: 'user', content: userInput.trim() } })
      const threadIdGenerated = response.data.threadId
      setThreadId(threadIdGenerated)
    
      localStorage.setItem('threadId', threadIdGenerated)
      const messagesToSave = JSON.stringify([...messages, { role: 'user', content: userInput }])
      localStorage.setItem('messages', messagesToSave)


      const intervalId = setInterval(async (): Promise<any> => {

        const threadResponse = await axios.post(`/api/assistant-status`, { threadId: response?.data.threadId, runId: response?.data.runId })

        if (threadResponse?.status === 200) {
            clearInterval(intervalId)
            const answer: string = await threadResponse?.data.assistantResponse.text.value
            setResponseLoading(false)
            setMessages(prev => [...prev, { role: 'assistant', content: answer }])

            const messagesToSave = JSON.stringify([...messages, { role: 'user', content: userInput }, { role: 'assistant', content: answer }])
            localStorage.setItem('messages', messagesToSave)
        }

      }, 2000)
    
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
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                <Avatar>
                  {/* <AvatarImage alt="Me" src="/placeholder-avatar.jpg" /> */}
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div key={index} ref={index === messages.length - 1 ? lastMessageRef : null} className="flex items-start">
                <Avatar>
                  {/* <AvatarImage alt="Sherlock AI" src="/placeholder-avatar.jpg" /> */}
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-white rounded-md p-4 max-w-[70%]">
                  <ReactMarkdown className="text-gray-800">{content}</ReactMarkdown>
                </div>
              </div>
            ) }
            </>
          )) }
          </>
        ) : (
          <div className="flex flex-grow justify-center items-center h-[75vh] lg:h-[80vh]">
            { loading ? <ReactLoading type="bubbles" color="#111827" /> : <p className="text-center text-3xl select-none">Hello, I&apos;m Sherlock AI. How can I help you today?</p> }
          </div>
        ) }

        { responseLoading && (
          <div className="flex items-start">
            <Avatar>
              {/* <AvatarImage alt="Sherlock AI" src="/placeholder-avatar.jpg" /> */}
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="ml-3 bg-white rounded-md px-4 py-1 max-w-[70%]">
              <ReactLoading type="bubbles" color="#111827" />
            </div>
          </div>
        ) }

        </div>
      </div>

      <form onSubmit={handleSendMessage} className="bg-gray-100 p-4 flex items-center">
        <Input
          type="text"
          placeholder="Ask me something..."
          className="flex-1 mr-4 bg-white border-none focus:ring-0"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>

    </div>
  )
}

interface IMessage {
  role: 'user' | 'assistant'
  content: string
}
