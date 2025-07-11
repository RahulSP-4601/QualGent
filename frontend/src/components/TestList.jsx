import React from 'react';
import '../styles/TestList.css';

function TestList({ tests, selectedCategory, onCreateClick, onTestClick }) {
  return (
    <div className="test-list">
      <div className="test-header">
        <strong>{selectedCategory}</strong>
        <button className="test-add-btn" onClick={onCreateClick}>+ New</button>
      </div>

      <ul className="test-items">
        {tests.length === 0 ? (
          <li className="test-item empty">No test cases found</li>
        ) : (
          tests.map((test, index) => (
            <li
              key={index}
              className="test-item"
              onClick={() => onTestClick(test)}
            >
              {test.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TestList;
