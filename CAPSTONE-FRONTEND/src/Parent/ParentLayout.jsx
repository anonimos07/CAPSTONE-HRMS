import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiBarChart2, 
  FiLock,
  FiFileText,
  FiMail,
  FiArrowRight
} from 'react-icons/fi';

export const ParentLayout = ({ children, scrollToRef }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-800">TechStaffHub</span>
          </div>
          <nav className="flex space-x-6">
            <button 
              onClick={() => scrollToRef('features')} 
              className="flex items-center text-purple-800 hover:text-purple-600 font-medium"
            >
              <FiBarChart2 className="mr-2" /> Features
            </button>
            <Link 
              to="/login" 
              className="flex items-center text-purple-800 hover:text-purple-600 font-medium"
            >
              <FiLock className="mr-2" /> Login
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-purple-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-purple-700 p-2 rounded-lg">
                <FiBriefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">TechStaffHub</h3>
            </div>
            <p className="text-purple-200">
              The complete HR solution for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <FiFileText className="mr-2" /> Product
            </h4>
            <ul className="space-y-2 text-purple-200">
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
            <ul className="space-y-2 text-purple-200">
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
            <p className="text-purple-200 mb-4">
              Subscribe to our newsletter for updates
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
              />
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-md">
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-purple-700 text-center text-purple-300">
          © 2025 TechStaffHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};