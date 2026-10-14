import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Star, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost/Driving/api/instructors';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success) {
          const activeInstructors = res.data.data.filter(inst => inst.status?.toLowerCase() === 'active');
          setInstructors(activeInstructors);
          
          // Extract unique branches
          const uniqueBranches = ['All Branches', ...new Set(activeInstructors.map(i => i.branch_name).filter(Boolean))];
          setBranches(uniqueBranches);
        }
      } catch (err) {
        setError('Failed to load instructors.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = (inst.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inst.specialties || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'All Branches' || inst.branch_name === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* 1. Hero */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Our Instructors</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Meet Our Instructors</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn from experienced, patient and professional driving instructors.
          </p>
          <Link to="/book" className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors text-sm md:text-base">
            Book A Lesson
          </Link>
        </div>
      </section>

      {/* 2. Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search instructor or specialty..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-medium text-black" 
              />
              <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            <div className="flex space-x-4 overflow-x-auto w-full md:w-auto scrollbar-hide">
               <select 
                 value={branchFilter}
                 onChange={(e) => setBranchFilter(e.target.value)}
                 className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-semibold uppercase tracking-wider text-xs text-gray-600 outline-none cursor-pointer"
               >
                 {branches.map(b => (
                   <option key={b} value={b}>{b}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Cards */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-yellow-500 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading instructors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No active instructors found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstructors.map(inst => (
              <div key={inst.id} className="bg-white border border-gray-200 rounded-2xl group hover:border-yellow-400 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {inst.image ? (
                    <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Photo'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">No Photo</div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                    <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {inst.experience ? `${inst.experience} Exp` : 'Professional'}
                    </div>
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star size={12} className="mr-1 fill-current" /> {parseFloat(inst.rating || 4.5).toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-1">{inst.name}</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">{inst.qualification || 'Professional Instructor'}</p>
                  
                  <div className="space-y-3 mb-8 text-sm">
                    {inst.specialties && (
                      <div className="flex"><span className="w-24 text-gray-500 font-semibold uppercase text-xs tracking-wider pt-0.5">Focus</span> <span className="font-medium text-gray-800">{inst.specialties}</span></div>
                    )}
                    {inst.license_category && (
                      <div className="flex"><span className="w-24 text-gray-500 font-semibold uppercase text-xs tracking-wider pt-0.5">License</span> <span className="font-medium text-gray-800">Category {inst.license_category}</span></div>
                    )}
                    {inst.branch_name && (
                      <div className="flex"><span className="w-24 text-gray-500 font-semibold uppercase text-xs tracking-wider pt-0.5">Branch</span> <span className="font-medium text-gray-800">{inst.branch_name}</span></div>
                    )}
                  </div>
  
                  <div className="mt-auto flex flex-col space-y-3 pt-6 border-t border-gray-100">
                    <button className="w-full bg-gray-50 border border-gray-200 text-black rounded-lg font-bold uppercase tracking-wide py-3 text-xs hover:bg-gray-100 transition-colors">View Profile</button>
                    <Link to="/book" className="w-full bg-black text-white rounded-lg font-bold uppercase tracking-wide py-3 text-xs hover:bg-yellow-400 hover:text-black transition-colors text-center">Book With Instructor</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Instructors;
