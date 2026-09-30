export class Camera {
    private mediaStream: MediaStream | null = null;

    get stream() {
        return this.mediaStream
    }

    async start() {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
    }

    stop() {
        const tracks = this.mediaStream?.getTracks() ?? []
        tracks.forEach(track => track.stop())
        this.mediaStream = null;
    }

    isRunning(): boolean {
        return this.mediaStream?.active ?? false
    }
}