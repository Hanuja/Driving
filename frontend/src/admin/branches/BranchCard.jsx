import React from 'react';
import { Eye, Pencil, Trash2, Users, Car, ToggleLeft, ToggleRight, MapPin, Clock } from 'lucide-react';

const BranchCard = ({ branch, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
      
      <div className="h-28 bg-[#111111] relative p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="bg-[#F5C542] text-[#111111] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            {branch.branch_code}
          </span>
          <button 
            onClick={() => onToggleStatus(branch)}
            className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${branch.status === 'Active' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-100 hover:bg-red-500/40'}`}
          >
            {branch.status === 'Active' ? <ToggleRight size={14} className="mr-1 text-[#F5C542]" /> : <ToggleLeft size={14} className="mr-1" />}
            {branch.status}
          </button>
        </div>
        <div>
          <h3 className="text-white font-black text-lg leading-tight line-clamp-1">{branch.name}</h3>
          <p className="text-[#F5C542] text-xs font-bold uppercase tracking-wider flex items-center mt-1"><MapPin size={12} className="mr-1"/> {branch.city || 'Unknown City'}</p>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-3 mb-4">
          <div className="col-span-2">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">Manager</p>
            <p className="text-sm font-bold text-[#111111] truncate">{branch.manager || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Clock size={10} className="mr-1" /> Open
            </p>
            <p className="text-sm font-bold text-[#111111]">{branch.opening_time ? branch.opening_time.substring(0,5) : '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Clock size={10} className="mr-1" /> Close
            </p>
            <p className="text-sm font-bold text-[#111111]">{branch.closing_time ? branch.closing_time.substring(0,5) : '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Users size={10} className="mr-1" /> Instructors
            </p>
            <p className="text-sm font-bold text-[#111111]">{branch.instructor_count || 0}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Car size={10} className="mr-1" /> Vehicles
            </p>
            <p className="text-sm font-bold text-[#111111]">{branch.vehicle_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-100 p-3 bg-[#F7F7F5] flex justify-between items-center gap-2">
        <button 
          onClick={() => onView(branch)}
          className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <Eye size={16} className="mr-1" /> View
        </button>
        <button 
          onClick={() => onEdit(branch)}
          className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <Pencil size={16} className="mr-1" /> Edit
        </button>
        <button 
          onClick={() => onDelete(branch)}
          className="flex justify-center items-center p-2 text-[#737373] hover:text-white hover:bg-red-500 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default BranchCard;
