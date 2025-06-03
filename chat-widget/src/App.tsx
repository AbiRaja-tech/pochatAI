import { useState, useRef, useEffect } from 'react'
import './App.css'

const ROLES = {
  ADMIN: 'admin' as 'admin',
  USER: 'user' as 'user',
}

type RoleType = 'admin' | 'user'

function App() {
  // For demo: allow switching roles
  const [role, setRole] = useState<RoleType>(ROLES.USER)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you with your purchase orders today?', type: 'info' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { from: role, text: input, type: 'user' }])
    setInput('')
    // Simulate bot response with role-based logic
    setTimeout(() => {
      if (role === ROLES.ADMIN && input.toLowerCase().includes('analytics')) {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: 'Here is your advanced analytics dashboard. [Demo: Only admins see this!]', type: 'admin-action' }
        ])
      } else {
        setMessages(msgs => [
          ...msgs,
          { from: 'bot', text: "I'm just a demo bot!", type: 'info' }
        ])
      }
    }, 600)
  }

  // Minimalistic chat icon (SVG)
  const chatIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  )

  // Role badge
  const roleBadge = (
    <span className={`role-badge ${role}`}>{role === ROLES.ADMIN ? 'Admin' : 'User'}</span>
  )

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button className="chat-fab minimal" onClick={() => setOpen(true)} title="Open Chat" aria-label="Open chat">
          {chatIcon}
        </button>
      )}
      {/* Copilot-style Sidebar Chat Window */}
      {open && (
        <div className="chat-sidebar sleek" role="dialog" aria-modal="true" aria-label="Chat with Imprinta Assistant">
          <div className="chat-header sleek">
            <span className="assistant-title">Imprinta Assistant</span>
            {roleBadge}
            <button className="chat-close" onClick={() => setOpen(false)} title="Close" aria-label="Close chat">×</button>
          </div>
          <div className="chat-messages sleek" tabIndex={0} aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.from} ${msg.type}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row sleek">
            <input
              className="chat-input"
              type="text"
              placeholder={role === ROLES.ADMIN ? "Ask for analytics, predictions, or PO queries..." : "Ask a question..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              aria-label="Type your message"
            />
            <button className="chat-send" onClick={handleSend} aria-label="Send message">➤</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
