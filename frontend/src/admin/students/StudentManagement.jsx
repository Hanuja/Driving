import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, UserCheck, Clock, CheckCircle } from 'lucide-react';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';
import StudentProfile from './StudentProfile';
import DeleteStudentModal from './DeleteStudentModal';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/students';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredStudents(
        students.filter(
          s => 
            s.name.toLowerCase().includes(lower) || 
            (s.email && s.email.toLowerCase().includes(lower)) || 
            (s.phone && s.phone.toLowerCase().includes(lower)) || 
            (s.student_id && s.student_id.toLowerCase().includes(lower))
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        setError(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else {
        setError('Unable to load students. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleView = async (student) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSelectedStudent(response.data.data);
        setIsProfileOpen(true);
      }
    } catch (err) {
      alert('Failed to load student details.');
    }
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  const getStats = () => {
    return {
      total: students.length,
      active: students.filter(s => s.status === 'Active').length,
      pending: students.filter(s => s.status === 'Pending').length,
      completed: students.filter(s => s.status === 'Completed').length,
    };
  };

  const stats = getStats();

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Student Management</h1>
          <p className="text-[#737373] text-sm font-medium">Manage all registered driving school students.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#111111] hover:bg-[#F5C542] text-white hover:text-[#111111] px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Student
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Students', value: stats.total, icon: Users },
          { title: 'Active Students', value: stats.active, icon: UserCheck },
          { title: 'Pending Students', value: stats.pending, icon: Clock },
          { title: 'Completed Students', value: stats.completed, icon: CheckCircle }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex items-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 rounded-xl bg-[#FFF9E6] border border-[#F5C542]/30 text-[#111111] flex items-center justify-center mr-5 shadow-sm">
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#737373] uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-[#111111]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#F7F7F5]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#737373]" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] text-sm font-medium"
            />
          </div>
          <button className="flex items-center text-[#737373] hover:text-[#111111] bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5C542]"></div>
              <span className="ml-3 font-medium text-[#737373]">Loading Students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#111111] mb-2">No Students Found</h3>
              <p className="text-[#737373] mb-6">There are currently no registered students matching your criteria.</p>
              <button 
                onClick={handleAdd}
                className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-sm inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Student
              </button>
            </div>
          ) : (
            <StudentTable 
              students={filteredStudents} 
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {isFormOpen && (
        <StudentForm 
          student={selectedStudent} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchStudents();
          }} 
        />
      )}

      {isProfileOpen && selectedStudent && (
        <StudentProfile 
          student={selectedStudent} 
          onClose={() => setIsProfileOpen(false)} 
        />
      )}

      {isDeleteOpen && selectedStudent && (
        <DeleteStudentModal 
          student={selectedStudent} 
          onClose={() => setIsDeleteOpen(false)} 
          onSuccess={() => {
            setIsDeleteOpen(false);
            fetchStudents();
          }} 
        />
      )}
    </div>
  );
};

export default StudentManagement;
