// import assert from "node:assert";
import { assert } from "chai";
import * as Shenanigans from "./Utils.js";

describe("fake input", () => {
  const events: Shenanigans.FakeKeyboardEvent[] = []
  const receiveEvent = (event: Shenanigans.FakeKeyboardEvent) => { events.push(event) }

  beforeEach(() => {
    events.length = 0;
    Shenanigans.overrideReceiveEvent(receiveEvent)
  });

  afterEach(() => Shenanigans.restoreRecieveEvent());

  describe("with sendKey", () => {
    it("sends a correctly-formed event", () => {

      Shenanigans.sendKey("a", Shenanigans.KeyState.Down);
      assert.equal(events.length, 1)
      assert.equal(events[0].keyCode, 65);
      assert.equal(events[0].type, Shenanigans.KeyState.Down);
      assert.equal(typeof events[0].preventDefault, "function");
    }); 
  });

  describe("with sendTyping", () => {
    it("sends down and up events for all letters", async () => {
      const text = "hello world"
      await Shenanigans.sendTyping(text, 0);

      // two events per key (down + up)
      assert.equal(events.length, text.length * 2);

      for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        const down = events[i * 2];
        const up = events[(i * 2) + 1];

        assert.equal(down.keyCode, letter.toUpperCase().charCodeAt(0));
        assert.equal(down.type, Shenanigans.KeyState.Down);

        assert.equal(up.keyCode, letter.toUpperCase().charCodeAt(0));
        assert.equal(up.type, Shenanigans.KeyState.Up);
      }
    });
 });
})