import React, { useState, useEffect } from 'react';
import '../styles/EditTestCase.css';
import axios from 'axios';

function EditTestCase({ isCreatingNewTest, selectedTestCase, onCreate, onUpdate, onDelete, onClose }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    if (isCreatingNewTest) {
      setCategoryId('');
      setName('');
      setDescription('');
    } else if (selectedTestCase) {
      setCategoryId(selectedTestCase.category_id || '');
      setName(selectedTestCase.name || '');
      setDescription(selectedTestCase.description || '');
    }
  }, [isCreatingNewTest, selectedTestCase]);

  const handleCreateTest = async () => {
    if (!categoryId || !name || !description) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/test-cases', {
        category_id: categoryId,
        name,
        description
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to create test case:', error);
      alert('Error creating test case');
    }
  };

  const handleUpdateTest = async () => {
    if (!selectedTestCase || !name || !description || !categoryId) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/test-cases/${selectedTestCase.id}`, {
        category_id: categoryId,
        name,
        description
      });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Failed to update test case:', error);
      alert('Error updating test case');
    }
  };

  const handleDeleteTest = async () => {
    if (!selectedTestCase) return;
    if (!window.confirm("Are you sure you want to delete this test case?")) return;

    try {
      await axios.delete(`http://localhost:8000/test-cases/${selectedTestCase.id}`);
      onDelete(selectedTestCase.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete test case:', error);
      alert('Error deleting test case');
    }
  };

  if (!isCreatingNewTest && !selectedTestCase) {
    return (
      <div className="edit-test-case">
        <p>Select a test case to edit or click "+ New" to create one.</p>
      </div>
    );
  }

  return (
    <div className="edit-test-case">
      <h2>{isCreatingNewTest ? 'Create New Test Case' : 'Edit Test Case'}</h2>

      <label>Category</label>
      <select
        className="custom-select"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter test name"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter a description for this test case"
      />

      <div className="button-row">
        {isCreatingNewTest ? (
          <button className="primary-btn" onClick={handleCreateTest}>Create Test</button>
        ) : (
          <>
            <button className="primary-btn" onClick={handleUpdateTest}>Update</button>
            <button className="danger-btn" onClick={handleDeleteTest}>Delete</button>
          </>
        )}
        <button className="secondary-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default EditTestCase;
