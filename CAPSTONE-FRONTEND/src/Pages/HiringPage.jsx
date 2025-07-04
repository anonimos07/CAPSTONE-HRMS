import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    description: "We're looking for an experienced React developer to join our team."
  },
  {
    id: 2,
    title: "HR Manager",
    department: "Human Resources",
    location: "New York",
    description: "Looking for an HR professional to manage our growing team."
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "San Francisco",
    description: "Join our design team to create beautiful user experiences."
  }
];

export const HiringPage = () => {
  return (
    <ParentLayout>
      <div className="bg-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center text-purple-600 mb-6">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-purple-800 mb-8">Open Positions</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-purple-700 mb-2">{job.title}</h2>
                <div className="flex items-center text-purple-600 mb-2">
                  <FiBriefcase className="mr-2" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center text-purple-600 mb-4">
                  <FiHome className="mr-2" />
                  <span>{job.location}</span>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <Link to={`/apply/${job.id}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Apply Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};