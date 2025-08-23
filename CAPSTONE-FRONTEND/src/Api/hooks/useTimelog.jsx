import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllTimelogsForHR,
  downloadTimelogsCSV,
  getTimelogById,
  adjustTimelog,
  deleteTimelog,
  getUsersClockedIn,
  getUsersOnBreak,
  getIncompleteTimelogs
} from '../timelog';

// Query hooks for HR timelog management
export const useAllTimelogsForHR = (search, startDate, endDate) => {
  return useQuery({
    queryKey: ['timelogs', 'hr', search, startDate, endDate],
    queryFn: () => getAllTimelogsForHR(search, startDate, endDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTimelogById = (timelogId) => {
  return useQuery({
    queryKey: ['timelog', timelogId],
    queryFn: () => getTimelogById(timelogId),
    enabled: !!timelogId,
  });
};

export const useUsersClockedIn = () => {
  return useQuery({
    queryKey: ['users', 'clocked-in'],
    queryFn: getUsersClockedIn,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useUsersOnBreak = () => {
  return useQuery({
    queryKey: ['users', 'on-break'],
    queryFn: getUsersOnBreak,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useIncompleteTimelogs = () => {
  return useQuery({
    queryKey: ['timelogs', 'incomplete'],
    queryFn: getIncompleteTimelogs,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Mutation hooks
export const useAdjustTimelog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adjustTimelog,
    onSuccess: () => {
      // Invalidate and refetch all timelog-related data including employee views
      queryClient.invalidateQueries({ queryKey: ['timelogs'] });
      queryClient.invalidateQueries({ queryKey: ['timelog'] });
      // Use predicate to invalidate all monthly-timelogs queries regardless of parameters
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'today-timelog' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'timelog-status' 
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteTimelog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTimelog,
    onSuccess: () => {
      // Invalidate and refetch all timelog-related data including employee views
      queryClient.invalidateQueries({ queryKey: ['timelogs'] });
      queryClient.invalidateQueries({ queryKey: ['timelog'] });
      // Use predicate to invalidate all monthly-timelogs queries regardless of parameters
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'today-timelog' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'timelog-status' 
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// CSV download hook
export const useDownloadTimelogsCSV = () => {
  return useMutation({
    mutationFn: ({ search, startDate, endDate }) => downloadTimelogsCSV(search, startDate, endDate),
    onSuccess: (data) => {
      // Create blob and download
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timelogs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
