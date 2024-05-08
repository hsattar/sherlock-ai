'use client'

import { useState } from "react"

export default function Home() {

  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])

  const handleSendMessage = () => {
    if (userInput.trim().length > 0 ) {
      setMessages(prev => [...prev, { role: 'user', content: userInput }])
      setUserInput('')
    }
  }

  return (
    <div className="relative">
    <nav className="fixed top-0 left-0 right-0 py-4 border-b-2 border-gray-400">
      <h1 className="text-6xl text-center select-none">Sherlock AI</h1>
    </nav>

    { messages.length > 0 ? (
      <div className="mt-28">
      { messages.map(({ role, content }, index) => (
        <div key={index} className={ role === 'user' ? "chat chat-end" : "chat chat-start"}>
          <p className={ role === 'user' ? "chat-bubble" : "chat-bubble chat-bubble-info"}>{content}</p>
        </div>
      )) }
      </div>
    ) : (
      <div className="flex flex-grow justify-center items-center h-[100vh]">
        <p className="text-center text-3xl select-none">Ask me a question to get started.</p>
      </div>
    ) }
    
    <footer className="fixed bottom-0 left-0 right-0 py-4 flex justify-center">
      <input
        type="text"
        placeholder="Ask me something..."
        className="input input-bordered w-full max-w-sm sm:max-w-xl focus:outline-none"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => { e.code === 'Enter' && handleSendMessage() }}
      />
    </footer>
    </div>
  )
}

interface IMessage {
  role: 'user' | 'ai'
  content: string
}
