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
    <div className="min-h-screen bg-[#7a1b3a]/5"> 
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#7a1b3a] shadow-lg border-b border-[#6b1832] transition-all duration-500">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TechStaffHub</span>
          </div>
          <nav className="flex space-x-6">
            <button 
              onClick={() => scrollToRef('features')} 
              className="flex items-center text-white/90 hover:text-white transition duration-300"
            >
              <FiBarChart2 className="mr-2" /> Features
            </button>
            <Link 
              to="/login" 
              className="flex items-center text-white/90 hover:text-white transition duration-300"
            >
              <FiLock className="mr-2" /> Login
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="transition-all duration-700 ease-in-out">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#7a1b3a] text-white py-12 px-4 transition-all duration-500">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">TechStaffHub</h3>
          </div>
          <p className="text-white/70 mb-6">
            The complete HR solution for modern businesses.
          </p>
          <div className="border-t border-white/20 pt-6 text-white/60">
            © 2025 TechStaffHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
