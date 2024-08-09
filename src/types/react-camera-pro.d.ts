// src/types/react-camera-pro.d.ts
declare module 'react-camera-pro' {
    import React from 'react';
  
    interface CameraProps {
      ref?: React.RefObject<any>;
      aspectRatio?: number;
      facingMode?: 'user' | 'environment';
      numberOfCamerasCallback?: (numCameras: number) => void;
    }
  
    export default class Camera extends React.Component<CameraProps> {}
  }
  