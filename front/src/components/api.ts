export type DetectionBox = {
  coords: number[];
  cls: string;
  confidence: number;
};
export type Frame = { objects: DetectionBox[] };
export type VideoDetection = { frames: Frame[]; total_frames: number };

const base = '';
const detectionEndpoint = (id: string) => `${base}/detection/${id}`;

async function safeFetch(...args: Parameters<typeof fetch>) {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error();
  }
  return res;
}

export async function startInference(id: string, video: File) {
  const body = new FormData();
  body.append('file', video);
  await safeFetch(detectionEndpoint(id), { method: 'POST', body });
}

export async function getInference(id: string): Promise<VideoDetection> {
  const res = await safeFetch(detectionEndpoint(id));
  return await res.json();
}
