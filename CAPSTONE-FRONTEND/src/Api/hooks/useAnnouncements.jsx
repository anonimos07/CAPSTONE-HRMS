import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveAnnouncements,
  getAllAnnouncements,
  getUserAnnouncements,
  getAnnouncementsByPriority,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deactivateAnnouncement,
  deleteAnnouncement,
} from '../announcement';

// Query hooks
export const useActiveAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements', 'active'],
    queryFn: getActiveAnnouncements,
  });
};

export const useAllAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements', 'all'],
    queryFn: getAllAnnouncements,
  });
};

export const useUserAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements', 'user'],
    queryFn: getUserAnnouncements,
  });
};

export const useAnnouncementsByPriority = (priority) => {
  return useQuery({
    queryKey: ['announcements', 'priority', priority],
    queryFn: () => getAnnouncementsByPriority(priority),
    enabled: !!priority,
  });
};

export const useAnnouncementById = (id) => {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useDeactivateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deactivateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};
