import React from 'react';
import { Eye, Pencil, Trash2, Users, Clock, ToggleLeft, ToggleRight, Settings } from 'lucide-react';

const CourseCard = ({ course, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
      {/* Header / Image Area */}
      <div className="h-32 bg-[#111111] relative p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="bg-[#F5C542] text-[#111111] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            {course.code}
          </span>
          <button 
            onClick={() => onToggleStatus(course)}
            className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${course.status === 'Active' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-100 hover:bg-red-500/40'}`}
          >
            {course.status === 'Active' ? <ToggleRight size={14} className="mr-1 text-[#F5C542]" /> : <ToggleLeft size={14} className="mr-1" />}
            {course.status}
          </button>
        </div>
        <div>
          <h3 className="text-white font-black text-lg leading-tight line-clamp-1">{course.name}</h3>
          <p className="text-[#F5C542] text-xs font-bold uppercase tracking-wider">{course.type}</p>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-3 mb-4">
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Settings size={10} className="mr-1" /> Transmission
            </p>
            <p className="text-sm font-bold text-[#111111]">{course.transmission || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Clock size={10} className="mr-1" /> Duration
            </p>
            <p className="text-sm font-bold text-[#111111]">{course.duration || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center mb-0.5">
              <Users size={10} className="mr-1" /> Students
            </p>
            <p className="text-sm font-bold text-[#111111]">{course.student_count || 0}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-sm font-bold text-[#111111]">Rs. {parseFloat(course.price || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-100 p-3 bg-[#F7F7F5] flex justify-between items-center gap-2">
        <button 
          onClick={() => onView(course)}
          className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <Eye size={16} className="mr-1" /> View
        </button>
        <button 
          onClick={() => onEdit(course)}
          className="flex-1 flex justify-center items-center py-2 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <Pencil size={16} className="mr-1" /> Edit
        </button>
        <button 
          onClick={() => onDelete(course)}
          className="flex justify-center items-center p-2 text-[#737373] hover:text-white hover:bg-red-500 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
