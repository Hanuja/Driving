import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, UserCheck, CalendarCheck, Coffee, LayoutGrid, List } from 'lucide-react';
import InstructorTable from './InstructorTable';
import InstructorCard from './InstructorCard';
import InstructorForm from './InstructorForm';
import InstructorProfile from './InstructorProfile';
import DeleteInstructorModal from './DeleteInstructorModal';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/instructors';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Options for form
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchInstructors();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredInstructors(
        instructors.filter(
          i => 
            (i.name && i.name.toLowerCase().includes(lower)) ||
            (i.instructor_code && i.instructor_code.toLowerCase().includes(lower)) ||
            (i.email && i.email.toLowerCase().includes(lower)) ||
            (i.phone && i.phone.toLowerCase().includes(lower)) ||
            (i.license_number && i.license_number.toLowerCase().includes(lower)) ||
            (i.specialties && i.specialties.toLowerCase().includes(lower))
        )
      );
    } else {
      setFilteredInstructors(instructors);
    }
  }, [searchTerm, instructors]);

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [bRes, cRes] = await Promise.all([
        axios.get('http://localhost/Driving/api/branches', { headers }).catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost/Driving/api/courses', { headers }).catch(() => ({ data: { data: [] } }))
      ]);

      if (bRes.data?.success) setBranches(bRes.data.data);
      if (cRes.data?.success) setCourses(cRes.data.data);
      
      // Attempt to fetch vehicles if endpoint exists
      try {
        const vRes = await axios.get('http://localhost/Driving/api/vehicles', { headers });
        if (vRes.data?.success) setVehicles(vRes.data.data);
      } catch (e) {
        setVehicles([]); // fallback
      }

    } catch (err) {
      console.error('Failed to load filter options');
    }
  };

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setInstructors(response.data.data);
        setFilteredInstructors(response.data.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load instructors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedInstructor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setIsFormOpen(true);
  };

  const handleView = async (instructor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${instructor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSelectedInstructor(response.data.data);
        setIsProfileOpen(true);
      }
    } catch (err) {
      alert('Failed to load instructor details.');
    }
  };

  const handleDelete = (instructor) => {
    setSelectedInstructor(instructor);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = async (instructor) => {
    const newStatus = instructor.status === 'Active' ? 'Inactive' : 'Active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} this instructor?\n\nInactive instructors cannot be assigned to new bookings.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${instructor.id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInstructors();
    } catch(err) {
      alert('Failed to update instructor status.');
    }
  };

  const handleToggleAvailability = async (instructor, newAvail) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${instructor.id}`, 
        { availability: newAvail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInstructors();
    } catch(err) {
      alert('Failed to update availability.');
    }
  };

  const stats = {
    total: instructors.length,
    active: instructors.filter(i => i.status === 'Active').length,
    available: instructors.filter(i => i.availability === 'Available').length,
    leave: instructors.filter(i => i.availability === 'On Leave').length
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Instructor Management</h1>
          <p className="text-[#737373] text-sm font-medium">Manage instructors, qualifications, assignments, availability, and training schedules.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#111111] hover:bg-[#F5C542] text-white hover:text-[#111111] px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Instructor
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
          { title: 'Total Instructors', value: stats.total, icon: Users },
          { title: 'Active Instructors', value: stats.active, icon: UserCheck },
          { title: 'Available Today', value: stats.available, icon: CalendarCheck },
          { title: 'On Leave', value: stats.leave, icon: Coffee }
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
              placeholder="Search instructors..." 
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
              <span className="ml-3 font-medium text-[#737373]">Loading Instructors...</span>
            </div>
          ) : filteredInstructors.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#111111] mb-2">No Instructors Found</h3>
              <p className="text-[#737373] mb-6">There are currently no instructors registered.</p>
              <button 
                onClick={handleAdd}
                className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-sm inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add Instructor
              </button>
            </div>
          ) : (
            viewMode === 'list' ? (
              <InstructorTable 
                instructors={filteredInstructors} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onToggleAvailability={handleToggleAvailability}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-[#F7F7F5]">
                {filteredInstructors.map(inst => (
                  <InstructorCard 
                    key={inst.id}
                    instructor={inst}
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
        <InstructorForm 
          instructor={selectedInstructor} 
          branches={branches}
          courses={courses}
          vehicles={vehicles}
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchInstructors();
          }} 
        />
      )}

      {isProfileOpen && selectedInstructor && (
        <InstructorProfile 
          instructor={selectedInstructor} 
          onClose={() => setIsProfileOpen(false)} 
          onToggleStatus={() => {
            setIsProfileOpen(false);
            fetchInstructors();
          }}
        />
      )}

      {isDeleteOpen && selectedInstructor && (
        <DeleteInstructorModal 
          instructor={selectedInstructor} 
          onClose={() => setIsDeleteOpen(false)} 
          onSuccess={() => {
            setIsDeleteOpen(false);
            fetchInstructors();
          }} 
        />
      )}
    </div>
  );
};

export default InstructorManagement;
