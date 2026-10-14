import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/pricing';
const COURSES_API_URL = 'http://localhost/Driving/api/courses';

const PricingForm = ({ pkg, onClose, onSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    course_id: '',
    package_name: '',
    lessons: '',
    regular_price: '',
    discount_price: '',
    is_popular: 0,
    status: 'active',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchCourses();
    if (pkg) {
      setFormData({
        course_id: pkg.course_id || '',
        package_name: pkg.package_name || '',
        lessons: pkg.lessons || '',
        regular_price: pkg.regular_price || '',
        discount_price: pkg.discount_price || '',
        is_popular: pkg.is_popular || 0,
        status: pkg.status || 'active',
        features: pkg.features || []
      });
    }
  }, [pkg]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSES_API_URL);
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.package_name || !formData.regular_price) {
      setError('Package name and Regular price are required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        ...formData,
        lessons: formData.lessons ? parseInt(formData.lessons) : null,
        regular_price: parseFloat(formData.regular_price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null
      };

      if (pkg) {
        await axios.put(`${API_URL}/${pkg.id}`, payload, config);
      } else {
        await axios.post(API_URL, payload, config);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {pkg ? 'Edit Pricing Package' : 'Add New Package'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form id="pricing-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Package Name *</label>
                <input 
                  type="text" 
                  name="package_name"
                  value={formData.package_name} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111]"
                  placeholder="e.g. Starter Package"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Associated Course</label>
                <select 
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111] appearance-none"
                >
                  <option value="">General / All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Number of Lessons</label>
                <input 
                  type="number" 
                  name="lessons"
                  value={formData.lessons} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111]"
                  placeholder="e.g. 5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Regular Price (LKR) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="regular_price"
                  value={formData.regular_price} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Discount Price (LKR)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="discount_price"
                  value={formData.discount_price} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111]"
                  placeholder="0.00 (Optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111] appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center mt-8">
                <label className="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="is_popular"
                    checked={formData.is_popular === 1}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#111111] focus:ring-[#F5C542]"
                  />
                  <span className="ml-3 text-sm font-bold text-[#111111] uppercase tracking-wider group-hover:text-[#F5C542] transition-colors">Mark as Most Popular</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Package Features</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] focus:bg-white transition-all text-sm font-bold text-[#111111]"
                  placeholder="e.g. Basic Vehicle Control"
                />
                <button 
                  type="button"
                  onClick={addFeature}
                  className="bg-[#111111] text-white px-4 rounded-lg hover:bg-black transition-colors flex items-center justify-center font-bold"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              {formData.features.length > 0 && (
                <ul className="space-y-2">
                  {formData.features.map((feature, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <span className="text-sm font-medium text-[#111111]">{feature}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFeature(idx)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#737373] hover:text-[#111111] hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="pricing-form"
            disabled={loading}
            className="bg-[#111111] hover:bg-black text-[#F5C542] px-8 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-md flex items-center justify-center min-w-[120px] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (pkg ? 'Update' : 'Save')}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E5E7EB; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #D1D5DB; }
      `}} />
    </div>
  );
};

export default PricingForm;
