import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Edit2, ImageIcon, FileText, CheckCircle, BarChart2 } from 'lucide-react';

const API_URL = 'http://localhost/Driving/api/content';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('about');
  
  const [aboutData, setAboutData] = useState({});
  const [banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [statistics, setStatistics] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [aboutRes, bannersRes, featuresRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/about`, { headers }),
        axios.get(`${API_URL}/banners`, { headers }),
        axios.get(`${API_URL}/about-features`, { headers }),
        axios.get(`${API_URL}/about-statistics`, { headers })
      ]);
      
      if (aboutRes.data.success) setAboutData(aboutRes.data.data || {});
      if (bannersRes.data.success) setBanners(bannersRes.data.data || []);
      if (featuresRes.data.success) setFeatures(featuresRes.data.data || []);
      if (statsRes.data.success) setStatistics(statsRes.data.data || []);
    } catch (err) {
      setError('Failed to fetch content data.');
    } finally {
      setLoading(false);
    }
  };

  // --- About Form Handling ---
  
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutData({ ...aboutData, [name]: value });
  };

  const saveAboutData = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/about`, aboutData, { headers: { Authorization: `Bearer ${token}` } });
      alert('About page content saved successfully!');
    } catch (err) {
      alert('Failed to save about data.');
    } finally {
      setSaveLoading(false);
    }
  };

  // --- Statistics Handling ---
  
  const handleStatChange = (index, field, value) => {
    const newStats = [...statistics];
    newStats[index][field] = value;
    setStatistics(newStats);
  };

  const saveStatistics = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/about-statistics`, { statistics }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Statistics saved successfully!');
    } catch (err) {
      alert('Failed to save statistics.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">Website Content</h1>
        <p className="text-[#737373] text-sm mt-1 font-medium">Manage text, images, and content for your public website.</p>
      </div>

      <div className="bg-white rounded-t-2xl border-b border-gray-100 flex overflow-x-auto shadow-sm">
        <button 
          onClick={() => setActiveTab('about')}
          className={`px-6 py-4 font-bold text-sm uppercase tracking-wide flex items-center whitespace-nowrap transition-colors ${activeTab === 'about' ? 'text-[#111111] border-b-2 border-[#F5C542]' : 'text-[#737373] hover:bg-gray-50'}`}
        >
          <FileText size={16} className="mr-2" /> About Us Page
        </button>
        <button 
          onClick={() => setActiveTab('statistics')}
          className={`px-6 py-4 font-bold text-sm uppercase tracking-wide flex items-center whitespace-nowrap transition-colors ${activeTab === 'statistics' ? 'text-[#111111] border-b-2 border-[#F5C542]' : 'text-[#737373] hover:bg-gray-50'}`}
        >
          <BarChart2 size={16} className="mr-2" /> Statistics
        </button>
        {/* We can add features and banners here if needed later */}
      </div>

      <div className="bg-white p-6 rounded-b-2xl shadow-sm min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>
            )}

            {/* ABOUT US TAB */}
            {activeTab === 'about' && (
              <form onSubmit={saveAboutData} className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Hero Title</label>
                      <input type="text" name="hero_title" value={aboutData.hero_title || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Hero Image URL</label>
                      <div className="flex items-center gap-3">
                        <ImageIcon size={18} className="text-gray-400" />
                        <input type="text" name="hero_image" value={aboutData.hero_image || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" placeholder="https://example.com/hero-image.jpg" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Hero Description</label>
                      <textarea name="hero_description" rows="3" value={aboutData.hero_description || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Our Story</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Story Title</label>
                      <input type="text" name="story_title" value={aboutData.story_title || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Story Image URL</label>
                      <div className="flex items-center gap-3">
                        <ImageIcon size={18} className="text-gray-400" />
                        <input type="text" name="story_image" value={aboutData.story_image || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium" placeholder="https://example.com/story-image.jpg" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#737373] uppercase mb-1">Story Content</label>
                      <textarea name="story_content" rows="6" value={aboutData.story_content || ''} onChange={handleAboutChange} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-medium"></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button type="submit" disabled={saveLoading} className="bg-[#111111] text-white hover:bg-[#F5C542] hover:text-[#111111] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors flex items-center shadow-md">
                    <Save size={16} className="mr-2" /> {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* STATISTICS TAB */}
            {activeTab === 'statistics' && (
              <form onSubmit={saveStatistics} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statistics.map((stat, index) => (
                    <div key={stat.id} className="bg-[#F7F7F5] p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">Stat Value</label>
                        <input type="text" value={stat.stat_value} onChange={(e) => handleStatChange(index, 'stat_value', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-lg font-black text-center" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">Label</label>
                        <input type="text" value={stat.label} onChange={(e) => handleStatChange(index, 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#F5C542] text-sm font-bold text-center uppercase tracking-wider text-[#737373]" />
                      </div>
                      <div className="text-[10px] text-gray-400 text-center mt-2 uppercase tracking-widest">{stat.stat_key}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button type="submit" disabled={saveLoading} className="bg-[#111111] text-white hover:bg-[#F5C542] hover:text-[#111111] px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors flex items-center shadow-md">
                    <Save size={16} className="mr-2" /> {saveLoading ? 'Saving...' : 'Save Statistics'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
