import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHR, createEmployee } from '../hr';

export const useHr = () => {
  const queryClient = useQueryClient();

  const createHRMutation = useMutation({
    mutationFn: createHR,
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error creating HR:', error);
    }
  });

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
    }
  });

  return {
    createHRMutation,
    createEmployeeMutation
  };
};
