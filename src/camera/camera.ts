export class Camera {
    private _stream: MediaStream | null = null;

    get stream() {
        return this._stream
    }

    async start() {
        this._stream = await navigator.mediaDevices.getUserMedia({ video: true })
    }

    stop() {
        const tracks = this._stream?.getTracks() ?? []
        tracks.forEach(track => track.stop())
        this._stream = null;
    }

    isRunning(): boolean {
        return this._stream?.active ?? false
    }
}