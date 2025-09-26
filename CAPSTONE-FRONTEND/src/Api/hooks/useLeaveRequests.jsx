import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  submitLeaveRequest,
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveBalance,
  getEmployeeLeaveRequests,
  getPendingRequestsCount,
  getLeaveRequestById
} from '../leaveRequest';

// Submit leave request hook
export const useSubmitLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLeaveRequest,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequestsCount'] });
    },
    onError: (error) => {
      console.error('Error submitting leave request:', error);
    }
  });
};

// Get pending leave requests for HR
export const usePendingLeaveRequests = () => {
  return useQuery({
    queryKey: ['pendingLeaveRequests'],
    queryFn: getPendingLeaveRequests,
    refetchInterval: 30000, 
    staleTime: 10000, 
  });
};


export const useApproveLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, approvalData }) => approveLeaveRequest(requestId, approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalance'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequestsCount'] });
    },
    onError: (error) => {
      console.error('Error approving leave request:', error);
    }
  });
};


export const useRejectLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, rejectionData }) => rejectLeaveRequest(requestId, rejectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequestsCount'] });
    },
    onError: (error) => {
      console.error('Error rejecting leave request:', error);
    }
  });
};


export const useLeaveBalance = () => {
  return useQuery({
    queryKey: ['leaveBalance'],
    queryFn: () => getLeaveBalance(),
    staleTime: 5 * 60 * 1000, // Consider data maybe 5 minutes
  });
};


export const useEmployeeLeaveRequests = () => {
  return useQuery({
    queryKey: ['leaveRequests'],
    queryFn: () => getEmployeeLeaveRequests(),
    staleTime: 5 * 60 * 1000, // Consider data maybe 5 minutes
  });
};

// Get pending requests count hook
export const usePendingRequestsCount = () => {
  return useQuery({
    queryKey: ['pendingRequestsCount'],
    queryFn: getPendingRequestsCount,
    refetchInterval: 30000, 
    staleTime: 10000, 
  });
};

// Get leave request by ID hook
export const useLeaveRequestById = (requestId) => {
  return useQuery({
    queryKey: ['leaveRequest', requestId],
    queryFn: () => getLeaveRequestById(requestId),
    enabled: !!requestId,
  });
};
