import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import VehicleCategories from './pages/VehicleCategories'
import Pricing from './pages/Pricing'
import Instructors from './pages/Instructors'
import Gallery from './pages/Gallery'
import Testimonials from './pages/Testimonials'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Book from './pages/Book' // Booking Page
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import StudentManagement from './admin/students/StudentManagement'
import BookingManagement from './admin/bookings/BookingManagement'
import CourseManagement from './admin/courses/CourseManagement'
import BranchManagement from './admin/branches/BranchManagement'
import VehicleManagement from './admin/vehicles/VehicleManagement'
import InstructorManagement from './admin/instructors/InstructorManagement'
import AdminLogin from './admin/AdminLogin'
import AdminRegister from './admin/AdminRegister'
import Placeholder from './admin/Placeholder'
import PricingManagement from './admin/pricing/PricingManagement'

import TestimonialManagement from './admin/testimonials/TestimonialManagement'
import ContactMessageManagement from './admin/contact/ContactMessageManagement'
import GalleryManagement from './admin/gallery/GalleryManagement'
import FaqManagement from './admin/faq/FaqManagement'
import ContentManagement from './admin/content/ContentManagement'
import ReportManagement from './admin/reports/ReportManagement'
import NotificationManagement from './admin/notifications/NotificationManagement'
import SettingsManagement from './admin/settings/SettingsManagement'

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetails />} />
          <Route path="vehicles" element={<VehicleCategories />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<Book />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Main Navigation Placeholders */}
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="instructors" element={<InstructorManagement />} />
          <Route path="branches" element={<BranchManagement />} />
          
          {/* Sales Placeholders */}
          <Route path="pricing" element={<PricingManagement />} />
          <Route path="trial-lessons" element={<Placeholder title="Trial Lessons" />} />
          
          {/* Content Placeholders */}
          <Route path="gallery" element={<GalleryManagement />} />
          <Route path="testimonials" element={<TestimonialManagement />} />
          <Route path="faq" element={<FaqManagement />} />
          <Route path="contact-messages" element={<ContactMessageManagement />} />
          
          {/* Sub-menu Catch-all Placeholders */}
          <Route path="careers/*" element={<Placeholder title="Careers Management" />} />
          <Route path="content/*" element={<ContentManagement />} />
          
          {/* Analytics & SEO Placeholders */}
          <Route path="reports/*" element={<ReportManagement />} />
          <Route path="marketing/*" element={<Placeholder title="Marketing" />} />
          <Route path="seo/*" element={<Placeholder title="SEO Settings" />} />
          
          {/* System Placeholders */}
          <Route path="notifications/*" element={<NotificationManagement />} />
          <Route path="settings/*" element={<SettingsManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
