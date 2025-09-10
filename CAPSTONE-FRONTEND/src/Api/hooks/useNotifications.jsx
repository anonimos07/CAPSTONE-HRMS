import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getAllNotifications,
  sendNotificationToAll,
  sendNotificationToUser,
} from '../notification';

// Query hooks
export const useUserNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'user'],
    queryFn: getUserNotifications,
  });
};

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: getUnreadNotifications,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread', 'count'],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useAllNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: getAllNotifications,
  });
};

// Mutation hooks
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate all notification-related queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Force refetch of unread count
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread', 'count'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate all notification-related queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Force refetch of unread count
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread', 'count'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate all notification-related queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Force refetch of unread count
      queryClient.refetchQueries({ queryKey: ['notifications', 'unread', 'count'] });
    },
  });
};

export const useSendNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, ...notificationData }) => {
      if (userId) {
        return sendNotificationToUser(userId, notificationData);
      } else {
        return sendNotificationToAll(notificationData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
