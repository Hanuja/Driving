import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/bookings';

const BookingForm = ({ booking, onClose, onSuccess }) => {
  const isEdit = !!booking;
  
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    instructor_id: '',
    vehicle_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    course_fee: '',
    paid_amount: '',
    payment_status: 'Pending',
    status: 'Pending'
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions();
    if (isEdit) {
      setFormData({
        student_id: booking.student_id || '',
        course_id: booking.course_id || '',
        instructor_id: booking.instructor_id || '',
        vehicle_id: booking.vehicle_id || '',
        booking_date: booking.booking_date || '',
        start_time: booking.start_time || '',
        end_time: booking.end_time || '',
        course_fee: booking.course_fee || '',
        paid_amount: booking.paid_amount || '',
        payment_status: booking.payment_status || 'Pending',
        status: booking.status || 'Pending'
      });
    }
  }, [booking]);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [studentsRes, coursesRes, instructorsRes, vehiclesRes] = await Promise.all([
        axios.get('http://localhost/Driving/api/students', { headers }),
        axios.get('http://localhost/Driving/api/courses', { headers }),
        axios.get('http://localhost/Driving/api/instructors', { headers }),
        axios.get('http://localhost/Driving/api/vehicles', { headers })
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data);
        if (isEdit) {
          setSelectedStudent(studentsRes.data.data.find(s => s.id === booking.student_id));
        }
      }
      if (coursesRes.data.success) setCourses(coursesRes.data.data);
      if (instructorsRes.data.success) setInstructors(instructorsRes.data.data);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data);
    } catch (err) {
      console.error('Failed to load form options');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };
    
    if (name === 'student_id') {
      const s = students.find(student => student.id.toString() === value.toString());
      setSelectedStudent(s || null);
    }

    if (name === 'course_id') {
      const selectedCourse = courses.find(c => c.id.toString() === value.toString());
      if (selectedCourse && selectedCourse.transmission && formData.vehicle_id) {
        const currentVehicle = vehicles.find(v => v.id.toString() === formData.vehicle_id.toString());
        if (currentVehicle) {
          const cTrans = (selectedCourse.transmission || '').toLowerCase();
          const vTrans = (currentVehicle.transmission || '').toLowerCase();
          if (cTrans !== 'both' && cTrans !== vTrans) {
            updates.vehicle_id = '';
          }
        }
      }
    }
    
    setFormData({ ...formData, ...updates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    let submissionData = { ...formData };
    if (submissionData.course_fee && submissionData.paid_amount) {
      const fee = parseFloat(submissionData.course_fee);
      const paid = parseFloat(submissionData.paid_amount);
      if (paid >= fee) submissionData.payment_status = 'Paid';
      else if (paid > 0) submissionData.payment_status = 'Partial';
      else submissionData.payment_status = 'Pending';
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${booking.id}`, submissionData, { headers });
        alert('Booking updated successfully.');
      } else {
        await axios.post(API_URL, submissionData, { headers });
        alert('Booking created successfully.');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save booking. Please check for conflicts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Booking' : 'Create New Booking'}
          </h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#111111] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}
          
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            
            {/* Student & Course */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Student & Course</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Select Student *</label>
                  <select name="student_id" value={formData.student_id} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select a Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>
                    ))}
                  </select>
                </div>
                
                {selectedStudent && (
                  <div className="lg:col-span-1 bg-[#F7F7F5] p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
                    <span className="text-xs font-bold text-[#111111]">{selectedStudent.email}</span>
                    <span className="text-xs text-[#737373] font-medium">{selectedStudent.phone}</span>
                  </div>
                )}
                
                <div className="lg:col-span-3">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Select Course *</label>
                  <select name="course_id" value={formData.course_id} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule & Resources */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Schedule & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Booking Date *</label>
                  <input type="date" name="booking_date" value={formData.booking_date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Start Time *</label>
                  <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">End Time *</label>
                  <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Assign Instructor *</label>
                  <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select Instructor --</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Assign Vehicle *</label>
                  <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.filter(v => {
                      if (formData.vehicle_id && v.id.toString() === formData.vehicle_id.toString()) return true;
                      const selectedCourse = courses.find(c => c.id.toString() === formData.course_id.toString());
                      const isAvailable = v.status === 'Available';
                      if (!selectedCourse || !selectedCourse.transmission) return isAvailable;
                      
                      const cTrans = selectedCourse.transmission.toLowerCase();
                      const vTrans = (v.transmission || '').toLowerCase();
                      
                      if (cTrans === 'both') return isAvailable;
                      return cTrans === vTrans && isAvailable;
                    }).map(v => (
                      <option key={v.id} value={v.id}>{v.vehicle_number} - {v.model} ({v.transmission})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment & Status */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Payment & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Fee</label>
                  <input type="number" min="0" name="course_fee" value={formData.course_fee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Paid Amount</label>
                  <input type="number" min="0" name="paid_amount" value={formData.paid_amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Payment Status</label>
                  <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Booking Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
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
            form="booking-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Booking')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
