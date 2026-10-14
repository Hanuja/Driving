import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit2, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/faqs/categories';

const FaqCategoryModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ id: null, name: '', sort_order: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, formData, { headers });
      } else {
        await axios.post(API_URL, formData, { headers });
      }
      
      setFormData({ id: null, name: '', sort_order: 0 });
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ id: cat.id, name: cat.name, sort_order: cat.sort_order });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Any associated FAQs will have their category set to null.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ id: null, name: '', sort_order: 0 });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            Manage FAQ Categories
          </h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#111111] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          <form onSubmit={handleSubmit} className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-200" autoComplete="off">
            <h3 className="text-sm font-bold text-[#111111] mb-3 uppercase tracking-wider">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Category Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Sort Order (0-99)</label>
                <input 
                  type="number" 
                  value={formData.sort_order} 
                  onChange={(e) => setFormData({...formData, sort_order: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-xs font-bold text-[#737373] uppercase">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={submitLoading} className="bg-[#111111] text-white hover:bg-[#F5C542] hover:text-[#111111] px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-colors flex items-center">
                  {isEditing ? 'Update' : <><Plus size={14} className="mr-1" /> Add</>}
                </button>
              </div>
            </div>
          </form>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] text-white">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest w-16">Sort</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="3" className="p-4 text-center text-sm text-gray-500">Loading...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-sm text-gray-500">No categories found.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F7F7F5]">
                      <td className="px-4 py-3 text-sm font-bold text-[#111111]">{cat.name}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-500">{cat.sort_order}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => handleEdit(cat)} className="p-1 text-gray-400 hover:text-[#F5C542]">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-1 text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqCategoryModal;
