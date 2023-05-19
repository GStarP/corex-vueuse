import type { SpyInstance } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Ref } from "vue";
import { nextTick, ref } from "vue";
import { useEventListener } from ".";

describe("useEventListener", () => {
  const options = { capture: true };
  let stop: () => void;
  let target: Ref<HTMLDivElement>;
  let removeSpy: SpyInstance;
  let addSpy: SpyInstance;

  beforeEach(() => {
    target = ref(document.createElement("div"));
    removeSpy = vi.spyOn(target.value, "removeEventListener");
    addSpy = vi.spyOn(target.value, "addEventListener");
  });

  it("should be defined", () => {
    expect(useEventListener).toBeDefined();
  });

  describe("given both none array", () => {
    const listener = vi.fn();
    const event = "click";

    beforeEach(() => {
      listener.mockReset();
      stop = useEventListener(target, event, listener, options);
    });

    it("should add listener", () => {
      expect(addSpy).toBeCalledTimes(1);
    });

    it("should trigger listener", () => {
      expect(listener).not.toBeCalled();
      target.value.dispatchEvent(new MouseEvent(event));
      expect(listener).toBeCalledTimes(1);
    });

    it("should remove listener", () => {
      expect(removeSpy).not.toBeCalled();

      stop();

      expect(removeSpy).toBeCalledTimes(1);
      expect(removeSpy).toBeCalledWith(event, listener, options);
    });
  });

  it("should auto re-register", async () => {
    const target = ref();
    const listener = vi.fn();
    const options = false;
    useEventListener(target, "click", listener, options);

    const el = document.createElement("div");
    const addSpy = vi.spyOn(el, "addEventListener");
    const removeSpy = vi.spyOn(el, "removeEventListener");
    target.value = el;
    await nextTick();
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenLastCalledWith("click", listener, false);
    expect(removeSpy).toHaveBeenCalledTimes(0);

    // @delegate not watch options
    // options.value = true;
    // await nextTick();
    // expect(addSpy).toHaveBeenCalledTimes(2);
    // expect(addSpy).toHaveBeenLastCalledWith("click", listener, true);
    // expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
