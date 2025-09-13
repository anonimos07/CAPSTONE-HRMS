import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  uploadProfilePicture, 
  getProfilePicture, 
  resetProfilePicture,
  getProfilePictureByUserId,
  getAllUsersProfilePictures 
} from '../profilePicture';

export const useProfilePicture = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Query to get current profile picture
  const profilePictureQuery = useQuery({
    queryKey: ['profilePicture', userId],
    queryFn: getProfilePicture,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token && !!userId, // Only run query if user is authenticated
    retry: false, // Don't retry on authentication errors
  });

  // Mutation to upload profile picture
  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profilePicture', userId] });
    },
    onError: (error) => {
      console.error('Error uploading profile picture:', error);
    }
  });

  // Mutation to reset profile picture
  const resetMutation = useMutation({
    mutationFn: resetProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profilePicture', userId] });
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

// Hook for getting profile picture by user ID (for HR/Admin use)
export const useProfilePictureByUserId = (userId) => {
  const queryClient = useQueryClient();

  const profilePictureQuery = useQuery({
    queryKey: ['profilePicture', userId],
    queryFn: () => getProfilePictureByUserId(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId, // Only run query if userId is provided
    retry: false, // Don't retry on authentication errors
  });

  return {
    profilePicture: profilePictureQuery.data,
    isLoading: profilePictureQuery.isLoading,
    error: profilePictureQuery.error,
  };
};

// Hook for getting all users' profile pictures (for HR/Admin use in user management)
export const useAllUsersProfilePictures = () => {
  const profilePicturesQuery = useQuery({
    queryKey: ['allProfilePictures'],
    queryFn: getAllUsersProfilePictures,
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for bulk data
    retry: false, // Don't retry on authentication errors
  });

  // Debug logging
  console.log('Profile Pictures Query Data:', profilePicturesQuery.data);
  console.log('Profile Pictures Query Error:', profilePicturesQuery.error);
  console.log('Profile Pictures Query Loading:', profilePicturesQuery.isLoading);

  return {
    profilePictures: profilePicturesQuery.data?.profilePictures || {},
    isLoading: profilePicturesQuery.isLoading,
    error: profilePicturesQuery.error,
  };
};
