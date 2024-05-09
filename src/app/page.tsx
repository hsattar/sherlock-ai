'use client'

import { FormEvent, useEffect, useRef, useState } from "react"
import "regenerator-runtime/runtime.js"
import { AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import ReactLoading from 'react-loading'
import ReactMarkdown from 'react-markdown'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Home() {

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition()

  const lastMessageRef = useRef<HTMLDivElement>(null)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [threadId, setThreadId] = useState('')
  const [loading, setLoading] = useState(true)
  const [responseLoading, setResponseLoading] = useState(false)

  const handleSendMessage = async (e: FormEvent ) => {
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

  const handleVoiceMessage = async (message: string) => {
    SpeechRecognition.stopListening()
    if (message.trim().length > 0 ) {

      setMessages(prev => [...prev, { role: 'user', content: message }])
      setResponseLoading(true)

      const response = await axios.post('/api/assistant', { threadId, message: { role: 'user', content: message.trim() } })
      const threadIdGenerated = response.data.threadId
      setThreadId(threadIdGenerated)
    
      localStorage.setItem('threadId', threadIdGenerated)
      const messagesToSave = JSON.stringify([...messages, { role: 'user', content: message }])
      localStorage.setItem('messages', messagesToSave)


      const intervalId = setInterval(async (): Promise<any> => {

        const threadResponse = await axios.post(`/api/assistant-status`, { threadId: response?.data.threadId, runId: response?.data.runId })

        if (threadResponse?.status === 200) {
            clearInterval(intervalId)
            const answer: string = await threadResponse?.data.assistantResponse.text.value
            setResponseLoading(false)
            setMessages(prev => [...prev, { role: 'assistant', content: answer }])

            const messagesToSave = JSON.stringify([...messages, { role: 'user', content: message }, { role: 'assistant', content: answer }])
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
            <div key={index}>
            { role === 'user' ? (
              <div ref={index === messages.length - 1 ? lastMessageRef : null} className="flex items-start justify-end">
                <div className="mr-3 bg-blue-500 text-white rounded-md p-4 max-w-[95%] md:max-w-[70%]">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                <Avatar>
                  {/* <AvatarImage alt="Me" src="/placeholder-avatar.jpg" /> */}
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div ref={index === messages.length - 1 ? lastMessageRef : null} className="flex items-start">
                <Avatar>
                  {/* <AvatarImage alt="Sherlock AI" src="/placeholder-avatar.jpg" /> */}
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="ml-3 bg-white rounded-md p-4 max-w-[95%] md:max-w-[70%]">
                  <ReactMarkdown className="text-gray-800">{content}</ReactMarkdown>
                </div>
              </div>
            ) }
            </div>
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
        { browserSupportsSpeechRecognition && (
        <Button
          type="button"
          className="mr-2"
          onClick={() => listening ? handleVoiceMessage(transcript) : SpeechRecognition.startListening()}
        >
          { listening ? (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 8.735 8.735m0 0a.374.374 0 1 1 .53.53m-.53-.53.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 0 1 0 5.304m2.121-7.425a6.75 6.75 0 0 1 0 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 0 1-1.06-2.122m-1.061 4.243a6.75 6.75 0 0 1-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12Z" />
            </svg>          
          ) : (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          ) }
        </Button> ) }
        <Button type="submit">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
        </Button>
      </form>

    </div>
  )
}

interface IMessage {
  role: 'user' | 'assistant'
  content: string
}
