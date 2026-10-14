import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, RefreshCw, LayoutGrid, List as ListIcon, CarFront } from 'lucide-react';

import VehicleTable from './VehicleTable';
import VehicleCard from './VehicleCard';
import VehicleForm from './VehicleForm';
import VehicleProfile from './VehicleProfile';
import DeleteVehicleModal from './DeleteVehicleModal';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // list or grid
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [profileVehicle, setProfileVehicle] = useState(null);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [vehRes, brRes, instRes] = await Promise.all([
        axios.get('http://localhost/Driving/api/vehicles', { headers }),
        axios.get('http://localhost/Driving/api/branches', { headers }),
        axios.get('http://localhost/Driving/api/instructors', { headers })
      ]);

      setVehicles(vehRes.data.data || []);
      setBranches(brRes.data.data || []);
      setInstructors(instRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load data. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
    toast.success('Data refreshed');
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (selectedVehicle) {
        await axios.put(`http://localhost/Driving/api/vehicles/${selectedVehicle.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Vehicle updated successfully');
      } else {
        await axios.post('http://localhost/Driving/api/vehicles', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Vehicle created successfully');
      }
      setIsFormOpen(false);
      setSelectedVehicle(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      (v.vehicle_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.registration_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.instructor_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType ? v.vehicle_type === filterType : true;
    const matchesStatus = filterStatus ? v.status === filterStatus : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    assigned: vehicles.filter(v => v.status === 'Assigned').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
    inactive: vehicles.filter(v => v.status === 'Inactive').length
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#111111] flex items-center gap-3">
            <CarFront className="text-[#F5C542]" size={32} />
            Vehicle Management
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage academy vehicles, assignments, availability, and maintenance.</p>
        </div>
        <button 
          onClick={() => { setSelectedVehicle(null); setIsFormOpen(true); }}
          className="bg-[#111111] hover:bg-black text-[#F5C542] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Vehicles', value: stats.total, color: 'bg-[#111111] text-white', valColor: 'text-[#F5C542]' },
          { label: 'Available', value: stats.available, color: 'bg-white text-gray-500 border border-gray-100', valColor: 'text-green-500' },
          { label: 'Assigned', value: stats.assigned, color: 'bg-white text-gray-500 border border-gray-100', valColor: 'text-blue-500' },
          { label: 'Maintenance', value: stats.maintenance, color: 'bg-white text-gray-500 border border-gray-100', valColor: 'text-orange-500' },
          { label: 'Inactive', value: stats.inactive, color: 'bg-white text-gray-500 border border-gray-100', valColor: 'text-gray-400' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.valColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search vehicles, brands, models, or instructors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-[#F5C542]"
          >
            <option value="">All Types</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Heavy Vehicle">Heavy Vehicle</option>
            <option value="Bus">Bus</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-[#F7F7F5] border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-[#F5C542]"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex bg-[#F7F7F5] border border-gray-200 rounded-xl p-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow text-[#111111]' : 'text-gray-400 hover:text-gray-600'}`}>
              <ListIcon size={20} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-[#111111]' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid size={20} />
            </button>
          </div>

          <button onClick={handleRefresh} className="p-3 bg-[#F7F7F5] border border-gray-200 text-gray-500 hover:text-[#111111] hover:bg-gray-200 rounded-xl transition-all">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white h-64 rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <VehicleTable 
              vehicles={filteredVehicles} 
              onView={(v) => {
                axios.get(`http://localhost/Driving/api/vehicles/${v.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
                  .then(res => setProfileVehicle(res.data.data))
                  .catch(() => toast.error('Failed to load vehicle details'));
              }} 
              onEdit={(v) => { setSelectedVehicle(v); setIsFormOpen(true); }} 
              onDelete={setDeleteVehicle} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onView={(v) => {
                      axios.get(`http://localhost/Driving/api/vehicles/${v.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
                        .then(res => setProfileVehicle(res.data.data))
                        .catch(() => toast.error('Failed to load vehicle details'));
                    }} 
                    onEdit={(v) => { setSelectedVehicle(v); setIsFormOpen(true); }} 
                    onDelete={setDeleteVehicle} 
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                  No vehicles found matching your search or filters.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {isFormOpen && (
        <VehicleForm 
          vehicle={selectedVehicle} 
          branches={branches}
          instructors={instructors}
          onSubmit={handleFormSubmit}
          onClose={() => { setIsFormOpen(false); setSelectedVehicle(null); }}
          isSubmitting={isSubmitting}
        />
      )}

      {profileVehicle && (
        <VehicleProfile 
          vehicle={profileVehicle}
          onClose={() => setProfileVehicle(null)}
          onRefresh={() => {
            fetchData();
            setProfileVehicle(null);
          }}
        />
      )}

      {deleteVehicle && (
        <DeleteVehicleModal 
          vehicle={deleteVehicle}
          onClose={() => setDeleteVehicle(null)}
          onSuccess={() => {
            setDeleteVehicle(null);
            fetchData();
          }}
        />
      )}

    </div>
  );
};

export default VehicleManagement;
