import React from 'react';
import { Eye, Pencil, Trash2, MapPin, Car, Phone, ToggleLeft, ToggleRight } from 'lucide-react';

const InstructorCard = ({ instructor, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
      
      <div className="h-24 bg-[#111111] relative p-4 flex justify-between">
        <span className="bg-[#F5C542] text-[#111111] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded h-fit">
          {instructor.instructor_code}
        </span>
        <button 
          onClick={() => onToggleStatus(instructor)}
          className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded h-fit transition-colors ${instructor.status === 'Active' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-100 hover:bg-red-500/40'}`}
        >
          {instructor.status === 'Active' ? <ToggleRight size={14} className="mr-1 text-[#F5C542]" /> : <ToggleLeft size={14} className="mr-1" />}
          {instructor.status}
        </button>
      </div>

      <div className="px-4 pt-0 pb-4 flex-1 flex flex-col items-center -mt-10">
        <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white overflow-hidden shadow-sm mb-3">
          {instructor.image ? (
            <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-black text-2xl">
              {instructor.name.charAt(0)}
            </div>
          )}
        </div>
        
        <h3 className="text-[#111111] font-black text-lg text-center leading-tight">{instructor.name}</h3>
        <p className="text-[#737373] text-xs font-bold uppercase tracking-wider mb-4 text-center">{instructor.specialties || 'Instructor'}</p>

        <div className="w-full grid grid-cols-2 gap-3 mb-2">
          <div className="bg-[#F7F7F5] p-2 rounded-lg text-center border border-gray-100">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Students</p>
            <p className="text-sm font-black text-[#111111]">{instructor.student_count || 0}</p>
          </div>
          <div className={`p-2 rounded-lg text-center border ${instructor.availability === 'Available' ? 'bg-green-50 border-green-100 text-green-700' : instructor.availability === 'Busy' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider">Status</p>
            <p className="text-sm font-black">{instructor.availability}</p>
          </div>
        </div>

        <div className="w-full space-y-2 mt-2">
          <div className="flex items-center text-xs text-[#737373]">
            <MapPin size={12} className="mr-2 text-[#111111]" />
            <span className="truncate">{instructor.branch_name || 'No Branch'}</span>
          </div>
          <div className="flex items-center text-xs text-[#737373]">
            <Car size={12} className="mr-2 text-[#111111]" />
            <span className="truncate">{instructor.vehicle_number || 'No Vehicle'}</span>
          </div>
          <div className="flex items-center text-xs text-[#737373]">
            <Phone size={12} className="mr-2 text-[#111111]" />
            <span className="truncate">{instructor.phone || '-'}</span>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-100 p-3 bg-[#F7F7F5] flex justify-between items-center gap-2">
        <button onClick={() => onView(instructor)} className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">
          <Eye size={16} className="mr-1" /> View
        </button>
        <button onClick={() => onEdit(instructor)} className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">
          <Pencil size={16} className="mr-1" /> Edit
        </button>
        <button onClick={() => onDelete(instructor)} className="flex justify-center items-center p-2 text-[#737373] hover:text-white hover:bg-red-500 rounded-lg transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstructorCard;
