import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';
import { useAllJobPositions } from '../Api/hooks/useJobPositions';

export const HiringPage = () => {
  const { data: positions = [], isLoading } = useAllJobPositions();

  return (
    <ParentLayout>
      <div className="bg-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center text-purple-600 mb-6">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-purple-800 mb-8">Open Positions</h1>
          
          {isLoading ? (
            <div className="text-center py-8 text-purple-600">Loading positions...</div>
          ) : positions.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <FiBriefcase className="mx-auto h-12 w-12 text-purple-300 mb-4" />
                <h3 className="text-lg font-medium text-purple-800 mb-2">No Open Positions</h3>
                <p className="text-purple-600">Check back later for new opportunities!</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map(position => (
                <div key={position.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold text-purple-700 mb-2">{position.title}</h2>
                  <div className="flex items-center text-purple-600 mb-2">
                    <FiBriefcase className="mr-2" />
                    <span>{position.department || 'Various Departments'}</span>
                  </div>
                  <div className="flex items-center text-purple-600 mb-4">
                    <FiHome className="mr-2" />
                    <span>{position.location || 'Multiple Locations'}</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {position.description || `Join our team as a ${position.title}. We're looking for talented individuals to contribute to our growing company.`}
                  </p>
                  <Link to={`/apply/${position.id}`}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
};