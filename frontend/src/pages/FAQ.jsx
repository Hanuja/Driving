import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openQ, setOpenQ] = useState(1);
  
  const faqs = [
    { id: 1, q: 'How many lessons do I need?', a: 'The required number of lessons depends on your experience, confidence and training goals. Beginners usually start with 10 lessons.' },
    { id: 2, q: 'Do you provide manual and automatic training?', a: 'Yes, courses can be configured for both manual and automatic vehicles depending on your preference.' },
    { id: 3, q: 'Can I choose my instructor?', a: 'Instructor selection can be offered based on branch and availability.' },
    { id: 4, q: 'Can I book a trial lesson?', a: 'Yes. Submit the trial lesson form and our team will contact you to arrange a suitable time.' },
    { id: 5, q: 'Do you provide test preparation?', a: 'Yes, selected courses include practical test preparation, including parking practice and mock tests.' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Find answers to common questions about our courses, lessons, bookings and driving tests.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <input type="text" placeholder="Search your question..." className="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-4 pl-12 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-medium" />
            <Search size={20} className="absolute left-4 top-4.5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* Categories */}
        <div className="lg:w-1/4">
           <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
             <h3 className="font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-4 text-black">Categories</h3>
             <ul className="space-y-2">
               {['General', 'Courses', 'Pricing', 'Booking', 'Driving Test', 'Vehicles', 'Learner Permit', 'Safety'].map((cat, i) => (
                 <li key={i}>
                   <button className={`w-full text-left py-2 font-semibold uppercase tracking-wider text-xs transition-colors rounded-lg px-3 ${i === 0 ? 'bg-black text-yellow-400' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>{cat}</button>
                 </li>
               ))}
             </ul>
           </div>
        </div>

        {/* Accordion */}
        <div className="lg:w-3/4 space-y-4">
           {faqs.map(faq => (
             <div key={faq.id} className="bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:border-yellow-400 overflow-hidden shadow-sm">
               <button 
                 onClick={() => setOpenQ(openQ === faq.id ? null : faq.id)}
                 className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
               >
                 <h4 className={`font-semibold text-lg pr-8 transition-colors ${openQ === faq.id ? 'text-yellow-500' : 'text-black'}`}>{faq.q}</h4>
                 {openQ === faq.id ? <ChevronUp size={24} className="text-yellow-500 shrink-0" /> : <ChevronDown size={24} className="text-gray-400 shrink-0" />}
               </button>
               {openQ === faq.id && (
                 <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/50">
                   <p>{faq.a}</p>
                 </div>
               )}
             </div>
           ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 mt-8 bg-neutral-900 text-center border-y border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-white">Can't Find Your Answer?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/contact" className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors text-sm md:text-base">
              Contact Us
            </Link>
            <a href="https://wa.me/94771234567" className="border border-white/30 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors text-sm md:text-base">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
