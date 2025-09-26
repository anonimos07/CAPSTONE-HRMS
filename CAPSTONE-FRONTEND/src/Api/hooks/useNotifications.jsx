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
  
  // console.log('DEBUG: useUserNotifications - userId from localStorage:', userId);
  
  return useQuery({
    queryKey: ['notifications', 'user', userId],
    queryFn: () => {
      // console.log('DEBUG: Calling getUserNotifications API');
      return getUserNotifications();
    },
    enabled: !!userId, 
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
    enabled: !!userId, 
  });
};

export const useUnreadNotificationCount = () => {
  const userId = localStorage.getItem('userId');
  
  return useQuery({
    queryKey: ['notifications', 'unread', 'count', userId],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, 
    enabled: !!userId,
  });
};

export const useAllNotifications = () => {
  const userId = localStorage.getItem('userId');
  
  return useQuery({
    queryKey: ['notifications', 'all', userId],
    queryFn: getAllNotifications,
    enabled: !!userId, 
  });
};

// Mutation hooks
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (data, notificationId) => {
      queryClient.setQueryData(['notifications', 'user', userId], (old) => {
        if (!old) return old;
        return old.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, read: true }
            : notification
        );
      });

 
      queryClient.setQueryData(['notifications', 'unread', userId], (old) => {
        if (!old) return old;
        return old.filter(notification => notification.notificationId !== notificationId);
      });

   
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

      queryClient.setQueryData(['notifications', 'user', userId], (old) => {
        if (!old) return old;
        return old.map(notification => ({ ...notification, read: true }));
      });


      queryClient.setQueryData(['notifications', 'unread', userId], []);


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
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};


export const useClearNotificationCache = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.removeQueries({ queryKey: ['notifications'] });
  };
};
