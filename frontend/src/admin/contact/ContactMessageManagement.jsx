import React, { useState, useEffect } from 'react';
import { Search, Trash2, Mail, MailOpen, CornerUpLeft, Filter, RefreshCw, X, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/contact-messages';

const ContactMessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [viewingMessage, setViewingMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}?admin=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Failed to load messages.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(messages.filter(m => m.id !== id));
        if (viewingMessage && viewingMessage.id === id) {
          setViewingMessage(null);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete message.');
      }
    }
  };

  const handleStatusToggle = async (message, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${message.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update locally
      setMessages(messages.map(m => m.id === message.id ? { ...m, status: newStatus } : m));
      if (viewingMessage && viewingMessage.id === message.id) {
        setViewingMessage({ ...viewingMessage, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleViewMessage = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/${message.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setViewingMessage(response.data.data);
        // If it was unread, update local state since backend marked it read
        if (message.status === 'unread') {
          setMessages(messages.map(m => m.id === message.id ? { ...m, status: 'read' } : m));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch message details.');
    }
  };

  const filteredMessages = messages.filter(m => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(term) || 
      (m.email || '').toLowerCase().includes(term) ||
      (m.subject || '').toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
      
      {/* Left Column: List */}
      <div className={`flex-1 flex flex-col bg-transparent ${viewingMessage ? 'hidden lg:flex lg:max-w-md' : 'w-full'}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Contact Messages</h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage inquiries from the website contact form.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 mb-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search sender, email, subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-sm font-medium"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C542] text-xs font-bold appearance-none cursor-pointer"
              >
                <option value="All">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            <button onClick={fetchMessages} className="p-2 bg-[#F7F7F5] text-[#737373] hover:text-[#111111] rounded-lg transition-colors">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No messages found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => handleViewMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors border-l-4 ${
                    viewingMessage?.id === msg.id 
                      ? 'bg-[#F7F7F5] border-[#F5C542]' 
                      : msg.status === 'unread' 
                        ? 'bg-white border-blue-500 hover:bg-gray-50' 
                        : 'bg-white border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-black text-[#111111]' : 'font-bold text-gray-700'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`text-xs mb-2 truncate ${msg.status === 'unread' ? 'font-bold text-gray-800' : 'font-medium text-gray-500'}`}>
                    {msg.subject || 'No Subject'}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      msg.status === 'unread' ? 'bg-blue-100 text-blue-800' : 
                      msg.status === 'replied' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: View Message */}
      <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden ${!viewingMessage ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
        {!viewingMessage ? (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-400">Select a message to read</h3>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 bg-[#F7F7F5] flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    viewingMessage.status === 'unread' ? 'bg-blue-100 text-blue-800' : 
                    viewingMessage.status === 'replied' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {viewingMessage.status}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusToggle(viewingMessage, viewingMessage.status === 'replied' ? 'read' : 'replied')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewingMessage.status === 'replied' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-white text-gray-500 hover:text-[#111111] shadow-sm border border-gray-200'
                      }`}
                      title={viewingMessage.status === 'replied' ? 'Mark as Not Replied' : 'Mark as Replied'}
                    >
                      <CornerUpLeft size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(viewingMessage.id)}
                      className="p-2 rounded-lg bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => setViewingMessage(null)}
                      className="lg:hidden p-2 rounded-lg bg-white text-gray-400 hover:text-[#111111] shadow-sm border border-gray-200 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <h2 className="text-xl font-black text-[#111111] mb-4">{viewingMessage.subject || 'No Subject'}</h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#111111] rounded-full flex items-center justify-center text-[#F5C542] font-bold text-lg mr-3 flex-shrink-0">
                      {viewingMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-[#111111]">{viewingMessage.name}</div>
                      <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        <a href={`mailto:${viewingMessage.email}`}>{viewingMessage.email}</a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs font-bold text-gray-400">
                    <div>{new Date(viewingMessage.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div>{new Date(viewingMessage.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto bg-white">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {viewingMessage.message}
              </div>
            </div>
            
            {viewingMessage.phone && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center">
                <span className="text-xs font-bold text-gray-400 uppercase mr-3">Contact Number:</span>
                <a href={`tel:${viewingMessage.phone}`} className="text-sm font-bold text-[#111111] hover:text-[#F5C542] transition-colors">
                  {viewingMessage.phone}
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E5E7EB; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #D1D5DB; }
      `}} />
    </div>
  );
};

export default ContactMessageManagement;
