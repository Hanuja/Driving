import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Calendar, Car, GraduationCap, CreditCard } from 'lucide-react';
import axios from 'axios';

const StudentProfile = ({ student, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [student.id]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost/Driving/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Filter bookings for this student
        const studentBookings = response.data.data.filter(b => b.student_id === student.id);
        setBookings(studentBookings);
      }
    } catch (err) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="bg-[#111111] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Active</span>;
      case 'Pending':
        return <span className="bg-[#F5C542] text-[#111111] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'Completed':
        return <span className="bg-[#E5E5E5] text-[#111111] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const getBookingStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-[#F5C542] text-[#0B0B0B]';
      case 'Confirmed': return 'bg-[#111111] text-white';
      case 'Completed': return 'bg-[#E5E5E5] text-[#111111]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-[#F7F7F5]">
          <div>
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight mb-2">Student Profile</h2>
            <div className="flex items-center space-x-3">
              <span className="text-[#737373] font-bold text-sm tracking-widest">{student.student_id}</span>
              {getStatusBadge(student.status)}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#737373] hover:text-[#111111] hover:bg-white rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Personal Details */}
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center mb-4">
                  <User size={18} className="mr-2 text-[#F5C542]" />
                  Personal Details
                </h3>
                <div className="space-y-4 bg-[#F7F7F5] p-5 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-sm font-bold text-[#111111]">{student.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Gender</p>
                      <p className="text-sm font-bold text-[#111111]">{student.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">DOB</p>
                      <p className="text-sm font-bold text-[#111111]">{student.date_of_birth || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Phone size={12} className="mr-1" /> Phone
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Mail size={12} className="mr-1" /> Email
                    </p>
                    <p className="text-sm font-bold text-[#111111] truncate">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Address</p>
                    <p className="text-sm font-bold text-[#111111]">{student.address || 'N/A'}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Calendar size={12} className="mr-1" /> Registered On
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{student.registration_date}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center mb-4">
                  <CreditCard size={18} className="mr-2 text-[#F5C542]" />
                  Payment Details
                </h3>
                <div className="space-y-4 bg-[#F7F7F5] p-5 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Total Fee</p>
                    <p className="text-sm font-bold text-[#111111]">LKR {parseFloat(student.course_fee || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Paid Amount</p>
                    <p className="text-sm font-bold text-[#111111]">LKR {parseFloat(student.paid_amount || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest">Remaining</p>
                    <p className="text-sm font-bold text-red-500">LKR {Math.max(0, parseFloat(student.course_fee || 0) - parseFloat(student.paid_amount || 0)).toLocaleString()}</p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mr-2">Status:</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${
                      student.payment_status === 'Paid' ? 'text-green-600' : 
                      student.payment_status === 'Partial' ? 'text-[#F5C542]' : 'text-red-500'
                    }`}>
                      {student.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Course & Bookings */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Course Details */}
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center mb-4">
                  <GraduationCap size={18} className="mr-2 text-[#F5C542]" />
                  Course Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7F7F5] p-5 rounded-xl border border-gray-100">
                  <div className="md:col-span-2">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Selected Course</p>
                    <p className="text-lg font-black text-[#111111]">{student.course_name || 'N/A'}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <User size={12} className="mr-1" /> Assigned Instructor
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{student.instructor_name || 'Not Assigned'}</p>
                    {student.instructor_phone && <p className="text-xs text-[#737373]">{student.instructor_phone}</p>}
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1 flex items-center">
                      <Car size={12} className="mr-1" /> Assigned Vehicle
                    </p>
                    <p className="text-sm font-bold text-[#111111]">{student.vehicle_number || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center mb-4 border-b border-gray-100 pb-2">
                  <Calendar size={18} className="mr-2 text-[#F5C542]" />
                  Booking History
                </h3>
                
                {loading ? (
                  <div className="py-8 text-center text-[#737373] text-sm font-medium">Loading history...</div>
                ) : bookings.length === 0 ? (
                  <div className="bg-[#F7F7F5] rounded-xl p-8 text-center border border-gray-100">
                    <p className="text-[#737373] text-sm font-medium">No bookings found for this student.</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#F7F7F5] border-b border-gray-200">
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#737373]">Date & Time</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#737373]">Course</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#737373]">Instructor</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#737373]">Vehicle</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#737373]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking, idx) => (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-[#F7F7F5]/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="text-xs font-bold text-[#111111]">{booking.booking_date}</div>
                                <div className="text-[10px] text-[#737373]">{booking.start_time} - {booking.end_time}</div>
                              </td>
                              <td className="py-3 px-4 text-xs font-medium text-[#111111]">{booking.course_name}</td>
                              <td className="py-3 px-4 text-xs font-medium text-[#737373]">{booking.instructor_name}</td>
                              <td className="py-3 px-4 text-xs font-medium text-[#737373]">{booking.vehicle_number}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${getBookingStatusBadge(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
