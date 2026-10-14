import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      <section className="relative pt-32 pb-24 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Terms & Conditions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6">Terms & Conditions</h1>
          <p className="text-lg text-gray-300 font-medium max-w-2xl mx-auto">
            Please review the terms governing the use of our website and driving training services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-10">Last Updated: August 2026</p>
          
          <h3 className="text-2xl font-bold text-black mb-4">1. General Terms</h3>
          <p className="text-gray-700 leading-8 mb-10">By accessing this Website, accessible from drivepro.lk, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>

          <h3 className="text-2xl font-bold text-black mb-4">2. Course Enrollment & Booking</h3>
          <p className="text-gray-700 leading-8 mb-10">Course enrollment is subject to availability and completion of the required documentation. Lesson bookings must be confirmed in advance. The driving school reserves the right to reallocate an unconfirmed booking slot.</p>

          <h3 className="text-2xl font-bold text-black mb-4">3. Cancellation Policy</h3>
          <p className="text-gray-700 leading-8 mb-10">Cancellations must be made at least 24 hours in advance of the scheduled lesson. Failure to cancel within this timeframe may result in the lesson being deducted from your package or a cancellation fee being applied.</p>

          <h3 className="text-2xl font-bold text-black mb-4">4. Payment Terms</h3>
          <p className="text-gray-700 leading-8 mb-10">All course fees must be paid in accordance with the payment plan agreed upon at the time of enrollment. Certificates and test scheduling will not be processed if there are outstanding balances.</p>

          <h3 className="text-2xl font-bold text-black mb-4">5. Limitation of Liability</h3>
          <p className="text-gray-700 leading-8 mb-10">The driving school shall not be held liable for any damages that will arise with the use or inability to use the materials on this Website, even if the driving school or an authorized representative has been notified, orally or in writing, of the possibility of such damage.</p>

          <h3 className="text-2xl font-bold text-black mb-4">6. Driving Test</h3>
          <p className="text-gray-700 leading-8">Completion of a training course does not guarantee a passing result in the practical driving test. The final assessment is conducted by independent examiners from the Department of Motor Traffic.</p>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
