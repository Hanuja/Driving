import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit2, Filter, ImageIcon, FolderOpen } from 'lucide-react';
import GalleryForm from './GalleryForm';
import GalleryCategoryModal from './GalleryCategoryModal';

const API_URL = 'http://localhost/Driving/api/gallery';

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}/categories`)
      ]);
      if (itemsRes.data.success) setItems(itemsRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch gallery data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete item.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category_id?.toString() === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Gallery Management</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage images displayed in the website gallery.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex-1 md:flex-none bg-white text-[#111111] border border-gray-200 hover:border-[#111111] px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-sm flex items-center justify-center"
          >
            <FolderOpen size={16} className="mr-2" /> Categories
          </button>
          <button 
            onClick={handleAdd}
            className="flex-1 md:flex-none bg-[#F5C542] text-[#111111] hover:bg-[#111111] hover:text-[#F5C542] px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-md flex items-center justify-center"
          >
            <Plus size={16} className="mr-2" /> Add Image
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-medium"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-bold appearance-none cursor-pointer text-[#111111]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-12 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#111111] mb-1">No Images Found</h3>
          <p className="text-[#737373] text-sm text-center max-w-md">
            {searchTerm || categoryFilter ? "No images match your search criteria." : "Your gallery is currently empty. Click 'Add Image' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow relative">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={item.title || 'Gallery image'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image'; }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-white rounded-full text-[#111111] hover:text-[#F5C542] hover:bg-[#111111] transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                {item.status === 'inactive' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-[10px] font-bold text-[#F5C542] uppercase tracking-wider mb-1">
                  {item.category_name || 'Uncategorized'}
                </div>
                <h3 className="font-bold text-[#111111] text-sm truncate">{item.title || 'Untitled Image'}</h3>
                {item.description && (
                  <p className="text-xs text-[#737373] mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <GalleryForm 
          item={editingItem}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showCategoryModal && (
        <GalleryCategoryModal 
          onClose={() => {
            setShowCategoryModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default GalleryManagement;
