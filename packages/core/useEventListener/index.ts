import { Ref, watch } from "vue";

/**
 * We only allow the simplest API
 */
export function useEventListener<EventType = Event>(
  target: Ref<EventTarget | null | undefined>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions
): () => void {
  const cleanups: Function[] = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };

  function register(
    el: EventTarget,
    event: string,
    listener: any,
    options: any
  ) {
    el.addEventListener(event, listener, options);
    cleanups.push(() => el.removeEventListener(event, listener, options));
  }

  const stopWatch = watch(
    target,
    (el) => {
      cleanup();
      if (!el) return;
      register(el, event, listener, options);
    },
    { immediate: true, flush: "post" }
  );

  const stop = () => {
    stopWatch();
    cleanup();
  };

  return stop;
}

/**
 * Types
 */
export interface GeneralEventListener<E = Event> {
  (evt: E): void;
}
