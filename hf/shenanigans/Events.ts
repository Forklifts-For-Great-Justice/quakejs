export const event = new EventTarget();

export enum TYPES {
  YouDied = "you died", // You died, normally.
  YouGibbed = "you got gibbed", // You died, but was gibbed.
  YouTeleported = "you teleported", // Walked through a teleporter
  QuadDamageBegin = "quad damage begin",
  QuadDamageEnd = "quad damage end",
  Crash = "crash",
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

export function QuadDamageBegin() {
  event.dispatchEvent(new CustomEvent(TYPES.QuadDamageBegin));
}
export function QuadDamageEnd() {
  event.dispatchEvent(new CustomEvent(TYPES.QuadDamageEnd));
}

import * as MirrorImage from "./mirror-image/index.js"
import * as BowToMyFirewall from "./bow-to-my-firewall/index.js"
import * as BSOD from "./bsod/index.js"
import * as ConsoleTakeover from "./console-takeover/index.js"

BowToMyFirewall.Setup();
BSOD.Setup();
ConsoleTakeover.Setup();

event.addEventListener(TYPES.YouDied, () => { 
  console.log("You died"); 
  BSOD.Begin();
});

event.addEventListener(TYPES.YouGibbed, () => { console.log("You died (gibbed)"); });
event.addEventListener(TYPES.YouTeleported, () => { MirrorImage.Begin() });

event.addEventListener(TYPES.QuadDamageBegin, () => BowToMyFirewall.Begin("Aaagghhh"));
event.addEventListener(TYPES.QuadDamageEnd, BowToMyFirewall.End);

event.addEventListener(TYPES.Crash, () => { BSOD.Begin() })

export function Mirror(duration: number = 2500) {
  MirrorImage.Begin(duration)
}

export function Crash(duration: number = 5000) {
  BSOD.Begin(duration)
}

export function Hack() {
  ConsoleTakeover.Begin()
}

