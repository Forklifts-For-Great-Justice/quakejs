const elementId = "telefrag";

let setupInvoked = false;
export function Setup () {
  if (setupInvoked) {
    console.warn("Setup already invoked.");
    return;
  }

  const html = `<div id="${elementId}" class="talk-box hide">
      <div class="content">Teleporter accident!</div>
      <img class="portrait" src="/hf/shenanigans/telefrag/laforge.png">
    </div>`;

  const fragment = document.createRange().createContextualFragment(html);
  document.body.append(fragment);
  setupInvoked = true;
}

let timer: number | null = null;

export function Begin() {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("show");
    element.classList.remove("hide");

    if (timer !== null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(End, 5000);
  }
}

export function End() {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("hide");
    element.classList.remove("show");
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }
}
