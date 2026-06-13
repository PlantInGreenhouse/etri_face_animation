/**
 * AvatarRenderer - Handles 3D rendering and facial landmark processing
 */
import * as THREE from 'three';
import type { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { Avatar, type LoadModelOptions } from './Avatar.js';
/**
 * Camera configuration
 */
export interface CameraConfig {
    /** Camera field of view in degrees (default: 60) */
    fov?: number;
    /** Enable orbit controls (default: false) */
    enableControls?: boolean;
    /** Enable zoom controls (default: true) */
    enableZoom?: boolean;
    /** Camera position [x, y, z] (default: [0, 0, 1.5]) */
    position?: [number, number, number];
    /** Camera lookAt target [x, y, z] (default: [0, 0, 0]) */
    target?: [number, number, number];
}
/**
 * Lighting configuration
 */
export interface LightingConfig {
    /** Ambient light intensity */
    ambientIntensity: number;
    /** Directional light intensity */
    directionalIntensity: number;
    /** Directional light position */
    directionalPosition: [number, number, number];
}
/**
 * Configuration options for AvatarRenderer
 */
export interface AvatarRendererConfig {
    /** Canvas element to render on */
    canvas: HTMLCanvasElement;
    /** Path to GLB model file */
    modelPath: string;
    /** Camera configuration (optional) */
    cameraConfig?: Partial<CameraConfig>;
    /** Custom blendshape multipliers to adjust expression intensity */
    blendshapeMultipliers?: Record<string, number>;
    /** Model loading options */
    modelOptions?: LoadModelOptions;
    /** Lighting configuration (optional, defaults: ambientIntensity=0.5, directionalIntensity=0.8, directionalPosition=[0,1,2]) */
    lightingConfig?: Partial<LightingConfig>;
}
/**
 * AvatarRenderer - Manages Three.js scene and avatar rendering
 *
 * @example
 * ```typescript
 * const renderer = new AvatarRenderer({
 *   canvas: document.getElementById('avatar'),
 *   modelPath: '/models/avatar.glb',
 *   // Optional: customize camera
 *   cameraConfig: {
 *     fov: 60,
 *     enableControls: true
 *   },
 *   // Optional: customize lighting
 *   lightingConfig: {
 *     ambientIntensity: 0.6,
 *     directionalIntensity: 0.9,
 *     directionalPosition: [1, 2, 3]
 *   }
 * })
 *
 * await renderer.initialize()
 *
 * // Process landmarks from MediaPipe
 * renderer.processLandmarks(landmarkResults)
 * ```
 */
export declare class AvatarRenderer {
    private scene;
    private camera;
    private renderer;
    private controls;
    private avatar;
    private _tempMatrix4;
    private _tempVector3;
    private config;
    constructor(config: AvatarRendererConfig);
    /**
     * Initialize the renderer - sets up Three.js scene and loads avatar
     */
    initialize(): Promise<void>;
    /**
     * Set up the Three.js scene, camera, lights, and controls
     */
    private setupScene;
    /**
     * Render a single frame
     * This should be called from the main animation loop
     */
    render(): void;
    /**
     * Update renderer size (call when canvas is resized)
     */
    updateSize(width: number, height: number): void;
    /**
     * Load the avatar model
     */
    private loadAvatar;
    /**
     * Process facial landmarks and update avatar
     * @param results - Results from MediaPipe Face Landmarker
     */
    processLandmarks(results: FaceLandmarkerResult | null): void;
    /**
     * Get the Three.js scene
     */
    getScene(): THREE.Scene | null;
    /**
     * Get the camera
     */
    getCamera(): THREE.PerspectiveCamera | null;
    /**
     * Get the avatar instance
     */
    getAvatar(): Avatar | null;
    /**
     * Check if avatar is loaded and ready
     */
    isReady(): boolean;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=AvatarRenderer.d.ts.map