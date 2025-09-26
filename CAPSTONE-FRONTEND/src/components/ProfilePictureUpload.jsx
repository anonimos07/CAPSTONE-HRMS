import React, { useRef, useState } from 'react';
import { Camera, User, RotateCcw } from 'lucide-react';
import { useProfilePicture } from '../Api/hooks/useProfilePicture';
import { getProfilePictureFullUrl } from '../Api/profilePicture';

const ProfilePictureUpload = ({ size = 'large' }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const {
    profilePicture,
    isLoading,
    error,
    uploadProfilePicture,
    resetProfilePicture,
    isUploading,
    isResetting,
    uploadError,
    resetError
  } = useProfilePicture();

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
   
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

  
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }


      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

   
      uploadProfilePicture(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setPreviewUrl(null);
    resetProfilePicture();
  };

  const getCurrentImageUrl = () => {

    
    if (previewUrl) return previewUrl;
    if (profilePicture?.profilePictureUrl) {
      return getProfilePictureFullUrl(profilePicture.profilePictureUrl);
    }
    return getProfilePictureFullUrl(null);
  };


  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100`}>
        <img
          src={getProfilePictureFullUrl(null)}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Picture Display */}
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <img
            src={getCurrentImageUrl()}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = getProfilePictureFullUrl(null);
            }}
          />
        )}
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
             onClick={handleUploadClick}>
          <Camera className="text-white" size={iconSizes[size]} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#8b1e3f]/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Camera size={16} />
          <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
        </button>
        
      
      </div>

   
      {uploadError && (
        <div className="text-red-600 text-sm text-center">
          Error uploading: {uploadError.response?.data?.message || uploadError.message}
        </div>
      )}
      
      {resetError && (
        <div className="text-red-600 text-sm text-center">
          Error resetting: {resetError.response?.data?.message || resetError.message}
        </div>
      )}

    
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
 
     
    </div>
  );
};

export default ProfilePictureUpload;
