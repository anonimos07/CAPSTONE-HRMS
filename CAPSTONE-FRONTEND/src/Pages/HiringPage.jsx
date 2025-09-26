import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome, FiClock } from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';
import { useAllJobPositions } from '../Api/hooks/useJobPositions';
import { motion } from 'framer-motion';

export const HiringPage = () => {
  const { data: positions = [], isLoading } = useAllJobPositions();

  return (
    <ParentLayout>
      <div className="bg-gradient-to-br from-[#7a1b3a]/5 to-[#7a1b3a]/10 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="flex items-center text-[#7a1b3a] mb-8 hover:underline transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-[#7a1b3a] mb-12 text-center"
          >
            Open Positions
          </motion.h1>


          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#7a1b3a] text-lg"
            >
              Loading positions...
            </motion.div>
          ) : positions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white p-10 rounded-xl shadow-lg max-w-md mx-auto">
                <FiBriefcase className="mx-auto h-14 w-14 text-[#7a1b3a] mb-4" />
                <h3 className="text-xl font-semibold text-[#7a1b3a] mb-2">
                  No Open Positions
                </h3>
                <p className="text-gray-600">
                  Check back later for new opportunities!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {positions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all"
                >
              
                  <h2 className="text-2xl font-bold text-[#7a1b3a] mb-3 flex items-center">
                    <FiBriefcase className="mr-2 text-[#7a1b3a]/80" />
                    {position.title}
                  </h2>

       
                  <div className="flex items-center text-gray-600 mb-2">
                    <FiClock className="mr-2 text-[#7a1b3a]/70" />
                    <span>{position.department || 'Various Departments'}</span>
                  </div>

     
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiHome className="mr-2 text-[#7a1b3a]/70" />
                    <span>{position.location || 'Multiple Locations'}</span>
                  </div>
            
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {position.description ||
                      `Join our team as a ${position.title}. We're looking for talented individuals to contribute to our growing company.`}
                  </p>

              
                  <Link to={`/apply/${position.id}`}>
                    <Button className="w-full bg-[#7a1b3a] hover:bg-[#7a1b3a]/80 text-white py-6 text-lg font-medium flex items-center justify-center transition-all">
                      Apply Now
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
};
