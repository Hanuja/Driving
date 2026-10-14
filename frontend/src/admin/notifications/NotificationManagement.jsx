import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCircle2, Info, AlertCircle, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/notifications';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unread_count);
      }
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      alert('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight flex items-center">
            <Bell className="mr-3" size={28} />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-4 bg-[#F5C542] text-[#111111] text-sm px-3 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage your system alerts and notifications.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="bg-white text-[#111111] border border-gray-200 hover:border-[#111111] px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-sm flex items-center justify-center"
          >
            <Check size={16} className="mr-2" /> Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-[#111111] mb-2">No Notifications</h3>
          <p className="text-[#737373]">You're all caught up! There are no new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 border-b border-gray-100 flex items-start justify-between transition-colors ${notif.is_read ? 'bg-white' : 'bg-[#F9FAFB]'}`}
            >
              <div className="flex items-start">
                <div className="mt-1 mr-4">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <h4 className={`text-base mb-1 ${notif.is_read ? 'font-medium text-gray-800' : 'font-bold text-[#111111]'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {!notif.is_read && (
                <button 
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-xs font-bold text-[#737373] hover:text-[#111111] uppercase tracking-wide bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors ml-4 whitespace-nowrap"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
