import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  Calendar,
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Mail
} from 'lucide-react';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* =====================================================
          HEADER & NAVIGATION
      ====================================================== */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md shadow-lg py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black tracking-tighter text-white flex items-center group"
          >
            DRIVE
            <span className="text-yellow-400 group-hover:text-white transition-colors duration-300">
              PRO
            </span>

            <span className="w-2 h-2 rounded-full bg-yellow-400 ml-1 group-hover:bg-white transition-colors duration-300"></span>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <nav className="hidden lg:flex items-center text-sm font-semibold uppercase tracking-wide text-white">

            <Link
              to="/"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              About Us
            </Link>

            <Link
              to="/courses"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Driving Courses
            </Link>

            <Link
              to="/vehicles"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Vehicle Categories
            </Link>

            <Link
              to="/pricing"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Pricing
            </Link>

            <Link
              to="/instructors"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Our Instructors
            </Link>

            <Link
              to="/gallery"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Gallery
            </Link>

            {/* ================= MORE DROPDOWN ================= */}
            <div className="relative group cursor-pointer flex items-center mx-3 hover:text-yellow-400 transition-colors duration-300">
              MORE

              <ChevronDown
                size={14}
                className="ml-1"
              />

              <div className="absolute top-full left-0 mt-4 w-48 bg-black border border-white/10 shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">

                <Link
                  to="/testimonials"
                  className="block px-4 py-2 text-white hover:bg-neutral-800 hover:text-yellow-400 transition-colors"
                >
                  Testimonials
                </Link>

                <Link
                  to="/faq"
                  className="block px-4 py-2 text-white hover:bg-neutral-800 hover:text-yellow-400 transition-colors"
                >
                  FAQ
                </Link>

                <Link
                  to="/contact"
                  className="block px-4 py-2 text-white hover:bg-neutral-800 hover:text-yellow-400 transition-colors"
                >
                  Contact Us
                </Link>

                <Link
                  to="/privacy"
                  className="block px-4 py-2 text-white hover:bg-neutral-800 hover:text-yellow-400 transition-colors"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/terms"
                  className="block px-4 py-2 text-white hover:bg-neutral-800 hover:text-yellow-400 transition-colors border-b border-white/10 mb-1 pb-3"
                >
                  Terms & Conditions
                </Link>

                <Link
                  to="/admin/login"
                  className="block px-4 py-2 text-gray-400 hover:bg-neutral-800 hover:text-yellow-400 transition-colors text-xs"
                >
                  Admin Login
                </Link>

                <Link
                  to="/admin/register"
                  className="block px-4 py-2 text-gray-400 hover:bg-neutral-800 hover:text-yellow-400 transition-colors text-xs"
                >
                  Admin Register
                </Link>

              </div>
            </div>

            {/* ================= CONTACT ================= */}
            <Link
              to="/contact"
              className="mx-3 hover:text-yellow-400 transition-colors duration-300"
            >
              Contact
            </Link>

          </nav>

          {/* =====================================================
              BOOK NOW BUTTON
              Added ml-8 for spacing after Contact
          ====================================================== */}
          <div className="hidden lg:flex items-center ml-8">
            <Link
              to="/book"
              className="bg-yellow-400 text-black px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-yellow-300 hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Book Now
            </Link>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>
      </header>

      {/* =====================================================
          MOBILE MENU OVERLAY
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col pt-24 px-6 pb-24 overflow-y-auto">

          <nav className="flex flex-col space-y-4 text-2xl font-black text-white uppercase tracking-wider">

            <Link
              to="/"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={closeMobileMenu}
            >
              About Us
            </Link>

            <Link
              to="/courses"
              onClick={closeMobileMenu}
            >
              Driving Courses
            </Link>

            <Link
              to="/vehicles"
              onClick={closeMobileMenu}
            >
              Vehicle Categories
            </Link>

            <Link
              to="/pricing"
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>

            <Link
              to="/instructors"
              onClick={closeMobileMenu}
            >
              Our Instructors
            </Link>

            <Link
              to="/gallery"
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>

            {/* ================= MORE ================= */}
            <div className="pt-4 border-t border-white/10 mt-4">

              <span className="text-gray-500 mb-4 block">
                MORE +
              </span>

              <div className="flex flex-col space-y-4 text-xl">

                <Link
                  to="/testimonials"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  Testimonials
                </Link>

                <Link
                  to="/faq"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  FAQ
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  Contact Us
                </Link>

                <Link
                  to="/privacy"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-yellow-400"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/terms"
                  onClick={closeMobileMenu}
                  className="text-gray-300 hover:text-yellow-400 border-b border-white/10 pb-4"
                >
                  Terms & Conditions
                </Link>

                <Link
                  to="/admin/login"
                  onClick={closeMobileMenu}
                  className="text-gray-400 hover:text-yellow-400 text-lg"
                >
                  Admin Login
                </Link>

                <Link
                  to="/admin/register"
                  onClick={closeMobileMenu}
                  className="text-gray-400 hover:text-yellow-400 text-lg"
                >
                  Admin Register
                </Link>

              </div>
            </div>

          </nav>

          {/* ================= MOBILE BOOK BUTTON ================= */}
          <div className="mt-12 flex space-x-4 justify-center">

            <Link
              to="/book"
              onClick={closeMobileMenu}
              className="w-full text-center bg-yellow-400 text-black px-6 py-4 font-black uppercase tracking-widest text-lg hover:bg-yellow-300 transition-colors"
            >
              Book A Lesson
            </Link>

          </div>

        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* =====================================================
          FLOATING ACTION BUTTONS - MOBILE ONLY
      ====================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 shadow-2xl z-40 flex">

        {/* CALL */}
        <a
          href="tel:+94771234567"
          className="flex-1 flex flex-col items-center justify-center py-3 text-white hover:bg-neutral-900 transition-colors"
        >
          <PhoneCall
            size={20}
            className="mb-1"
          />

          <span className="text-[10px] font-bold uppercase tracking-widest">
            Call
          </span>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/94771234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 text-white hover:bg-neutral-900 transition-colors"
        >
          <MessageCircle
            size={20}
            className="mb-1 text-green-500"
          />

          <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
            WhatsApp
          </span>
        </a>

        {/* BOOK */}
        <Link
          to="/book"
          className="flex-1 flex flex-col items-center justify-center py-3 bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
        >
          <Calendar
            size={20}
            className="mb-1"
          />

          <span className="text-[10px] font-bold uppercase tracking-widest">
            Book
          </span>
        </Link>

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* ================= BRAND ================= */}
            <div>

              <Link
                to="/"
                className="text-3xl font-black tracking-tighter text-white flex items-center mb-6"
              >
                DRIVE
                <span className="text-yellow-400">
                  PRO
                </span>

                <span className="w-2 h-2 rounded-full bg-yellow-400 ml-1"></span>
              </Link>

              <p className="text-gray-400 leading-relaxed font-medium mb-6">
                Premium driving education for Sri Lanka.
                We build confident, safe and responsible drivers
                for the road ahead.
              </p>

              {/* SOCIAL MEDIA */}
              <div className="flex space-x-4">

                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-neutral-800 transition-colors"
                >
                  <Facebook size={18} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-neutral-800 transition-colors"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-neutral-800 transition-colors"
                >
                  <Youtube size={18} />
                </a>

              </div>

            </div>

            {/* ================= QUICK LINKS ================= */}
            <div>

              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">
                Driving School
              </h4>

              <ul className="space-y-4">

                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/instructors"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Our Instructors
                  </Link>
                </li>

                <li>
                  <Link
                    to="/vehicles"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Training Vehicles
                  </Link>
                </li>

                <li>
                  <Link
                    to="/gallery"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Gallery
                  </Link>
                </li>

                <li>
                  <Link
                    to="/testimonials"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Student Reviews
                  </Link>
                </li>

              </ul>

            </div>

            {/* ================= COURSES ================= */}
            <div>

              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">
                Courses
              </h4>

              <ul className="space-y-4">

                <li>
                  <Link
                    to="/courses/beginner-manual"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Beginner Manual
                  </Link>
                </li>

                <li>
                  <Link
                    to="/courses/beginner-auto"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Beginner Automatic
                  </Link>
                </li>

                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    View Pricing
                  </Link>
                </li>

                <li>
                  <Link
                    to="/faq"
                    className="text-gray-400 font-medium hover:text-yellow-400 transition-colors"
                  >
                    Course FAQ
                  </Link>
                </li>

              </ul>

            </div>

            {/* ================= CONTACT ================= */}
            <div>

              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-white">
                Contact
              </h4>

              <ul className="space-y-4 text-gray-400 font-medium">

                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-yellow-400 shrink-0 mt-1"
                  />

                  Colombo 03, Sri Lanka
                </li>

                <li className="flex items-center">
                  <Phone
                    size={18}
                    className="mr-3 text-yellow-400 shrink-0"
                  />

                  +94 77 123 4567
                </li>

                <li className="flex items-center">
                  <Mail
                    size={18}
                    className="mr-3 text-yellow-400 shrink-0"
                  />

                  info@drivepro.lk
                </li>

              </ul>

            </div>

          </div>

          {/* ================= COPYRIGHT ================= */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium">

            <p>
              &copy; 2026 DrivePro Sri Lanka. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">

              <Link
                to="/privacy"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms & Conditions
              </Link>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default PublicLayout;