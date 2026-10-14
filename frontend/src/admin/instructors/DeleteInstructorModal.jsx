import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import axios from 'axios';

const DeleteInstructorModal = ({ instructor, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost/Driving/api/instructors/${instructor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Instructor deleted successfully.');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete instructor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in text-center">
        
        <div className="p-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          
          <h2 className="text-2xl font-black text-[#111111] mb-2 uppercase tracking-tight">Delete Instructor?</h2>
          <p className="text-[#737373] text-sm font-medium mb-6">
            Are you sure you want to delete <span className="font-bold text-[#111111]">{instructor.name} ({instructor.instructor_code})</span>? This action cannot be undone.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 text-left">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose} 
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F7F7F5] hover:bg-gray-200 transition-colors w-full border border-gray-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide text-white bg-red-600 hover:bg-red-700 transition-colors w-full flex items-center justify-center disabled:opacity-50 shadow-md"
            >
              {loading ? 'Deleting...' : 'Delete Instructor'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeleteInstructorModal;
