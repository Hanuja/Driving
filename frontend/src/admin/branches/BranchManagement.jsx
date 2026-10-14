import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Phone, Filter, Building2, RefreshCw, Eye } from 'lucide-react';
import axios from 'axios';
import BranchForm from './BranchForm';
import BranchProfile from './BranchProfile';

const API_URL = 'http://localhost/Driving/api/branches';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  
  const [showProfile, setShowProfile] = useState(false);
  const [viewingBranch, setViewingBranch] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Failed to load branches.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBranches(branches.filter(b => b.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete branch.');
      }
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleView = async (branch) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${branch.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setViewingBranch(response.data.data);
        setShowProfile(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch branch details.');
    }
  };

  const handleCreate = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBranch(null);
    fetchBranches();
  };

  const filteredBranches = branches.filter(branch => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (branch.name || '').toLowerCase().includes(term) || 
      (branch.branch_code || '').toLowerCase().includes(term) ||
      (branch.city || '').toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'All' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeBranches = branches.filter(b => b.status === 'Active').length;
  const inactiveBranches = branches.filter(b => b.status === 'Inactive').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Branch Management</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage all academy locations, contact details, and status.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-5 py-2.5 rounded-lg font-bold uppercase tracking-wide text-sm transition-colors flex items-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Create Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mr-4">
            <Building2 className="text-[#111111]" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Total Branches</p>
            <h3 className="text-2xl font-black text-[#111111]">{branches.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-[#F5C542]/10 rounded-xl flex items-center justify-center mr-4">
            <div className="w-3 h-3 rounded-full bg-[#F5C542]"></div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Active Branches</p>
            <h3 className="text-2xl font-black text-[#111111]">{activeBranches}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mr-4">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#737373] uppercase tracking-wider mb-1">Inactive Branches</p>
            <h3 className="text-2xl font-black text-[#111111]">{inactiveBranches}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 border-b-0 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search branches..." 
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={fetchBranches} className="p-2 bg-[#F7F7F5] text-[#737373] hover:text-[#111111] rounded-lg transition-colors">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-b-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Branch Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Code</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">City</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">District</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">Loading branches...</td>
                </tr>
              ) : filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">No branches found.</td>
                </tr>
              ) : (
                filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#F7F7F5] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#111111]">{branch.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{branch.branch_code || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{branch.city || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{branch.district || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-gray-600">
                        <Phone size={14} className="mr-2 text-gray-400" />
                        {branch.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        branch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleView(branch)} className="p-1.5 text-gray-400 hover:text-[#111111] transition-colors" title="View Profile">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEdit(branch)} className="p-1.5 text-gray-400 hover:text-[#F5C542] transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(branch.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
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
        <BranchForm 
          branch={editingBranch} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}
      
      {showProfile && viewingBranch && (
        <BranchProfile 
          branch={viewingBranch} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
};

export default BranchManagement;
