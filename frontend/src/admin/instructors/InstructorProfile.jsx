import React from 'react';
import { X, MapPin, Phone, Mail, FileText, BadgeCheck, GraduationCap, Car, Calendar, Users, Briefcase } from 'lucide-react';

const InstructorProfile = ({ instructor, onClose, onToggleStatus }) => {
  const isExpired = instructor.license_expiry && new Date(instructor.license_expiry) < new Date();
  
  const licenseExpiryWarning = () => {
    if (!instructor.license_expiry) return null;
    const expiryDate = new Date(instructor.license_expiry);
    const today = new Date();
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (expiryDate < today) {
       return <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2 py-0.5 rounded ml-2">License Expired</span>;
    } else if (diffDays <= 30) {
       return <span className="text-[10px] font-black uppercase tracking-widest text-[#111111] bg-orange-400 px-2 py-0.5 rounded ml-2">Expiring Soon</span>;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-[#F7F7F5]">
          <div>
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight mb-2">Instructor Profile</h2>
            <div className="flex items-center space-x-3">
              <span className="text-[#111111] font-bold text-sm bg-[#F5C542] px-3 py-1 rounded-md tracking-widest uppercase">{instructor.instructor_code}</span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${instructor.status === 'Active' ? 'bg-[#111111] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {instructor.status}
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                instructor.availability === 'Available' ? 'bg-green-100 text-green-700' :
                instructor.availability === 'Busy' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {instructor.availability}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#737373] hover:text-[#111111] hover:bg-white rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto flex-1 bg-white">
          
          {/* Top Hero Section */}
          <div className="bg-[#111111] px-8 py-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b-4 border-[#F5C542]">
            <div className="w-32 h-32 rounded-full border-4 border-[#F5C542] overflow-hidden bg-gray-200 shadow-lg flex-shrink-0">
              {instructor.image ? (
                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-black">{instructor.name.charAt(0)}</div>
              )}
            </div>
            <div className="text-center md:text-left text-white pt-2 flex-1">
              <h1 className="text-3xl font-black mb-1">{instructor.name}</h1>
              <p className="text-[#F5C542] font-bold uppercase tracking-wider text-sm mb-4">{instructor.specialties || 'Driving Instructor'}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-300">
                <span className="flex items-center"><Phone size={14} className="mr-1.5 text-[#F5C542]" /> {instructor.phone}</span>
                <span className="flex items-center"><Mail size={14} className="mr-1.5 text-[#F5C542]" /> {instructor.email}</span>
                <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-[#F5C542]" /> {instructor.city || instructor.address || 'Unknown Location'}</span>
              </div>
            </div>
            
            {/* Quick Stats Box */}
            <div className="bg-white/10 rounded-xl p-4 flex gap-6 text-white min-w-fit">
               <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Students</p>
                  <p className="text-2xl font-black text-[#F5C542]">{instructor.total_students || 0}</p>
               </div>
               <div className="w-px bg-white/20"></div>
               <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Today's Lessons</p>
                  <p className="text-2xl font-black text-white">{instructor.todays_lessons || 0}</p>
               </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details */}
            <div className="space-y-8">
              
              {/* Professional Details */}
              <div>
                 <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center">
                   <FileText size={16} className="mr-2" /> Professional Details
                 </h3>
                 <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#737373] uppercase">NIC</span>
                      <span className="text-sm font-black text-[#111111]">{instructor.nic || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <span className="text-xs font-bold text-[#737373] uppercase">Driving License</span>
                      <span className="text-sm font-black text-[#111111]">{instructor.license_number || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <span className="text-xs font-bold text-[#737373] uppercase">Category</span>
                      <span className="text-sm font-bold bg-white border border-gray-200 px-2 rounded shadow-sm">{instructor.license_category || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <span className="text-xs font-bold text-[#737373] uppercase">Expiry Date</span>
                      <span className={`text-sm font-bold flex items-center ${isExpired ? 'text-red-600' : 'text-[#111111]'}`}>
                        {instructor.license_expiry || '-'} {licenseExpiryWarning()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <span className="text-xs font-bold text-[#737373] uppercase">Experience</span>
                      <span className="text-sm font-bold text-[#111111]">{instructor.experience ? `${instructor.experience} Years` : '-'}</span>
                    </div>
                 </div>
              </div>

              {/* Assignments */}
              <div>
                 <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center">
                   <Briefcase size={16} className="mr-2" /> Current Assignments
                 </h3>
                 
                 <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3 flex items-start bg-white shadow-sm hover:border-[#F5C542] transition-colors">
                      <div className="bg-[#FFF9E6] p-2 rounded-md mr-3">
                        <MapPin size={18} className="text-[#F5C542]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest leading-none mb-1">Assigned Branch</p>
                        <p className="text-sm font-black text-[#111111]">{instructor.branch_name || 'Not Assigned'}</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 flex items-start bg-white shadow-sm hover:border-[#F5C542] transition-colors">
                      <div className="bg-[#FFF9E6] p-2 rounded-md mr-3">
                        <Car size={18} className="text-[#F5C542]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest leading-none mb-1">Assigned Vehicle</p>
                        <p className="text-sm font-black text-[#111111]">{instructor.vehicle_number || 'Not Assigned'}</p>
                        {instructor.vehicle_model && <p className="text-xs text-gray-500 font-medium">{instructor.vehicle_model} • {instructor.vehicle_transmission}</p>}
                      </div>
                    </div>
                 </div>
              </div>

              {/* Student Stats */}
              <div>
                 <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center">
                   <Users size={16} className="mr-2" /> Student Statistics
                 </h3>
                 <div className="bg-[#F7F7F5] rounded-xl p-5 border border-gray-100">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#737373] uppercase">Total Students</span>
                        <span className="text-lg font-black text-[#111111]">{instructor.total_students || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#737373] uppercase">Active</span>
                        <span className="text-sm font-bold text-green-600">{instructor.active_students || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#737373] uppercase">Completed</span>
                        <span className="text-sm font-bold text-blue-600">{instructor.completed_students || 0}</span>
                      </div>
                    </div>
                 </div>
              </div>

            </div>

            {/* Right Column: Courses & Schedule */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* Assigned Courses */}
               <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center">
                   <GraduationCap size={16} className="mr-2" /> Assigned Courses
                  </h3>
                  {instructor.courses_list && instructor.courses_list.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {instructor.courses_list.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:-translate-y-1 transition-transform">
                          <p className="text-xs font-bold text-[#F5C542] uppercase tracking-wider mb-1">{course.type}</p>
                          <p className="text-sm font-black text-[#111111] mb-2">{course.name}</p>
                          <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                             {course.student_count || 0} Students Enrolled
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-sm font-medium">
                      No courses assigned to this instructor.
                    </div>
                  )}
               </div>

               {/* Booking History / Schedule */}
               <div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                    <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center">
                     <Calendar size={16} className="mr-2" /> Recent & Upcoming Schedule
                    </h3>
                  </div>
                  
                  {instructor.booking_history && instructor.booking_history.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-[#F7F7F5]">
                          <tr>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#737373]">Date & Time</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#737373]">Student</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#737373]">Course</th>
                            <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#737373]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {instructor.booking_history.map(booking => {
                            const isToday = booking.booking_date === new Date().toISOString().split('T')[0];
                            return (
                              <tr key={booking.booking_id} className={`hover:bg-gray-50 ${isToday ? 'bg-[#FFF9E6]/30' : ''}`}>
                                <td className="py-3 px-4">
                                  <div className="text-sm font-bold text-[#111111]">{booking.booking_date}</div>
                                  <div className="text-xs text-[#737373]">{booking.start_time?.substring(0,5)} - {booking.end_time?.substring(0,5)}</div>
                                </td>
                                <td className="py-3 px-4 text-sm font-bold text-[#111111]">{booking.student_name}</td>
                                <td className="py-3 px-4 text-xs font-medium text-[#737373]">{booking.course_name}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center">
                      <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-[#737373] text-sm font-medium">No booking history available for this instructor.</p>
                    </div>
                  )}
               </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3 bg-[#F7F7F5]">
           <button 
             onClick={onToggleStatus}
             className={`px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide flex items-center transition-colors shadow-md ${instructor.status === 'Active' ? 'bg-gray-200 text-[#737373] hover:bg-gray-300 hover:text-[#111111]' : 'bg-[#111111] text-white hover:bg-black'}`}
           >
             {instructor.status === 'Active' ? 'Deactivate Instructor' : 'Activate Instructor'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default InstructorProfile;
