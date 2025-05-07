'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'
import Loading from './Loading';

interface ChatBubble {
  sender: ChatSender;
  message: string;
}

enum ChatSender {
  User, AI
}

export default function Chat() {
  const [input, setInput] = useState<string>('')
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      callApi()
    }
  };

  const callApi = async () => {
    try {
      const userMessage = input;
      setInput('');
      setLoading(true);
  
      setChatBubbles(prev => [...prev, { sender: ChatSender.User, message: userMessage }]);

      setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/ask?question=${userMessage}`);
          const text = await res.text();
  
          setChatBubbles(prev => [...prev, { sender: ChatSender.AI, message: text }]);
        } catch (e) {
          setError('Error calling API');
        } finally {
          setLoading(false);
        }
      }, 0);
  
    } catch (err) {
      setError('Error in chat');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        {chatBubbles.map((chatBubble, index) => {
          return <div key={index} className={`w-auto p-2 rounded-md max-w-[70%] ${chatBubble.sender === ChatSender.AI ? 'bg-white text-black mr-auto' : 'bg-gray-100 text-black ml-auto'}`}>{chatBubble.message}</div>
        })}
      </div>
      {loading ? <Loading /> : ""}
      {error ?  <div className="flex flex-col gap-2 p-2">{error}</div> : ""}
      <div className="flex gap-2">
        <input className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500" type="text" value={input} onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Ask anything..." />
        <button className="flex-shrink py-2 px-8 bg-slate-500 text-white font-semibold rounded-md shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50" onClick={callApi}>Send</button>
      </div>
    </>
  )
}