import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit2, Tag } from 'lucide-react';
import PricingForm from './PricingForm';

const API_URL = 'http://localhost/Driving/api/pricing';

const PricingManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setPackages(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch pricing packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pricing package?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(packages.filter(pkg => pkg.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete package.');
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchPackages();
  };

  const filteredPackages = packages.filter(pkg => 
    (pkg.package_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (pkg.course_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Pricing Packages</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage pricing packages and offers for courses.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="w-full md:w-auto bg-[#F5C542] text-[#111111] hover:bg-[#111111] hover:text-[#F5C542] px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-md flex items-center justify-center"
        >
          <Plus size={16} className="mr-2" /> Add Package
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by package name or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-medium"
          />
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
      ) : filteredPackages.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-12 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Tag className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#111111] mb-1">No Packages Found</h3>
          <p className="text-[#737373] text-sm text-center max-w-md">
            {searchTerm ? "No packages match your search criteria." : "Your pricing list is empty. Click 'Add Package' to get started."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F7F5]">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Package Name</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Course</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Price (LKR)</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Features</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map(pkg => (
                  <tr key={pkg.id} className="border-b border-gray-100 hover:bg-[#F7F7F5] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#111111]">{pkg.package_name}</span>
                        {pkg.is_popular == 1 && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded-full mt-1 w-max uppercase tracking-wider">Most Popular</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#737373] font-medium">{pkg.course_name || 'General / All'}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-black text-[#111111]">
                          {pkg.discount_price > 0 ? parseFloat(pkg.discount_price).toLocaleString() : parseFloat(pkg.regular_price).toLocaleString()}
                        </span>
                        {pkg.discount_price > 0 && (
                          <span className="text-xs text-red-500 line-through font-medium">{parseFloat(pkg.regular_price).toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#737373]">
                      {pkg.features && Array.isArray(pkg.features) ? `${pkg.features.length} items` : 'None'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(pkg)}
                          className="p-2 text-[#737373] hover:text-[#F5C542] hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 text-[#737373] hover:text-red-500 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <PricingForm 
          pkg={editingPackage}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default PricingManagement;
