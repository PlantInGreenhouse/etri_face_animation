/**
 * Aniface - Animate 3D avatars with real-time facial tracking
 * @module aniface
 */
export { Aniface } from './Aniface.js';
export { FacialLandmarkManager } from './core/FacialLandmarkManager.js';
export { AvatarRenderer } from './core/AvatarRenderer.js';
export { Avatar } from './core/Avatar.js';
export { retargetBlendshapes, dampenBlendshapes, filterBlendshapesByThreshold, mapBlendshapeNames, combineBlendshapes, DEFAULT_BLENDSHAPE_MULTIPLIERS, MEDIAPIPE_BLENDSHAPE_NAMES } from './utils/blendshapeRetargeting.js';
export type { AnifaceConfig, AnifaceEvents, BlendshapeMultipliers, BlendshapeCategory } from './types.js';
export type { FacialLandmarkManagerConfig } from './core/FacialLandmarkManager.js';
export type { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
export type { AvatarRendererConfig, CameraConfig, LightingConfig } from './core/AvatarRenderer.js';
export type { ApplyMatrixOptions, LoadModelOptions } from './core/Avatar.js';
export type { MediaPipeBlendshapeName } from './utils/blendshapeRetargeting.js';
export declare const VERSION = "0.1.0";
//# sourceMappingURL=index.d.ts.map