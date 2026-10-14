import React, { useState } from 'react';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentTable = ({ students, onView, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="bg-[#111111] text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Active</span>;
      case 'Pending':
        return <span className="bg-[#F5C542] text-[#111111] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'Completed':
        return <span className="bg-[#E5E5E5] text-[#111111] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch(status) {
      case 'Paid':
        return <span className="text-green-600 font-bold text-xs uppercase tracking-wide">Paid</span>;
      case 'Partial':
        return <span className="text-[#F5C542] font-bold text-xs uppercase tracking-wide">Partial</span>;
      case 'Pending':
        return <span className="text-red-500 font-bold text-xs uppercase tracking-wide">Pending</span>;
      default:
        return <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">{status}</span>;
    }
  };

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F7F7F5] border-y border-gray-100">
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">Student ID</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Student Info</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Course Info</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">Registration</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Payment</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id} className="border-b border-gray-100 hover:bg-[#F7F7F5]/50 transition-colors duration-200">
              <td className="py-4 px-4">
                <span className="text-sm font-black text-[#111111]">{student.student_id}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111]">{student.name}</span>
                  <span className="text-xs font-medium text-[#737373]">{student.email}</span>
                  <span className="text-xs font-medium text-[#737373]">{student.phone}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111]">{student.course_name || 'N/A'}</span>
                  {student.instructor_name && <span className="text-xs font-medium text-[#737373]">Inst: {student.instructor_name}</span>}
                  {student.vehicle_number && <span className="text-xs font-medium text-[#737373]">Veh: {student.vehicle_number}</span>}
                </div>
              </td>
              <td className="py-4 px-4 text-sm font-medium text-[#737373] whitespace-nowrap">
                {student.registration_date}
              </td>
              <td className="py-4 px-4">
                {getPaymentBadge(student.payment_status)}
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(student.status)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => onView(student)}
                    className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-md transition-colors"
                    title="View Profile"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => onEdit(student)}
                    className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-md transition-colors"
                    title="Edit Student"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(student)}
                    className="p-1.5 text-[#737373] hover:text-white hover:bg-red-500 rounded-md transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-[#737373]">
        <div>
          Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, students.length)} of {students.length} students
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-2 font-bold text-[#111111]">{currentPage} / {totalPages || 1}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
