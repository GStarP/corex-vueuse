import { Ref, onMounted, onUnmounted } from "vue";

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

  onMounted(() => {
    const el = target.value;
    if (el) {
      el.addEventListener("pointerdown", createTimer, {
        capture: finalOptions.modifiers?.capture,
        once: finalOptions.modifiers?.once,
      });
      el.addEventListener("pointerup", clearTimer);
      el.addEventListener("pointerleave", clearTimer);
    }
  });

  onUnmounted(() => {
    const el = target.value;

    if (el) {
      el.removeEventListener("pointerdown", createTimer);
      el.removeEventListener("pointerup", clearTimer);
      el.removeEventListener("pointerleave", clearTimer);
    }
  });
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
