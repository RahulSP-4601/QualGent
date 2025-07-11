import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/Sidebar';
import TestList from './components/TestList';
import EditTestCase from './components/EditTestCase';
import ChatBox from './components/ChatBox';
import './styles/App.css';
import axios from 'axios';

function App() {
  const [rightPanelWidth, setRightPanelWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Select a Category");

  const [categories, setCategories] = useState([]);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data);

      // If the selected category was renamed, update its name
      const updated = res.data.find(c => c.id === selectedCategoryId);
      if (updated) {
        setSelectedCategoryName(updated.name);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchTestCases = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/tests`);
      setTestCases(response.data);
    } catch (err) {
      console.error('Failed to fetch test cases:', err);
    }
  };

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.6;
      setRightPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    }
  };

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setSelectedTestCase(null);
    setIsCreatingNewTest(false);
    fetchTestCases(categoryId);
  };

  const handleTestClick = (test) => {
    setSelectedTestCase(test);
    setIsCreatingNewTest(false);
  };

  const handleNewClick = () => {
    setIsCreatingNewTest(true);
    setSelectedTestCase(null);
  };

  return (
    <div className="app-wrapper" onMouseMove={handleMouseMove} onMouseUp={stopResizing}>
      <Navbar />
      <div className="app-container">
        <Sidebar
          onCategorySelect={handleCategorySelect}
          categories={categories}
          fetchCategories={fetchCategories}
        />
        <div className="main-content">
          <div className="left-panel" style={{ flex: `1 1 calc(100% - ${rightPanelWidth}px)` }}>
            <h2 className="section-title">Test Cases Repository</h2>
            <p className="section-subtitle">Manage your test cases and folders</p>
            <TestList
              tests={testCases}
              selectedCategory={selectedCategoryName}
              onCreateClick={handleNewClick}
              onTestClick={handleTestClick}
            />
            <ChatBox
              onTestCreated={() => {
                if (selectedCategoryId) fetchTestCases(selectedCategoryId);
              }}
              onCategoryChanged={fetchCategories}
              categories={categories}
              fetchCategories={fetchCategories}
            />
          </div>
          <div
            className="resizer"
            onMouseDown={startResizing}
            style={{ cursor: 'col-resize' }}
          />
          <div className="right-panel" style={{ width: rightPanelWidth }}>
            <EditTestCase
              isCreatingNewTest={isCreatingNewTest}
              selectedTestCase={selectedTestCase}
              onCreate={() => {
                if (selectedCategoryId) fetchTestCases(selectedCategoryId);
              }}
              onUpdate={() => {
                if (selectedCategoryId) fetchTestCases(selectedCategoryId);
              }}
              onDelete={() => {
                if (selectedCategoryId) fetchTestCases(selectedCategoryId);
              }}
              onClose={() => {
                setIsCreatingNewTest(false);
                setSelectedTestCase(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;