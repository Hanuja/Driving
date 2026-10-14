import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CarFront, Users, BookOpen, CalendarCheck, LogOut, Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // In a real app, check auth state here and redirect to /admin/login if not logged in
  
  const handleLogout = () => {
    // Clear session/token
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#F7F7F5] font-sans">
      <AdminSidebar sidebarOpen={sidebarOpen} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-100">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 rounded-md text-[#111111] hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-lg font-bold text-[#111111] leading-tight">Dashboard Overview</h1>
              <div className="text-xs text-[#737373] font-medium">Admin / Dashboard</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="text-[#737373] hover:text-[#F5C542] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button className="text-[#737373] hover:text-[#F5C542] transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#F5C542] rounded-full border border-white"></span>
            </button>
            <div className="flex items-center space-x-3 cursor-pointer group pl-2 border-l border-gray-200">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-[#111111]">Super Admin</span>
              </div>
              <div className="w-9 h-9 bg-[#111111] rounded-full flex items-center justify-center text-[#F5C542] font-bold text-sm shadow-sm group-hover:bg-[#1F1F1F] transition-colors">
                SA
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#737373] group-hover:text-[#F5C542] transition-colors"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F7F7F5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
