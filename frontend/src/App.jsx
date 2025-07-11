import React, { useState } from 'react';
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

  const API_BASE_URL = 'http://localhost:8000';

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

  const handleCategorySelect = async (categoryId, categoryName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/tests`);
      setTestCases(response.data);
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
      setSelectedTestCase(null);
      setIsCreatingNewTest(false);
    } catch (err) {
      console.error('Failed to fetch test cases:', err);
    }
  };

  const handleAddTestCase = (newTest) => {
    setTestCases([...testCases, newTest]);
    setIsCreatingNewTest(false);
  };

  const handleTestClick = (test) => {
    setSelectedTestCase(test);
    setIsCreatingNewTest(false);
  };

  const handleNewClick = () => {
    setIsCreatingNewTest(true);
    setSelectedTestCase(null);
  };

  const handleUpdateTestCase = (updated) => {
    setTestCases(testCases.map(t => t.id === updated.id ? updated : t));
  };
  
  const handleDeleteTestCase = (id) => {
    setTestCases(testCases.filter(t => t.id !== id));
  };
  

  return (
    <div className="app-wrapper" onMouseMove={handleMouseMove} onMouseUp={stopResizing}>
      <Navbar />
      <div className="app-container">
        <Sidebar onCategorySelect={handleCategorySelect} />
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
            <ChatBox />
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
              onCreate={handleAddTestCase}
              onUpdate={handleUpdateTestCase}
              onDelete={handleDeleteTestCase}
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
