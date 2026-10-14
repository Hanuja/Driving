import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Wallet, Calendar, User, Phone, Mail, BookOpen, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_COURSES = 'http://localhost/Driving/api/courses';
const API_BRANCHES = 'http://localhost/Driving/api/branches';
const API_CONTACT = 'http://localhost/Driving/api/contact-messages';

const Book = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course_id: '',
    branch_id: '',
    preferred_date: '',
    payment_method: 'card' // 'card' or 'cash'
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [courseRes, branchRes] = await Promise.all([
          axios.get(API_COURSES).catch(() => ({ data: { data: [] } })),
          axios.get(API_BRANCHES).catch(() => ({ data: { data: [] } }))
        ]);
        if (courseRes.data?.success) setCourses(courseRes.data.data.filter(c => c.status === 'Active'));
        if (branchRes.data?.success) setBranches(branchRes.data.data);
      } catch (error) {
        console.error("Error fetching form options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedCourse = courses.find(c => c.id == formData.course_id);
      const selectedBranch = branches.find(b => b.id == formData.branch_id);

      const messageBody = `
--- BOOKING REQUEST ---
Course: ${selectedCourse ? selectedCourse.name : 'N/A'}
Branch: ${selectedBranch ? selectedBranch.name : 'N/A'}
Preferred Date: ${formData.preferred_date}
Payment Method: ${formData.payment_method === 'cash' ? 'Pay at Branch (Cash)' : 'Online Payment (Card)'}
      `.trim();

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `New Booking Request - ${formData.name}`,
        message: messageBody
      };

      const response = await axios.post(API_CONTACT, payload);

      if (response.data.success) {
        setSuccess(true);
        toast.success("Booking request submitted successfully!");
      } else {
        toast.error("Failed to submit booking.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen text-black font-sans pb-24 flex items-center justify-center pt-32">
        <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl max-w-2xl w-full text-center mx-4 border border-gray-100">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4 text-[#111111]">Booking Confirmed!</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Thank you, {formData.name}. Your booking request has been successfully received. 
            Our team will contact you shortly to confirm your schedule and payment details.
          </p>
          <Link to="/" className="inline-block bg-[#111111] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F5C542] hover:text-[#111111] transition-all shadow-md">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Book A Lesson</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Book Your Lesson</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
            Fast, secure, and easy booking. Choose your course, pick a date, and select your preferred payment method.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-[#F5C542] mb-4" size={48} />
              <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Booking Options...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
              
              {/* 1. Personal Details */}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-gray-100 pb-4 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm mr-3">1</span>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-medium transition-all" placeholder="John Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-medium transition-all" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-medium transition-all" placeholder="+94 77 123 4567" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Course Details */}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-gray-100 pb-4 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm mr-3">2</span>
                  Course & Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Course *</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
                      <select name="course_id" required value={formData.course_id} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-bold text-gray-800 appearance-none transition-all cursor-pointer">
                        <option value="" disabled>-- Select a Training Course --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name} - Rs. {c.price}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Preferred Branch *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
                      <select name="branch_id" required value={formData.branch_id} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-bold text-gray-800 appearance-none transition-all cursor-pointer">
                        <option value="" disabled>-- Select Branch --</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Preferred Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="date" name="preferred_date" required value={formData.preferred_date} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 font-bold text-gray-800 transition-all cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-gray-100 pb-4 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm mr-3">3</span>
                  Payment Method
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Option */}
                  <label className={`relative flex items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.payment_method === 'card' ? 'border-[#F5C542] bg-[#FFF9E6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="radio" name="payment_method" value="card" checked={formData.payment_method === 'card'} onChange={handleChange} className="sr-only" />
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 mt-0.5 ${formData.payment_method === 'card' ? 'border-[#F5C542]' : 'border-gray-300'}`}>
                      {formData.payment_method === 'card' && <div className="w-3 h-3 rounded-full bg-[#F5C542]" />}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <CreditCard size={20} className={formData.payment_method === 'card' ? 'text-[#111111]' : 'text-gray-400'} />
                        <span className="ml-2 font-black uppercase tracking-wide text-[#111111]">Pay Online (Card)</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 font-medium">Secure online payment via Visa, Mastercard, or Debit Card.</p>
                      
                      {/* Fake Card Icons */}
                      <div className="flex gap-2 mt-4">
                        <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center"><span className="text-white text-[8px] font-bold italic">VISA</span></div>
                        <div className="w-10 h-6 bg-[#EB001B] rounded flex items-center justify-center relative overflow-hidden">
                          <div className="w-4 h-4 rounded-full bg-[#FF5F00] absolute right-1 mix-blend-screen opacity-80"></div>
                          <div className="w-4 h-4 rounded-full bg-yellow-400 absolute left-1"></div>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Cash Option */}
                  <label className={`relative flex items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.payment_method === 'cash' ? 'border-[#F5C542] bg-[#FFF9E6]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="radio" name="payment_method" value="cash" checked={formData.payment_method === 'cash'} onChange={handleChange} className="sr-only" />
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 mt-0.5 ${formData.payment_method === 'cash' ? 'border-[#F5C542]' : 'border-gray-300'}`}>
                      {formData.payment_method === 'cash' && <div className="w-3 h-3 rounded-full bg-[#F5C542]" />}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Wallet size={20} className={formData.payment_method === 'cash' ? 'text-[#111111]' : 'text-gray-400'} />
                        <span className="ml-2 font-black uppercase tracking-wide text-[#111111]">Pay At Branch</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 font-medium">Reserve your spot now and pay directly at the branch via cash or card in person.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#F5C542] text-[#111111] py-5 rounded-xl font-black uppercase tracking-widest hover:bg-[#111111] hover:text-[#F5C542] transition-all shadow-lg flex items-center justify-center text-lg disabled:opacity-70"
                >
                  {submitting ? (
                    <><Loader2 className="animate-spin mr-3" size={24} /> Processing...</>
                  ) : (
                    formData.payment_method === 'card' ? 'Proceed to Secure Payment' : 'Confirm Booking Request'
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4 font-medium uppercase tracking-wider">
                  By booking, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>

            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Book;
