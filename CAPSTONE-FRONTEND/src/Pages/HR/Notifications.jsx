import React, { useState } from 'react';
import Header from '../../components/Header';
import { useAllNotifications, useSendNotification } from '../../Api';
import { Bell, Send, Users, User, AlertCircle, CheckCircle, X } from 'lucide-react';

const Notifications = () => {
  const { data: notifications = [], isLoading } = useAllNotifications();
  const sendMutation = useSendNotification();
  
  const [showSendForm, setShowSendForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient: 'all', // 'all' or 'individual'
    userId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    
    const notificationData = {
      title: formData.title,
      message: formData.message,
      ...(formData.recipient === 'individual' && { userId: formData.userId })
    };

    sendMutation.mutate(notificationData, {
      onSuccess: () => {
        alert('Notification sent successfully!');
        setFormData({ title: '', message: '', recipient: 'all', userId: '' });
        setShowSendForm(false);
      },
      onError: (error) => {
        console.error('Error sending notification:', error);
        alert('Failed to send notification');
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'JOB_APPLICATION':
        return <User className="w-5 h-5 text-green-500" />;
      case 'SYSTEM':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="HR" />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">HR Notifications</h1>
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Notification
          </button>
        </div>

        {/* Send Notification Form */}
        {showSendForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Send New Notification</h2>
              <button
                onClick={() => setShowSendForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <select
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="individual">Individual User</option>
                </select>
              </div>
              
              {formData.recipient === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="number"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              All System Notifications
            </h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>User ID: {notification.userId}</span>
                            <span>Type: {notification.type}</span>
                            <span>{formatDate(notification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.read ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
