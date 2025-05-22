import { util } from "chai";
import * as Utils from "../Utils.js";
import { utils } from "mocha";

const elementId = "bsod";

let setupInvoked = false;
export function Setup () {
  if (setupInvoked) {
    console.warn("Setup already invoked.");
    return;
  }

  const html = `<img src="/hf/shenanigans/bsod/bsod.png" id="${elementId}" class="full-screen hide">`;

  const fragment = document.createRange().createContextualFragment(html);
  document.body.append(fragment);
  setupInvoked = true;
}

export async function Begin() {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("show");
    element.classList.remove("hide");
  }

  Utils.rejectInput();

  await Utils.sleep(2000);

  End();
  Utils.acceptInput();
}

export function End() {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("hide");
    element.classList.remove("show", "shake");
  }
}