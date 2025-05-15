class Shenanigans
  # Allocate a C String in Emscripten. Both `allocate` and `intArrayFromString`
  # are provided by Emscripten
  @CString: (str) -> allocate(intArrayFromString(str), "i8", ALLOC_STACK);

  @sleep: (ms) -> new Promise((resolve) -> setTimeout(resolve, ms))

  @receiveEvent: (event) -> SDL.receiveEvent(event)

  @sendKey: (key, state) ->
    if state not in ["up", "down"]
      throw new Error("""sendkey(#{key}, #{state}) - state is invalid. Must be 'up' or 'down'""")

    if typeof key is "string" 
      # Some keyCodes don't match their respective UTF-8/ASCII codepoints values
      switch key
        when "`" then key = 192
        else key = key.toUpperCase().charCodeAt(0)
    
    # Fake a KeyboardEvent that quacks like a duck just enough
    # for Emscripten's SDL to accept it.
    kev = {
      # Event type will be keyup or keydown
      type: "key" + state 
      keyCode: key

      preventDefault: -> false
    }

    @receiveEvent(kev)

  @sendTyping: (keys, keyRate = 50) ->
    if typeof keys is "string"
      keys = keys.split("")

    downWait = keyRate * 0.8
    upWait = keyRate - downWait
    for key in keys
      @sendKey(key, "down")
      await @sleep(downWait) unless downWait is 0
      @sendKey(key, "up")
      await @sleep(upWait) unless upWait is 0

# lol, es6. Nobody loves it for some reason.
#export { Shenanigans }

module.exports = { Shenanigans }