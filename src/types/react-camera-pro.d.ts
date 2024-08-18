declare module 'react-camera-pro' {
  import { RefObject } from 'react';

  export interface CameraProps {
    aspectRatio?: number | string;
    facingMode?: 'user' | 'environment';
    ref?: RefObject<any>;
    // Add other props as needed
  }

  const Camera: React.FC<CameraProps>;
  export default Camera;
}