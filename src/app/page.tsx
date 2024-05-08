'use client'

import { useState } from "react"

export default function Home() {

  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])

  const handleSendMessage = () => {
    setMessages(prev => [...prev, { role: 'user', content: userInput }])
    setUserInput('')
  }

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 py-4 border-b-2 border-gray-400">
      <h1 className="text-6xl text-center">Sherlock AI</h1>
    </nav>

    { messages.length > 0 ? (
      <>
      { messages.map(({ role, content }, index) => (
        <div key={index}>
          <p>{content}</p>
        </div>
      )) }
      </>
    ) : (
      <>
      
      </>
    ) }
    
    <footer className="fixed bottom-0 left-0 right-0 py-4 flex justify-center">
      <input
        type="text"
        placeholder="Ask me something..."
        className="w-[95vw] outline-none border-none bg-gray-100 p-2 rounded-md"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => { e.code === 'Enter' && handleSendMessage() }}
      />
    </footer>
    </>
  )
}

interface IMessage {
  role: 'user' | 'ai'
  content: string
}
