import React from 'react';
import { Users, BookOpen, CarFront, CalendarCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const data = [
  { name: 'Jan', bookings: 40 },
  { name: 'Feb', bookings: 30 },
  { name: 'Mar', bookings: 20 },
  { name: 'Apr', bookings: 27 },
  { name: 'May', bookings: 18 },
  { name: 'Jun', bookings: 23 },
  { name: 'Jul', bookings: 34 },
];

const courseData = [
  { name: 'Beginner', students: 120 },
  { name: 'Manual', students: 85 },
  { name: 'Auto', students: 95 },
  { name: 'Heavy', students: 30 },
];

const recentBookings = [
  { id: 1, name: 'Kasun Perera', course: 'Beginner Driving Course', date: '2026-08-14', status: 'Pending' },
  { id: 2, name: 'Nimal Fernando', course: 'Manual Driving Course', date: '2026-08-13', status: 'Confirmed' },
  { id: 3, name: 'Amal Silva', course: 'Automatic Driving Course', date: '2026-08-12', status: 'Completed' },
  { id: 4, name: 'Sahan Perera', course: 'Heavy Vehicle Course', date: '2026-08-11', status: 'Pending' },
  { id: 5, name: 'Dinesh Kumar', course: 'Beginner Driving Course', date: '2026-08-10', status: 'Confirmed' },
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-[#F5C542] text-[#0B0B0B]';
    case 'Confirmed':
      return 'bg-[#111111] text-white';
    case 'Completed':
      return 'bg-[#E5E5E5] text-[#111111]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminDashboard = () => {
  return (
    <div className="animate-fade-in pb-10">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Students', value: '5,248', icon: Users },
          { title: 'Active Bookings', value: '142', icon: CalendarCheck },
          { title: 'Active Courses', value: '6', icon: BookOpen },
          { title: 'Vehicles', value: '24', icon: CarFront }
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-black text-[#111111] uppercase tracking-tight">Booking Trends</h3>
            <p className="text-sm text-[#737373] font-medium">Monthly booking performance</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C542" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#F5C542" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 13, fontWeight: 500}} dx={-10} />
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#F5C542', fontWeight: 'bold' }}
                  labelStyle={{ color: '#737373', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#F5C542" strokeWidth={4} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-black text-[#111111] uppercase tracking-tight">Course Popularity</h3>
            <p className="text-sm text-[#737373] font-medium">Active enrollments</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#F7F7F5'}} 
                  contentStyle={{ backgroundColor: '#111111', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#F5C542', fontWeight: 'bold' }}
                />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#F5C542" className="hover:fill-[#FFD84D] transition-colors duration-300 cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-black text-[#111111] uppercase tracking-tight">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F5]">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Student Name</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Course</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Date</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#737373]">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-[#F7F7F5] transition-colors duration-200">
                  <td className="py-4 px-6 text-sm text-[#111111] font-bold">{item.name}</td>
                  <td className="py-4 px-6 text-sm text-[#737373] font-medium">{item.course}</td>
                  <td className="py-4 px-6 text-sm text-[#737373] font-medium">{item.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="px-4 py-2 bg-[#F5C542] hover:bg-[#111111] text-[#111111] hover:text-[#F5C542] rounded-lg text-xs font-bold uppercase tracking-wide transition-colors duration-200 shadow-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
