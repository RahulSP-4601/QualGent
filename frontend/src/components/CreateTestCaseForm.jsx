// src/components/CreateTestCaseForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/CreateTestCaseForm.css';
import axios from 'axios';

function CreateTestCaseForm({ onClose, onCreate }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleSubmit = async () => {
    if (!categoryId || !name.trim()) {
      alert("Please select a category and enter a name.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/test-cases', {
        category_id: categoryId,
        name,
        description,
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating test case:', error);
      alert('Failed to create test case.');
    }
  };

  return (
    <div className="testcase-form">
      <h3>Create New Test Case</h3>

      <label>Category</label>
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select a category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label>Name</label>
      <input
        type="text"
        placeholder="Enter test name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Description</label>
      <textarea
        placeholder="Enter a description for this test case"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="btn-group">
        <button className="create-btn" onClick={handleSubmit}>Create Test</button>
        <button className="cancel-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CreateTestCaseForm;
