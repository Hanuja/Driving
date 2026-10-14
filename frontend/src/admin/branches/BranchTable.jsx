import React from 'react';
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

const BranchTable = ({ branches, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-100">
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">Code</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Branch Info</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Contact</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Manager</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Resources</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id} className="border-b border-gray-50 hover:bg-[#F7F7F5]/50 transition-colors duration-200">
              <td className="py-4 px-4">
                <span className="text-sm font-black text-[#111111]">{branch.branch_code}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111] flex items-center"><MapPin size={14} className="mr-1 text-[#F5C542]" />{branch.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mt-0.5">{branch.city || 'No City'}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#111111]">{branch.phone || '-'}</span>
                  <span className="text-[10px] font-medium text-[#737373]">{branch.email || '-'}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-bold text-[#111111]">{branch.manager || '-'}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#111111] bg-gray-100 px-2 py-0.5 rounded-md" title="Instructors">{branch.instructor_count || 0} I</span>
                  <span className="text-xs font-bold text-[#111111] bg-gray-100 px-2 py-0.5 rounded-md" title="Vehicles">{branch.vehicle_count || 0} V</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <button 
                  onClick={() => onToggleStatus(branch)}
                  className={`flex items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${branch.status === 'Active' ? 'bg-[#FFF9E6] text-[#111111] hover:bg-red-50' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                >
                  {branch.status === 'Active' ? (
                    <><ToggleRight size={14} className="mr-1 text-[#F5C542]" /> Active</>
                  ) : (
                    <><ToggleLeft size={14} className="mr-1" /> Inactive</>
                  )}
                </button>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onView(branch)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-md transition-colors" title="View Profile">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(branch)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-md transition-colors" title="Edit Branch">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(branch)} className="p-1.5 text-[#737373] hover:text-white hover:bg-red-500 rounded-md transition-colors" title="Delete Branch">
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

export default BranchTable;
