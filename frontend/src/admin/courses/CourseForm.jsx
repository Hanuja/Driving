import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/courses';

const CourseForm = ({ course, onClose, onSuccess }) => {
  const isEdit = !!course;
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Beginner',
    description: '',
    transmission: 'Manual',
    duration: '',
    lessons: '',
    lesson_duration: '',
    price: '',
    registration_fee: '',
    status: 'Active',
    image: ''
  });

  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: course.name || '',
        code: course.code || '',
        type: course.type || 'Beginner',
        description: course.description || '',
        transmission: course.transmission || 'Manual',
        duration: course.duration || '',
        lessons: course.lessons || '',
        lesson_duration: course.lesson_duration || '',
        price: course.price || '',
        registration_fee: course.registration_fee || '',
        status: course.status || 'Active',
        image: course.image || ''
      });
      setFeatures(course.features || []);
    }
  }, [course, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = { ...formData, features };

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${course.id}`, submissionData, { headers });
        alert('Course updated successfully.');
      } else {
        await axios.post(API_URL, submissionData, { headers });
        alert('Course created successfully.');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#111111] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}
          
          <form id="course-form" onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Code *</label>
                  <input type="text" name="code" value={formData.code} onChange={handleChange} required autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Type *</label>
                  <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Refresher">Refresher</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Description *</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Course Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Duration *</label>
                  <input type="text" name="duration" placeholder="e.g. 4 Weeks" value={formData.duration} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Number of Lessons</label>
                  <input type="number" name="lessons" min="1" value={formData.lessons} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Lesson Duration (Mins)</label>
                  <input type="number" name="lesson_duration" min="1" value={formData.lesson_duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Both">Both</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Price (Rs.) *</label>
                  <input type="number" name="price" min="0" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Registration Fee (Rs.)</label>
                  <input type="number" name="registration_fee" min="0" value={formData.registration_fee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
              </div>
            </div>

            {/* Course Features */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Course Features</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newFeature} 
                  onChange={(e) => setNewFeature(e.target.value)} 
                  placeholder="e.g. 20 Practical Driving Lessons" 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"
                  onKeyPress={(e) => { if(e.key === 'Enter') handleAddFeature(e); }}
                />
                <button type="button" onClick={handleAddFeature} className="bg-[#111111] text-white px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-[#F5C542] hover:text-[#111111] transition-colors flex items-center">
                  <Plus size={16} className="mr-1" /> Add
                </button>
              </div>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex justify-between items-center bg-[#F7F7F5] border border-gray-200 px-3 py-2 rounded-md">
                    <span className="text-sm font-medium text-[#111111]">✓ {feature}</span>
                    <button type="button" onClick={() => handleRemoveFeature(index)} className="text-red-500 hover:text-red-700 p-1">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Media & Status */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Media & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]" size={16} />
                      <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-3 w-32 h-20 rounded-md border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img src={formData.image} alt="Preview" className="max-w-full max-h-full object-cover" onError={(e) => {e.target.style.display = 'none';}} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
            form="course-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors flex items-center shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Course')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
