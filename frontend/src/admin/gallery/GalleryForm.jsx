import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/gallery';

const GalleryForm = ({ item, onClose, onSuccess }) => {
  const isEdit = !!item;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    image_url: '',
    sort_order: 0,
    status: 'active'
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category_id: item.category_id || '',
        image_url: item.image_url || '',
        sort_order: item.sort_order || 0,
        status: item.status || 'active'
      });
    }
  }, [item, isEdit]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${item.id}`, formData, { headers });
      } else {
        await axios.post(API_URL, formData, { headers });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save gallery item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Gallery Item' : 'Add Gallery Item'}
          </h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#111111] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto flex-1">
          {error && (
            <div className="m-6 mb-0 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}
          
          <form id="gallery-form" onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="off">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="url" 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleChange} 
                      required 
                      autoComplete="off" 
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  autoComplete="off" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Category</label>
                <select 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-bold bg-white"
                >
                  <option value="">-- No Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="2" 
                  autoComplete="off" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Sort Order</label>
                <input 
                  type="number" 
                  name="sort_order" 
                  value={formData.sort_order} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Status</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange} className="w-4 h-4 text-[#111111] border-gray-300 focus:ring-[#F5C542]" />
                    <span className="ml-2 text-sm font-bold text-[#111111]">Active</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange} className="w-4 h-4 text-[#111111] border-gray-300 focus:ring-[#F5C542]" />
                    <span className="ml-2 text-sm font-bold text-[#737373]">Inactive</span>
                  </label>
                </div>
              </div>

            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-[#F7F7F5]">
          <button 
            type="button"
            onClick={onClose} 
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#737373] bg-white border border-gray-200 hover:text-[#111111] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="gallery-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Image')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;
