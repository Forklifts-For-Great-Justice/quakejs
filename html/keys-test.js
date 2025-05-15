
class Shenanigans {
  static CString(str) {
    return allocate(intArrayFromString(str), "i8", ALLOC_STACK)
  }
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static sendKey(key, state) {
    if (state !== "down" && state !== "up") {
      throw new Error(`sendKey(${key}, ${state}) - state is invalid, must be "up" or "down"`);
    }

    if (typeof key === "string") {
      switch (key) {
        // Some keystrokes don't match their ASCII/UTF-8 values
        case "`": key = 192; break;
        default:
          key = key.toUpperCase().charCodeAt(0);
    }

  // A fake KeyboardEvent that is quacks like a duck just enough for
  // Emscripten's SDL to accept it.

  let kev = {
    type: "key" + state, // keydown or keyup
    keyCode: key,

    // SDL sometimes calls preventDefault()
    preventDefault: () => false,
  }

  SDL.receiveEvent(kev);
    //SDL._originalReceiveEvent(kev);
    resolve();
  });
}

sendKey = (key, state, options={}) => {
}

sendTyping = (keys) => {
  if (typeof keys === "string") {
    keys = keys.split("")
  }
jj/"`"
  let chain = Promise.resolve(); // Start with an empty promise to chain with.

  keys.forEach((key)  => {
    chain = chain.then(() => sendKey(key, "down"))
    .then(() => sleep(delay))
    .then(() => sendKey(key, "up"))
    .then(() => sleep(delay))
  }) // promise
  return chain;
}; // sendTyping

//disableInput = true;
// _Com_Printf(s("========================\n"));
// _Com_Printf(s("= You are being hacked =\n"));
// _Com_Printf(s("= You are being hacked =\n"));
// _Com_Printf(s("= You are being hacked =\n"));
// _Com_Printf(s("========================\n"));

sleep(2000)
  .then(() => sendTyping([192])) // backtick
  .then(() => sendTyping([3])) // ctrl+c
  .then(() => sleep(2000))
  .then(() => {
    _Com_Printf(s("========================\n"));
    _Com_Printf(s("= You are being hacked =\n"));
    _Com_Printf(s("= BE NOT AFRAID ?      =\n"));
    _Com_Printf(s("========================\n"));
    return sendTyping("/kill\r");
  })
  .then(() => sendTyping([192])) // backtick
  .then(() => sleep(3000))
  .then(() => {
      console.log("Shenanigan complete");
      disableInput = false;
  });