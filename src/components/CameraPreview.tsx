import './CameraPreview.css';
import { Camera } from '../camera/Camera';
import { useRef, useEffect, useState } from 'react';
import { HandTracker } from '../tracking/HandTracker';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { drawFrame } from '../helper/DrawHands';

export function CameraPreview() {
    const cameraRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const camera = useRef(new Camera()).current;
    const tracker = useRef(new HandTracker()).current;  

    const animationFrame = useRef<number | null>(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    
    useEffect(() => {
        return () => {
            if (animationFrame.current !== null) {
                cancelAnimationFrame(animationFrame.current);
            }

            camera.stop();

            if (cameraRef.current) {
                cameraRef.current.srcObject = null;
            }
        };
    }, [camera]);


    
    function startDetectionLoop() {
        if (animationFrame.current !== null) return;

        const detect = () => {
            const video = cameraRef.current;

            if (video && video.readyState >= 2) {
                const canvas = canvasRef.current;

                if (canvas) drawFrame(canvas, tracker.detect(video));
            }

            animationFrame.current = requestAnimationFrame(detect);
        }

        detect();
    }

    async function startCameraStream() {
        try {
            await tracker.initialize();
            await camera.start();

            const video = cameraRef.current;
            if (!video) return;

            video.srcObject = camera.stream;
            await video.play();

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;  
            }
            
            setCameraVisible(true);
            startDetectionLoop();
        } catch (error) {
            console.error('Unable to start camera:', error);
        }
    }
    
    return (
        <>
            {!cameraVisible && (
                <button
                    className="camera-button"
                    type="button"
                    onClick={startCameraStream}
                >
                    Request Camera Access
                </button>
            )}

            <div className="camera-container">
                <video ref={cameraRef} autoPlay playsInline />
                <canvas ref={canvasRef} />
            </div>
        </>
    )
}