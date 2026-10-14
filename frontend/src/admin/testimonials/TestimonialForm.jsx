import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/testimonials';

const TestimonialForm = ({ testimonial, onClose, onSuccess }) => {
  const isEdit = !!testimonial;
  
  const [formData, setFormData] = useState({
    student_name: '',
    course_name: '',
    rating: 5,
    testimonial: '',
    image_url: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        student_name: testimonial.student_name || '',
        course_name: testimonial.course_name || '',
        rating: testimonial.rating || 5,
        testimonial: testimonial.testimonial || '',
        image_url: testimonial.image_url || '',
        status: testimonial.status || 'pending',
        date: testimonial.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [testimonial, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${testimonial.id}`, formData, { headers });
      } else {
        await axios.post(API_URL, formData, { headers });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save testimonial. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
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
          
          <form id="testimonial-form" onSubmit={handleSubmit} className="p-6 space-y-8" autoComplete="off">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Student Name *</label>
                <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Name</label>
                <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} autoComplete="off" placeholder="e.g. Light Vehicle Training" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Student Image URL</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} autoComplete="off" placeholder="https://example.com/student.jpg" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      size={28} 
                      className={`transition-colors ${star <= formData.rating ? 'text-[#F5C542] fill-[#F5C542]' : 'text-gray-200 hover:text-gray-300'}`} 
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-bold text-gray-500">{formData.rating} out of 5</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Testimonial Text *</label>
              <textarea name="testimonial" value={formData.testimonial} onChange={handleChange} required rows="5" autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"></textarea>
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
            form="testimonial-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Testimonial')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialForm;
