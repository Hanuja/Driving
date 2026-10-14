import React from 'react';
import { Eye, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const CourseTable = ({ courses, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-100">
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">Course ID</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Course Info</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Details</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Price</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Students</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-gray-50 hover:bg-[#F7F7F5]/50 transition-colors duration-200">
              <td className="py-4 px-4">
                <span className="text-sm font-black text-[#111111]">{course.code}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111]">{course.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">{course.type}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#111111]">{course.transmission}</span>
                  <span className="text-[10px] font-medium text-[#737373]">{course.duration}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-bold text-[#111111]">Rs. {parseFloat(course.price || 0).toLocaleString()}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-bold text-[#111111] bg-gray-100 px-2 py-1 rounded-md">{course.student_count || 0}</span>
              </td>
              <td className="py-4 px-4">
                <button 
                  onClick={() => onToggleStatus(course)}
                  className={`flex items-center text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${course.status === 'Active' ? 'bg-[#FFF9E6] text-[#111111] hover:bg-red-50' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                >
                  {course.status === 'Active' ? (
                    <><ToggleRight size={14} className="mr-1 text-[#F5C542]" /> Active</>
                  ) : (
                    <><ToggleLeft size={14} className="mr-1" /> Inactive</>
                  )}
                </button>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button onClick={() => onView(course)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-md transition-colors" title="View Details">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(course)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-md transition-colors" title="Edit Course">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(course)} className="p-1.5 text-[#737373] hover:text-white hover:bg-red-500 rounded-md transition-colors" title="Delete Course">
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

export default CourseTable;
