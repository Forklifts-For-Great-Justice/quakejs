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

// The default receiveEvent should call SDL.
export let receiveEvent = (event: FakeKeyboardEvent) => {
  // Under Emscripten, most events (keyboard, mouse, etc) are sent to SDL.receiveEvent,
  // So we can invoke that here with our own event objects to fake event input.
  SDL.receiveEvent(event);
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

  // Fake a KeyboardEvent well enough that Emscripten's SDL implementaiton will
  // accept it. Duck typing is fun.
  const kev = new FakeKeyboardEvent(state, key)

  receiveEvent(kev)
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

// These should be exported by Emscripten at build-time. Define them so TypeScript knows about them.
declare function _Key_SetCatcher(mask: number): void;
declare function _Key_GetCatcher(): number;

export function openConsole() {
  // See ioq3's Con_ToggleConsole_f from cl_console.c for implementation details.
  const KEYCATCH_CONSOLE = 0x0001; // From ioq3's q_shared.h
	_Key_SetCatcher( _Key_GetCatcher( ) | KEYCATCH_CONSOLE );
}

export function closeConsole() {
  // See ioq3's Con_ToggleConsole_f from cl_console.c for implementation details.
  const KEYCATCH_CONSOLE = 0x0001; // From ioq3's q_shared.h
	_Key_SetCatcher( _Key_GetCatcher( ) & ~KEYCATCH_CONSOLE );
}