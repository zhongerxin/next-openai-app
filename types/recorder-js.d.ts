declare module 'recorder-js' {
    class Recorder {
      constructor(audioContext: AudioContext);
      init(stream: MediaStream): void;
      start(): void;
      stop(): Promise<{blob: Blob}>;
    }
  
    export default Recorder;
  }