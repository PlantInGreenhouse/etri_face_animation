/**
 * Aniface - Animate 3D avatars with real-time facial tracking
 * @module aniface
 */
// Main exports
export { Aniface } from './Aniface.js';
// Core exports (for advanced usage)
export { FacialLandmarkManager } from './core/FacialLandmarkManager.js';
export { AvatarRenderer } from './core/AvatarRenderer.js';
export { Avatar } from './core/Avatar.js';
// Utility exports
export { retargetBlendshapes, dampenBlendshapes, filterBlendshapesByThreshold, mapBlendshapeNames, combineBlendshapes, DEFAULT_BLENDSHAPE_MULTIPLIERS, MEDIAPIPE_BLENDSHAPE_NAMES } from './utils/blendshapeRetargeting.js';
// Version
export const VERSION = '0.1.0';
//# sourceMappingURL=index.js.map