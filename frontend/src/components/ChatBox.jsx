import React, { useState, useEffect } from 'react';
import '../styles/ChatBox.css';
import axios from 'axios';

function ChatBox({ onTestCreated, onCategoryChanged, categories, fetchCategories }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pendingTests, setPendingTests] = useState([]);
  const [duplicateMatches, setDuplicateMatches] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionPayload, setActionPayload] = useState(null);

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
      const matches = categories
        .map((cat, idx) => ({ ...cat, displayIndex: idx + 1 }))
        .filter(cat => cat.name.toLowerCase() === deleteMatch[1].trim().toLowerCase());

      if (matches.length === 1) {
        await deleteCategoryById(matches[0].id, matches[0].name);
      } else if (matches.length > 1) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Multiple categories named "${deleteMatch[1].trim()}" found. Please select which one to delete:`
        }]);
        setDuplicateMatches(matches);
        setPendingAction('delete');
        setActionPayload({ name: deleteMatch[1].trim() });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ No category named "${deleteMatch[1].trim()}" found.` }]);
      }
      return;
    }

    if (updateMatch?.length === 3) {
      const oldName = updateMatch[1].trim();
      const newName = updateMatch[2].trim();
      const matches = categories
        .map((cat, idx) => ({ ...cat, displayIndex: idx + 1 }))
        .filter(cat => cat.name.toLowerCase() === oldName.toLowerCase());

      if (matches.length === 1) {
        await updateCategoryById(matches[0].id, oldName, newName);
      } else if (matches.length > 1) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Multiple categories named "${oldName}" found. Please select which one to update:`
        }]);
        setDuplicateMatches(matches);
        setPendingAction('update');
        setActionPayload({ oldName, newName });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `❌ No category named "${oldName}" found.` }]);
      }
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

  const handleDuplicateChoice = async (cat) => {
    if (pendingAction === 'delete') {
      await deleteCategoryById(cat.id, cat.name);
    } else if (pendingAction === 'update') {
      await updateCategoryById(cat.id, actionPayload.oldName, actionPayload.newName);
    }
    setDuplicateMatches([]);
    setPendingAction(null);
    setActionPayload(null);
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

  const deleteCategoryById = async (id, name) => {
    try {
      await axios.delete(`http://localhost:8000/categories/${id}`);
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

  const updateCategoryById = async (id, oldName, newName) => {
    try {
      await axios.put(`http://localhost:8000/categories/${id}`, { name: newName });
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

      {duplicateMatches.length > 0 && (
        <div className="category-confirmation">
          {duplicateMatches.map(cat => (
            <button key={cat.id} onClick={() => handleDuplicateChoice(cat)}>
              {`#${cat.displayIndex}: ${cat.name}`}
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
