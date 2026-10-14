import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Car,
  Calendar,
  UserCheck,
  TrendingUp,
  MapPin,
  CheckCircle,
  Phone,
  MessageCircle,
  Clock,
} from "lucide-react";
import CarImage from "../assets/car.png";

const Home = () => {
  const [data] = useState({
    stats: [
      {
        key: "students",
        value: "5,000+",
        label: "STUDENTS",
      },
      {
        key: "pass_rate",
        value: "95%",
        label: "PASS RATE",
      },
      {
        key: "experience",
        value: "10+",
        label: "YEARS EXPERIENCE",
      },
      {
        key: "instructors",
        value: "15+",
        label: "INSTRUCTORS",
      },
    ],

    courses: [
      {
        id: 1,
        title: "BEGINNER",
        desc: "Complete beginner training with professional instructor support.",
        price: "LKR 12,500",
        lessons: 5,
        duration: "1 Week",
        type: "Manual / Auto",
        image:
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        title: "MANUAL",
        desc: "Clutch control, gears, hill starts and real-world road driving.",
        price: "LKR 25,000",
        lessons: 10,
        duration: "3 Weeks",
        type: "Manual",
        image:
          "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 3,
        title: "AUTOMATIC",
        desc: "Smooth automatic vehicle training for confident learners.",
        price: "LKR 22,000",
        lessons: 8,
        duration: "2 Weeks",
        type: "Automatic",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 4,
        title: "DEFENSIVE",
        desc: "Advanced hazard awareness and safer road-driving techniques.",
        price: "LKR 15,000",
        lessons: 2,
        duration: "2 Days",
        type: "Both",
        image:
          "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 5,
        title: "REFRESHER",
        desc: "Rebuild your confidence after a long break from driving.",
        price: "LKR 12,000",
        lessons: 5,
        duration: "1 Week",
        type: "Manual / Auto",
        image:
          "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 6,
        title: "INTENSIVE",
        desc: "Accelerated training for learners preparing for their driving test.",
        price: "LKR 35,000",
        lessons: 15,
        duration: "1 Month",
        type: "Manual / Auto",
        image:
          "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-yellow-400 selection:text-black">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative flex min-h-[650px] items-center overflow-hidden bg-[#07090D] lg:min-h-[720px]">

        {/* Background */}
        <div className="absolute inset-0 z-0">

          <div className="absolute inset-0 bg-gradient-to-br from-[#090A0C] via-[#07090D] to-[#12141A]" />

          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "100px 100%",
            }}
          />

          <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[#FFC400]/5 blur-[120px]" />

        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[45%_55%]">

            {/* =====================================================
                LEFT SIDE
            ====================================================== */}
            <div className="relative z-20 flex flex-col items-start pt-10 lg:pt-0">

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="w-full"
              >

                <div className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-wider text-gray-300 backdrop-blur-sm">
                  PROFESSIONAL DRIVING SCHOOL
                </div>

                <h1 className="mb-6 text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[84px]">

                  LEARN TO DRIVE.
                  <br />

                  DRIVE WITH
                  <br />

                  <span className="text-yellow-400">
                    CONFIDENCE.
                  </span>

                </h1>

                <p className="mb-8 max-w-md text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
                  Master the road with expert instructors, modern training
                  vehicles, and practical driving lessons designed for
                  confident drivers.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">

                  {/* BOOK BUTTON */}
                  <Link
                    to="/book"
                    className="inline-flex items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-400 px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(250,204,21,0.8)]"
                  >
                    BOOK YOUR LESSON
                  </Link>

                  {/* CONTACT BUTTON */}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    CONTACT US
                  </Link>

                </div>

              </motion.div>

            </div>


            {/* =====================================================
                RIGHT SIDE - CAR
            ====================================================== */}
            <div className="relative z-10 flex h-[350px] w-full justify-center sm:h-[450px] lg:h-[550px] lg:justify-end">

              <motion.div
                initial={{
                  opacity: 0,
                  x: 100,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.2,
                }}
                className="relative flex h-full w-full items-center justify-center lg:translate-x-8"
              >

                {/* Yellow Glow */}
                <div className="absolute left-1/2 top-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC400]/15 blur-[80px]" />

                {/* Floating Car */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 h-full w-full"
                >

                  <img
                    src={CarImage}
                    alt="Premium Yellow Training Car"
                    className="h-full w-full object-contain object-center lg:object-right"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                </motion.div>

              </motion.div>

            </div>

          </div>

        </div>


        {/* =========================================================
            NORMAL STRAIGHT WHITE LINE
            CURVE REMOVED
        ========================================================== */}
        <div className="absolute bottom-0 left-0 z-20 h-[5px] w-full bg-white" />

      </section>


      {/* =========================================================
          QUICK BOOKING
      ========================================================== */}
      <section className="relative z-30 mx-auto mb-24 mt-4 max-w-7xl px-4 sm:px-6 lg:mt-12 lg:px-8">

        <div className="rounded-3xl border-t-4 border-yellow-400 bg-white p-6 text-black shadow-2xl md:p-8">

          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">
                Start Your Journey
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">
                Check Availability
              </h2>

            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">

              <Clock className="h-4 w-4 text-yellow-500" />

              Flexible training schedules

            </div>

          </div>


          <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            />

            <select
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
            >

              <option value="">
                Select Course
              </option>

              <option value="beginner">
                Beginner
              </option>

              <option value="manual">
                Manual
              </option>

              <option value="automatic">
                Automatic
              </option>

              <option value="defensive">
                Defensive
              </option>

              <option value="refresher">
                Refresher
              </option>

            </select>

            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-black uppercase tracking-wide text-black transition-colors duration-300 hover:bg-yellow-300"
            >
              Check Now

              <ArrowRight className="ml-2 h-5 w-5" />

            </button>

          </form>

        </div>

      </section>


      {/* =========================================================
          WHY CHOOSE US
      ========================================================== */}
      <section className="bg-black py-16 md:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-14">

            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
              Why Drive With Us
            </p>

            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
              Why Choose Us?
            </h2>

            <div className="mt-4 h-1 w-16 rounded-full bg-yellow-400" />

          </div>


          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: <UserCheck className="h-8 w-8" />,
                title: "Experienced Instructors",
                desc: "Professional and patient instructors focused on building confidence.",
              },
              {
                icon: <Car className="h-8 w-8" />,
                title: "Modern Vehicles",
                desc: "Well-maintained training vehicles for different course types.",
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Flexible Schedule",
                desc: "Morning, afternoon and selected evening training sessions.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Safety First",
                desc: "Road safety is at the centre of every lesson we teach.",
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "High Pass Rate",
                desc: "Training focused on real-world driving and test preparation.",
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Local Experience",
                desc: "Practical experience on Sri Lankan roads and traffic.",
              },
            ].map((feature, index) => (

              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="group min-h-[220px] rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-sm transition-colors duration-300 hover:border-yellow-400"
              >

                <div className="mb-6 inline-flex text-yellow-400 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold uppercase tracking-wide text-white">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {feature.desc}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          CHOOSE YOUR TRAINING
      ========================================================== */}
      <section className="bg-gray-50 py-16 text-black md:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 text-center">

            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-yellow-600">
              Start Your Journey
            </p>

            <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl lg:text-5xl">
              Choose Your Training
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              Whether you're a beginner or looking to sharpen your skills,
              we have the right training path to help you become a safe,
              confident and responsible driver.
            </p>

            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-yellow-400" />

          </div>


          {/* Training Options */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* NEW DRIVERS */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl"
            >

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                <UserCheck className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                New Drivers
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Perfect for beginners who are learning to drive from the
                ground up with professional instructor guidance.
              </p>

              <Link
                to="/courses"
                className="mt-6 inline-flex items-center font-black uppercase tracking-wide text-black transition-colors hover:text-yellow-600"
              >
                Explore Training

                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

            </motion.div>


            {/* IMPROVE SKILLS */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl"
            >

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-yellow-400">
                <Car className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Improve Your Skills
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Already know the basics? Improve your control, parking,
                road awareness and everyday driving confidence.
              </p>

              <Link
                to="/courses"
                className="mt-6 inline-flex items-center font-black uppercase tracking-wide text-black transition-colors hover:text-yellow-600"
              >
                Improve Your Skills

                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

            </motion.div>


            {/* DRIVE WITH CONFIDENCE */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl"
            >

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                <Shield className="h-7 w-7" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Drive With Confidence
              </h3>

              <p className="mt-3 leading-relaxed text-gray-600">
                Build safer driving habits, improve hazard awareness and
                prepare yourself for real-world road situations.
              </p>

              <Link
                to="/courses"
                className="mt-6 inline-flex items-center font-black uppercase tracking-wide text-black transition-colors hover:text-yellow-600"
              >
                Start Training

                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

            </motion.div>

          </div>


          {/* VIEW COURSES CTA */}
          <div className="mt-10 text-center">

            <Link
              to="/courses"
              className="inline-flex items-center rounded-xl bg-black px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-800"
            >
              Explore All Training Programs

              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================================
          COURSE PREVIEW
      ========================================================== */}
      <section className="bg-white py-16 text-black md:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-yellow-600">
                Our Programs
              </p>

              <h2 className="text-3xl font-black uppercase tracking-tight md:text-4xl lg:text-5xl">
                Popular Courses
              </h2>

              <div className="mt-4 h-1 w-16 rounded-full bg-yellow-400" />

            </div>

            <Link
              to="/courses"
              className="inline-flex items-center font-black uppercase tracking-wide transition-colors hover:text-yellow-600"
            >
              View All Courses

              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

          </div>


          {/* Course Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {data.courses.slice(0, 3).map((course) => (

              <motion.div
                key={course.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-yellow-400 hover:shadow-2xl"
              >

                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">

                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
                    {course.type}
                  </div>

                </div>


                {/* Content */}
                <div className="p-6">

                  <h3 className="text-2xl font-black uppercase tracking-wide">
                    {course.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] leading-relaxed text-gray-600">
                    {course.desc}
                  </p>


                  <div className="mt-6 grid grid-cols-2 gap-4">

                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Lessons
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {course.lessons}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Duration
                      </p>

                      <p className="mt-1 text-lg font-black">
                        {course.duration}
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Price From
                      </p>

                      <p className="mt-1 text-2xl font-black">
                        {course.price}
                      </p>

                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center rounded-xl bg-black px-5 py-3 text-sm font-black uppercase text-white transition-colors hover:bg-neutral-800"
                    >
                      Details

                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          STATS
      ========================================================== */}
      <section className="border-y border-white/10 bg-black py-16 md:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">

            {data.stats.map((stat) => (

              <div key={stat.key}>

                <h3 className="text-4xl font-black text-yellow-400 md:text-5xl">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white md:text-sm">
                  {stat.label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          TRIAL LESSON
      ========================================================== */}
      <section className="bg-yellow-400 py-16 text-center text-black md:py-20 lg:py-24">

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-yellow-400">
            <CheckCircle className="h-7 w-7" />
          </div>

          <h2 className="text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Not Sure Where to Start?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-gray-800 md:text-xl">
            Book a trial lesson and experience our professional training
            before choosing a package.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            {/* TRIAL BOOKING */}
            <Link
              to="/trial-booking"
              className="flex items-center justify-center rounded-xl bg-black px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition-colors duration-300 hover:bg-neutral-800"
            >
              Book A Trial Lesson

              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>


            {/* CALL */}
            <a
              href="tel:+94771234567"
              className="flex items-center justify-center rounded-xl border-2 border-black px-7 py-4 text-sm font-black uppercase tracking-wide text-black transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>


            {/* WHATSAPP */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-xl border-2 border-black px-7 py-4 text-sm font-black uppercase tracking-wide text-black transition-colors duration-300 hover:bg-black hover:text-white"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;