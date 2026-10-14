import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, ChevronRight } from 'lucide-react';
import axios from 'axios';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get('http://localhost/Driving/api/content/about');
        if (response.data.success) {
          setAbout(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load About Us:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24 selection:bg-yellow-400 selection:text-black">
      {/* 1. About Hero Section */}
      <section 
        className="relative min-h-[400px] flex items-center justify-center overflow-hidden bg-black text-white"
        style={{ 
          backgroundImage: about?.hero_image ? `url(${about.hero_image})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-neutral-900 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 text-center py-24">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">About Us</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6 leading-tight whitespace-pre-line">
            {about?.hero_title || 'About Our Driving School'}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 whitespace-pre-line">
            {about?.hero_description || 'Building confident, responsible and safe drivers for Sri Lanka. We provide professional driving training designed for beginners, experienced learners and drivers looking to improve their confidence.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/courses" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                Explore Our Courses
             </Link>
             <Link to="/book" className="border border-white/30 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                Book A Lesson
             </Link>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-[4/3] w-full bg-gray-200 rounded-2xl relative overflow-hidden shadow-sm border border-gray-200 group">
              {about?.story_image ? (
                <img src={about.story_image} alt="Our Story" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              )}
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 text-black">
                {about?.story_title || 'Our Story'}
              </h2>
              <div className="h-1 w-16 bg-yellow-400 rounded mb-8"></div>
              
              <div className="text-gray-700 leading-relaxed mb-8 space-y-4 text-base md:text-lg whitespace-pre-line">
                {about?.story_content || 'Our driving school was established with a simple goal — to help learners become confident, responsible and safety-conscious drivers.\n\nThrough experienced instructors, practical training and modern teaching methods, we have helped thousands of students begin their driving journey. We believe that learning to drive is not just about passing a test, but about gaining a skill for life that requires respect for the road and other drivers.'}
              </div>
              
              <Link to="/contact" className="inline-flex font-bold uppercase tracking-wide text-sm md:text-base items-center text-black hover:text-yellow-500 transition-colors">
                Read Our Journey <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-black">
                {about?.mission_title || 'Our Mission'}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {about?.mission_description || 'To provide safe, professional and accessible driving education that prepares learners for real-world road conditions.'}
              </p>
            </div>
            
            <div className="bg-black border border-white/10 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-white">
                {about?.vision_title || 'Our Vision'}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                {about?.vision_description || 'To become one of Sri Lanka\'s most trusted driving education providers, setting the standard for road safety and driver confidence.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Achievements */}
      <section className="py-16 md:py-20 lg:py-24 bg-black border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-2">5,000+</h3>
              <p className="text-white font-semibold uppercase tracking-wider text-xs md:text-sm">Students Trained</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-2">95%</h3>
              <p className="text-white font-semibold uppercase tracking-wider text-xs md:text-sm">Pass Rate</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-2">10+</h3>
              <p className="text-white font-semibold uppercase tracking-wider text-xs md:text-sm">Years Experience</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-2">15+</h3>
              <p className="text-white font-semibold uppercase tracking-wider text-xs md:text-sm">Instructors</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;
