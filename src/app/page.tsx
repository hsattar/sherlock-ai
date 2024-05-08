export default function Home() {
  return (
    <>
    <nav className="fixed top-0 left-0 right-0 py-4 border-b-2 border-gray-400">
      <h1 className="text-6xl text-center">Sherlock AI</h1>
    </nav>
    
    <footer className="fixed bottom-0 left-0 right-0 py-4 flex justify-center">
      <input
        type="text"
        placeholder="Ask me something..."
        className="w-[95vw] outline-none border-none bg-gray-100 p-2 rounded-md"
      />
    </footer>
    </>
  )
}
