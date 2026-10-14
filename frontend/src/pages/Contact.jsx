import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, MessageCircle, Mail, MapPin, ArrowRight, Rocket } from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Complete animation after 2.5s
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      
      // Reset form view after 5s
      setTimeout(() => setIsSent(false), 5000);
    }, 2500);
  };
  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contact Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Have a question about our driving courses? We're here to help.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-400 text-black rounded-xl flex items-center justify-center mb-6">
                <Phone size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-2 text-black">Call Us</h3>
              <p className="text-lg font-bold mb-6 text-gray-800">+94 77 123 4567</p>
              <button className="text-xs font-bold uppercase tracking-wider text-yellow-500 hover:text-black transition-colors mt-auto">Call Now</button>
           </div>
           
           <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-green-500 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 text-white rounded-xl flex items-center justify-center mb-6">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-2 text-black">WhatsApp</h3>
              <p className="text-lg font-bold mb-6 text-gray-800">+94 77 123 4567</p>
              <button className="text-xs font-bold uppercase tracking-wider text-green-500 hover:text-black transition-colors mt-auto">Chat With Us</button>
           </div>
           
           <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-400 text-black rounded-xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-2 text-black">Email</h3>
              <p className="text-sm font-bold mb-6 text-gray-800">info@drivepro.lk</p>
              <button className="text-xs font-bold uppercase tracking-wider text-yellow-500 hover:text-black transition-colors mt-auto">Send Email</button>
           </div>
           
           <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-400 text-black rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-sm mb-2 text-black">Visit Us</h3>
              <p className="text-sm font-bold mb-6 text-gray-800">Colombo 03, Sri Lanka</p>
              <button className="text-xs font-bold uppercase tracking-wider text-black hover:text-yellow-500 transition-colors mt-auto">Get Directions</button>
           </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
           
           {/* Form */}
           <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
             
             {/* Animation Overlay */}
             {isSubmitting && (
               <div className="fixed inset-0 z-50 pointer-events-none animate-screen-glow">
                 <div className="absolute bottom-10 right-10 animate-rocket-launch text-yellow-500 drop-shadow-2xl">
                   <Rocket size={100} strokeWidth={1.5} fill="currentColor" />
                 </div>
               </div>
             )}

             {/* Form Container */}
             <div className={`${isSubmitting ? 'animate-fade-out' : ''} ${isSent ? 'hidden' : 'block'}`}>
               <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 text-black">Send a Message</h2>
               <form className="space-y-6" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name *</label>
                   <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number *</label>
                   <input type="tel" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20" />
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                   <input type="email" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20" />
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-gray-800 mb-2">Subject *</label>
                   <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 bg-white">
                     <option>General Inquiry</option>
                     <option>Course Booking</option>
                     <option>Feedback</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-800 mb-2">Message *</label>
                 <textarea rows="5" className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 resize-none"></textarea>
               </div>

                <button type="submit" className="w-full bg-yellow-400 text-black px-6 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-yellow-300 transition-all flex items-center justify-center group overflow-hidden relative">
                 <span className="relative z-10 flex items-center">
                   Send Message <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </span>
               </button>
             </form>
             </div>

             {/* Success Message */}
             {isSent && !isSubmitting && (
               <div className="text-center py-16">
                 <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                   <Rocket size={40} fill="currentColor" />
                 </div>
                 <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 text-black">Message Sent!</h2>
                 <p className="text-gray-600 font-medium">Thank you for reaching out. We will get back to you shortly.</p>
               </div>
             )}
           </div>

           {/* Branch & Hours */}
           <div className="space-y-12">
             
             <div>
               <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 text-black">Branch Locations</h2>
               <div className="bg-white border border-gray-200 border-l-4 border-l-yellow-400 p-6 rounded-r-2xl shadow-sm mb-6">
                 <h4 className="font-bold uppercase tracking-wide mb-2 text-black">Colombo Main Branch</h4>
                 <p className="text-gray-600 font-medium text-sm mb-1">123 Galle Road, Colombo 03, Sri Lanka</p>
                 <p className="text-gray-600 font-medium text-sm mb-4">+94 77 123 4567</p>
                 <a href="#" className="text-xs font-bold uppercase tracking-wider text-yellow-500 flex items-center hover:text-black transition-colors">Open in Google Maps <ArrowRight size={14} className="ml-1" /></a>
               </div>
             </div>

             <div>
               <h2 className="text-2xl font-bold uppercase tracking-tight mb-8 text-black">Opening Hours</h2>
               <div className="bg-neutral-900 rounded-2xl border border-white/10 text-white p-8 shadow-sm">
                 <ul className="space-y-4">
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Monday</span> <span className="font-medium text-sm">8:00 AM – 6:00 PM</span></li>
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Tuesday</span> <span className="font-medium text-sm">8:00 AM – 6:00 PM</span></li>
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Wednesday</span> <span className="font-medium text-sm">8:00 AM – 6:00 PM</span></li>
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Thursday</span> <span className="font-medium text-sm">8:00 AM – 6:00 PM</span></li>
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Friday</span> <span className="font-medium text-sm">8:00 AM – 6:00 PM</span></li>
                   <li className="flex justify-between border-b border-gray-800 pb-3"><span className="font-semibold uppercase tracking-wider text-xs text-gray-400">Saturday</span> <span className="font-medium text-sm">8:00 AM – 4:00 PM</span></li>
                   <li className="flex justify-between"><span className="font-semibold uppercase tracking-wider text-xs text-yellow-400">Sunday</span> <span className="font-medium text-sm text-gray-500">Closed</span></li>
                 </ul>
               </div>
             </div>

           </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 mt-12 bg-gray-200 w-full relative">
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
          <p className="font-bold uppercase tracking-wider text-gray-500 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">Google Maps Integration</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
