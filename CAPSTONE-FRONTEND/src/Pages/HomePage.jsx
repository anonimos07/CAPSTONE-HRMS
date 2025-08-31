import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiClock, 
  FiCalendar, 
  FiBriefcase,
  FiCheckCircle,
  FiLock,
  FiBarChart2,
  FiArrowRight,
  FiFileText
} from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';

const Homepage = () => {
  const featuresRef = useRef(null);
  const signupRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiBriefcase className="w-6 h-6 text-[#8b1e3f]" />,
      title: "Job Applications",
      description: "Streamline hiring with our applicant tracking system."
    },
    {
      icon: <FiUsers className="w-6 h-6 text-[#8b1e3f]" />,
      title: "Attendance",
      description: "Real-time tracking of employee attendance."
    },
    {
      icon: <FiClock className="w-6 h-6 text-[#8b1e3f]" />,
      title: "Time Tracking",
      description: "Simple clock in/out with mobile and web access."
    },
    {
      icon: <FiCalendar className="w-6 h-6 text-[#8b1e3f]" />,
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

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRef = (refName) => {
    if (refName === 'features') scrollTo(featuresRef);
    if (refName === 'signup') scrollTo(signupRef);
  };

  return (
    <ParentLayout scrollToRef={scrollToRef}>
      <section className="py-28 px-4 text-center bg-gradient-to-br from-[#8b1e3f]/10 to-[#8b1e3f]/20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-[#8b1e3f]/10 text-[#8b1e3f] rounded-full mb-4">
            <FiCheckCircle className="mr-2" /> I Rated HR Software 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#8b1e3f] mb-6">
            Modern HR Management <span className="text-[#8b1e3f]">Simplified</span>
          </h1>
          <p className="text-xl text-[#8b1e3f] mb-8 max-w-2xl mx-auto">
            Join thousands of businesses transforming their HR operations with our all-in-one platform
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/hiring')}
              className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white px-8 py-6 text-lg flex items-center"
            >
              View Open Positions <FiArrowRight className="ml-2" />
            </Button>
            <Button 
              onClick={() => scrollToRef('features')} 
              variant="outline" 
              className="text-[#8b1e3f] border-[#8b1e3f]/50 hover:bg-[#8b1e3f]/20 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#8b1e3f] mb-4">
            Complete HR Management Solution
          </h2>
          <p className="text-lg text-[#8b1e3f] max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-[#8b1e3f]/10 hover:border-[#8b1e3f]/20">
              <CardHeader>
                <div className="bg-[#8b1e3f]/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-[#8b1e3f]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section ref={signupRef} className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#8b1e3f]/10 to-[#8b1e3f]/20 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8b1e3f] mb-4">
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-lg text-[#8b1e3f] max-w-2xl mx-auto">
              Choose the plan that works best for your organization
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#8b1e3f] flex items-center">
                <FiBriefcase className="mr-2" /> For Businesses
              </h3>
              <ul className="space-y-4 text-[#8b1e3f]">
                {businessBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-[#8b1e3f] mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white py-6 text-lg">
                Start Free Trial
              </Button>
            </div>
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#8b1e3f] flex items-center">
                <FiUsers className="mr-2" /> For Employees
              </h3>
              <ul className="space-y-4 text-[#8b1e3f]">
                {employeeBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="text-[#8b1e3f] mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full text-[#8b1e3f] border-[#8b1e3f] hover:bg-[#8b1e3f]/20 py-6 text-lg"
                onClick={() => navigate('/login')}
              >
                Employee Portal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </ParentLayout>
  );
};

export default Homepage;