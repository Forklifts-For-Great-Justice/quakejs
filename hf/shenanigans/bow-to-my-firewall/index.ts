const elementId = "bow-to-my-firewall";

let setupInvoked = false;
export function Setup () {
  if (setupInvoked) {
    console.warn("Setup already invoked.");
    return;
  }

  const html = `<div id="${elementId}" class="talk-box hide">
      <div class="content">Bow to my firewall!</div>
      <img class="portrait" src="/hf/shenanigans/bow-to-my-firewall/bruce-firewall.png">
    </div>`;

  const fragment = document.createRange().createContextualFragment(html);
  document.body.append(fragment);
  setupInvoked = true;
}

type Aagghhh = "Aaagghhh";

let timer: number | null = null;
export function Begin(aagghhh: Aagghhh) {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("show", "shake");
    element.classList.remove("hide");

    // Quad damage can end in-game when the player dies, drops the powerup(?),
    // or the powerup expires.
    // Until I figure out how to trigger End() when quad damage ends in the q3a client,
    // just set a short timer which calls End()
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
    element.classList.remove("show", "shake");
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }
}