import React from 'react';
import { Eye, Pencil, Trash2, ShieldCheck, FileText, AlertTriangle, MapPin, User, Settings } from 'lucide-react';

const VehicleCard = ({ vehicle, onView, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Available</span>;
      case 'Assigned':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">Assigned</span>;
      case 'Maintenance':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-[10px] font-bold uppercase tracking-wider">Maintenance</span>;
      case 'Inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-bold uppercase tracking-wider">Inactive</span>;
      default:
        return null;
    }
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <div className="h-40 bg-[#F7F7F5] relative overflow-hidden">
        {vehicle.image ? (
          <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-sm font-bold uppercase tracking-widest mt-2">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          {getStatusBadge(vehicle.status)}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-black text-lg text-[#111111]">{vehicle.vehicle_number}</h3>
            <p className="text-sm font-semibold text-gray-500">{vehicle.brand} {vehicle.model} ({vehicle.manufacturing_year})</p>
          </div>
          <div className="text-right">
            <span className="block text-xs font-bold text-[#111111] bg-gray-100 px-2 py-1 rounded">{vehicle.vehicle_type}</span>
            <span className="block text-[10px] font-bold text-gray-500 mt-1 uppercase">{vehicle.transmission}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
            <MapPin size={14} className="text-[#F5C542]" />
            <span className="truncate">{vehicle.branch_name || 'No Branch'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 p-2 rounded-lg">
            <User size={14} className="text-[#F5C542]" />
            <span className="truncate">{vehicle.instructor_name || 'Unassigned'}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex gap-3">
            <div className="flex items-center gap-1" title={`Insurance Expiry: ${vehicle.insurance_expiry || 'N/A'}`}>
              <ShieldCheck size={14} className={isExpired(vehicle.insurance_expiry) ? "text-red-500" : "text-gray-400"} />
            </div>
            <div className="flex items-center gap-1" title={`Revenue License: ${vehicle.revenue_license_expiry || 'N/A'}`}>
              <FileText size={14} className={isExpired(vehicle.revenue_license_expiry) ? "text-red-500" : "text-gray-400"} />
            </div>
            <div className="flex items-center gap-1" title={`Next Service: ${vehicle.next_service_date || 'N/A'}`}>
              <Settings size={14} className={isExpired(vehicle.next_service_date) ? "text-red-500" : "text-gray-400"} />
            </div>
          </div>
          
          <div className="flex gap-1">
            <button onClick={() => onView(vehicle)} className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors">
              <Eye size={16} />
            </button>
            <button onClick={() => onEdit(vehicle)} className="p-2 text-gray-400 hover:text-[#F5C542] hover:bg-yellow-50 rounded-lg transition-colors">
              <Pencil size={16} />
            </button>
            <button onClick={() => onDelete(vehicle)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
