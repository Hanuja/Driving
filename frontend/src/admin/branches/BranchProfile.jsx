import React from 'react';
import { X, Building2, MapPin, Users, Car, Phone, Mail, Navigation, Activity } from 'lucide-react';

const BranchProfile = ({ branch, onClose }) => {
  if (!branch) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#F7F7F5] rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-fade-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#111111] p-8 flex justify-between items-start relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-[#F5C542] transition-colors">
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Building2 className="text-[#F5C542]" size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{branch.name}</h2>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  branch.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {branch.status}
                </span>
              </div>
              <div className="flex gap-4 text-gray-400 text-sm font-medium">
                <span className="flex items-center"><Activity size={14} className="mr-1.5 text-[#F5C542]" /> Code: {branch.branch_code || 'N/A'}</span>
                {branch.phone && <span className="flex items-center"><Phone size={14} className="mr-1.5 text-[#F5C542]" /> {branch.phone}</span>}
                {branch.email && <span className="flex items-center"><Mail size={14} className="mr-1.5 text-[#F5C542]" /> {branch.email}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-8">
            {branch.description && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{branch.description}</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4 flex items-center">
                <MapPin size={16} className="mr-2" /> Location Details
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Street Address</p>
                  <p className="font-medium text-[#111111]">{branch.address || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">City</p>
                  <p className="font-medium text-[#111111]">{branch.city || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">District</p>
                  <p className="font-medium text-[#111111]">{branch.district || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Postal Code</p>
                  <p className="font-medium text-[#111111]">{branch.postal_code || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">GPS Coordinates</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-[#111111] bg-gray-50 px-3 py-1 rounded border border-gray-200">
                      Lat: {branch.latitude || 'N/A'}
                    </span>
                    <span className="font-medium text-[#111111] bg-gray-50 px-3 py-1 rounded border border-gray-200">
                      Lng: {branch.longitude || 'N/A'}
                    </span>
                  </div>
                </div>
                {branch.google_maps_url && (
                  <div className="col-span-2 mt-2">
                    <a href={branch.google_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      <Navigation size={14} className="mr-1" /> View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Branch Statistics</h3>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center mr-4">
                <Users className="text-[#111111]" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Students</p>
                <h4 className="text-xl font-black text-[#111111]">{branch.total_students || 0}</h4>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className="w-10 h-10 bg-[#F5C542]/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="text-[#F5C542]" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Instructors</p>
                <h4 className="text-xl font-black text-[#111111]">{branch.total_instructors || 0}</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <Car className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Vehicles</p>
                <h4 className="text-xl font-black text-[#111111]">{branch.total_vehicles || 0}</h4>
              </div>
            </div>
            
            {/* Added Courses placeholder stat as it might not be explicitly returned by backend right now, but UI requires it */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <Activity className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Courses Offered</p>
                <h4 className="text-xl font-black text-[#111111]">{branch.courses?.length || 'All'}</h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchProfile;
