export async function enableWebcam(video?: HTMLVideoElement): Promise<MediaStream | null> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video) {
            video.srcObject = stream;
            video.play();
        }
        return stream;
    } catch (err) {
        return null;
    }
}