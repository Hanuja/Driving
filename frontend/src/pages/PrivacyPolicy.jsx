import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      <section className="relative pt-32 pb-24 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-lg text-gray-300 font-medium max-w-2xl mx-auto">
            Your privacy and security are important to us.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-10">Last Updated: August 2026</p>
          
          <h3 className="text-2xl font-bold text-black mb-4">1. Information We Collect</h3>
          <p className="text-gray-700 leading-8 mb-10">We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, phone number.</p>

          <h3 className="text-2xl font-bold text-black mb-4">2. How We Use Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-10 text-gray-700 leading-8">
            <li>To process lesson bookings.</li>
            <li>To respond to customer service requests and support needs more efficiently.</li>
            <li>To manage customer requests and communicate updates.</li>
            <li>To improve our website and services based on feedback.</li>
          </ul>

          <h3 className="text-2xl font-bold text-black mb-4">3. Information Security</h3>
          <p className="text-gray-700 leading-8 mb-10">We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>

          <h3 className="text-2xl font-bold text-black mb-4">4. Cookies</h3>
          <p className="text-gray-700 leading-8 mb-10">Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.</p>

          <h3 className="text-2xl font-bold text-black mb-4">5. Contacting Us</h3>
          <p className="text-gray-700 leading-8">If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:</p>
          <p className="mt-4 font-bold text-black">info@drivepro.lk</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
