import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/students';

const StudentForm = ({ student, onClose, onSuccess }) => {
  const isEdit = !!student;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    course_id: '',
    instructor_id: '',
    vehicle_id: '',
    registration_date: new Date().toISOString().split('T')[0],
    course_fee: '',
    paid_amount: '',
    payment_status: 'Pending',
    status: 'Active'
  });

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions();
    if (isEdit) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || 'Male',
        address: student.address || '',
        course_id: student.course_id || '',
        instructor_id: student.instructor_id || '',
        vehicle_id: student.vehicle_id || '',
        registration_date: student.registration_date || new Date().toISOString().split('T')[0],
        course_fee: student.course_fee || '',
        paid_amount: student.paid_amount || '',
        payment_status: student.payment_status || 'Pending',
        status: student.status || 'Active'
      });
    }
  }, [student]);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [coursesRes, instructorsRes, vehiclesRes] = await Promise.all([
        axios.get('http://localhost/Driving/api/courses', { headers }),
        axios.get('http://localhost/Driving/api/instructors', { headers }),
        axios.get('http://localhost/Driving/api/vehicles', { headers })
      ]);

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
    
    // Auto calculate payment status if values exist
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
        await axios.put(`${API_URL}/${student.id}`, submissionData, { headers });
        alert('Student updated successfully.');
      } else {
        await axios.post(API_URL, submissionData, { headers });
        alert('Student added successfully.');
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <h2 className="text-xl font-black text-[#111111] uppercase tracking-tight">
            {isEdit ? 'Edit Student' : 'Add New Student'}
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
          
          <form id="student-form" onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
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
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Course Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Select Course *</label>
                  <select name="course_id" value={formData.course_id} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Assign Instructor</label>
                  <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="">-- Select --</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Assign Vehicle</label>
                  <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
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
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Registration Date</label>
                  <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Student Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Course Fee (LKR)</label>
                  <input type="number" min="0" name="course_fee" value={formData.course_fee} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Paid Amount (LKR)</label>
                  <input type="number" min="0" name="paid_amount" value={formData.paid_amount} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Payment Status</label>
                  <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium bg-white">
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
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
            form="student-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide text-[#111111] bg-[#F5C542] hover:bg-[#111111] hover:text-[#F5C542] transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Student')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
