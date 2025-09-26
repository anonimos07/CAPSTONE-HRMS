import React, { useState } from 'react';
import { Bell, Check, Trash2, CheckCheck, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Header from '../../components/Header';
import { 
  useUserNotifications, 
  useUnreadNotifications,
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification 
} from '../../Api';

const Notifications = () => {
  const { data: allNotifications = [], isLoading } = useUserNotifications();
  const { data: unreadNotifications = [] } = useUnreadNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    notificationId: null,
    notificationTitle: ''
  });


  const totalItems = allNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = allNotifications.slice(startIndex, endIndex);


  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId, notificationTitle) => {
    setDeleteModal({
      isOpen: true,
      notificationId,
      notificationTitle
    });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteModal.notificationId, {
      onSuccess: () => {
       
        if (currentNotifications.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setDeleteModal({ isOpen: false, notificationId: null, notificationTitle: '' });
      }
    });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, notificationId: null, notificationTitle: '' });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return '📢';
      case 'JOB_APPLICATION': return '📋';
      case 'SYSTEM': return '⚙️';
      default: return '📬';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT': return 'border-blue-200 bg-blue-50';
      case 'JOB_APPLICATION': return 'border-green-200 bg-green-50';
      case 'SYSTEM': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };


  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="EMPLOYEE" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#8b1e3f]">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with company announcements and important messages
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {markAllAsReadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Marking...</span>
                </>
              ) : (
                <>
                  <CheckCheck size={20} />
                  <span>Mark All Read</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-[#8b1e3f]/10 rounded-full">
                <Bell className="h-6 w-6 text-[#8b1e3f]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-semibold text-gray-900">{allNotifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-semibold text-gray-900">{unreadNotifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {allNotifications.length - unreadNotifications.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading notifications...</div>
          ) : allNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No notifications yet</p>
              <p className="text-gray-500">You'll see company announcements and updates here</p>
            </div>
          ) : (
            <>
              {/* Pagination Info */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} notifications
                  </p>
                </div>
              )}

              {/* Notifications */}
              <div className="divide-y divide-gray-300">
                {currentNotifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`p-6 transition-colors ${
                      !notification.read 
                        ? 'bg-[#8b1e3f]/15 border-l-4 border-l-[#8b1e3f]' 
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                            !notification.read 
                              ? getNotificationColor(notification.type)
                              : 'border border-gray-200 bg-white text-gray-600'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8b1e3f]/10 text-[#8b1e3f]">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize">{notification.type.toLowerCase().replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.notificationId)}
                            disabled={markAsReadMutation.isPending}
                            className="p-2 text-[#8b1e3f] hover:bg-[#8b1e3f]/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.notificationId, notification.title)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </button>

                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                          <button
                            key={index}
                            onClick={() => typeof page === 'number' ? goToPage(page) : null}
                            disabled={typeof page !== 'number'}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              page === currentPage
                                ? 'bg-[#8b1e3f] text-white'
                                : typeof page === 'number'
                                ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                : 'text-gray-400 cursor-default'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-transparent-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-ping"></div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete notification
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notifications;