import { Show, createSignal } from "solid-js";
import { WelcomeScreen } from "./Welcome";
import { VideoPlayer } from "./Player";
import { nanoid } from "nanoid";
import { getInference, startInference, type VideoDetection } from "./api";

export function App() {
  let polling: number | null = null;
  const [video, setVideo] = createSignal<{ url: string; type: string }>();
  const [detection, setDetection] = createSignal<VideoDetection>({ total_frames: 0, frames: [] });
  const upload = (file: File) => {
    polling && clearInterval(polling);
    setVideo({ url: URL.createObjectURL(file), type: file.type });
    const id = nanoid();
    startInference(id, file);
    polling = setInterval(async () => {
      const res = await getInference(id);
      setDetection(res);
      if (res.frames.length > res.total_frames - 2) {
        polling && clearInterval(polling);
      }
    }, 1000);
  };

  return (
    <Show when={video()} fallback={<WelcomeScreen onUpload={upload} />} keyed>
      {s => <VideoPlayer source={s.url} type={s.type} detection={detection()} onUpload={upload} />}
    </Show>
  )
}
