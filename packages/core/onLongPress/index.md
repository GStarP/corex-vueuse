# onLongPress

## Mistakes

### The meaning of `options.modifiers.self`

```ts
if (options?.modifiers?.self && ev.target !== elementRef.value) return;
```

### Listener options should be applied for all

```ts
const listenerOptions: AddEventListenerOptions = {
  capture: options?.modifiers?.capture,
  once: options?.modifiers?.once,
};

useEventListener(elementRef, "pointerdown", onDown, listenerOptions);
useEventListener(elementRef, "pointerup", clear, listenerOptions);
useEventListener(elementRef, "pointerleave", clear, listenerOptions);
```

### Clear current timer before create new timer

> Not in normal process, cannot imagine such circumstance...

```ts
clear();
// prevent and stop
timeout = setTimeout(/* ... */);
```

### Not work without component lifecycle

When running test, Vitest will remind us that `onMounted` can only be called inside a Vue component's setup. However, this function should also works for plain DOM.

We can use `watch` to add/remove listeners when `ref(el)` switch from `null` to `HTMLElement` and then back to `null` (details in `useEventListener`).
