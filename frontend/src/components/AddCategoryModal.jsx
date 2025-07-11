import React, { useState } from 'react';
import '../styles/AddCategoryModal.css';

function AddCategoryModal({ visible, onClose, onCreate }) {
  const [categoryName, setCategoryName] = useState('');

  if (!visible) return null;

  const handleCreate = () => {
    if (categoryName.trim()) {
      onCreate(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Test Category</h3>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="create-btn" onClick={handleCreate}>Create</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryModal;
