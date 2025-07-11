import React, { useState, useEffect } from 'react';
import './../styles/EditCategoryModal.css';

function EditCategoryModal({ visible, currentName, onClose, onSave }) {
  const [name, setName] = useState(currentName || '');

  useEffect(() => {
    setName(currentName || '');
  }, [currentName]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (name.trim()) onSave(name.trim());
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glassy">
        <h3>Edit Test Category</h3>
        <label htmlFor="category-name">Category Name</label>
        <input
          id="category-name"
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="primary" onClick={handleSubmit}>Save</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditCategoryModal;
