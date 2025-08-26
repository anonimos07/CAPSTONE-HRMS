import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPosition,
  getAllPositions,
} from '../position';

// Combined positions hook
export const usePositions = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['positions'],
    queryFn: getAllPositions,
  });

  const createPositionMutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    createPositionMutation
  };
};

// Individual hooks for backward compatibility
export const useAllPositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: getAllPositions,
  });
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
};
