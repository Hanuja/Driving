import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Users, BookOpen, CarFront, UserCheck, 
  Building2, CircleDollarSign, Ticket, Image as ImageIcon, Star, HelpCircle, 
  Mail, Briefcase, Globe, LineChart, Megaphone, Search, Bell, Settings, 
  LogOut, ChevronDown, ChevronRight, UserCircle2
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, handleLogout }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuLabel) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/students', icon: <Users size={20} />, label: 'Students' },
        { path: '/admin/bookings', icon: <CalendarCheck size={20} />, label: 'Bookings' },
        { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Courses' },
        { path: '/admin/instructors', icon: <UserCheck size={20} />, label: 'Instructors' },
        { path: '/admin/vehicles', icon: <CarFront size={20} />, label: 'Vehicles' },
        { path: '/admin/branches', icon: <Building2 size={20} />, label: 'Branches' },
      ]
    },
    {
      title: 'Sales & Content',
      items: [
        { path: '/admin/pricing', icon: <CircleDollarSign size={20} />, label: 'Pricing' },
        { path: '/admin/testimonials', icon: <Star size={20} />, label: 'Testimonials' },
        { path: '/admin/gallery', icon: <ImageIcon size={20} />, label: 'Gallery' },
        { path: '/admin/contact-messages', icon: <Mail size={20} />, label: 'Contact Messages' },
        { path: '/admin/faq', icon: <HelpCircle size={20} />, label: 'FAQ' },
        {
          label: 'Website Content',
          icon: <Globe size={20} />,
          subItems: [
            { path: '/admin/content/home', label: 'Home' },
            { path: '/admin/content/about', label: 'About' },
            { path: '/admin/content/services', label: 'Services' },
          ]
        }
      ]
    },
    {
      title: 'Analytics & System',
      items: [
        {
          label: 'Reports',
          icon: <LineChart size={20} />,
          subItems: [
            { path: '/admin/reports/bookings', label: 'Bookings' },
            { path: '/admin/reports/courses', label: 'Courses' },
          ]
        },
        { path: '/admin/notifications', icon: <Bell size={20} />, label: 'Notifications' },
        { path: '/admin/settings/general', icon: <Settings size={20} />, label: 'Settings' },
      ]
    }
  ];

  const renderItem = (item) => {
    const isActive = item.path && location.pathname.startsWith(item.path);
    const hasSubMenu = !!item.subItems;
    const isMenuOpen = openMenus[item.label];
    
    return (
      <li key={item.label || item.path} className="mb-1">
        {hasSubMenu ? (
          <div>
            <button
              onClick={() => toggleMenu(item.label)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors border-l-4 group focus:outline-none ${
                isMenuOpen ? 'border-[#F5C542] bg-[#0B0B0B]' : 'border-transparent text-[#737373] hover:text-white hover:bg-[#0B0B0B]'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 transition-colors ${isMenuOpen ? 'text-[#F5C542]' : 'text-[#737373] group-hover:text-[#F5C542]'}`}>
                  {item.icon}
                </span>
                {sidebarOpen && <span className={`ml-4 font-medium text-sm whitespace-nowrap ${isMenuOpen ? 'text-white' : ''}`}>{item.label}</span>}
              </div>
              {sidebarOpen && (
                <span className={`transition-transform duration-200 ${isMenuOpen ? 'text-[#F5C542] rotate-180' : 'text-[#737373]'}`}>
                  <ChevronDown size={16} />
                </span>
              )}
            </button>
            {/* Sub Menu */}
            {sidebarOpen && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="pl-12 pr-4 py-1 space-y-1 bg-[#0B0B0B]">
                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`block py-2 rounded-md text-sm transition-colors ${
                            isSubActive
                              ? 'text-[#F5C542] font-semibold'
                              : 'text-[#737373] hover:text-[#FFD84D]'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center px-4 py-3 transition-colors group border-l-4 ${
              isActive
                ? 'bg-[#0B0B0B] border-[#F5C542] text-white'
                : 'border-transparent text-[#737373] hover:bg-[#0B0B0B] hover:text-white'
            }`}
            title={!sidebarOpen ? item.label : ''}
          >
            <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#F5C542]' : 'text-[#737373] group-hover:text-[#F5C542]'}`}>
              {item.icon}
            </span>
            {sidebarOpen && <span className="ml-4 font-medium text-sm whitespace-nowrap">{item.label}</span>}
          </Link>
        )}
      </li>
    );
  };

  return (
    <aside className={`bg-[#111111] text-white transition-all duration-300 flex flex-col fixed h-full z-20 md:relative shadow-2xl border-r border-[#1F1F1F] ${sidebarOpen ? 'w-72' : 'w-20'}`}>
      <div className="h-16 flex flex-shrink-0 items-center justify-center border-b border-[#1F1F1F] shadow-sm px-4">
        <div className="w-9 h-9 bg-[#F5C542] rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
        </div>
        {sidebarOpen && (
          <div className="flex flex-col items-start overflow-hidden whitespace-nowrap">
            <span className="font-black text-lg tracking-wider leading-tight">CEYLON DRIVE</span>
            <span className="text-[10px] text-[#F5C542] font-bold tracking-widest uppercase">Academy Admin</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            {sidebarOpen && (
              <h3 className="px-5 text-[11px] font-black uppercase tracking-widest text-[#737373] mb-3">
                {group.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {group.items.map(renderItem)}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#0B0B0B] flex-shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#737373] flex items-center justify-center text-[#F5C542]">
                <UserCircle2 size={24} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">Super Admin</span>
                <a href="mailto:admin@ceylondrive.lk" className="text-xs text-[#737373] hover:text-[#F5C542] transition-colors truncate">
                  admin@ceylondrive.lk
                </a>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-[#737373] hover:text-[#F5C542] hover:bg-[#1F1F1F] rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 text-[#737373] hover:text-[#F5C542] hover:bg-[#1F1F1F] rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #1F1F1F;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #F5C542;
        }
      `}} />
    </aside>
  );
};

export default AdminSidebar;
