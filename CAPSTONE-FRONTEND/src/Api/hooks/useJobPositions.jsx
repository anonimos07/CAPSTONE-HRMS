import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createJobPosition,
  getAllJobPositions,
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition,
} from '../jobPosition';

// Query hooks
export const useAllJobPositions = () => {
  return useQuery({
    queryKey: ['jobPositions'],
    queryFn: getAllJobPositions,
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
    refetchOnWindowFocus: true, 
    refetchOnMount: 'always', 
  });
};

export const useJobPositionById = (id) => {
  return useQuery({
    queryKey: ['jobPositions', id],
    queryFn: () => getJobPositionById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateJobPosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJobPosition,
    onSuccess: () => {
      // Invalidate and refetch job positions data
      queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
      queryClient.refetchQueries({ queryKey: ['jobPositions'] });
    },
  });
};

export const useUpdateJobPosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateJobPosition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
    },
  });
};

export const useDeleteJobPosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteJobPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPositions'] });
    },
  });
};
