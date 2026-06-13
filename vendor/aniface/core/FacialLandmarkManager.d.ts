/**
 * FacialLandmarkManager - Manages MediaPipe Face Landmarker for facial tracking
 */
import { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
/**
 * Configuration options for FacialLandmarkManager
 */
export interface FacialLandmarkManagerConfig {
    /** Whether to output face blendshapes (default: true) */
    outputFaceBlendshapes?: boolean;
    /** Whether to output facial transformation matrices (default: true) */
    outputFacialTransformationMatrixes?: boolean;
    /** Delegate for processing: 'CPU' or 'GPU' (default: 'GPU') */
    delegate?: 'CPU' | 'GPU';
    /** Custom model path (optional) */
    modelAssetPath?: string;
    /** Custom WASM path (optional) */
    wasmPath?: string;
}
/**
 * FacialLandmarkManager - Handles facial landmark detection using MediaPipe
 *
 * @example
 * ```typescript
 * const manager = new FacialLandmarkManager()
 * await manager.initialize()
 *
 * const results = manager.detectLandmarks(videoElement)
 * if (results) {
 *   console.log('Detected landmarks:', results.faceLandmarks)
 * }
 * ```
 */
export declare class FacialLandmarkManager {
    private faceLandmarker;
    private isInitialized;
    private results;
    private config;
    constructor(config?: FacialLandmarkManagerConfig);
    /**
     * Initialize the MediaPipe Face Landmarker model
     * Must be called before using detectLandmarks
     */
    initialize(): Promise<void>;
    /**
     * Detect facial landmarks from a video element
     *
     * @param videoElement - The video element to analyze
     * @param timestamp - Optional timestamp (uses performance.now() if not provided)
     * @returns FaceLandmarkerResult or null if detection fails
     */
    detectLandmarks(videoElement: HTMLVideoElement, timestamp?: number): FaceLandmarkerResult | null;
    /**
     * Get the most recent detection results
     */
    getResults(): FaceLandmarkerResult | null;
    /**
     * Check if the landmark manager is ready for use
     */
    isReady(): boolean;
    /**
     * Draw facial landmarks on a canvas (useful for debugging)
     *
     * @param canvas - Canvas element to draw on
     */
    drawLandmarks(canvas: HTMLCanvasElement): void;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=FacialLandmarkManager.d.ts.map