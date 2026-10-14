import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';

const Pricing = () => {
  const [trans, setTrans] = useState('Manual');
  const [cat, setCat] = useState('Light Vehicle');

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* 1. Hero */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Transparent Pricing</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the package that fits your goals and budget. No hidden fees.
          </p>
        </div>
      </section>

      {/* 2. Toggles */}
      <section className="py-12 bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center gap-8">
           
           <div className="flex bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setTrans('Manual')} className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs transition-colors ${trans === 'Manual' ? 'bg-black text-yellow-400 shadow-md' : 'text-gray-500 hover:text-black'}`}>Manual</button>
             <button onClick={() => setTrans('Automatic')} className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs transition-colors ${trans === 'Automatic' ? 'bg-black text-yellow-400 shadow-md' : 'text-gray-500 hover:text-black'}`}>Automatic</button>
           </div>

           <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide">
             {['Light Vehicle', 'Motorcycle', 'Heavy Vehicle'].map(c => (
               <button key={c} onClick={() => setCat(c)} className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-xs whitespace-nowrap transition-colors ${cat === c ? 'bg-white text-black shadow-sm border border-gray-200' : 'text-gray-500 hover:text-black'}`}>{c}</button>
             ))}
           </div>

        </div>
      </section>

      {/* 3. Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <h3 className="font-bold text-xl uppercase tracking-wide text-black mb-2">Starter</h3>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-6">5 Lessons</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-black">LKR 12,500</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Basic Vehicle Control</li>
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Quiet Road Training</li>
                <li className="flex items-center text-gray-400 font-medium"><Check size={20} className="text-gray-300 mr-3 shrink-0" /> Parking Practice</li>
                <li className="flex items-center text-gray-400 font-medium"><Check size={20} className="text-gray-300 mr-3 shrink-0" /> Test Preparation</li>
              </ul>
              <button className="w-full border border-black text-black rounded-lg py-3 font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors">Select Starter</button>
            </div>

            {/* Standard (Popular) */}
            <div className="bg-white rounded-2xl p-8 border-2 border-yellow-400 shadow-xl relative md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full font-bold uppercase tracking-wider text-xs">Most Popular</div>
              <h3 className="font-bold text-xl uppercase tracking-wide text-black mb-2 mt-2">Standard</h3>
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-6">10 Lessons</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-black">LKR 25,000</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Basic Vehicle Control</li>
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Traffic Training</li>
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Parking Practice</li>
                <li className="flex items-center text-gray-700 font-medium"><Check size={20} className="text-yellow-500 mr-3 shrink-0" /> Test Preparation</li>
              </ul>
              <button className="w-full bg-yellow-400 text-black rounded-lg py-3 font-bold uppercase tracking-wide hover:bg-yellow-300 transition-colors">Select Standard</button>
            </div>

            {/* Premium */}
            <div className="bg-neutral-900 rounded-2xl p-8 border border-white/10 shadow-xl text-white">
              <h3 className="font-bold text-xl uppercase tracking-wide text-white mb-2">Premium</h3>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-6">20 Lessons</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">LKR 48,000</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-200 font-medium"><Check size={20} className="text-yellow-400 mr-3 shrink-0" /> All Standard Features</li>
                <li className="flex items-center text-gray-200 font-medium"><Check size={20} className="text-yellow-400 mr-3 shrink-0" /> Advanced Traffic</li>
                <li className="flex items-center text-gray-200 font-medium"><Check size={20} className="text-yellow-400 mr-3 shrink-0" /> Night Driving Practice</li>
                <li className="flex items-center text-gray-200 font-medium"><Check size={20} className="text-yellow-400 mr-3 shrink-0" /> Full Test Guarantee Prep</li>
              </ul>
              <button className="w-full bg-white text-black rounded-lg py-3 font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">Select Premium</button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
