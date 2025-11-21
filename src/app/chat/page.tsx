'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const productName = searchParams.get('product')
  const productPrice = searchParams.get('price')
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! Welcome to Rural Connection! 👋 How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setChatSessions(sessionsWithDates)
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    // Create or load current session
    const sessionId = Date.now().toString()
    setCurrentSessionId(sessionId)
  }, [])

  // Auto-send product question if coming from product page
  useEffect(() => {
    if (productName && productPrice && messages.length === 1) {
      const productQuestion = `Tell me about the ${productName}. What are the details and is ₹${productPrice} a good price?`
      sendMessage(productQuestion)
    }
  }, [productName, productPrice])

  // Save chat session
  const saveSession = () => {
    if (messages.length <= 1) return // Don't save if only welcome message

    const session: ChatSession = {
      id: currentSessionId,
      title: messages[1]?.content.substring(0, 50) + '...' || 'New Chat',
      messages: messages,
      createdAt: new Date()
    }

    const existingIndex = chatSessions.findIndex(s => s.id === currentSessionId)
    let updatedSessions

    if (existingIndex >= 0) {
      updatedSessions = [...chatSessions]
      updatedSessions[existingIndex] = session
    } else {
      updatedSessions = [session, ...chatSessions]
    }

    setChatSessions(updatedSessions)
    localStorage.setItem('chatHistory', JSON.stringify(updatedSessions))
  }

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!customMessage) setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // Auto-save after assistant responds
        setTimeout(saveSession, 500)
      } else {
        throw new Error(data.details || data.error)
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message || 'Please try again.'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages)
    setCurrentSessionId(session.id)
    setShowHistory(false)
  }

  const startNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! Welcome to Rural Connection! 👋 How can I help you today?',
        timestamp: new Date()
      }
    ])
    setCurrentSessionId(Date.now().toString())
    setShowHistory(false)
  }

  const deleteChatSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = chatSessions.filter(s => s.id !== sessionId)
    setChatSessions(updated)
    localStorage.setItem('chatHistory', JSON.stringify(updated))
    
    if (currentSessionId === sessionId) {
      startNewChat()
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#faf8f5' }}>
      {/* Sidebar - Chat History */}
      <div className={`${showHistory ? 'block' : 'hidden'} md:block w-full md:w-80 border-r-2 flex flex-col`} 
           style={{ borderColor: '#e8dfd0', backgroundColor: '#f5efe6' }}>
        <div className="p-4 border-b-2" style={{ borderColor: '#e8dfd0' }}>
          <button
            onClick={startNewChat}
            className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#926829' }}
          >
            <span>➕</span>
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Chat History</h3>
          
          {chatSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">No previous chats</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadChatSession(session)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group ${
                    session.id === currentSessionId ? 'bg-white shadow-md' : 'bg-white/50 hover:bg-white'
                  }`}
                  style={{ borderLeft: session.id === currentSessionId ? '3px solid #926829' : 'none' }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChatSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t-2" style={{ borderColor: '#e8dfd0' }}>
          <Link href="/">
            <button className="w-full px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-300 hover:bg-white text-sm"
                    style={{ borderColor: '#926829', color: '#926829' }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-2 flex items-center justify-between"
             style={{ borderColor: '#e8dfd0', backgroundColor: '#926829' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              suppressHydrationWarning
            >
              ☰
            </button>
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="text-xl font-bold text-white">Rural Connection AI</h1>
              <p className="text-xs text-white/80">Your marketplace assistant</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[#926829] text-white rounded-br-none'
                    : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-gray-200 p-4 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 border-t-2 bg-white" style={{ borderColor: '#e8dfd0' }}>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, orders, artisans..."
              disabled={isLoading}
              suppressHydrationWarning
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#926829] transition-colors disabled:opacity-50 text-sm md:text-base"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              suppressHydrationWarning
              className="px-6 py-3 rounded-full text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
              style={{ backgroundColor: '#926829' }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
