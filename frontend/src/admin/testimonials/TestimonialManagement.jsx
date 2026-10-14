import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Star, CheckCircle, XCircle, Clock, Filter, RefreshCw, MessageSquare } from 'lucide-react';
import axios from 'axios';
import TestimonialForm from './TestimonialForm';

const API_URL = 'http://localhost/Driving/api/testimonials';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}?admin=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Failed to load testimonials.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete testimonial.');
      }
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowForm(true);
  };

  const handleStatusToggle = async (testimonial, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${testimonial.id}`, { ...testimonial, status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  const filteredTestimonials = testimonials.filter(t => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (t.student_name || '').toLowerCase().includes(term) || 
      (t.course_name || '').toLowerCase().includes(term) ||
      (t.testimonial || '').toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-[#F5C542] fill-[#F5C542]' : 'text-gray-300'} />
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Testimonials</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage student reviews and website testimonials.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-5 py-2.5 rounded-lg font-bold uppercase tracking-wide text-sm transition-colors flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
            <MessageSquare className="text-[#111111]" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Total</p>
            <h3 className="text-2xl font-black text-[#111111]">{testimonials.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mr-4">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Approved</p>
            <h3 className="text-2xl font-black text-[#111111]">{testimonials.filter(t => t.status === 'approved').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mr-4">
            <Clock className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Pending</p>
            <h3 className="text-2xl font-black text-[#111111]">{testimonials.filter(t => t.status === 'pending').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mr-4">
            <XCircle className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Rejected</p>
            <h3 className="text-2xl font-black text-[#111111]">{testimonials.filter(t => t.status === 'rejected').length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 border-b-0 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search testimonials..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-medium"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button onClick={fetchTestimonials} className="p-2 bg-[#F7F7F5] text-[#737373] hover:text-[#111111] rounded-lg transition-colors">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-b-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Testimonial</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">Loading testimonials...</td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">No testimonials found.</td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F7F7F5] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {t.image_url ? (
                          <img src={t.image_url} alt={t.student_name} className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                        )}
                        <div>
                          <div className="font-bold text-[#111111]">{t.student_name}</div>
                          <div className="text-xs text-gray-500">{t.course_name || '-'}</div>
                          <div className="text-xs text-gray-400 mt-1">{t.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex">{renderStars(t.rating)}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-medium text-gray-600 line-clamp-2">{t.testimonial}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={t.status}
                        onChange={(e) => handleStatusToggle(t, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 outline-none cursor-pointer ${
                          t.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          t.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(t)} className="p-1.5 text-gray-400 hover:text-[#F5C542] transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={18} />
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

      {showForm && (
        <TestimonialForm 
          testimonial={editingTestimonial} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </div>
  );
};

export default TestimonialManagement;
