import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { disableUserAccount, enableUserAccount } from '../Api/userManagement';

const DisableAccountModal = ({ isOpen, onClose, user, onAccountStatusChanged }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleDisableAccount = async () => {
    setLoading(true);
    setError('');
    try {
      await disableUserAccount(user.userId);
      onAccountStatusChanged(user.userId, false);
      onClose();
    } catch (err) {
      setError('Failed to disable account. Please try again.');
      console.error('Error disabling account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableAccount = async () => {
    setLoading(true);
    setError('');
    try {
      await enableUserAccount(user.userId);
      onAccountStatusChanged(user.userId, true);
      onClose();
    } catch (err) {
      setError('Failed to enable account. Please try again.');
      console.error('Error enabling account:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = user.isEnabled === false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isDisabled ? 'Enable Account' : 'Disable Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className={`${isDisabled ? 'text-green-500' : 'text-red-500'}`} size={24} />
            <div>
              <h3 className="font-medium text-gray-900">
                {isDisabled ? 'Enable User Account' : 'Disable User Account'}
              </h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDisabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} mb-4`}>
            <p className={`text-sm ${isDisabled ? 'text-green-800' : 'text-red-800'}`}>
              {isDisabled ? (
                <>
                  <strong>Are you sure you want to enable this account?</strong>
                  <br />
                  The user will be able to log in and access the system again.
                </>
              ) : (
                <>
                  <strong>Are you sure you want to disable this account?</strong>
                  <br />
                  The user will be unable to log in and will see a "Your account has been disabled" message.
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600 mb-6">
            <strong>User Details:</strong>
            <br />
            Username: {user.username}
            <br />
            Role: {user.role}
            <br />
            Current Status: {isDisabled ? 'Disabled' : 'Enabled'}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={isDisabled ? handleEnableAccount : handleDisableAccount}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors ${
              isDisabled 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isDisabled ? 'Enabling...' : 'Disabling...'}
              </span>
            ) : (
              isDisabled ? 'Enable Account' : 'Disable Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableAccountModal;
