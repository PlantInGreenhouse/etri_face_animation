/**
 * Main Aniface class - Entry point for the library
 */
import type { AnifaceConfig } from './types.js';
import { FacialLandmarkManager } from './core/FacialLandmarkManager.js';
import { AvatarRenderer } from './core/AvatarRenderer.js';
/**
 * Aniface - Animate 3D avatars with real-time facial tracking
 *
 * This is the main class that brings together facial landmark detection,
 * 3D rendering, and blendshape animation into a simple, unified API.
 *
 * Supports two input modes:
 * 1. Built-in MediaPipe detection (provide videoElement, call start())
 * 2. Manual landmark updates (call processLandmarkData() when you have data)
 *
 * @example Built-in MediaPipe detection
 * ```typescript
 * const avatar = new Aniface({
 *   videoElement: document.getElementById('webcam') as HTMLVideoElement,
 *   canvasElement: document.getElementById('avatar') as HTMLCanvasElement,
 *   modelPath: '/models/avatar.glb'
 * })
 * await avatar.initialize()
 * avatar.start() // Automatic processing loop
 * ```
 *
 * @example Manual updates (event-driven)
 * ```typescript
 * const avatar = new Aniface({
 *   canvasElement: document.getElementById('avatar') as HTMLCanvasElement,
 *   modelPath: '/models/avatar.glb'
 * })
 * await avatar.initialize()
 *
 * // Push data when events occur
 * socket.on('landmarks', (data) => {
 *   avatar.processLandmarkData(data)
 * })
 * ```
 */
export declare class Aniface {
    private config;
    private landmarkManager;
    private avatarRenderer;
    private isRunning;
    private isInitialized;
    private animationFrameId;
    private noFaceDetectedCount;
    private readonly NO_FACE_THRESHOLD;
    constructor(config: AnifaceConfig);
    /**
     * Validate the configuration
     */
    private validateConfig;
    /**
     * Initialize the avatar system
     * Must be called before start()
     */
    initialize(): Promise<void>;
    /**
     * Cleanup all resources and reset state
     * Used during initialization failure and destruction
     */
    private cleanupResources;
    /**
     * Start avatar processing
     * Begins the facial tracking and animation loop
     */
    start(): void;
    /**
     * Stop avatar processing
     * Pauses the facial tracking loop
     */
    stop(): void;
    /**
     * Main processing loop - detects landmarks and updates avatar
     */
    private processFrame;
    /**
     * Process facial landmark data directly without using the animation loop
     * Use this for push-based updates (e.g., WebSocket events, button clicks)
     *
     * @param landmarkData - FaceLandmarkerResult from MediaPipe or compatible format
     *
     * @example
     * ```typescript
     * // Push-based: Receive landmark data from WebSocket
     * socket.on('landmarks', (data) => {
     *   avatar.processLandmarkData(data)
     * })
     *
     * // Push-based: Update on button click
     * button.onclick = () => {
     *   const data = getPrerecordedLandmark()
     *   avatar.processLandmarkData(data)
     * }
     * ```
     */
    processLandmarkData(landmarkData: import('@mediapipe/tasks-vision').FaceLandmarkerResult): void;
    /**
     * Update canvas size (call when window is resized)
     */
    updateSize(width: number, height: number): void;
    /**
     * Get the current video element (if provided)
     */
    getVideoElement(): HTMLVideoElement | undefined;
    /**
     * Get the current canvas element
     */
    getCanvasElement(): HTMLCanvasElement;
    /**
     * Get the avatar renderer instance (for advanced usage)
     */
    getRenderer(): AvatarRenderer | null;
    /**
     * Get the landmark manager instance (for advanced usage)
     */
    getLandmarkManager(): FacialLandmarkManager | null;
    /**
     * Check if avatar is currently running
     */
    get running(): boolean;
    /**
     * Check if avatar system is initialized
     */
    get ready(): boolean;
    /**
     * Destroy avatar and cleanup resources
     * Call this when you're done with the avatar
     */
    destroy(): void;
}
//# sourceMappingURL=Aniface.d.ts.map