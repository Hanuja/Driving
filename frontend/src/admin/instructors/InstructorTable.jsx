import React from 'react';
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight, User } from 'lucide-react';

const InstructorTable = ({ instructors, onView, onEdit, onDelete, onToggleStatus, onToggleAvailability }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-100">
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">ID</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Profile</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Specialization</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Assignments</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Students</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Availability</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((inst) => (
            <tr key={inst.id} className="border-b border-gray-50 hover:bg-[#F7F7F5]/50 transition-colors duration-200">
              <td className="py-4 px-4">
                <span className="text-xs font-black text-[#111111] bg-gray-100 px-2 py-1 rounded">{inst.instructor_code}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0 border border-gray-300">
                    {inst.image ? (
                      <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#111111] line-clamp-1">{inst.name}</span>
                    <span className="text-[10px] font-medium text-[#737373]">{inst.phone || inst.email}</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-xs font-bold text-[#111111] bg-[#F5C542]/20 text-[#111111] px-2 py-1 rounded-md">{inst.specialties || '-'}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111111] truncate max-w-[150px]">{inst.branch_name || 'No Branch'}</span>
                  {inst.vehicle_number && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mt-0.5">{inst.vehicle_number}</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-bold text-[#111111]">{inst.student_count || 0}</span>
              </td>
              <td className="py-4 px-4">
                <select 
                  value={inst.availability} 
                  onChange={(e) => onToggleAvailability(inst, e.target.value)}
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md border-0 focus:ring-0 cursor-pointer ${
                    inst.availability === 'Available' ? 'bg-green-100 text-green-700' :
                    inst.availability === 'Busy' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </td>
              <td className="py-4 px-4">
                <button 
                  onClick={() => onToggleStatus(inst)}
                  className={`flex items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${inst.status === 'Active' ? 'bg-[#111111] text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {inst.status === 'Active' ? (
                    <><ToggleRight size={14} className="mr-1 text-[#F5C542]" /> Active</>
                  ) : (
                    <><ToggleLeft size={14} className="mr-1" /> Inactive</>
                  )}
                </button>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onView(inst)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-md transition-colors" title="View Profile">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(inst)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-md transition-colors" title="Edit Instructor">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(inst)} className="p-1.5 text-[#737373] hover:text-white hover:bg-red-500 rounded-md transition-colors" title="Delete Instructor">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorTable;
