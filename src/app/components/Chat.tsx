'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'
import Loading from './Loading';
import Divider from './Divider';

interface ChatBubble {
  sender: ChatSender;
  message: string;
}

enum ChatSender {
  User, AI
}

export default function Chat() {
  const apiUrl = 'http://127.0.0.1:5000'

  const [input, setInput] = useState<string>('')
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([{
    sender: ChatSender.AI,
    message: "Hello! I am Ville's finetuned personal AI meant to help recruiters and employers. Ask anything!"
  }])
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

      if (!userMessage) return;

      setInput('')
      setLoading(true)
      setError('')

      setChatBubbles(prev => [...prev, { sender: ChatSender.User, message: userMessage }]);

      setTimeout(async () => {
        try {
          const res = await fetch(`${apiUrl}/ask?question=${userMessage}`, {
            method: "GET",
            headers: {
              "User-Agent": "Hello",
              "ngrok-skip-browser-warning": "true",
            }
          });
          const text = await res.text();

          setChatBubbles(prev => [...prev, { sender: ChatSender.AI, message: text }]);
        } catch {
          setError("Error calling API. It's likely the backend isn't running at all right now :)");
        } finally {
          setLoading(false);
        }
      }, 0);

    } catch {
      setError('Error in chat');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        {chatBubbles.map((chatBubble, index) => {
          return <div key={index} className={`w-auto p-2 rounded-md max-w-[70%] text-black dark:text-white ${chatBubble.sender === ChatSender.AI ? 'bg-white dark:bg-black mr-auto' : 'bg-gray-100 dark:bg-gray-900 ml-auto'}`}>{chatBubble.message}</div>
        })}
      </div>
      {loading ? <Loading /> : ""}
      {error ? <div className="flex flex-col gap-2 p-2">{error}</div> : ""}
      <Divider />
      <div className="flex gap-2">
        <input className="w-full py-2 px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500" type="text" value={input} onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Submit with enter key..." />
        <button className="flex-shrink py-2 px-8 bg-gray-100 dark:bg-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 cursor-pointer" onClick={callApi}>Send</button>
      </div>
    </>
  )
}