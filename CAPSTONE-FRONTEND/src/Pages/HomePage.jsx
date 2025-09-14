import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiClock, 
  FiCalendar, 
  FiBriefcase,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';
import { motion } from "framer-motion";

import jobImg from "@/assets/job.jpg";
import attendanceImg from "@/assets/attendance.jpg";
import timeImg from "@/assets/time.png";
import leaveImg from "@/assets/leave.png";
import whyImg from "@/assets/why.jpg";

const Homepage = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRef = (refName) => {
    if (refName === 'features') scrollTo(featuresRef);
  };

  return (
    <ParentLayout scrollToRef={scrollToRef}>
      
      {/* HERO */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-28 px-4 text-center bg-gradient-to-br from-[#7a1b3a]/10 to-[#7a1b3a]/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-[#7a1b3a]/10 text-[#7a1b3a] rounded-full mb-4">
            <FiCheckCircle className="mr-2" /> TechStaffHub HR Solution
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#7a1b3a] mb-6">
            Simplify HR with <span className="text-[#7a1b3a]">TechStaffHub</span>
          </h1>
          <p className="text-xl text-[#7a1b3a] mb-8 max-w-2xl mx-auto">
            All-in-One HR Solution for Growing Businesses
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/hiring')}
              className="bg-[#7a1b3a] hover:bg-[#7a1b3a]/70 text-white px-8 py-6 text-lg flex items-center"
            >
              View Open Positions <FiArrowRight className="ml-2" />
            </Button>
            <Button 
              onClick={() => scrollToRef('features')} 
              variant="outline" 
              className="text-[#7a1b3a] border-[#7a1b3a]/50 hover:bg-[#7a1b3a]/20 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </motion.section>

      {/* FEATURES (Vertical Alternating) */}
      <motion.section
        ref={featuresRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#7a1b3a] mb-4">
            Complete HR Management Solution
          </h2>
          <p className="text-lg text-[#7a1b3a] max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently
          </p>
        </div>

        <div className="space-y-20">
          {/* Job Applications */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src={jobImg} 
              alt="Job Applications" 
              className="rounded-xl shadow-md w-full h-64 object-cover bg-gray-100"
            />
            <div>
              <h3 className="text-2xl font-bold text-[#7a1b3a] mb-4">
                Job Applications
              </h3>
              <p className="text-lg text-gray-700 mb-3">
                Streamline hiring with our applicant tracking system. 
              </p>
              <p className="text-gray-600">
                From posting jobs to managing resumes, our system ensures 
                a smooth and professional recruitment process. Save time, 
                attract top talent, and make data-driven hiring decisions 
                with ease.
              </p>
            </div>
          </div>

          {/* Attendance Tracking */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-[#7a1b3a] mb-4">
                Attendance Tracking
              </h3>
              <p className="text-lg text-gray-700 mb-3">
                Real-time tracking of employee attendance.
              </p>
              <p className="text-gray-600">
                Monitor presence, late arrivals, and absences with 
                precision. Our system gives managers and HR teams 
                powerful insights, helping you maintain accountability 
                while supporting flexible work arrangements.
              </p>
            </div>
            <img 
              src={attendanceImg} 
              alt="Attendance Tracking" 
              className="rounded-xl shadow-md w-full h-64 object-cover bg-gray-100 order-1 md:order-2"
            />
          </div>

          {/* Time Tracking */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src={timeImg} 
              alt="Time Tracking" 
              className="rounded-xl shadow-md w-full h-64 object-cover bg-gray-100"
            />
            <div>
              <h3 className="text-2xl font-bold text-[#7a1b3a] mb-4">
                Time Tracking
              </h3>
              <p className="text-lg text-gray-700 mb-3">
                Simple clock in/out with mobile and web access.
              </p>
              <p className="text-gray-600">
                Employees can log their hours easily from anywhere, 
                ensuring accurate timesheets. Managers gain real-time 
                visibility into productivity, enabling better project 
                planning and payroll accuracy.
              </p>
            </div>
          </div>

          {/* Leave Management */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-[#7a1b3a] mb-4">
                Leave Management
              </h3>
              <p className="text-lg text-gray-700 mb-3">
                Automated leave requests and approvals.
              </p>
              <p className="text-gray-600">
                Empower employees to request time off in seconds while 
                managers approve with a single click. Our leave 
                management system tracks balances, ensures compliance, 
                and helps maintain a balanced workforce.
              </p>
            </div>
            <img 
              src={leaveImg} 
              alt="Leave Management" 
              className="rounded-xl shadow-md w-full h-64 object-cover bg-gray-100 order-1 md:order-2"
            />
          </div>
        </div>
      </motion.section>

      {/* WHY CHOOSE TECHSTAFFHUB */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-gradient-to-r from-[#7a1b3a]/10 to-[#7a1b3a]/20 rounded-2xl p-8 md:p-12 shadow-md">
          
          {/* IMAGE */}
          <img 
            src={whyImg} 
            alt="Why Choose TechStaffHub" 
            className="rounded-xl shadow-lg w-full h-80 object-cover bg-gray-100"
          />
          
          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-bold text-[#7a1b3a] mb-6">
              Why Choose TechStaffHub?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              TechStaffHub is built to simplify human resource management for both
              employees and administrators. Instead of juggling multiple tools, our
              platform brings everything into one clean, modern system.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              From handling job applications and tracking attendance to managing
              leave requests and work hours, TechStaffHub ensures that every
              process is smooth, transparent, and accessible anytime. This helps
              businesses stay efficient while giving employees the tools they need
              to succeed.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With an intuitive interface, real-time tracking, and automation
              features, TechStaffHub not only saves time but also empowers your
              workforce. It’s a smarter way to manage HR — simple, reliable, and
              built for modern teams.
            </p>
          </div>
        </div>
      </motion.section>
    </ParentLayout>
  );
};

export default Homepage;
