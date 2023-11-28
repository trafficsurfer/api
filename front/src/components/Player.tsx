import './Player.css';
import { Index, Show, createSignal, onCleanup, onMount } from "solid-js";
import { faPlay, faPause, faForward, faRepeat, faBackward, faUpload, type IconDefinition, faWarning } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';
import type { DetectionBox, VideoDetection } from './api';

export function VideoPlayer(props: { source: string; type: string; detection: VideoDetection; onUpload: (file: File) => void }) {
  let video: HTMLVideoElement;
  let [currentFrame, setCurrentFrame] = createSignal(0);
  const [playState, setPlayState] = createSignal<'paused' | 'playing' | 'finished'>('paused');
  const [videoAspect, setVideoAspect] = createSignal(1);
  onMount(() => {
    setVideoAspect(video.videoWidth / video.videoHeight);
    video.addEventListener('resize', () => {
      setVideoAspect(video.videoWidth / video.videoHeight);
    });
  });

  const togglePlay = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleFileInputChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    file && props.onUpload(file);
  };

  const goToPrevFrame = () => video.currentTime -= 1;
  const goToNextFrame = () => video.currentTime += 1;

  function handleKeyPress(event: KeyboardEvent) {
    if(event.target instanceof HTMLElement && event.target.closest('[data-controls]')) {
      return;
    }
    if (event.code === "Space") {
      togglePlay();
    } else if (event.code === "ArrowLeft") {
      goToPrevFrame();
    } else if (event.code === "ArrowRight") {
      goToNextFrame();
    }
  };
  onMount(() => window.addEventListener('keypress', handleKeyPress));
  onCleanup(() => window.removeEventListener('keypress', handleKeyPress));

  function mainAction() {
    switch (playState()) {
      case 'playing': return faPause;
      case 'paused': return faPlay;
      case 'finished': return faRepeat;
    }
  }

  const processedFrames = () => props.detection.frames.length;

  function trackCurrentFrame() {
    const aggregateframes = Math.floor(props.detection.total_frames * (video.currentTime / video.duration));
    setCurrentFrame(aggregateframes);
    requestAnimationFrame(trackCurrentFrame);
  }
  onMount(() => {
    trackCurrentFrame();
  });
  function onTimeUpdate() {
    setPlayState(s => s === 'finished' ? 'paused' : s);
  }
  function frameObjects(): DetectionBox[] {
    const res = props.detection.frames[currentFrame()]?.objects ?? [];
    console.log(currentFrame(), 'loaded:', props.detection.frames.length, res.length ? 'hit' : 'miss', currentFrame() > props.detection.frames.length ? 'pending' : 'loaded');
    return res;
  }

  return (
    <>
      <video
        ref={video}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setPlayState('finished')}
        onPlaying={() => setPlayState('playing')}
        onPause={() => setPlayState('paused')}
        class="absolute top-0 left-0 w-full h-full"
      >
        <source src={props.source} type={props.type} />
      </video>
      <Show when={currentFrame() > processedFrames()}>
        <div class="fixed top-2 right-2 rounded-md text-white bg-red-500 py-1 px-4 flex items-center gap-2">
          <Fa icon={faWarning} />
          Processing {processedFrames()} / {props.detection.total_frames}
        </div>
      </Show>
      <div style={{ position: 'absolute', 'aspect-ratio': `${videoAspect()} / 1`, 'max-width': '100%', 'max-height': '100%', margin: 'auto', inset: 0 }}>
        <Index each={frameObjects()}>{box => <DetectionBox {...box()} />}</Index>
      </div>
      <div class="absolute left-0 bottom-4 w-full flex justify-center items-center mt-4 gap-2" data-controls>
        <button
          onClick={goToPrevFrame}
          class="control shadow-md bg-fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white h-10 w-10 rounded-full flex items-center justify-center"
        ><Fa icon={faBackward} /></button>
        <button
          onClick={togglePlay}
          class="control shadow-md bg-fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white h-10 w-10 rounded-full flex items-center justify-center"
        ><Fa icon={mainAction()} /></button>
        <button
          onClick={goToNextFrame}
          class="control shadow-md bg-fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white h-10 w-10 rounded-full flex items-center justify-center"
        ><Fa icon={faForward} /></button>
        <label class="control shadow-md bg-fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
          <input type="file" accept="video/*" onChange={handleFileInputChange} class="hidden" />
          <Fa icon={faUpload} />
        </label>
      </div>
    </>
  );
}

function DetectionBox(props: DetectionBox) {
  const pc = (v: number) => `${100 * v}%`;
  function getStyle([x0, y0, x1, y1]: number[]) {
    return { left: pc(x0), top: pc(y0), width: pc(x1 - x0), height: pc(y1 - y0) };
  }
  return (
    <div class="absolute border-2 border-red-500 rounded-md" style={getStyle(props.coords)}>
      <div class="absolute top-0 left-full width-80 rounded-md mx-2" style={{ "background-color":'rgba(255,255,255,0.2)' }}>
        {props.cls} ({props.confidence.toFixed(2)})
      </div>
    </div>
  )
}
