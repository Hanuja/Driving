import React, { useState } from 'react';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import axios from 'axios';

const BookingTable = ({ bookings, onView, onEdit, onDelete, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending':
        return <span className="bg-[#F5C542] text-[#111111] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'Confirmed':
        return <span className="bg-[#111111] text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Confirmed</span>;
      case 'Completed':
        return <span className="bg-[#E5E5E5] text-[#111111] px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Completed</span>;
      case 'Cancelled':
      case 'Rejected':
        return <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
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

  const handleQuickStatus = async (booking, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost/Driving/api/bookings/${booking.id}`, 
        { ...booking, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange();
    } catch(err) {
      alert('Failed to update booking status.');
    }
  };

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F7F7F5] border-y border-gray-100">
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] whitespace-nowrap">Booking ID</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Student & Course</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Schedule</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Payment</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
            <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#737373] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking.id} className="border-b border-gray-100 hover:bg-[#F7F7F5]/50 transition-colors duration-200">
              <td className="py-4 px-4">
                <span className="text-sm font-black text-[#111111]">{booking.booking_id}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111]">{booking.student_name}</span>
                  <span className="text-xs font-medium text-[#737373]">{booking.course_name}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#111111]">{booking.booking_date}</span>
                  <span className="text-xs font-medium text-[#737373]">{booking.start_time} - {booking.end_time}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                {getPaymentBadge(booking.payment_status)}
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(booking.status)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  
                  {booking.status === 'Pending' && (
                    <>
                      <button onClick={() => handleQuickStatus(booking, 'Confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Confirm">
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleQuickStatus(booking, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Reject">
                        <X size={18} />
                      </button>
                    </>
                  )}

                  {booking.status === 'Confirmed' && (
                    <button onClick={() => handleQuickStatus(booking, 'Completed')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Mark Completed">
                      <Check size={18} />
                    </button>
                  )}

                  <button onClick={() => onView(booking)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-[#F5C542] rounded-md transition-colors" title="View Details">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(booking)} className="p-1.5 text-[#737373] hover:text-[#111111] hover:bg-gray-200 rounded-md transition-colors" title="Edit Booking">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(booking)} className="p-1.5 text-[#737373] hover:text-white hover:bg-red-500 rounded-md transition-colors" title="Delete Booking">
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
          Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, bookings.length)} of {bookings.length} bookings
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

export default BookingTable;
