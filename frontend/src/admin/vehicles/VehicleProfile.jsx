import React, { useState } from 'react';
import { X, MapPin, Settings, User, FileText, ShieldCheck, CheckCircle2, History, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const VehicleProfile = ({ vehicle, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('details');

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Available</span>;
      case 'Assigned': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Assigned</span>;
      case 'Maintenance': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">Maintenance</span>;
      case 'Inactive': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">Inactive</span>;
      default: return null;
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      const newStatus = vehicle.status === 'Maintenance' ? 'Available' : 'Maintenance';
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost/Driving/api/vehicles/${vehicle.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(newStatus === 'Maintenance' ? 'Vehicle moved to maintenance' : 'Vehicle marked as available');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header (Image + Title) */}
        <div className="relative h-64 bg-[#F7F7F5] flex-shrink-0 group">
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-xl font-bold uppercase tracking-widest mt-4">No Vehicle Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-colors text-white">
            <X size={24} />
          </button>
          
          <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusBadge(vehicle.status)}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  {vehicle.vehicle_type}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-xl font-medium text-white/80 mt-1">{vehicle.vehicle_number}</p>
            </div>
            
            <button 
              onClick={handleMaintenanceToggle}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
                vehicle.status === 'Maintenance' 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Settings size={18} />
              {vehicle.status === 'Maintenance' ? 'Mark Available' : 'Set Maintenance'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-8 bg-white z-10">
          <button onClick={() => setActiveTab('details')} className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'details' ? 'border-[#F5C542] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            Vehicle Details
          </button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'history' ? 'border-[#F5C542] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            Booking History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic & Driving Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Specifications</h3>
                  <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Reg Number</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.registration_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Year</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.manufacturing_year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Transmission</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.transmission}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Fuel Type</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Engine</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.engine_capacity || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Mileage</p>
                      <p className="text-sm font-semibold text-[#111111] mt-1">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : '0 km'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Assignments</h3>
                  <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Branch</p>
                        <p className="text-sm font-semibold text-[#111111]">{vehicle.branch_name || 'Unassigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Instructor</p>
                        <p className="text-sm font-semibold text-[#111111]">{vehicle.instructor_name || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance & Legal */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Maintenance</h3>
                  <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-bold uppercase">Last Service</span>
                      <span className="text-sm font-semibold text-[#111111]">{vehicle.last_service_date || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 font-bold uppercase">Next Service</span>
                      <div className="flex items-center gap-2">
                        {isExpired(vehicle.next_service_date) && <AlertTriangle size={14} className="text-red-500" />}
                        <span className={`text-sm font-semibold ${isExpired(vehicle.next_service_date) ? 'text-red-600' : 'text-[#111111]'}`}>
                          {vehicle.next_service_date || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Legal Documents</h3>
                  <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 space-y-5">
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600 uppercase">Insurance</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-sm font-semibold text-[#111111]">{vehicle.insurance_provider || 'Unknown Provider'}</p>
                        <p className="text-xs text-gray-500 mt-1">Policy: {vehicle.insurance_policy_number || 'N/A'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isExpired(vehicle.insurance_expiry) ? 'bg-red-100 text-red-700' : isExpiringSoon(vehicle.insurance_expiry) ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {isExpired(vehicle.insurance_expiry) ? 'EXPIRED' : isExpiringSoon(vehicle.insurance_expiry) ? 'EXPIRING SOON' : 'VALID'}
                          </span>
                          <span className="text-xs text-gray-500">Exp: {vehicle.insurance_expiry || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600 uppercase">Revenue License</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mt-1">License: {vehicle.revenue_license_number || 'N/A'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isExpired(vehicle.revenue_license_expiry) ? 'bg-red-100 text-red-700' : isExpiringSoon(vehicle.revenue_license_expiry) ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {isExpired(vehicle.revenue_license_expiry) ? 'EXPIRED' : isExpiringSoon(vehicle.revenue_license_expiry) ? 'EXPIRING SOON' : 'VALID'}
                          </span>
                          <span className="text-xs text-gray-500">Exp: {vehicle.revenue_license_expiry || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <History size={24} className="text-[#F5C542]" />
                <h2 className="text-xl font-black text-[#111111]">Recent Bookings</h2>
              </div>
              
              {(!vehicle.booking_history || vehicle.booking_history.length === 0) ? (
                <div className="text-center py-12 bg-[#F7F7F5] rounded-2xl border border-gray-100">
                  <p className="text-gray-500 font-medium">No booking history found for this vehicle.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F7F5] border-b border-gray-100">
                        <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest">ID</th>
                        <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest">Date & Time</th>
                        <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest">Student</th>
                        <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest">Course</th>
                        <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {vehicle.booking_history.map((booking, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-[#111111]">#{booking.booking_id}</td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-[#111111]">{booking.booking_date}</div>
                            <div className="text-xs text-gray-500">{booking.start_time} - {booking.end_time}</div>
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-700">{booking.student_name}</td>
                          <td className="p-4 text-sm font-medium text-gray-700">{booking.course_name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleProfile;
