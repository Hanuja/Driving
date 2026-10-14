import React from 'react';
import { Eye, Pencil, Trash2, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

const VehicleTable = ({ vehicles, onView, onEdit, onDelete, onStatusUpdate }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Available</span>;
      case 'Assigned':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Assigned</span>;
      case 'Maintenance':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">Maintenance</span>;
      case 'Inactive':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">Inactive</span>;
      default:
        return null;
    }
  };

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const today = new Date();
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const today = new Date();
    return expiry < today;
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F7F5] border-b border-gray-100">
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest whitespace-nowrap">Vehicle</th>
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest whitespace-nowrap">Specs</th>
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest whitespace-nowrap">Branch & Instructor</th>
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest whitespace-nowrap">Legal Docs</th>
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest whitespace-nowrap">Status</th>
              <th className="p-4 text-xs font-black text-[#111111] uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                      {vehicle.image ? (
                        <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs font-bold">NO IMG</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-[#111111]">{vehicle.vehicle_number}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{vehicle.brand} {vehicle.model} ({vehicle.manufacturing_year})</div>
                    </div>
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[#111111]">{vehicle.vehicle_type}</span>
                    <span className="text-xs font-medium text-gray-500">{vehicle.transmission} • {vehicle.fuel_type}</span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[#111111]">{vehicle.branch_name || 'Unassigned'}</span>
                    <span className="text-xs font-medium text-gray-500">{vehicle.instructor_name || 'No Instructor'}</span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className={isExpired(vehicle.insurance_expiry) ? "text-red-500" : isExpiringSoon(vehicle.insurance_expiry) ? "text-orange-500" : "text-gray-400"} />
                      <span className={`text-xs font-medium ${isExpired(vehicle.insurance_expiry) ? "text-red-600" : isExpiringSoon(vehicle.insurance_expiry) ? "text-orange-600" : "text-gray-600"}`}>
                        INS: {vehicle.insurance_expiry || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className={isExpired(vehicle.revenue_license_expiry) ? "text-red-500" : isExpiringSoon(vehicle.revenue_license_expiry) ? "text-orange-500" : "text-gray-400"} />
                      <span className={`text-xs font-medium ${isExpired(vehicle.revenue_license_expiry) ? "text-red-600" : isExpiringSoon(vehicle.revenue_license_expiry) ? "text-orange-600" : "text-gray-600"}`}>
                        REV: {vehicle.revenue_license_expiry || 'N/A'}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  {getStatusBadge(vehicle.status)}
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(vehicle)}
                      className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(vehicle)}
                      className="p-2 text-gray-400 hover:text-[#F5C542] hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Vehicle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(vehicle)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Vehicle"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {vehicles.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No vehicles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTable;
