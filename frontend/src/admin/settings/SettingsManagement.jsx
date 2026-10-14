import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Settings, Building, Phone, Mail, Globe, Database, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost/Driving/api/settings';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    currency: 'LKR',
    registration_fee: '',
    enable_online_booking: 'true',
    maintenance_mode: 'false'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (err) {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(API_URL, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full animate-fade-in relative z-0">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight flex items-center">
            <Settings className="mr-3" size={28} />
            System Settings
          </h1>
          <p className="text-[#737373] text-sm mt-1 font-medium">Manage global configurations for your driving school.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F7F7F5] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-[#111111] flex items-center">
              <Globe className="mr-2 text-[#737373]" size={18} />
              General Information
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Driving School Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">System Currency</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">$</span>
                </div>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="LKR">LKR (Sri Lankan Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F7F7F5] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-[#111111] flex items-center">
              <Phone className="mr-2 text-[#737373]" size={18} />
              Contact Information
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Public Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={16} />
                </div>
                <input
                  type="email"
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="contact_phone"
                  value={settings.contact_phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Physical Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white resize-none"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* System Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#F7F7F5] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-[#111111] flex items-center">
              <Database className="mr-2 text-[#737373]" size={18} />
              System Features
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#737373] uppercase tracking-wider mb-2">Default Registration Fee</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="text-gray-400" size={16} />
                </div>
                <input
                  type="number"
                  name="registration_fee"
                  value={settings.registration_fee}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-colors bg-gray-50 focus:bg-white"
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="enable_online_booking"
                    checked={settings.enable_online_booking === 'true'}
                    onChange={handleInputChange}
                    className="sr-only" 
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.enable_online_booking === 'true' ? 'bg-[#F5C542]' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enable_online_booking === 'true' ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-bold text-[#111111] group-hover:text-[#F5C542] transition-colors">
                  Enable Online Booking
                </div>
              </label>

              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="maintenance_mode"
                    checked={settings.maintenance_mode === 'true'}
                    onChange={handleInputChange}
                    className="sr-only" 
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenance_mode === 'true' ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm font-bold text-[#111111] group-hover:text-red-500 transition-colors">
                  Enable Maintenance Mode
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            type="submit"
            disabled={saving}
            className={`bg-[#111111] hover:bg-[#F5C542] text-white hover:text-[#111111] px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center shadow-md ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManagement;
