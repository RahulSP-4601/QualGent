import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css';
import TestCategory from './TestCategory';
import EditCategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';
import axios from 'axios';

function Sidebar({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    const categoryId = categories[index].id;
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
        const updated = [...categories];
        updated.splice(index, 1);
        setCategories(updated);
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert('Delete failed');
      }
    }
  };

  const handleSave = async (newName) => {
    const category = categories[editIndex];
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${category.id}`, {
        name: newName,
      });
      const updated = [...categories];
      updated[editIndex] = response.data;
      setCategories(updated);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Update failed');
    }
  };

  const handleAddCategory = async (newCategoryName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, {
        name: newCategoryName,
      });
      setCategories([...categories, response.data]);
      setShowAddModal(false);
    } catch (error) {
      alert('Category creation failed!');
      console.error(error);
    }
  };

  const handleCategoryClick = (cat) => {
    setSelected(cat.name);
    onCategorySelect(cat.id, cat.name);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Test Categories</h3>
        <button className="new-btn" onClick={() => setShowAddModal(true)}>+ New</button>
      </div>

      <div className="category-list">
        {categories.map((cat, idx) => (
          <TestCategory
            key={cat.id}
            name={cat.name}
            count={idx + 1}
            isActive={selected === cat.name}
            onClick={() => handleCategoryClick(cat)}
            onEdit={() => handleEdit(idx)}
            onDelete={() => handleDelete(idx)}
          />
        ))}
      </div>

      <EditCategoryModal
        visible={showModal}
        currentName={editIndex !== null ? categories[editIndex].name : ''}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleAddCategory}
      />
    </div>
  );
}

export default Sidebar;
