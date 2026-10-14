import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CalendarCheck, CalendarDays, Clock, Users, XCircle, CheckCircle } from 'lucide-react';
import BookingTable from './BookingTable';
import BookingForm from './BookingForm';
import BookingDetails from './BookingDetails';
import DeleteBookingModal from './DeleteBookingModal';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/bookings';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredBookings(
        bookings.filter(
          b => 
            (b.booking_id && b.booking_id.toLowerCase().includes(lower)) ||
            (b.student_name && b.student_name.toLowerCase().includes(lower)) || 
            (b.student_email && b.student_email.toLowerCase().includes(lower)) ||
            (b.student_phone && b.student_phone.toLowerCase().includes(lower)) ||
            (b.course_name && b.course_name.toLowerCase().includes(lower)) ||
            (b.instructor_name && b.instructor_name.toLowerCase().includes(lower)) ||
            (b.vehicle_number && b.vehicle_number.toLowerCase().includes(lower))
        )
      );
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
        setError(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else {
        setError('Unable to load bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleView = async (booking) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSelectedBooking(response.data.data);
        setIsDetailsOpen(true);
      }
    } catch (err) {
      alert('Failed to load booking details.');
    }
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteOpen(true);
  };

  const getStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending').length,
      confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    };
  };

  const stats = getStats();

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111111] uppercase tracking-tight">Booking Management</h1>
          <p className="text-[#737373] text-sm font-medium">Manage driving lesson bookings and course booking requests.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#111111] hover:bg-[#F5C542] text-white hover:text-[#111111] px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Booking
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { title: 'Total Bookings', value: stats.total, icon: CalendarDays },
          { title: 'Pending', value: stats.pending, icon: Clock },
          { title: 'Confirmed', value: stats.confirmed, icon: CalendarCheck },
          { title: 'Completed', value: stats.completed, icon: CheckCircle },
          { title: 'Cancelled', value: stats.cancelled, icon: XCircle }
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
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center text-[#111111] bg-white border border-[#F5C542] px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors shadow-sm w-full sm:w-auto justify-center flex-1">
              List View
            </button>
            <button className="flex items-center text-[#737373] hover:text-[#111111] bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors shadow-sm w-full sm:w-auto justify-center flex-1">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5C542]"></div>
              <span className="ml-3 font-medium text-[#737373]">Loading Bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-16 text-center">
              <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#111111] mb-2">No Bookings Found</h3>
              <p className="text-[#737373] mb-6">There are currently no booking records matching your criteria.</p>
              <button 
                onClick={handleAdd}
                className="bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-sm inline-flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Create Booking
              </button>
            </div>
          ) : (
            <BookingTable 
              bookings={filteredBookings} 
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={fetchBookings}
            />
          )}
        </div>
      </div>

      {isFormOpen && (
        <BookingForm 
          booking={selectedBooking} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchBookings();
          }} 
        />
      )}

      {isDetailsOpen && selectedBooking && (
        <BookingDetails 
          booking={selectedBooking} 
          onClose={() => setIsDetailsOpen(false)} 
          onStatusChange={fetchBookings}
        />
      )}

      {isDeleteOpen && selectedBooking && (
        <DeleteBookingModal 
          booking={selectedBooking} 
          onClose={() => setIsDeleteOpen(false)} 
          onSuccess={() => {
            setIsDeleteOpen(false);
            fetchBookings();
          }} 
        />
      )}
    </div>
  );
};

export default BookingManagement;
