import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/Driving/api/courses');
      if (response.data.success) {
        // Filter out inactive courses for the public page
        const activeCourses = response.data.data.filter(c => c.status === 'Active');
        setCourses(activeCourses);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Driving Courses</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Driving Courses</h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Choose the right training program and start your journey toward becoming a confident, responsible driver.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-all text-sm md:text-base">
              Book A Lesson
            </Link>
            <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all text-sm md:text-base">
              Compare Courses
            </button>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <input type="text" placeholder="Search courses..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 font-medium" />
              <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
              {['All', 'Beginner', 'Advanced', 'Manual', 'Automatic'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 font-semibold uppercase tracking-wider text-xs whitespace-nowrap transition-colors rounded-lg ${activeTab === tab ? 'bg-black text-yellow-400' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                >
                  {tab}
                </button>
              ))}
              <button className="px-5 py-2.5 font-semibold uppercase tracking-wider text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center ml-2">
                <Filter size={16} className="mr-2" /> Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Course Grid */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-yellow-500 mr-3" size={32} />
              <span className="text-gray-600 font-medium">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">{error}</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-medium">No courses found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-2xl group hover:shadow-xl hover:border-yellow-400 transition-all duration-300 flex flex-col relative overflow-hidden shadow-sm hover:-translate-y-1">
                  <div className="h-48 bg-gray-100 relative">
                     {/* Image Placeholder if actual image is missing */}
                     {course.image ? (
                        <img 
                          src={course.image.startsWith('http') ? course.image : `http://localhost/Driving/backend/uploads/${course.image}`} 
                          alt={course.name} 
                          className="w-full h-full object-cover" 
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                     )}
                     <div className="absolute top-4 right-4 bg-black text-yellow-400 font-bold uppercase text-xs px-3 py-1 rounded-full z-10">
                       {course.transmission || 'Both'}
                     </div>
                     {course.type && (
                       <div className="absolute top-4 left-4 bg-green-600 text-white font-bold uppercase text-xs px-3 py-1 rounded-full z-10">
                         {course.type}
                       </div>
                     )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow relative">
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-4 pr-12 leading-tight text-black">{course.name}</h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-sm font-medium text-gray-600">
                        <CheckCircle size={18} className="text-yellow-500 mr-3" /> {course.lessons || 0} Practical Lessons
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-600">
                        <CheckCircle size={18} className="text-yellow-500 mr-3" /> Duration: {course.duration || 'N/A'}
                      </div>
                      {course.description && (
                        <div className="text-sm text-gray-600 line-clamp-2 mt-2">
                          {course.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Fee</p>
                        <p className="font-black text-xl text-black">Rs. {Number(course.price).toLocaleString()}</p>
                      </div>
                      <Link to={`/courses/${course.id}`} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors flex items-center">
                        View <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Packages CTA */}
      <section className="py-16 md:py-24 bg-black text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Need a custom training package?</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-10">
            We offer specialized training, refresher courses, and defensive driving. Contact our team to build a schedule that works for you.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-all text-sm md:text-base">
            Contact Support Team
          </button>
        </div>
      </section>
      
    </div>
  );
};

export default Courses;
