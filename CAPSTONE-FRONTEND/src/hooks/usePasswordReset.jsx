import { useMutation, useQuery } from '@tanstack/react-query';
import { forgotPassword, resetPassword, changePassword, validateResetToken } from '../Api/passwordReset';
import { toast } from 'sonner';

/**
 * Hook for forgot password functionality
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset link sent to your email');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });
};

/**
 * Hook for resetting password with token
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword, confirmPassword }) => 
      resetPassword(token, newPassword, confirmPassword),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
};

/**
 * Hook for changing password (authenticated users)
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) => 
      changePassword(currentPassword, newPassword, confirmPassword),
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
};

/**
 * Hook for validating reset token
 */
export const useValidateResetToken = (token) => {
  return useQuery({
    queryKey: ['validateResetToken', token],
    queryFn: () => validateResetToken(token),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
