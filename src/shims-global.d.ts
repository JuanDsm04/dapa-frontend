import jszip from 'jszip';

declare global {
  interface Window {
    JSZip: typeof jszip;
  }
}
