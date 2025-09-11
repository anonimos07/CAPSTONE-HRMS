import React from 'react';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
import { useLeaveBalance } from '../Api/hooks/useLeaveRequests';

const LeaveBalanceCard = ({ employeeId }) => {
  const { data: leaveBalances = [], isLoading } = useLeaveBalance();

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case 'ANNUAL': return '🏖️';
      case 'SICK': return '🏥';
      case 'PERSONAL': return '👤';
      case 'EMERGENCY': return '🚨';
      case 'MATERNITY': return '👶';
      case 'PATERNITY': return '👨‍👶';
      case 'BEREAVEMENT': return '🕊️';
      default: return '📅';
    }
  };

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case 'ANNUAL': return 'Annual';
      case 'SICK': return 'Sick';
      case 'PERSONAL': return 'Personal';
      case 'EMERGENCY': return 'Emergency';
      case 'MATERNITY': return 'Maternity';
      case 'PATERNITY': return 'Paternity';
      case 'BEREAVEMENT': return 'Bereavement';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-[#8b1e3f]/10">
        <div className="flex items-center gap-2 mb-4">
          <FiClock className="w-5 h-5 text-[#8b1e3f]" />
          <h3 className="text-lg font-semibold text-[#8b1e3f]">Leave Balance</h3>
        </div>
        <div className="text-center py-4 text-gray-500">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-[#8b1e3f]/10">
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="w-5 h-5 text-[#8b1e3f]" />
        <h3 className="text-lg font-semibold text-[#8b1e3f]">Leave Balance</h3>
      </div>

      {leaveBalances.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No leave balances available</div>
      ) : (
        <div className="space-y-3">
          {leaveBalances.map((balance) => (
            <div key={balance.id} className="flex items-center justify-between p-3 bg-[#8b1e3f]/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getLeaveTypeIcon(balance.leaveType)}</span>
                <div>
                  <div className="font-medium text-gray-800">
                    {getLeaveTypeLabel(balance.leaveType)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {balance.usedDays} used of {balance.totalDays}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#8b1e3f]">
                  {balance.remainingDays}
                </div>
                <div className="text-xs text-gray-500">days left</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveBalanceCard;
