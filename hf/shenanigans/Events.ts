export const event = new EventTarget();

export enum TYPES {
  YouDied = "you died", // You died, normally.
  YouGibbed = "you got gibbed", // You died, but was gibbed.
  YouTeleported = "you teleported", // Walked through a teleporter
}

// This event is invoked when the player dies, via g_combat.c's player_die
export function YouDied() {
  event.dispatchEvent(new CustomEvent(TYPES.YouDied));
}

export function YouGibbed() {
  event.dispatchEvent(new CustomEvent(TYPES.YouGibbed));
}

export function YouTeleported() {
  event.dispatchEvent(new CustomEvent(TYPES.YouTeleported));
}

import * as MirrorImage from "./mirror-image/index.js"

event.addEventListener(TYPES.YouDied, () => { console.log("You died"); });
event.addEventListener(TYPES.YouGibbed, () => { console.log("You died (gibbed)"); });
event.addEventListener(TYPES.YouTeleported, () => { 
  MirrorImage.Begin()
});