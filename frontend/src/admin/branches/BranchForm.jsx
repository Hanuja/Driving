import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/branches';

const BranchForm = ({ branch, onClose, onSuccess }) => {
  const isEdit = !!branch;
  
  const [formData, setFormData] = useState({
    name: '',
    branch_code: '',
    description: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
    phone: '',
    email: '',
    google_maps_url: '',
    latitude: '',
    longitude: '',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: branch.name || '',
        branch_code: branch.branch_code || '',
        description: branch.description || '',
        address: branch.address || '',
        city: branch.city || '',
        district: branch.district || '',
        postal_code: branch.postal_code || '',
        phone: branch.phone || '',
        email: branch.email || '',
        google_maps_url: branch.google_maps_url || '',
        latitude: branch.latitude || '',
        longitude: branch.longitude || '',
        status: branch.status || 'Active'
      });
    }
  }, [branch, isEdit]);

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
        await axios.put(`${API_URL}/${branch.id}`, formData, { headers });
        alert('Branch updated successfully.');
      } else {
        await axios.post(API_URL, formData, { headers });
        alert('Branch created successfully.');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save branch. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Branch' : 'Create Branch'}
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
          
          <form id="branch-form" onSubmit={handleSubmit} className="p-6 space-y-10" autoComplete="off">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Branch Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Branch Code *</label>
                  <input type="text" name="branch_code" value={formData.branch_code} onChange={handleChange} required autoComplete="off" placeholder="CD-COL-001" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium uppercase" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="2" autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 flex items-center">
                <MapPin size={16} className="mr-2" /> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">District</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Postal Code</label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} autoComplete="off" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Google Maps URL</label>
                  <input type="text" name="google_maps_url" value={formData.google_maps_url} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Latitude</label>
                  <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="6.9271" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Longitude</label>
                  <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="79.8612" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Branch Status</h3>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} className="w-4 h-4 text-[#111111] border-gray-300 focus:ring-[#F5C542]" />
                  <span className="ml-2 text-sm font-bold text-[#111111]">Active</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} className="w-4 h-4 text-[#111111] border-gray-300 focus:ring-[#F5C542]" />
                  <span className="ml-2 text-sm font-bold text-[#737373]">Inactive</span>
                </label>
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
            form="branch-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Branch')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchForm;
