import * as Shenanigans from "./ConsoleTakeover.js";

describe("fake input", () => {
  const receiveEvent = jest.fn();
  beforeEach(() => Shenanigans.overrideReceiveEvent(receiveEvent));
  afterEach(() => Shenanigans.restoreRecieveEvent());

  test("sendKey sends a correctly-formed event", () => {

    Shenanigans.sendKey("a", Shenanigans.KeyState.Down);
    expect(receiveEvent).toHaveBeenCalledTimes(1);
    expect(receiveEvent.mock.calls[0][0].keyCode).toBe(65);
    expect(receiveEvent.mock.calls[0][0].type).toBe(Shenanigans.KeyState.Down);
  })

  test("sendTyping sends down an upt events for all letters", async () => {
    const text = "hello world"
    await Shenanigans.sendTyping(text, 0);
  });
})