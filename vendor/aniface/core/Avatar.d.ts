/**
 * Avatar - Handles loading and animating GLB 3D models
 */
import * as THREE from 'three';
/**
 * Options for applying transformation matrix
 */
export interface ApplyMatrixOptions {
    scale?: number;
}
/**
 * Options for loading and positioning the model
 */
export interface LoadModelOptions {
    /** Center the model at origin. Default: true */
    center?: boolean;
    /** Apply automatic rotation. Default: true */
    autoRotate?: boolean;
    /** Rotation in radians around Y-axis. Default: Math.PI (180°) */
    rotation?: number;
    /** Uniform scale factor. Default: 1 */
    scale?: number;
    /** Position offset [x, y, z]. Applied after centering. Default: [0, 0, 0] */
    position?: [number, number, number];
    /** Is this a full-body avatar (vs head-only model)? Set true for full-body avatars like Ready Player Me. Default: false */
    fullBodyAvatar?: boolean;
    /**
     * Bone rotation axis mapping system.
     * - 'standard': For Ready Player Me and similar models (default)
     * - 'quickrig': For QuickRig/Mixamo rigged models
     * Default: 'standard'
     */
    axisMapping?: 'standard' | 'quickrig';
}
/**
 * Avatar class - Loads and animates GLB models with blendshapes
 */
export declare class Avatar {
    private url;
    private scene;
    private loader;
    private gltf;
    private morphTargetMeshes;
    private root;
    private headBone;
    private neckBone;
    private spine2Bone;
    private options;
    private blendshapeCache;
    private _tempVector3;
    private _tempMatrix4;
    private _tempQuaternion;
    private _tempEuler;
    private _tempBox3;
    loaded: boolean;
    constructor(url: string, scene: THREE.Scene, options?: LoadModelOptions);
    /**
     * Initialize the avatar by loading the model
     * Must be called after construction
     */
    initialize(): Promise<void>;
    /**
     * Initialize the loaded model - find bones and morph targets
     */
    private initializeLoadedModel;
    /**
     * Build cache mapping blendshape names to mesh/index pairs
     * This enables O(1) blendshape updates
     */
    private buildBlendshapeCache;
    /**
     * Update blendshape values
     * Uses cached indices for O(1) performance
     * @param blendshapes - Map of blendshape names to values (typically 0-1, but can exceed 1 for exaggerated effects)
     */
    updateBlendshapes(blendshapes: Map<string, number>): void;
    /**
     * Apply transformation matrix to the avatar
     * @param matrix - Transformation matrix
     * @param options - Options including scale
     */
    applyMatrix(matrix: THREE.Matrix4, options?: ApplyMatrixOptions): void;
    /**
     * Offset the root bone position and rotation
     * @param offset - Position offset
     * @param rotation - Optional rotation offset in Euler angles
     */
    offsetRoot(offset: THREE.Vector3, rotation?: THREE.Vector3): void;
    /**
     * Get the loaded GLTF scene
     */
    getScene(): THREE.Group | null;
    /**
     * Get all meshes with morph targets
     */
    getMorphTargetMeshes(): THREE.Mesh[];
    /**
     * Check if avatar is a full-body model (vs head-only model)
     */
    isFullBodyAvatar(): boolean;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=Avatar.d.ts.map