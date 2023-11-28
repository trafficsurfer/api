export function WelcomeScreen(props: { onUpload: (file: File) => void }) {
  const handleFileInputChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      props.onUpload(file);
    }
  };

  return (
    <div class="relative w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
      <div class="text-white text-3xl font-bold mb-6">Detect road signs like a pro, now.</div>
      <label for="file-input" class="relative text-white">
        <svg class="w-24 h-24 rounded-full shadow-2xl" viewBox='0 0 512 512' width={24} height={24}>
          <defs>
            <mask id="upload">
              <rect x="0" y="0" width="512" height="512" fill="white" />
              <g transform='scale(0.3)' transform-origin="center">
                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" fill="black"></path>
              </g>
            </mask>
          </defs>
          <circle cx="256" cy="256" r="256" fill="currentColor" mask="url(#upload)"></circle>
        </svg>
        <input id="file-input" type="file" accept="video/*" onChange={handleFileInputChange} class="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
      </label>
    </div>
  );
}
