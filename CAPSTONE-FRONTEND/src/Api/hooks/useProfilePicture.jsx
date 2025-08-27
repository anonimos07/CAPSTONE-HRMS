import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadProfilePicture, getProfilePicture, resetProfilePicture } from '../profilePicture';

export const useProfilePicture = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  // Query to get current profile picture
  const profilePictureQuery = useQuery({
    queryKey: ['profilePicture'],
    queryFn: getProfilePicture,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run query if user is authenticated
    retry: false, // Don't retry on authentication errors
  });

  // Mutation to upload profile picture
  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profilePicture'] });
    },
    onError: (error) => {
      console.error('Error uploading profile picture:', error);
    }
  });

  // Mutation to reset profile picture
  const resetMutation = useMutation({
    mutationFn: resetProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profilePicture'] });
    },
    onError: (error) => {
      console.error('Error resetting profile picture:', error);
    }
  });

  return {
    profilePicture: profilePictureQuery.data,
    isLoading: profilePictureQuery.isLoading,
    error: profilePictureQuery.error,
    uploadProfilePicture: uploadMutation.mutate,
    resetProfilePicture: resetMutation.mutate,
    isUploading: uploadMutation.isPending,
    isResetting: resetMutation.isPending,
    uploadError: uploadMutation.error,
    resetError: resetMutation.error
  };
};
