import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { capturePhoto, isCameraSupported } from '../utils/cameraCapture';

const CameraCapture = ({ onCapture, onCancel, isOpen }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = useCallback(async () => {
    if (!isCameraSupported()) {
      setError('Camera is not supported on this device');
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const base64Image = await capturePhoto();
      setCapturedImage(base64Image);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      // Don't reset captured image here - let parent component handle cleanup
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setError(null);
    onCancel();
  };

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Take Photo</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {capturedImage ? (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRetake}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Click to capture photo</p>
              </div>
            </div>
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>{isCapturing ? 'Capturing...' : 'Take Photo'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
