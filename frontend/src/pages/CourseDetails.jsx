import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Calendar, CheckCircle, Clock, MapPin, User, ArrowRight, MessageCircle } from 'lucide-react';

const CourseDetails = () => {
  const { slug } = useParams();
  const [activePackage, setActivePackage] = useState('STANDARD');

  const packages = [
    { name: 'STARTER', lessons: 5, price: '12,500', desc: 'For learners who want to try professional training.', features: ['5 Practical Lessons', 'Basic Vehicle Control', 'Road Introduction', 'Instructor Support'] },
    { name: 'STANDARD', lessons: 10, price: '25,000', popular: true, desc: 'Complete training for beginner drivers.', features: ['10 Practical Lessons', 'Road Training', 'Parking Practice', 'Traffic Training', 'Test Preparation'] },
    { name: 'PREMIUM', lessons: 20, price: '48,000', desc: 'Advanced training and full test preparation.', features: ['20 Practical Lessons', 'Advanced Road Training', 'Parking', 'Traffic', 'Mock Test', 'Driving Test Preparation'] },
  ];

  const curriculum = [
    { num: '01', title: 'Vehicle Familiarization', desc: 'Controls, seating, mirrors and safety.' },
    { num: '02', title: 'Starting & Stopping', desc: 'Smooth acceleration and braking.' },
    { num: '03', title: 'Steering & Turning', desc: 'Cornering and road positioning.' },
    { num: '04', title: 'Gear & Clutch Control', desc: 'Manual vehicle control.' },
    { num: '05', title: 'Traffic Training', desc: 'Real-world road conditions.' },
    { num: '06', title: 'Parking', desc: 'Parallel, reverse and bay parking.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-black">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-8">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/courses" className="hover:text-yellow-400 transition-colors">Driving Courses</Link>
            <ChevronRight size={14} />
            <span className="text-white">Beginner Manual</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             <div className="lg:w-2/3">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-yellow-400 text-black font-bold uppercase text-xs px-3 py-1 rounded-full tracking-wide">Manual</span>
                  <span className="bg-white/10 font-bold uppercase text-xs px-3 py-1 rounded-full tracking-wide text-white border border-white/20">Light Vehicle</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-tight">Beginner Manual Course</h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-8">
                  Complete clutch, gear, hills and road driving training designed for learners starting from zero.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="#booking" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-all flex items-center justify-center text-sm md:text-base">
                    Book This Course
                  </Link>
                  <a href="https://wa.me/94771234567" className="border border-white/30 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all flex items-center justify-center text-sm md:text-base">
                    <MessageCircle size={20} className="mr-2" /> WhatsApp Info
                  </a>
                </div>
             </div>
             
             {/* Key Info Card */}
             <div className="lg:w-1/3 w-full bg-neutral-900 rounded-2xl p-6 md:p-8 border-t-4 border-yellow-400 border-x border-b border-white/10">
                <h3 className="font-semibold uppercase tracking-wider text-gray-400 text-xs mb-6">Course Summary</h3>
                <ul className="space-y-6">
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mr-4 text-yellow-400"><Clock size={18} /></div>
                    <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Duration</p><p className="font-bold text-white">1 - 4 Weeks</p></div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mr-4 text-yellow-400"><CheckCircle size={18} /></div>
                    <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Pass Rate</p><p className="font-bold text-white">96% Average</p></div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mr-4 text-yellow-400"><Car size={18} /></div>
                    <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Vehicle</p><p className="font-bold text-white">Toyota Vitz (Manual)</p></div>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Content & Curriculum */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
           <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 text-black">Course Overview</h2>
              <div className="h-1 w-16 bg-yellow-400 rounded mb-8"></div>
              
              <div className="text-gray-700 leading-relaxed mb-16 space-y-4 text-base md:text-lg">
                <p>This comprehensive manual driving course is designed specifically for beginners with no prior driving experience. You will learn the fundamentals of vehicle control, focusing heavily on clutch management, gear shifting, and smooth acceleration.</p>
                <p>Our structured curriculum ensures you progress at a comfortable pace, moving from quiet training areas to active Sri Lankan roads as your confidence builds.</p>
              </div>

              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 text-black">Course Curriculum</h2>
              <div className="h-1 w-16 bg-yellow-400 rounded mb-8"></div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                 {curriculum.map((lesson, idx) => (
                   <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                     <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-black text-yellow-400 font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                       {lesson.num}
                     </div>
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-yellow-400 transition-colors">
                       <h4 className="font-bold text-black mb-2">{lesson.title}</h4>
                       <p className="text-sm text-gray-600 leading-relaxed">{lesson.desc}</p>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Sidebar: Packages */}
           <div className="lg:col-span-1" id="booking">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 sticky top-24">
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-6 text-black">Select Package</h3>
                <div className="space-y-4 mb-8">
                   {packages.map((pkg, idx) => (
                     <div 
                       key={idx} 
                       onClick={() => setActivePackage(pkg.name)}
                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${activePackage === pkg.name ? 'border-yellow-400 bg-yellow-400/5 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                     >
                       <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold uppercase tracking-wide text-black">{pkg.name}</h4>
                         {pkg.popular && <span className="bg-yellow-400 text-black text-[10px] font-bold uppercase px-2 py-1 rounded-full">Popular</span>}
                       </div>
                       <p className="text-gray-500 text-sm mb-2">{pkg.lessons} Lessons</p>
                       <p className="font-black text-xl text-black">LKR {pkg.price}</p>
                     </div>
                   ))}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
                   <h4 className="font-semibold uppercase tracking-wider text-xs text-gray-600 mb-4">Package Includes:</h4>
                   <ul className="space-y-3">
                     {packages.find(p => p.name === activePackage)?.features.map((feat, idx) => (
                       <li key={idx} className="flex items-start text-sm text-gray-700">
                         <CheckCircle size={18} className="text-yellow-500 mr-3 shrink-0 mt-0.5" />
                         {feat}
                       </li>
                     ))}
                   </ul>
                </div>

                <button className="w-full bg-yellow-400 text-black rounded-lg font-bold uppercase tracking-wide py-4 hover:bg-yellow-300 transition-all flex items-center justify-center">
                  Proceed To Book <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Availability Checker */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 text-black">Check Availability</h2>
          <p className="text-gray-600 mb-10 text-lg">See live lesson slots for this course before booking.</p>
          
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Select Branch</label>
                 <select className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 appearance-none text-gray-700">
                   <option>Colombo Main Branch</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Select Date</label>
                 <input type="date" className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-gray-700" />
               </div>
               <div className="flex items-end">
                 <button className="w-full bg-black text-white rounded-lg font-bold uppercase tracking-wide px-4 py-3 hover:bg-neutral-800 transition-colors">
                   Check Slots
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div className="bg-white border border-green-500 rounded-xl text-green-700 font-bold p-4 text-center shadow-sm">08:00 AM<br/><span className="text-[10px] uppercase block mt-1">Available</span></div>
               <div className="bg-gray-100 border border-gray-300 rounded-xl text-gray-400 font-bold p-4 text-center">10:00 AM<br/><span className="text-[10px] uppercase block mt-1">Booked</span></div>
               <div className="bg-white border border-green-500 rounded-xl text-green-700 font-bold p-4 text-center shadow-sm">01:00 PM<br/><span className="text-[10px] uppercase block mt-1">Available</span></div>
               <div className="bg-white border border-green-500 rounded-xl text-green-700 font-bold p-4 text-center shadow-sm">03:30 PM<br/><span className="text-[10px] uppercase block mt-1">Available</span></div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default CourseDetails;
