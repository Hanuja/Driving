import React, { useState } from 'react';
import { X, CalendarDays, Clock, User, Car, Check, XCircle } from 'lucide-react';
import axios from 'axios';

const BookingDetails = ({ booking, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-[#F5C542] text-[#111111]';
      case 'Confirmed': return 'bg-[#111111] text-white';
      case 'Completed': return 'bg-[#E5E5E5] text-[#111111]';
      case 'Cancelled': 
      case 'Rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Mark this booking as ${newStatus}?`)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost/Driving/api/bookings/${booking.id}`, 
        { ...booking, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange();
      onClose();
    } catch(err) {
      alert('Failed to update booking status.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-[#F7F7F5]">
          <div>
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight mb-2">Booking Details</h2>
            <div className="flex items-center space-x-3">
              <span className="text-[#737373] font-bold text-sm tracking-widest">{booking.booking_id}</span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#737373] hover:text-[#111111] hover:bg-white rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Schedule Info */}
          <div className="space-y-6">
            <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CalendarDays size={64} />
              </div>
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center mb-4">
                Schedule Information
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                    <CalendarDays size={12} className="mr-1" /> Date
                  </p>
                  <p className="text-lg font-black text-[#111111]">{booking.booking_date}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Clock size={12} className="mr-1" /> Start
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{booking.start_time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Clock size={12} className="mr-1" /> End
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{booking.end_time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course & Payment */}
            <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-4">
                Course & Payment
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Course</p>
                  <p className="text-sm font-bold text-[#111111]">{booking.course_name}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Fee</p>
                  <p className="text-sm font-bold text-[#111111]">LKR {parseFloat(booking.course_fee || 0).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Paid</p>
                  <p className="text-sm font-bold text-green-600">LKR {parseFloat(booking.paid_amount || 0).toLocaleString()}</p>
                </div>
                <div className="pt-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${booking.payment_status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                    Payment: {booking.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* People Info */}
          <div className="space-y-6">
            
            {/* Student Info */}
            <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest flex items-center mb-4">
                <User size={12} className="mr-1" /> Student Details
              </h3>
              <div className="space-y-3">
                <p className="text-sm font-black text-[#111111]">{booking.student_name}</p>
                <p className="text-xs font-medium text-[#737373]">{booking.student_email}</p>
                <p className="text-xs font-medium text-[#737373]">{booking.student_phone}</p>
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Student ID</p>
                  <p className="text-xs font-bold text-[#111111]">{booking.student_code}</p>
                </div>
              </div>
            </div>

            {/* Resources Info */}
            <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100">
              <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-4">
                Assigned Resources
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                    <User size={12} className="mr-1" /> Instructor
                  </p>
                  <p className="text-sm font-bold text-[#111111]">{booking.instructor_name}</p>
                  {booking.instructor_phone && <p className="text-xs text-[#737373]">{booking.instructor_phone}</p>}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                    <Car size={12} className="mr-1" /> Vehicle
                  </p>
                  <p className="text-sm font-bold text-[#111111]">{booking.vehicle_number}</p>
                  <div className="flex gap-2 mt-1">
                    {booking.vehicle_type && <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-[#111111] font-bold uppercase">{booking.vehicle_type}</span>}
                    {booking.vehicle_transmission && <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-[#111111] font-bold uppercase">{booking.vehicle_transmission}</span>}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t border-gray-100 flex flex-wrap gap-3 bg-[#F7F7F5] justify-end">
          {booking.status === 'Pending' && (
            <>
              <button 
                onClick={() => handleUpdateStatus('Rejected')}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-2" /> Reject
              </button>
              <button 
                onClick={() => handleUpdateStatus('Confirmed')}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-white bg-[#111111] hover:bg-black transition-colors flex items-center shadow-md"
              >
                <Check size={16} className="mr-2" /> Confirm Booking
              </button>
            </>
          )}

          {booking.status === 'Confirmed' && (
            <button 
              onClick={() => handleUpdateStatus('Completed')}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center shadow-md"
            >
              <Check size={16} className="mr-2" /> Mark Completed
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;
