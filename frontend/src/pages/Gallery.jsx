import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost/Driving/api/gallery';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setItems(response.data.data.filter(item => item.status === 'active') || []);
        }
      } catch (err) {
        setError('Failed to load gallery images.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['ALL', ...new Set(items.map(item => item.category_name || 'UNCATEGORIZED'))];
  
  const filteredItems = activeTab === 'ALL' 
    ? items 
    : items.filter(item => (item.category_name || 'UNCATEGORIZED') === activeTab);

  const heights = ['h-64', 'h-80', 'h-96', 'h-72'];
  const getMasonryHeight = (index) => heights[index % heights.length];

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans pb-24">
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-black text-white border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Gallery</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6">Our Gallery</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Take a look at our instructors, training vehicles, students and driving sessions.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide justify-center gap-2 py-2">
            {categories.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-semibold uppercase tracking-wider text-xs whitespace-nowrap transition-colors rounded-lg ${activeTab === tab ? 'bg-black text-yellow-400' : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-black'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-yellow-500 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No images found in this category.</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={
                activeTab === 'ALL'
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={item.id} 
                  className={`bg-gray-200 rounded-xl relative group overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${
                    activeTab === 'ALL' ? 'break-inside-avoid ' + getMasonryHeight(index) : 'aspect-[4/3]'
                  }`}
                >
                   <img 
                     src={item.image_url} 
                     alt={item.title || 'Gallery Image'} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                     onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                   />
                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/70 transition-colors duration-500"></div>
                   
                   <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-end h-full">
                     <p className="text-yellow-400 font-bold uppercase tracking-wider text-[10px] mb-1">{item.category_name || 'UNCATEGORIZED'}</p>
                     <h3 className="text-white font-black text-lg leading-tight mb-2 truncate">{item.title || 'Untitled Image'}</h3>
                     {item.description && (
                       <p className="text-gray-300 text-xs line-clamp-2 mb-3">{item.description}</p>
                     )}
                     <p className="text-white text-xs font-semibold uppercase tracking-wider flex items-center mt-auto">
                       View Image <ChevronRight size={14} className="ml-1" />
                     </p>
                   </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
};

export default Gallery;
