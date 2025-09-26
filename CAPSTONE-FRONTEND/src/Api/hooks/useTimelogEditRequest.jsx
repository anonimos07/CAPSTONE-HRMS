import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTimelogEditRequest,
  getAllHrStaff,
  getRequestsByEmployee,
  getRequestsByHr,
  getPendingRequestsByHr,
  approveTimelogEditRequest,
  rejectTimelogEditRequest,
  getTimelogEditRequestById
} from '../timelogEditRequest';

// Create timelog edit request
export const useCreateTimelogEditRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTimelogEditRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelog-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['employee-edit-requests'] });
    },
  });
};

// Get all HR staff
export const useHrStaff = () => {
  return useQuery({
    queryKey: ['hr-staff'],
    queryFn: getAllHrStaff,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get requests by employee
export const useEmployeeEditRequests = () => {
  return useQuery({
    queryKey: ['employee-edit-requests'],
    queryFn: getRequestsByEmployee,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get requests by HR
export const useHrEditRequests = () => {
  return useQuery({
    queryKey: ['hr-edit-requests'],
    queryFn: getRequestsByHr,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get pending requests by HR
export const usePendingHrEditRequests = () => {
  return useQuery({
    queryKey: ['pending-hr-edit-requests'],
    queryFn: getPendingRequestsByHr,
    staleTime: 30 * 1000, 
    refetchInterval: 60 * 1000, 
  });
};

// Approve timelog edit request
export const useApproveTimelogEditRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, hrResponse }) => approveTimelogEditRequest(requestId, hrResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pending-hr-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['employee-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Reject timelog edit request
export const useRejectTimelogEditRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, hrResponse }) => rejectTimelogEditRequest(requestId, hrResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['pending-hr-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['employee-edit-requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Get timelog edit request by ID
export const useTimelogEditRequestById = (requestId) => {
  return useQuery({
    queryKey: ['timelog-edit-request', requestId],
    queryFn: () => getTimelogEditRequestById(requestId),
    enabled: !!requestId,
  });
};
