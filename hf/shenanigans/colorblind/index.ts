let viewport = document.getElementById("viewport-frame");

export function Begin(duration: number = 2000) {
  if (viewport !== null) {
    viewport.style = "filter: grayscale() brightness(3) contrast(2)";
  }
}

export function End() {
  if (viewport !== null) {
    viewport.style = "";
  }
}
