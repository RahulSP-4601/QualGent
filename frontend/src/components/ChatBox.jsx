import React, { useState, useEffect } from 'react';
import '../styles/ChatBox.css';
import axios from 'axios';

function ChatBox({ onTestCreated, onCategoryChanged }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pendingTests, setPendingTests] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:8000/categories');
    setCategories(res.data);
  };

  const sendToAI = async (newMessages) => {
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        messages: newMessages,
      });
      return response.data.response;
    } catch (err) {
      return "❌ Error reaching AI service.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    const trimmed = input.trim().toLowerCase();

    const createMatch = trimmed.match(/^create category\s+(.+)$/i);
    const deleteMatch = trimmed.match(/^delete category\s+(.+)$/i);
    const updateMatch = trimmed.match(/^update category\s+(.+)\s+to\s+(.+)$/i);

    if (createMatch?.[1]) {
      await createCategory(createMatch[1].trim());
      return;
    }

    if (deleteMatch?.[1]) {
      await deleteCategoryByName(deleteMatch[1].trim());
      return;
    }

    if (updateMatch?.length === 3) {
      await updateCategory(updateMatch[1].trim(), updateMatch[2].trim());
      return;
    }

    const aiReply = await sendToAI(newMessages);
    setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);

    const matches = aiReply.match(/Test case name:([\s\S]*?)(?=Test case name:|$)/gi);
    if (matches) {
      const extracted = matches.map(block => {
        const name = block.match(/Test case name:\s*(.+)/i)?.[1]?.trim();
        const description = block.match(/Description:\s*(.+)/i)?.[1]?.trim();
        return name && description ? { name, description } : null;
      }).filter(Boolean);

      if (extracted.length > 0) {
        setPendingTests(extracted);
      }
    }
  };

  const handleConfirmCategory = async (categoryId) => {
    if (!pendingTests.length) return;

    const selectedCategory = categories.find(cat => cat.id === categoryId);
    const statusMessages = [];

    for (const test of pendingTests) {
      try {
        const res = await axios.post('http://localhost:8000/test-cases', {
          name: test.name,
          description: test.description,
          category_id: categoryId,
        });
        if (typeof onTestCreated === 'function') {
          onTestCreated(res.data);
        }
        statusMessages.push(`✅ Created: **${test.name}** in **${selectedCategory?.name}**`);
      } catch (err) {
        statusMessages.push(`❌ Failed: **${test.name}** - ${err?.response?.data?.detail || err.message}`);
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: statusMessages.join('\n') }]);
    setPendingTests([]);
  };

  const createCategory = async (name) => {
    try {
      await axios.post('http://localhost:8000/categories', { name });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Category "${name}" created successfully.`
      }]);
      onCategoryChanged?.();
      fetchCategories();
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to create category: ${err?.response?.data?.detail || err.message}`
      }]);
    }
  };

  const deleteCategoryByName = async (name) => {
    try {
      const res = await axios.get('http://localhost:8000/categories');
      const category = res.data.find(cat => cat.name.toLowerCase() === name.toLowerCase());
      if (!category) throw new Error("Category not found");
      await axios.delete(`http://localhost:8000/categories/${category.id}`);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🗑️ Category "${name}" deleted successfully.`
      }]);
      onCategoryChanged?.();
      fetchCategories();
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to delete category: ${err?.response?.data?.detail || err.message}`
      }]);
    }
  };

  const updateCategory = async (oldName, newName) => {
    try {
      const res = await axios.get('http://localhost:8000/categories');
      const category = res.data.find(cat => cat.name.toLowerCase() === oldName.toLowerCase());
      if (!category) throw new Error("Category not found");
      await axios.put(`http://localhost:8000/categories/${category.id}`, { name: newName });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✏️ Category "${oldName}" renamed to "${newName}".`
      }]);
      onCategoryChanged?.();
      fetchCategories();
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to update category: ${err?.response?.data?.detail || err.message}`
      }]);
    }
  };

  return (
    <div className="chat-box">
      <h2 className="center">Chat AI Assistant</h2>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      {pendingTests.length > 0 && (
        <div className="category-confirmation">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleConfirmCategory(cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Ask AI to generate test cases or manage categories..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
