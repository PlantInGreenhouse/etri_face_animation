/**
 * Blendshape Retargeting Utilities
 *
 * Provides functions to retarget and adjust blendshape values from MediaPipe
 * to work better with different 3D models.
 */
/**
 * Blendshape category from MediaPipe
 */
export interface BlendshapeCategory {
    categoryName: string;
    score: number;
}
/**
 * Map of blendshape names to multiplier values
 */
export type BlendshapeMultipliers = Record<string, number>;
/**
 * Default multipliers for common blendshapes
 * These values are tuned to make facial expressions more visible
 */
export declare const DEFAULT_BLENDSHAPE_MULTIPLIERS: BlendshapeMultipliers;
/**
 * Retarget blendshapes from MediaPipe to a format suitable for 3D models
 * Applies multipliers to adjust the intensity of certain expressions
 *
 * @param categories - Blendshape categories from MediaPipe FaceLandmarker
 * @param customMultipliers - Optional custom multipliers to override defaults
 * @returns Map of blendshape names to adjusted values (0-1 range)
 *
 * @example
 * ```typescript
 * const results = faceLandmarker.detectForVideo(video, timestamp)
 * if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
 *   const blendshapes = retargetBlendshapes(
 *     results.faceBlendshapes[0].categories,
 *     { eyeBlinkLeft: 1.5, eyeBlinkRight: 1.5 }
 *   )
 *   avatar.updateBlendshapes(blendshapes)
 * }
 * ```
 */
export declare function retargetBlendshapes(categories: BlendshapeCategory[], customMultipliers?: BlendshapeMultipliers): Map<string, number>;
/**
 * Apply dampening to blendshape values to smooth out jittery movements
 *
 * @param currentValues - Current blendshape values
 * @param newValues - New blendshape values from detection
 * @param dampeningFactor - Factor between 0-1 (0 = no smoothing, 1 = no change)
 * @returns Smoothed blendshape values
 *
 * @example
 * ```typescript
 * // Smooth the transition between frames
 * const smoothed = dampenBlendshapes(
 *   previousBlendshapes,
 *   currentBlendshapes,
 *   0.3 // 30% dampening
 * )
 * ```
 */
export declare function dampenBlendshapes(currentValues: Map<string, number>, newValues: Map<string, number>, dampeningFactor?: number): Map<string, number>;
/**
 * Filter blendshapes by removing values below a threshold
 * Useful for reducing noise and micro-movements
 *
 * @param blendshapes - Blendshape values to filter
 * @param threshold - Minimum value to keep (0-1 range)
 * @returns Filtered blendshape values
 *
 * @example
 * ```typescript
 * // Remove small movements below 5%
 * const filtered = filterBlendshapesByThreshold(blendshapes, 0.05)
 * ```
 */
export declare function filterBlendshapesByThreshold(blendshapes: Map<string, number>, threshold?: number): Map<string, number>;
/**
 * Map MediaPipe blendshape names to custom model blendshape names
 * Useful when your GLB model uses different naming conventions
 *
 * @param blendshapes - Blendshape values with MediaPipe names
 * @param nameMapping - Map of MediaPipe names to custom model names
 * @returns Blendshapes with remapped names
 *
 * @example
 * ```typescript
 * const nameMapping = {
 *   'eyeBlinkLeft': 'blink_L',
 *   'eyeBlinkRight': 'blink_R',
 *   'jawOpen': 'mouth_open'
 * }
 * const remapped = mapBlendshapeNames(blendshapes, nameMapping)
 * ```
 */
export declare function mapBlendshapeNames(blendshapes: Map<string, number>, nameMapping: Record<string, string>): Map<string, number>;
/**
 * Combine multiple blendshapes into one
 * Useful for simplifying expressions or combining left/right movements
 *
 * @param blendshapes - Input blendshape values
 * @param combinations - Map of target name to source names to combine
 * @param combineMethod - How to combine: 'average', 'max', or 'sum'
 * @returns Blendshapes with combined values
 *
 * @example
 * ```typescript
 * // Create a single 'eyeBlink' from left and right
 * const combined = combineBlendshapes(
 *   blendshapes,
 *   { 'eyeBlink': ['eyeBlinkLeft', 'eyeBlinkRight'] },
 *   'average'
 * )
 * ```
 */
export declare function combineBlendshapes(blendshapes: Map<string, number>, combinations: Record<string, string[]>, combineMethod?: 'average' | 'max' | 'sum'): Map<string, number>;
/**
 * Get a list of all available MediaPipe blendshape names
 * Useful for reference and debugging
 */
export declare const MEDIAPIPE_BLENDSHAPE_NAMES: readonly ["eyeBlinkLeft", "eyeBlinkRight", "eyeSquintLeft", "eyeSquintRight", "eyeWideLeft", "eyeWideRight", "eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight", "browDownLeft", "browDownRight", "browInnerUp", "browOuterUpLeft", "browOuterUpRight", "cheekPuff", "cheekSquintLeft", "cheekSquintRight", "noseSneerLeft", "noseSneerRight", "mouthClose", "mouthFunnel", "mouthPucker", "mouthLeft", "mouthRight", "mouthSmileLeft", "mouthSmileRight", "mouthFrownLeft", "mouthFrownRight", "mouthDimpleLeft", "mouthDimpleRight", "mouthStretchLeft", "mouthStretchRight", "mouthRollLower", "mouthRollUpper", "mouthShrugLower", "mouthShrugUpper", "mouthPressLeft", "mouthPressRight", "mouthLowerDownLeft", "mouthLowerDownRight", "mouthUpperUpLeft", "mouthUpperUpRight", "jawOpen", "jawForward", "jawLeft", "jawRight"];
/**
 * Type for MediaPipe blendshape names
 */
export type MediaPipeBlendshapeName = typeof MEDIAPIPE_BLENDSHAPE_NAMES[number];
//# sourceMappingURL=blendshapeRetargeting.d.ts.map