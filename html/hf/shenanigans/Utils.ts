/* Note, these things come from emscripten
 * Define them in typescript to give the compiler something to check */
type ptr = any;
declare function allocate(array: number[], types: string, allocator: number): ptr;
declare function intArrayFromString(str: string): number[];
declare const ALLOC_STACK: number;

declare const SDL: SDLInterface;
interface SDLInterface {
  receiveEvent: (event: FakeKeyboardEvent) => (any)
}

/**
 * Allocate a C String in Emscripten. Both `allocate` and `intArrayFromString`
 * are provided by Emscripten
 */
export function CString(str: string) { 
  // XXX: probably should call _malloc() instead of allocate?
  return allocate(intArrayFromString(str), "i8", ALLOC_STACK);
}

// JavaScript doesn't have a "sleep" function so we gotta make our own.
export function sleep(ms: number) {
  if (ms <= 0) {
    // don't sleep if the delay is zero or ... less
    return Promise.resolve();
  }
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class FakeKeyboardEvent {
  readonly type: KeyState
  readonly keyCode: number

  constructor(type: KeyState, keyCode: number) {
    this.type = type;
    this.keyCode = keyCode;
  }

  // Sometimes SDL will invoke .preventDefault(), so we provide
  // a dummy function for that case.
  preventDefault() { return false; }
}

var allowInput = true;
// The default receiveEvent should call SDL.
export let receiveEvent = (event: FakeKeyboardEvent, insist = false) => {
  // Under Emscripten, most events (keyboard, mouse, etc) are sent to SDL.receiveEvent,
  // So we can invoke that here with our own event objects to fake event input.
  if (allowInput || (!allowInput && insist)) {
    sdlReceiveEvent(event);
  }
}

export function rejectInput() {
  allowInput = false;
}

export function acceptInput() {
  allowInput = true;
}

var sdlReceiveEvent: (event: FakeKeyboardEvent) => void = function(event: FakeKeyboardEvent) {
  console.log("SDL receiveEvent called without hook", event);
}

export function hookSDL(fn: (event: FakeKeyboardEvent) => void) {
  sdlReceiveEvent = fn;
  return receiveEvent;
}

export const originalReceiveEvent = receiveEvent;

// Allow overriding the receiveEvent function in order to make it easier to test
export function overrideReceiveEvent(fn: (event: FakeKeyboardEvent) => void): void {
  receiveEvent = fn;
}

export function restoreRecieveEvent(): void {
  receiveEvent = originalReceiveEvent;
}

export enum KeyState {
  Down = "keydown",
  Up = "keyup"
}

export function sendKey(key: string|number, state: KeyState) {
  if (typeof key === "string") {
    switch (key) {
      case "`": key = 192; break;
      default:
        key = key.toUpperCase().charCodeAt(0);
    }
  }

  // Fake a KeyboardEvent well enough that Emscripten's SDL implementation will
  // accept it. Duck typing is fun.
  const kev = new FakeKeyboardEvent(state, key)

  receiveEvent(kev, true)
}

export async function sendTyping(text: (string|string[]), keyRate = 50) {
  if (typeof text === "string") {
    text = text.split("");
  }

  const downWait = keyRate * 0.8;
  const upWait = keyRate - downWait;

  for (const key of text) {
    sendKey(key, KeyState.Down)
    await sleep(downWait)
    sendKey(key, KeyState.Up)
    await sleep(upWait)
  }
}

// These should be exported by Emscripten at build-time.
// Define them so TypeScript knows about them.
declare function _Key_SetCatcher(mask: number): void;
declare function _Key_GetCatcher(): number;

const KEYCATCH_CONSOLE = 0x0001; // From ioq3's q_shared.h
export function openConsole() {
  // See ioq3's Con_ToggleConsole_f from cl_console.c for implementation details.
  if (typeof _Key_GetCatcher == "function") {
    _Key_SetCatcher( _Key_GetCatcher( ) | KEYCATCH_CONSOLE );
  } else {
    console.warn("openConsole does nothing: likely running outside of Emscripten");
  }
}

export function closeConsole() {
  // See ioq3's Con_ToggleConsole_f from cl_console.c for implementation details.
  if (typeof _Key_GetCatcher == "function") {
    _Key_SetCatcher( _Key_GetCatcher( ) & ~KEYCATCH_CONSOLE );
  } else {
    console.warn("closeConsole does nothing: likely running outside of Emscripten");
  }
}

declare function _Com_Printf(... args: any[]): void;
export function Com_Printf(...args: string[]) {
  if (typeof allocate == "function") {
    const cargs = args.map((arg) => CString(arg));
    _Com_Printf(...cargs);
  } else {
    console.log("Com_Printf", ...args);
  }

}