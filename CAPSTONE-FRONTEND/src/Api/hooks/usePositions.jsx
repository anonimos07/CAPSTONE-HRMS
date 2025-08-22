import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPosition,
  getAllPositions,
} from '../position';

// Query hooks
export const useAllPositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: getAllPositions,
  });
};

// Mutation hooks
export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });
};
