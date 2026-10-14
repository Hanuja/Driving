import React from 'react';
import { X, BookOpen, Clock, Users, CheckCircle, ListChecks, Settings } from 'lucide-react';

const CourseDetails = ({ course, onClose, onToggleStatus }) => {
  const isFeaturesArray = Array.isArray(course.features);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-[#F7F7F5]">
          <div>
            <h2 className="text-2xl font-black text-[#111111] uppercase tracking-tight mb-2">Course Details</h2>
            <div className="flex items-center space-x-3">
              <span className="text-[#111111] font-bold text-sm bg-[#F5C542] px-3 py-1 rounded-md tracking-widest uppercase">{course.code}</span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${course.status === 'Active' ? 'bg-[#111111] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {course.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#737373] hover:text-[#111111] hover:bg-white rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-white overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Info) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div>
                <h1 className="text-3xl font-black text-[#111111] mb-2">{course.name}</h1>
                <p className="text-sm font-bold text-[#F5C542] uppercase tracking-wider mb-4">{course.type}</p>
                <p className="text-[#737373] text-sm leading-relaxed">{course.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-100">
                  <Clock size={16} className="text-[#737373] mb-2" />
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-bold text-[#111111]">{course.duration || '-'}</p>
                </div>
                <div className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-100">
                  <BookOpen size={16} className="text-[#737373] mb-2" />
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Lessons</p>
                  <p className="text-sm font-bold text-[#111111]">{course.lessons ? `${course.lessons} classes` : '-'}</p>
                </div>
                <div className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-100">
                  <Clock size={16} className="text-[#737373] mb-2" />
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Per Lesson</p>
                  <p className="text-sm font-bold text-[#111111]">{course.lesson_duration ? `${course.lesson_duration} mins` : '-'}</p>
                </div>
                <div className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-100">
                  <Settings size={16} className="text-[#737373] mb-2" />
                  <p className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-1">Vehicle</p>
                  <p className="text-sm font-bold text-[#111111]">{course.transmission || '-'}</p>
                </div>
              </div>

              {isFeaturesArray && course.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center">
                    <ListChecks size={16} className="mr-2" /> Course Features
                  </h3>
                  <ul className="space-y-3">
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle size={16} className="text-[#F5C542] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-[#111111]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column (Pricing & Stats) */}
            <div className="space-y-6">
              
              {/* Pricing */}
              <div className="bg-[#111111] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-[10px] font-bold text-[#F5C542] uppercase tracking-widest mb-4">Pricing Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                    <span className="text-sm font-medium text-gray-400">Course Fee</span>
                    <span className="text-lg font-bold">Rs. {parseFloat(course.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                    <span className="text-sm font-medium text-gray-400">Registration</span>
                    <span className="text-lg font-bold">Rs. {parseFloat(course.registration_fee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-[#F5C542] uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black text-[#F5C542]">Rs. {(parseFloat(course.price || 0) + parseFloat(course.registration_fee || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Stats */}
              <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-gray-100">
                <h3 className="text-[10px] font-bold text-[#737373] uppercase tracking-widest mb-4 flex items-center">
                  <Users size={12} className="mr-2" /> Enrollment Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#737373] uppercase">Total Students</span>
                    <span className="text-lg font-black text-[#111111]">{course.total_students || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#737373] uppercase">Active</span>
                    <span className="text-sm font-bold text-green-600">{course.active_students || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#737373] uppercase">Completed</span>
                    <span className="text-sm font-bold text-blue-600">{course.completed_students || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#737373] uppercase">Pending</span>
                    <span className="text-sm font-bold text-[#F5C542]">{course.pending_students || 0}</span>
                  </div>
                </div>
              </div>
              
              {course.image && (
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  <img src={course.image} alt={course.name} className="w-full h-auto object-cover" />
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3 bg-[#F7F7F5]">
           <button 
             onClick={onToggleStatus}
             className={`px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide flex items-center transition-colors ${course.status === 'Active' ? 'bg-gray-200 text-[#737373] hover:bg-gray-300' : 'bg-[#111111] text-white hover:bg-black shadow-md'}`}
           >
             {course.status === 'Active' ? 'Deactivate Course' : 'Activate Course'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
