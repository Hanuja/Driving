import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost/Driving/api/testimonials');
        if (response.data.success) {
          setTestimonials(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const filteredTestimonials = activeTab === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.course_name?.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Testimonials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Student Testimonials</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Real experiences from students who started their driving journey with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors text-sm md:text-base">
              Book Your Lesson
            </Link>
            <Link to="/courses" className="border border-white/30 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors text-sm md:text-base">
              View Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div><h3 className="text-4xl font-black text-black mb-2">5,000+</h3><p className="font-semibold text-xs uppercase tracking-wider text-gray-500">Students</p></div>
              <div><h3 className="text-4xl font-black text-black mb-2">95%</h3><p className="font-semibold text-xs uppercase tracking-wider text-gray-500">Pass Rate</p></div>
              <div><h3 className="text-4xl font-black text-black mb-2">4.9/5</h3><p className="font-semibold text-xs uppercase tracking-wider text-gray-500">Average Rating</p></div>
              <div><h3 className="text-4xl font-black text-black mb-2">10+</h3><p className="font-semibold text-xs uppercase tracking-wider text-gray-500">Years Experience</p></div>
           </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-hide justify-center gap-2">
          {['All', 'Manual', 'Automatic', 'Motorcycle', 'Defensive', 'Test Preparation'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-semibold uppercase tracking-wider text-xs whitespace-nowrap transition-colors rounded-lg ${activeTab === tab ? 'bg-black text-yellow-400' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map(test => (
              <div key={test.id} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-yellow-400 transition-all duration-300">
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} className={i < test.rating ? 'fill-current' : 'text-gray-200'} />)}
                </div>
                <p className="text-gray-700 font-medium italic mb-8 leading-relaxed text-lg">"{test.testimonial}"</p>
                <div className="flex items-center">
                  {test.image_url ? (
                    <img src={test.image_url} alt={test.student_name} className="w-12 h-12 rounded-full object-cover mr-4 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full mr-4 flex-shrink-0"></div>
                  )}
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-black text-sm">{test.student_name}</h4>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">{test.course_name || 'Student'}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredTestimonials.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No testimonials found for this category.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Submit CTA */}
      <section className="py-24 mt-16 bg-neutral-900 text-center text-white border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Share Your Experience</h2>
          <p className="text-gray-400 text-lg mb-10">Help other learners by sharing your journey with our driving school.</p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors text-sm md:text-base">
            Submit Testimonial
          </button>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
