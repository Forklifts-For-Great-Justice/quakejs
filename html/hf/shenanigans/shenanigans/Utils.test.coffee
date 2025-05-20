# lol it's 2025 and shit still has problems with ES6 modules. Why.
#import { Shenanigans } from "./ConsoleTakeover.js"

Shenanigans = require("./ConsoleTakeover.js").Shenanigans

test("sendKey sends a correctly-formed event", -> 
  # Monkeypatch Shenanigans.receiveEvent in order to capture events.
  events = []
  Shenanigans.receiveEvent = (event) -> events.push(event)

  Shenanigans.sendKey("a", "down")
  expect(events.length).toBe(1)
  expect(events[0].keyCode).toBe(65)
  expect(events[0].type).toBe("keydown")
)

test("sendTyping sends down and up events for all letters", ->
  events = []
  Shenanigans.receiveEvent = (event) -> events.push(event)

  text = "hello world"
  await Shenanigans.sendTyping(text, 0)

  expect(events.length).toBe(text.length * 2)
  for letter, i in text
    code = letter.toUpperCase().charCodeAt(0)
    expect(events[i*2].keyCode).toBe(code)
    expect(events[i*2].type).toBe("keydown")

    expect(events[i*2 + 1].keyCode).toBe(code)
    expect(events[i*2 + 1].type).toBe("keyup")
)
