import React from 'react';

const Attendance = () => {
  const attendanceData = [
    { date: '2023-06-01', timeIn: '08:45 AM', timeOut: '05:30 PM', status: 'Present' },
    { date: '2023-06-02', timeIn: '09:00 AM', timeOut: '05:45 PM', status: 'Present' },
    { date: '2023-06-03', timeIn: '08:30 AM', timeOut: '05:15 PM', status: 'Present' },
    { date: '2023-06-04', timeIn: '-', timeOut: '-', status: 'Weekend' },
    { date: '2023-06-05', timeIn: '10:15 AM', timeOut: '06:00 PM', status: 'Late' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Attendance Records</h2>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceData.map((record, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.timeIn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.timeOut}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    record.status === 'Present' ? 'bg-green-100 text-green-800' :
                    record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;