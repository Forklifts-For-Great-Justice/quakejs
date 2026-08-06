let viewport = document.getElementById("viewport-frame");

let timer: ReturnType<typeof setTimeout> | undefined;
export function Blur(duration: number = 2000) {
  if (viewport !== null) {
    viewport.style = "filter: blur(9px)";
  }

  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  timer = setTimeout(End, duration)
}

export function End() {
  if (viewport !== null) {
    viewport.style = "";
    timer = undefined;
  }
}
