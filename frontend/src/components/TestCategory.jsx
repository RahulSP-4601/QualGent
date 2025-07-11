import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import './../styles/TestCategory.css';

function TestCategory({ name, count, isActive, onClick, onEdit, onDelete }) {
  return (
    <div
      className={`test-category ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="left">
        <div className="count">{count}</div>
        <div className="name">{name}</div>
      </div>
      <div className="actions">
        <FiEdit2 onClick={(e) => { e.stopPropagation(); onEdit(); }} />
        <FiTrash2 onClick={(e) => { e.stopPropagation(); onDelete(); }} />
      </div>
    </div>
  );
}

export default TestCategory;
