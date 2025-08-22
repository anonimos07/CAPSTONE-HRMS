import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitJobApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../jobApplication';

// Query hooks
export const useAllApplications = () => {
  return useQuery({
    queryKey: ['applications', 'all'],
    queryFn: getAllApplications,
  });
};

export const useApplicationById = (id) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useSubmitJobApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, statusData }) => updateApplicationStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};
