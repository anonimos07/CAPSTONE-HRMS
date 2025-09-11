import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { capturePhoto, isCameraSupported } from '../utils/cameraCapture';

const CameraCapture = ({ onCapture, onCancel, isOpen }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
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

  const handleConfirm = async () => {
    if (capturedImage) {
      setIsConfirming(true);
      try {
        await onCapture(capturedImage);
        // Don't reset captured image here - let parent component handle cleanup
      } catch (err) {
        setError('Failed to confirm photo: ' + err.message);
      } finally {
        setIsConfirming(false);
      }
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
      setIsConfirming(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#8b1e3f]">Take Photo</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isConfirming}
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
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleRetake}
                disabled={isConfirming}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                {isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Confirm</span>
                  </>
                )}
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
              className="w-full px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#7a1a37] disabled:bg-[#8b1e3f]/60 transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            >
              {isCapturing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>Take Photo</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;