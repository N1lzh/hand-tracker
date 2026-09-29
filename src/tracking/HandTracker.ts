import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export class HandTracker {
    private landmarker: HandLandmarker | null = null;

    async initialize() {
        if (this.landmarker) {
            return;
        }

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
        );
        this.landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "/models/hand_landmarker.task"
            },
            runningMode: "VIDEO",
            numHands: 2
        })
    }

    detect(video: HTMLVideoElement) {
        if (!this.landmarker) {
            throw new Error("HandTracker has not been initialized")
        }
        
        const timestamp = performance.now();
        return this.landmarker.detectForVideo(video, timestamp);
    }
}