import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Calendar as CalIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/instructors';

const DEFAULT_SCHEDULE = {
  Monday: { active: true, start: '08:00', end: '17:00' },
  Tuesday: { active: true, start: '08:00', end: '17:00' },
  Wednesday: { active: true, start: '08:00', end: '17:00' },
  Thursday: { active: true, start: '08:00', end: '17:00' },
  Friday: { active: true, start: '08:00', end: '17:00' },
  Saturday: { active: true, start: '08:00', end: '13:00' },
  Sunday: { active: false, start: '', end: '' }
};

const InstructorForm = ({ instructor, branches, courses, vehicles, onClose, onSuccess }) => {
  const isEdit = !!instructor;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternative_phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    city: '',
    image: '',
    instructor_code: '',
    nic: '',
    license_number: '',
    license_category: '',
    license_expiry: '',
    experience_years: '',
    qualification: '',
    specialization: 'Manual Driving',
    branch_id: '',
    vehicle_id: '',
    status: 'Active',
    availability: 'Available'
  });

  const [assignedCourses, setAssignedCourses] = useState([]);
  const [schedule, setSchedule] = useState(JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: instructor.name || '',
        email: instructor.email || '',
        phone: instructor.phone || '',
        alternative_phone: instructor.alternative_phone || '',
        date_of_birth: instructor.date_of_birth || '',
        gender: instructor.gender || 'Male',
        address: instructor.address || '',
        city: instructor.city || '',
        image: instructor.image || '',
        instructor_code: instructor.instructor_code || '',
        nic: instructor.nic || '',
        license_number: instructor.license_number || '',
        license_category: instructor.license_category || '',
        license_expiry: instructor.license_expiry || '',
        experience_years: instructor.experience || '',
        qualification: instructor.qualification || '',
        specialization: instructor.specialties || 'Manual Driving',
        branch_id: instructor.branch_id || '',
        vehicle_id: instructor.vehicle_id || '',
        status: instructor.status || 'Active',
        availability: instructor.availability || 'Available'
      });
      setAssignedCourses(instructor.assigned_courses || []);
      if (instructor.working_schedule) {
        setSchedule(instructor.working_schedule);
      }
    }
  }, [instructor, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseToggle = (courseId) => {
    if (assignedCourses.includes(courseId)) {
      setAssignedCourses(assignedCourses.filter(id => id !== courseId));
    } else {
      setAssignedCourses([...assignedCourses, courseId]);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submissionData = { ...formData, assigned_courses: assignedCourses, working_schedule: schedule };
    
    // Clean empty strings for IDs
    if (!submissionData.branch_id) submissionData.branch_id = null;
    if (!submissionData.vehicle_id) submissionData.vehicle_id = null;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${instructor.id}`, submissionData, { headers });
        alert('Instructor updated successfully.');
      } else {
        await axios.post(API_URL, submissionData, { headers });
        alert('Instructor created successfully.');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save instructor. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Instructor' : 'Add New Instructor'}
          </h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#111111] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto flex-1">
          {error && (
            <div className="m-6 mb-0 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}
          
          <form id="inst-form" onSubmit={handleSubmit} className="p-6 space-y-10">
            
            {/* Section 1: Personal Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-xs font-bold text-[#737373] uppercase mb-1">Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#737373] uppercase mb-1">Email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-[#737373] uppercase mb-1">Phone *</label>
                  <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Alternative Phone</label>
                  <input type="text" name="alternative_phone" value={formData.alternative_phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Date of Birth</label>
                  <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                
                {/* Photo Upload Area */}
                <div className="md:col-span-3">
                   <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Profile Photo URL</label>
                   <div className="flex gap-4 items-center">
                     <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]" size={16} />
                        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/photo.jpg" className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                     </div>
                     {formData.image && (
                       <div className="w-12 h-12 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                         <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {e.target.style.display = 'none';}} />
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>

            {/* Section 2: Professional Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Instructor ID *</label>
                  <input type="text" name="instructor_code" value={formData.instructor_code} onChange={handleChange} required placeholder="INS001" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">NIC *</label>
                  <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">License Number *</label>
                  <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">License Expiry</label>
                  <input type="date" name="license_expiry" value={formData.license_expiry} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">License Category</label>
                  <input type="text" name="license_category" value={formData.license_category} onChange={handleChange} placeholder="e.g. B, B1, G" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Years Experience</label>
                  <input type="number" min="0" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Specialization</label>
                  <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Beginner Training">Beginner Training</option>
                    <option value="Manual Driving">Manual Driving</option>
                    <option value="Automatic Driving">Automatic Driving</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Highway Training">Highway Training</option>
                    <option value="Defensive Driving">Defensive Driving</option>
                    <option value="Advanced Driving">Advanced Driving</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
              </div>
            </div>

            {/* Section 3: Course & Resource Assignments */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Assignments & Resources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Branch & Vehicle */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#737373] uppercase mb-2">Assign Branch</label>
                    <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-bold bg-white">
                      <option value="">-- No Branch Assigned --</option>
                      {branches.map(b => (
                         <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#737373] uppercase mb-2">Assign Vehicle</label>
                    <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-bold bg-white">
                      <option value="">-- No Vehicle Assigned --</option>
                      {vehicles
                        .filter(v => v.status !== 'Inactive' && (!v.instructor_id || (instructor && v.instructor_id === instructor.id)))
                        .map(v => (
                         <option key={v.id} value={v.id}>{`${v.vehicle_type} \u2013 ${v.brand} ${v.model || ''}`.trim()}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1">* A vehicle can only be assigned to one active instructor at a time.</p>
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-2">Assigned Courses</label>
                  <div className="bg-[#F7F7F5] border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                    {courses.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No courses found in the system.</p>
                    ) : (
                      courses.map(course => (
                        <label key={course.id} className="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                          <input 
                            type="checkbox" 
                            id={`course_${course.id}`}
                            name={`course_${course.id}`}
                            checked={assignedCourses.includes(course.id)}
                            onChange={() => handleCourseToggle(course.id)}
                            className="w-4 h-4 text-[#111111] rounded border-gray-300 focus:ring-[#F5C542] cursor-pointer"
                          />
                          <span className="ml-3 text-sm font-bold text-[#111111]">{course.name}</span>
                          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{course.type}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Availability & Schedule */}
            <div>
              <div className="flex justify-between items-end border-b border-gray-200 pb-2 mb-6">
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest flex items-center">
                   <CalIcon size={16} className="mr-2"/> Working Schedule
                </h3>
                <div className="flex items-center">
                  <label className="text-xs font-bold text-[#737373] uppercase mr-2">Current Status</label>
                  <select name="availability" value={formData.availability} onChange={handleChange} className="px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-xs font-bold bg-white">
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-[#F7F7F5] rounded-xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                  {DAYS.map(day => (
                    <div key={day} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center w-32">
                        <input 
                          type="checkbox" 
                          id={`schedule_active_${day}`}
                          name={`schedule_active_${day}`}
                          checked={schedule[day].active}
                          onChange={(e) => handleScheduleChange(day, 'active', e.target.checked)}
                          className="w-4 h-4 text-[#111111] rounded border-gray-300 focus:ring-[#F5C542] cursor-pointer mr-3"
                        />
                        <span className={`text-sm font-bold ${schedule[day].active ? 'text-[#111111]' : 'text-gray-400 line-through'}`}>{day}</span>
                      </div>
                      
                      {schedule[day].active ? (
                        <div className="flex items-center space-x-2 flex-1 justify-end">
                          <input 
                            type="time" 
                            id={`schedule_start_${day}`}
                            name={`schedule_start_${day}`}
                            value={schedule[day].start}
                            onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded text-sm font-medium focus:outline-none focus:border-[#F5C542]"
                          />
                          <span className="text-xs text-gray-400 font-bold">TO</span>
                          <input 
                            type="time" 
                            id={`schedule_end_${day}`}
                            name={`schedule_end_${day}`}
                            value={schedule[day].end}
                            onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded text-sm font-medium focus:outline-none focus:border-[#F5C542]"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 text-right text-sm font-bold text-gray-400 uppercase tracking-widest">
                          Off
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden Status (could be toggled here but better kept clean) */}
            <input type="hidden" name="status" value={formData.status} />

          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-[#F7F7F5]">
          <button 
            type="button"
            onClick={onClose} 
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#737373] bg-white border border-gray-200 hover:text-[#111111] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="inst-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors flex items-center shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Instructor')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorForm;
