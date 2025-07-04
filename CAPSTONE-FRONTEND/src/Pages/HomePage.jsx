import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiClock, 
  FiCalendar, 
  FiBriefcase,
  FiCheckCircle,
  FiBarChart2,
  FiFileText,
  FiMail,
  FiLock,
  FiArrowRight
} from 'react-icons/fi';

const Homepage = () => {
  const featuresRef = useRef(null);
  const signupRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <FiBriefcase className="w-6 h-6 text-blue-600" />,
      title: "Job Applications",
      description: "Streamline hiring with our applicant tracking system."
    },
    {
      icon: <FiUsers className="w-6 h-6 text-blue-600" />,
      title: "Attendance",
      description: "Real-time tracking of employee attendance."
    },
    {
      icon: <FiClock className="w-6 h-6 text-blue-600" />,
      title: "Time Tracking",
      description: "Simple clock in/out with mobile and web access."
    },
    {
      icon: <FiCalendar className="w-6 h-6 text-blue-600" />,
      title: "Leave Management",
      description: "Automated leave requests and approvals."
    }
  ];

  const businessBenefits = [
    "Complete HR management suite",
    "Employee self-service portal",
    "Advanced reporting and analytics"
  ];

  const employeeBenefits = [
    "Easy time tracking",
    "Simple leave requests",
    "Access to HR documents"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-800">HRMS</span>
          </div>
          <nav className="flex space-x-6">
            <button 
              onClick={() => scrollTo(featuresRef)} 
              className="flex items-center text-blue-800 hover:text-blue-600 font-medium"
            >
              <FiBarChart2 className="mr-2" /> Features
            </button>
            <Link 
              to="/login" 
              className="flex items-center text-blue-800 hover:text-blue-600 font-medium"
            >
              <FiLock className="mr-2" /> Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-28 px-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full mb-4">
            <FiCheckCircle className="mr-2" /> I Rated HR Software 2024
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
            Modern HR Management <span className="text-blue-600">Simplified</span>
          </h1>
          <p className="text-xl text-blue-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses transforming their HR operations with our all-in-one platform
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => scrollTo(signupRef)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Button>
            <Button 
              onClick={() => scrollTo(featuresRef)} 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Complete HR Management Solution
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-blue-100 hover:border-blue-200">
              <CardHeader>
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-blue-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Signup Section */}
      <section ref={signupRef} className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Choose the plan that works best for your organization
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700 flex items-center">
                <FiBriefcase className="mr-2" /> For Businesses
              </h3>
              <ul className="space-y-4 text-blue-800">
                {businessBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                Start Free Trial
              </Button>
            </div>
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700 flex items-center">
                <FiUsers className="mr-2" /> For Employees
              </h3>
              <ul className="space-y-4 text-blue-800">
                {employeeBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 py-6 text-lg">
                Employee Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-700 p-2 rounded-lg">
                <FiBriefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">HRMS</h3>
            </div>
            <p className="text-blue-200">
              The complete HR solution for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <FiFileText className="mr-2" /> Product
            </h4>
            <ul className="space-y-2 text-blue-200">
              {['Features', 'Pricing', 'Integrations'].map((item, index) => (
                <li key={index} className="hover:text-white transition-colors">
                  <Link to="#" className="flex items-center">
                    <FiArrowRight className="mr-2 text-sm" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <FiBriefcase className="mr-2" /> Company
            </h4>
            <ul className="space-y-2 text-blue-200">
              {['About Us', 'Careers', 'Contact'].map((item, index) => (
                <li key={index} className="hover:text-white transition-colors">
                  <Link to="#" className="flex items-center">
                    <FiArrowRight className="mr-2 text-sm" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <FiMail className="mr-2" /> Newsletter
            </h4>
            <p className="text-blue-200 mb-4">
              Subscribe to our newsletter for updates
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md">
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-blue-700 text-center text-blue-300">
          © 2024 HRMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;