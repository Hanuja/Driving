import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, CheckCircle, XCircle, Users, LayoutGrid, List } from 'lucide-react';
import CourseTable from './CourseTable';
import CourseCard from './CourseCard';
import CourseForm from './CourseForm';
import CourseDetails from './CourseDetails';
import DeleteCourseModal from './DeleteCourseModal';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/courses';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredCourses(
        courses.filter(
          c => 
            (c.name && c.name.toLowerCase().includes(lower)) ||
            (c.code && c.code.toLowerCase().includes(lower)) ||
            (c.type && c.type.toLowerCase().includes(lower))
        )
      );
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleView = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${course.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSelectedCourse(response.data.data);
        setIsDetailsOpen(true);
      }
    } catch (err) {
      alert('Failed to load course details.');
    }
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'Active' ? 'Inactive' : 'Active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} this course?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${course.id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch(err) {
      alert('Failed to update course status.');
    }
  };

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === 'Active').length,
    inactive: courses.filter(c => c.status === 'Inactive').length,
    enrollments: courses.reduce((sum, c) => sum + parseInt(c.student_count || 0), 0)
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Course Management</h1>
          <p className="text-[#737373] text-sm font-medium">Create and manage driving courses offered by Ceylon Drive Academy.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#111111] hover:bg-[#F5C542] text-white hover:text-[#111111] px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Course
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Courses', value: stats.total, icon: BookOpen },
          { title: 'Active Courses', value: stats.active, icon: CheckCircle },
          { title: 'Inactive Courses', value: stats.inactive, icon: XCircle },
          { title: 'Total Enrollments', value: stats.enrollments, icon: Users }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200 flex items-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#FFF9E6] border border-[#F5C542]/30 text-[#111111] flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-[#111111]">{stat.value}</h3>
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
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto items-center">
            
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#111111] text-white' : 'text-[#737373] hover:bg-gray-50'}`}
                title="List View"
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 flex items-center justify-center transition-colors ${viewMode === 'card' ? 'bg-[#111111] text-white' : 'text-[#737373] hover:bg-gray-50'}`}
                title="Card View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <button className="flex items-center text-[#737373] hover:text-[#111111] bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors shadow-sm w-full sm:w-auto justify-center flex-1">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-0">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5C542]"></div>
              <span className="ml-3 font-medium text-[#737373]">Loading Courses...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-16 text-center">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#111111] mb-2">No Courses Found</h3>
              <p className="text-[#737373] mb-6">There are currently no courses available matching your criteria.</p>
              <button 
                onClick={handleAdd}
                className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-sm inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Course
              </button>
            </div>
          ) : (
            viewMode === 'list' ? (
              <CourseTable 
                courses={filteredCourses} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-[#F7F7F5]">
                {filteredCourses.map(course => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {isFormOpen && (
        <CourseForm 
          course={selectedCourse} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchCourses();
          }} 
        />
      )}

      {isDetailsOpen && selectedCourse && (
        <CourseDetails 
          course={selectedCourse} 
          onClose={() => setIsDetailsOpen(false)} 
          onToggleStatus={() => {
            setIsDetailsOpen(false);
            fetchCourses();
          }}
        />
      )}

      {isDeleteOpen && selectedCourse && (
        <DeleteCourseModal 
          course={selectedCourse} 
          onClose={() => setIsDeleteOpen(false)} 
          onSuccess={() => {
            setIsDeleteOpen(false);
            fetchCourses();
          }} 
        />
      )}
    </div>
  );
};

export default CourseManagement;
