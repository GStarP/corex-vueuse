import { Ref, watch } from "vue";

const DEFAULT_OPTIONS: OnLongPressOptions = {
  delay: 500,
};

export function onLongPress(
  target: MaybeElementRef,
  handler: (evt: PointerEvent) => void,
  options?: OnLongPressOptions
) {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let timer: NodeJS.Timeout | null = null;

  const createTimer = (e: PointerEvent) => {
    if (finalOptions.modifiers?.self && e.target !== target.value) {
      return;
    }

    clearTimer();

    if (finalOptions.modifiers?.prevent) {
      e.preventDefault();
    }
    if (finalOptions.modifiers?.stop) {
      e.stopPropagation();
    }
    timer = setTimeout(() => handler(e), finalOptions.delay);
  };
  /**
   * when pointer up/leave, clear timer
   * if cb not triggered, long press cancelled
   * if cb already triggered, nothing happens
   */
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const listenerOptions = {
    capture: finalOptions.modifiers?.capture,
    once: finalOptions.modifiers?.once,
  };

  /**
   * @TODO mock useEventListener
   */
  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  function register(
    el: HTMLElement,
    event: string,
    listener: any,
    options: any
  ) {
    el.addEventListener(event, listener, options);
    cleanups.push(() => el.removeEventListener(event, listener, options));
  }

  watch(
    target,
    (el) => {
      cleanup();
      if (!el) return;

      register(el, "pointerdown", createTimer, listenerOptions);
      register(el, "pointerup", clearTimer, listenerOptions);
      register(el, "pointerleave", clearTimer, listenerOptions);
    },
    { immediate: true, flush: "post" }
  );
}

/**
 * Types
 */
export interface OnLongPressOptions {
  delay?: number;
  modifiers?: OnLongPressModifiers;
}
export interface OnLongPressModifiers {
  stop?: boolean;
  once?: boolean;
  prevent?: boolean;
  capture?: boolean;
  self?: boolean;
}

type MaybeElementRef = Ref<HTMLElement | null>;
