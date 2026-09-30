import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";

export function drawFrame(canvas: HTMLCanvasElement, result: HandLandmarkerResult) {    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    result.landmarks.forEach((fingers) => {
        const rootX = fingers[0].x * canvas.width;
        const rootY = fingers[0].y * canvas.height;

        ctx.beginPath();

        fingers.forEach((point, index) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;

            if ((index - 1) % 4 == 0) {
                ctx.moveTo(rootX, rootY);
            }

            ctx.lineTo(x, y);
        });

        ctx.strokeStyle = '#3cff00';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();

        fingers.forEach((point) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;

            ctx.moveTo(x + 8, y);
            ctx.arc(x, y, 8, 0, Math.PI * 2);
        });

        ctx.fillStyle = '#ff0000';
        ctx.fill();
    });
}