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
  const userId = localStorage.getItem('userId');
  
  console.log('DEBUG: useUserNotifications - userId from localStorage:', userId);
  
  return useQuery({
    queryKey: ['notifications', 'user', userId],
    queryFn: () => {
      console.log('DEBUG: Calling getUserNotifications API');
      return getUserNotifications();
    },
    enabled: !!userId, // Only run query if userId exists
    onSuccess: (data) => {
      console.log('DEBUG: getUserNotifications success:', data);
    },
    onError: (error) => {
      console.log('DEBUG: getUserNotifications error:', error);
    }
  });
};

export const useUnreadNotifications = () => {
  const userId = localStorage.getItem('userId');
  
  return useQuery({
    queryKey: ['notifications', 'unread', userId],
    queryFn: getUnreadNotifications,
    enabled: !!userId, // Only run query if userId exists
  });
};

export const useUnreadNotificationCount = () => {
  const userId = localStorage.getItem('userId');
  
  return useQuery({
    queryKey: ['notifications', 'unread', 'count', userId],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!userId, // Only run query if userId exists
  });
};

export const useAllNotifications = () => {
  const userId = localStorage.getItem('userId');
  
  return useQuery({
    queryKey: ['notifications', 'all', userId],
    queryFn: getAllNotifications,
    enabled: !!userId, // Only run query if userId exists
  });
};

// Mutation hooks
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (data, notificationId) => {
      // Update user notifications cache
      queryClient.setQueryData(['notifications', 'user', userId], (old) => {
        if (!old) return old;
        return old.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, read: true }
            : notification
        );
      });

      // Update unread notifications cache
      queryClient.setQueryData(['notifications', 'unread', userId], (old) => {
        if (!old) return old;
        return old.filter(notification => notification.notificationId !== notificationId);
      });

      // Invalidate and refetch all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count', userId] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    }
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Update user notifications cache - mark all as read
      queryClient.setQueryData(['notifications', 'user', userId], (old) => {
        if (!old) return old;
        return old.map(notification => ({ ...notification, read: true }));
      });

      // Clear unread notifications cache
      queryClient.setQueryData(['notifications', 'unread', userId], []);

      // Invalidate and refetch all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count', userId] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    }
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate all notification-related queries for this specific user
      queryClient.invalidateQueries({ queryKey: ['notifications', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count', userId] });
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
      // Invalidate notifications for all users since we don't know who received them
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Utility function to clear notification cache when switching users
export const useClearNotificationCache = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.removeQueries({ queryKey: ['notifications'] });
  };
};
