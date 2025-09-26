import React from 'react';
import { useProfilePictureByUserId } from '../Api/hooks/useProfilePicture';
import { getProfilePictureFullUrl } from '../Api/profilePicture';

const UserProfilePicture = ({ userId, size = 'w-10 h-10', textSize = 'text-sm', username, isEnabled = true }) => {
  const { profilePicture, isLoading } = useProfilePictureByUserId(userId);

  if (isLoading) {
    return (
      <div className={`${size} rounded-full bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  const profilePictureUrl = getProfilePictureFullUrl(profilePicture);

  return (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center ${
      isEnabled ? 'bg-blue-100' : 'bg-gray-100'
    }`}>
      {profilePictureUrl && !profilePictureUrl.includes('base64,PHN2ZyB3aWR0aD0') ? (
        <img
          src={profilePictureUrl}
          alt={`${username}'s profile`}
          className="w-full h-full object-cover"
          onError={(e) => {
  
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span 
        className={`font-semibold ${textSize} ${
          isEnabled ? 'text-blue-600' : 'text-gray-500'
        } ${profilePictureUrl && !profilePictureUrl.includes('base64,PHN2ZyB3aWR0aD0') ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
      >
        {username ? username.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );
};

export default UserProfilePicture;
