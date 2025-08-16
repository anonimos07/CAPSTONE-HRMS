// Camera capture utility functions
export const capturePhoto = async () => {
  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 }, 
        height: { ideal: 480 },
        facingMode: 'user' // Front camera for selfies
      } 
    });

    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;

    // Wait for video to load
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Stop all video tracks
    stream.getTracks().forEach(track => track.stop());

    // Convert to base64
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    
    return base64;
  } catch (error) {
    console.error('Error capturing photo:', error);
    throw new Error('Failed to capture photo. Please ensure camera permissions are granted.');
  }
};

export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
};

export const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};
