// Typescript assumes NodeJS's setTimeout() and clearTimeout() types (NodeJS.time,
// but we need the browser's setTimeout() which returns a number
declare function setTimeout(handler: (...args: any[]) => void, timeout: number, ...args: any[]): number;
declare function clearTimeout(handle: number): void;

var timeout: number | undefined;

export function Begin() {
  document.getElementById("viewport-frame")?.classList.add("horizontal-mirror");
  timeout = setTimeout(End, 5000);
}

export function End() {
  document.getElementById("viewport-frame")?.classList.remove("horizontal-mirror");

  if (timeout) {
    clearTimeout(timeout);
    timeout = undefined;
  }
}