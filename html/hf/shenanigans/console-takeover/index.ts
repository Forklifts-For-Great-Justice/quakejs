import { util } from "chai";
import * as Utils from "../Utils.js";
import { utils } from "mocha";

const elementId = "console-takeover";

let setupInvoked = false;
export function Setup () {
  if (setupInvoked) {
    console.warn("Setup already invoked.");
    return;
  }

  const html = `<div id="${elementId}" class="banner-right hide blink font-thin">
      <div class="content">HACKING IN PROGRESS</div>
    </div>`;

  const fragment = document.createRange().createContextualFragment(html);
  document.body.append(fragment);
  setupInvoked = true;
}

type Aagghhh = "Aaagghhh";
export async function Begin(aagghhh: Aagghhh) {
  let element;
  if ((element = document.getElementById(elementId)) !== null) {
    element.classList.add("show");
    element.classList.remove("hide");
  }

  Utils.rejectInput();
  await Utils.sleep(2000);
  Utils.openConsole();

  Utils.sendKey(3, Utils.KeyState.Down); // ctrl+c
  Utils.sendKey(3, Utils.KeyState.Up); // ctrl+c

  await Utils.sleep(200);
  await Utils.sendTyping("/clear\r", 0);
  await Utils.sendTyping("/say HELP I AM BEING HACKED\r", 0);
  await Utils.sleep(1000);
  Utils.Com_Printf("===               ===\n");
  Utils.Com_Printf(`
 |\\_/|    
 (. .)
  =w= (\\  
 / ^ \\//  
(|| ||)
,""_""_ .\n`);
  
  await Utils.sendTyping("/kill\r", 1000);
  Utils.Com_Printf("===      ;)       ===\n");
  await Utils.sleep(1000);
  Utils.closeConsole();
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