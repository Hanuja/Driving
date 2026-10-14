import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Loader2, Car } from 'lucide-react';
import axios from 'axios';

const VehicleCategories = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/Driving/api/vehicles');
      if (response.data.success) {
        // Group vehicles by vehicle_type
        const vehicles = response.data.data.filter(v => v.status === 'Available');
        
        const grouped = vehicles.reduce((acc, vehicle) => {
          const type = vehicle.vehicle_type || 'Other';
          if (!acc[type]) acc[type] = [];
          acc[type].push(vehicle);
          return acc;
        }, {});
        
        setCategories(grouped);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Failed to load vehicle categories.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-black pb-24">
      {/* 1. Hero */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Vehicle Categories</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Training Vehicles</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            We provide specialized training across all vehicle classes. Select your category to view available courses.
          </p>
        </div>
      </section>

      {/* 2. Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="animate-spin text-yellow-500 mr-3" size={32} />
               <span className="text-gray-600 font-medium">Loading vehicle categories...</span>
             </div>
           ) : error ? (
             <div className="text-center py-20 text-red-500 font-medium">{error}</div>
           ) : Object.keys(categories).length === 0 ? (
             <div className="text-center py-20 text-gray-500 font-medium">No available vehicles found.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
               {Object.entries(categories).map(([type, vehicles], idx) => {
                 // Find the first vehicle in this category that has an image
                 const vehicleWithImage = vehicles.find(v => v.image);
                 let bgImageUrl = null;
                 if (vehicleWithImage) {
                   bgImageUrl = vehicleWithImage.image.startsWith('http') 
                     ? vehicleWithImage.image 
                     : `http://localhost/Driving/backend/uploads/${vehicleWithImage.image}`;
                 }

                 return (
                   <div key={type} className="relative group overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-yellow-400 transition-all duration-300 flex flex-col">
                     <div className="h-48 md:h-56 w-full bg-neutral-900 relative">
                        {bgImageUrl && (
                          <img 
                            src={bgImageUrl} 
                            alt={`${type} Category`} 
                            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700" 
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-black/40 transition-colors duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">{type}s</h3>
                        </div>
                     </div>
                     
                     <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                      <p className="text-gray-500 font-medium text-sm mb-6 uppercase tracking-wider">Available Training Vehicles:</p>
                      
                      <ul className="space-y-4 mb-8 flex-grow">
                        {vehicles.map(vehicle => (
                          <li key={vehicle.id} className="flex items-start">
                            <Car className="text-yellow-500 mr-3 mt-0.5" size={18} />
                            <div>
                              <p className="font-bold text-lg text-black">{vehicle.brand} {vehicle.model}</p>
                              <p className="text-sm text-gray-500 uppercase tracking-wide">{vehicle.transmission} • {vehicle.fuel_type}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <Link to="/courses" className="inline-flex items-center justify-center w-full bg-black text-yellow-400 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors mt-auto">
                        View Related Courses <ArrowRight size={18} className="ml-2" />
                      </Link>
                   </div>
                 </div>
                 );
               })}
             </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default VehicleCategories;
