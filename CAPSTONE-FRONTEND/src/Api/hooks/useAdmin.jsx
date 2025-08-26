import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminLogin,
  createHR,
  createEmployee,
  testAdmin,
} from '../admin';

// Combined admin hook
export const useAdmin = () => {
  const queryClient = useQueryClient();
  
  const loginMutation = useMutation({
    mutationFn: adminLogin,
  });

  const createHRMutation = useMutation({
    mutationFn: createHR,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: testAdmin,
  });

  return {
    loginMutation,
    createHRMutation,
    createEmployeeMutation,
    testMutation
  };
};

// Individual hooks for backward compatibility
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
