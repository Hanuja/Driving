import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, Calendar, DollarSign, Download, Activity } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/reports';

const ReportManagement = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_bookings: 0,
    pending_bookings: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to load report data.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `Rs. ${parseFloat(stats.total_revenue).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Students', value: stats.total_students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Bookings', value: stats.total_bookings, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Bookings', value: stats.pending_bookings, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Reports & Analytics</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Overview of your driving school's performance.</p>
        </div>
        <button className="bg-white text-[#111111] border border-gray-200 hover:border-[#111111] px-4 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-sm flex items-center justify-center">
          <Download size={16} className="mr-2" /> Export Report
        </button>
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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-[#737373] uppercase tracking-wider">{card.title}</p>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon size={20} className={card.color} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-[#111111]">{card.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-1">Revenue Chart</h3>
              <p className="text-[#737373] text-sm text-center max-w-sm">Revenue chart visualization will be implemented here using Chart.js in the next iteration.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Activity className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-1">Enrollment Trends</h3>
              <p className="text-[#737373] text-sm text-center max-w-sm">Student enrollment trends over time will be displayed here.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportManagement;
