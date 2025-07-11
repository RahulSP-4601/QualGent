import React, { useState } from 'react';
import '../styles/ChatBox.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function ChatBox({ onTestCreated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pendingTest, setPendingTest] = useState(null);

  const sendToAI = async (newMessages) => {
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        messages: newMessages,
      });
      return response.data.response; // ✅ This must match the key returned by FastAPI
    } catch (err) {
      return "Error reaching AI service.";
    }
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
  
    const aiRaw = await sendToAI(newMessages);
  
    const formatted = aiRaw
      .split(/Test case name:/i)
      .filter(Boolean)
      .map((block, index) => {
        const name = block.match(/^(.*?)(?=Description:)/s)?.[1]?.trim() || `Untitled ${index + 1}`;
        const description = block.match(/Description:\s*(.+)/is)?.[1]?.trim() || "No description.";
        return `**🧪 Test Case ${index + 1}: ${name}**\n\n• **Description:** ${description}`;
      })
      .join('\n\n');
  
    setMessages([...newMessages, { role: 'assistant', content: formatted }]);
  }; 

  const handleConfirmCategory = async (categoryId) => {
    if (!pendingTest) return;

    try {
      const res = await axios.post('http://localhost:8000/test-cases', {
        category_id: categoryId,
        name: pendingTest.name,
        description: pendingTest.description
      });
      onTestCreated(res.data); // update TestList
      setMessages(prev => [...prev, { role: 'assistant', content: `✅ Test case "${pendingTest.name}" created in category ID ${categoryId}.` }]);
      setPendingTest(null);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Failed to create test case: ${err.message}` }]);
    }
  };

  return (
    <div className="chat-box">
      <h2 className="center">Chat AI Assistant</h2>
      <div className="chat-messages">
      {messages.map((msg, idx) => (
        <div key={idx} className={`chat-msg ${msg.role}`}>
          {msg.role === 'assistant' ? (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          ) : (
            msg.content
          )}
        </div>
      ))}
      </div>

      {pendingTest && (
        <div className="category-confirmation">
          <p>Select a category to add: <strong>{pendingTest.name}</strong></p>
          {/* Replace this with your dynamic categories */}
          <button onClick={() => handleConfirmCategory(1)}>Category1</button>
          <button onClick={() => handleConfirmCategory(2)}>Category2</button>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Ask AI to generate test cases..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
