import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DeleteVehicleModal = ({ vehicle, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost/Driving/api/vehicles/${vehicle.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Vehicle deleted successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            Delete Vehicle?
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6 font-medium">
            Are you sure you want to permanently delete the vehicle <strong className="text-[#111111]">{vehicle.vehicle_number} ({vehicle.model})</strong>? 
          </p>
          
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
            <p className="text-sm text-red-700 font-medium">
              If this vehicle has any active bookings, it cannot be deleted. You can set it to <strong>Maintenance</strong> or <strong>Inactive</strong> instead.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-[0_4px_20px_rgba(239,68,68,0.3)] flex items-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 size={18} />
              )}
              {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
