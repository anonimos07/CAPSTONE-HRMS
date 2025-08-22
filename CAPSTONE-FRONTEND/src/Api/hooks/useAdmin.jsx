import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminLogin,
  createHR,
  createEmployee,
  testAdmin,
} from '../admin';

// Mutation hooks
export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useCreateHR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createHR,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useTestAdmin = () => {
  return useMutation({
    mutationFn: testAdmin,
  });
};
