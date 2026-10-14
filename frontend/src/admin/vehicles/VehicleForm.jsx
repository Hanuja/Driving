import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const VehicleForm = ({ vehicle = null, branches = [], instructors = [], onSubmit, onClose, isSubmitting }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    vehicle_number: '', registration_number: '', brand: '', model: '', vehicle_type: 'Car', 
    manufacturing_year: new Date().getFullYear(), color: '', transmission: 'Manual', 
    fuel_type: 'Petrol', engine_capacity: '', mileage: '', license_category: '', 
    branch_id: '', instructor_id: '', last_service_date: '', next_service_date: '', 
    insurance_provider: '', insurance_policy_number: '', insurance_expiry: '', 
    revenue_license_number: '', revenue_license_expiry: '', image: '', status: 'Available'
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        ...vehicle,
        instructor_id: vehicle.instructor_id || '',
        branch_id: vehicle.branch_id || '',
        last_service_date: vehicle.last_service_date || '',
        next_service_date: vehicle.next_service_date || '',
        insurance_expiry: vehicle.insurance_expiry || '',
        revenue_license_expiry: vehicle.revenue_license_expiry || ''
      });
    } else if (branches.length > 0) {
      setFormData(prev => ({ ...prev, branch_id: branches[0].id }));
    }
  }, [vehicle, branches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validations
    if (!formData.vehicle_number || !formData.registration_number || !formData.brand || !formData.model || !formData.branch_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  const tabs = [
    { id: 'info', label: 'Vehicle Info' },
    { id: 'driving', label: 'Driving Specs' },
    { id: 'assignment', label: 'Assignments' },
    { id: 'maintenance', label: 'Maintenance & Legal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F7F7F5]">
          <div>
            <h2 className="text-2xl font-black text-[#111111]">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {vehicle ? `Updating details for ${vehicle.vehicle_number}` : 'Register a new academy vehicle'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab.id ? 'border-[#F5C542] text-[#111111]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="vehicleForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* TAB: INFO */}
            <div className={activeTab === 'info' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Vehicle Number *</label>
                  <input type="text" name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} required placeholder="e.g. WP CAB-1234" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Registration Number *</label>
                  <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} required placeholder="e.g. CAB-1234" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Brand *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} required placeholder="e.g. Toyota" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Model *</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Aqua" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Vehicle Type</label>
                  <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Heavy Vehicle">Heavy Vehicle</option>
                    <option value="Bus">Bus</option>
                    <option value="Lorry">Lorry</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Year</label>
                    <input type="number" name="manufacturing_year" value={formData.manufacturing_year} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Vehicle Image URL</label>
                  <div className="flex gap-4">
                    <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="flex-1 p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                    {formData.image && (
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: DRIVING SPECS */}
            <div className={activeTab === 'driving' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Fuel Type</label>
                  <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Engine Capacity</label>
                  <input type="text" name="engine_capacity" value={formData.engine_capacity} onChange={handleChange} placeholder="e.g. 1500cc" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">Current Mileage (km)</label>
                  <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="e.g. 45000" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-2">License Category</label>
                  <input type="text" name="license_category" value={formData.license_category} onChange={handleChange} placeholder="e.g. B, A" className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium" />
                </div>
              </div>
            </div>

            {/* TAB: ASSIGNMENT */}
            <div className={activeTab === 'assignment' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-gray-200">
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-4">Branch Assignment *</label>
                  <select name="branch_id" value={formData.branch_id} onChange={handleChange} required className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="">Select a Branch...</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} - {b.city}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-gray-200">
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-4">Instructor Assignment (Optional)</label>
                  <select name="instructor_id" value={formData.instructor_id} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="">Unassigned</option>
                    {instructors.filter(i => i.status === 'Active' && i.branch_id == formData.branch_id).map(i => (
                      <option key={i.id} value={i.id}>{i.name} ({i.instructor_code})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Only active instructors from the selected branch are shown. A vehicle can only have one assigned instructor.</p>
                </div>
                
                <div className="bg-[#F7F7F5] rounded-2xl p-6 border border-gray-200">
                  <label className="block text-xs font-black text-[#111111] uppercase tracking-widest mb-4">Vehicle Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542] transition-all font-medium">
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TAB: MAINTENANCE & LEGAL */}
            <div className={activeTab === 'maintenance' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                
                {/* Service */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Maintenance Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Last Service Date</label>
                      <input type="date" name="last_service_date" value={formData.last_service_date} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Next Service Date</label>
                      <input type="date" name="next_service_date" value={formData.next_service_date} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Insurance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Provider</label>
                      <input type="text" name="insurance_provider" value={formData.insurance_provider} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Policy Number</label>
                      <input type="text" name="insurance_policy_number" value={formData.insurance_policy_number} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Expiry Date</label>
                      <input type="date" name="insurance_expiry" value={formData.insurance_expiry} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                  </div>
                </div>

                {/* Revenue License */}
                <div>
                  <h3 className="text-sm font-black text-[#111111] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Revenue License</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">License Number</label>
                      <input type="text" name="revenue_license_number" value={formData.revenue_license_number} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Expiry Date</label>
                      <input type="date" name="revenue_license_expiry" value={formData.revenue_license_expiry} onChange={handleChange} className="w-full p-3 bg-[#F7F7F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] transition-all font-medium" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="vehicleForm"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#111111] hover:bg-black text-[#F5C542] text-sm font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#F5C542] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Check size={18} />
            )}
            {vehicle ? 'Save Changes' : 'Create Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
