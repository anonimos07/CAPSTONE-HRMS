import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Camera, Coffee, LogIn, LogOut, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import CameraCapture from './CameraCapture';
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getCurrentStatus,
  getTodayTimelog
} from '../Api/timelog';

const TimelogWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCamera, setShowCamera] = useState(false);
  const [cameraAction, setCameraAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch current status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['timelog-status'],
    queryFn: getCurrentStatus,
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  // Fetch today's timelog
  const { data: todayTimelog } = useQuery({
    queryKey: ['today-timelog'],
    queryFn: getTodayTimelog,
    staleTime: 0, // Always consider stale to catch HR adjustments immediately
    cacheTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: clockIn,
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch critical queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['timelog-status'] }),
        queryClient.invalidateQueries({ queryKey: ['today-timelog'] }),
        queryClient.refetchQueries({ queryKey: ['timelog-status'] }),
        queryClient.refetchQueries({ queryKey: ['today-timelog'] })
      ]);
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      
      toast.success('Successfully clocked in!');
      setShowCamera(false);
      setCameraAction(null);
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to clock in');
      setShowCamera(false);
      setCameraAction(null);
      setIsProcessing(false);
    },
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: clockOut,
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch critical queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['timelog-status'] }),
        queryClient.invalidateQueries({ queryKey: ['today-timelog'] }),
        queryClient.refetchQueries({ queryKey: ['timelog-status'] }),
        queryClient.refetchQueries({ queryKey: ['today-timelog'] })
      ]);
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      
      toast.success('Successfully clocked out!');
      setShowCamera(false);
      setCameraAction(null);
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to clock out');
      setShowCamera(false);
      setCameraAction(null);
      setIsProcessing(false);
    },
  });

  // Start break mutation
  const startBreakMutation = useMutation({
    mutationFn: startBreak,
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch critical queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['timelog-status'] }),
        queryClient.invalidateQueries({ queryKey: ['today-timelog'] }),
        queryClient.refetchQueries({ queryKey: ['timelog-status'] }),
        queryClient.refetchQueries({ queryKey: ['today-timelog'] })
      ]);
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      
      toast.success('Break started');
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to start break');
      setIsProcessing(false);
    },
  });

  // End break mutation
  const endBreakMutation = useMutation({
    mutationFn: endBreak,
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch critical queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['timelog-status'] }),
        queryClient.invalidateQueries({ queryKey: ['today-timelog'] }),
        queryClient.refetchQueries({ queryKey: ['timelog-status'] }),
        queryClient.refetchQueries({ queryKey: ['today-timelog'] })
      ]);
      
      // Invalidate other related queries
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'total-hours' 
      });
      
      toast.success('Break ended');
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to end break');
      setIsProcessing(false);
    },
  });

  const handleClockIn = () => {
    if (isProcessing || showCamera) return;
    setCameraAction('clockIn');
    setShowCamera(true);
  };

  const handleClockOut = () => {
    if (isProcessing || showCamera) return;
    setCameraAction('clockOut');
    setShowCamera(true);
  };

  const handleStartBreak = () => {
    if (isProcessing) return;
    startBreakMutation.mutate();
  };

  const handleEndBreak = () => {
    if (isProcessing) return;
    endBreakMutation.mutate();
  };

  const handlePhotoCapture = (photoBase64) => {
    return new Promise((resolve, reject) => {
      if (cameraAction === 'clockIn') {
        clockInMutation.mutate(photoBase64, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        });
      } else if (cameraAction === 'clockOut') {
        clockOutMutation.mutate(photoBase64, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        });
      } else {
        reject(new Error('Invalid camera action'));
      }
    });
  };

  const handleCameraCancel = () => {
    if (isProcessing) return;
    setShowCamera(false);
    setCameraAction(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CLOCKED_IN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ON_BREAK':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CLOCKED_OUT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CLOCKED_IN':
        return 'Working';
      case 'ON_BREAK':
        return 'On Break';
      case 'CLOCKED_OUT':
        return 'Not Working';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateWorkedHours = () => {
    if (!todayTimelog?.timeIn) return '0.0';
    
    const timeIn = new Date(todayTimelog.timeIn);
    const timeOut = todayTimelog.timeOut ? new Date(todayTimelog.timeOut) : new Date();
    const breakDuration = todayTimelog.breakDurationMinutes || 0;
    
    const totalMinutes = (timeOut - timeIn) / (1000 * 60) - breakDuration;
    return Math.max(0, totalMinutes / 60).toFixed(1);
  };

  const currentStatus = statusData?.status || 'CLOCKED_OUT';
  const isLoading = statusLoading || isProcessing || clockInMutation.isPending || clockOutMutation.isPending || startBreakMutation.isPending || endBreakMutation.isPending;

  // Debug logging
  // console.log('Debug - Status Data:', statusData);
  // console.log('Debug - Current Status:', currentStatus);
  // console.log('Debug - Today Timelog:', todayTimelog);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-[#8b1e3f]/10 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-[#8b1e3f]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Time Tracking</h2>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {getStatusText(currentStatus)}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Time In</p>
            <p className="font-semibold text-gray-900">
              {formatTime(todayTimelog?.timeIn)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Time Out</p>
            <p className="font-semibold text-gray-900">
              {formatTime(todayTimelog?.timeOut)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Hours Worked</p>
            <p className="font-semibold text-gray-900">
              {calculateWorkedHours()}h
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStatus === 'CLOCKED_OUT' && (
            <button
              onClick={handleClockIn}
              disabled={isLoading || showCamera}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <Camera className="h-4 w-4" />
              <span>{isProcessing ? 'Processing...' : 'Clock In'}</span>
            </button>
          )}

          {currentStatus === 'CLOCKED_IN' && (
            <div className="space-y-2">
              <button
                onClick={handleClockOut}
                disabled={isLoading || showCamera}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <Camera className="h-4 w-4" />
                <span>{isProcessing ? 'Processing...' : 'Clock Out'}</span>
              </button>
              <button
                onClick={handleStartBreak}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>{startBreakMutation.isPending ? 'Starting...' : 'Start Break'}</span>
              </button>
            </div>
          )}

          {currentStatus === 'ON_BREAK' && (
            <div className="space-y-2">
              <button
                onClick={handleClockOut}
                disabled={isLoading || showCamera}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <Camera className="h-4 w-4" />
                <span>{isProcessing ? 'Processing...' : 'Clock Out'}</span>
              </button>
              <button
                onClick={handleEndBreak}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{endBreakMutation.isPending ? 'Ending...' : 'End Break'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Break Info */}
        {todayTimelog?.breakDurationMinutes > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Coffee className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Total break time: {Math.floor(todayTimelog.breakDurationMinutes / 60)}h {todayTimelog.breakDurationMinutes % 60}m
              </span>
            </div>
          </div>
        )}
      </div>

      <CameraCapture
        isOpen={showCamera}
        onCapture={handlePhotoCapture}
        onCancel={handleCameraCancel}
      />
    </>
  );
};

export default TimelogWidget;
