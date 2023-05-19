# useEventListener

## Mistakes

### Effects clean

Please refer to [effect scope RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

When we use `watch` inside a Vue component's setup, there is no problem, effects will be automatically stopped when component unmounted.

However, `watch` can also be called outside a Vue component, `useEventListener` is just an example. If not stopped manually, `watch` in `useEventListener` will live until the whole web app die. So, if we know `useEventListener` in a effect scope, then we should stop it when this scope die.

```ts
const stop = () => {
  stopWatch();
  cleanup();
};
tryOnScopeDispose(stop);
```

## Neglects

### Overload

For usability, VueUse allow different overloads and param passing:

- different type for `target`
- `target` can be getter or ref
- `event` and `listener` can be array
- `options` can be getter or ref

So it recv `any[]` args and do extra parse:

```ts
export function useEventListener(...args: any[]) {
  let target: MaybeRefOrGetter<EventTarget> | undefined
  let events: Arrayable<string>
  let listeners: Arrayable<Function>
  let options: MaybeRefOrGetter<boolean | AddEventListenerOptions> | undefined

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, options] = args
    target = defaultWindow
  }
  else {
    [target, events, listeners, options] = args
  }

  if (!target)
    return noop

  if (!Array.isArray(events))
    events = [events]
  if (!Array.isArray(listeners))
    listeners = [listeners]
```

For simplicity, we only allow one API:

```ts
export declare function useEventListener<EventType = Event>(
  target: Ref<EventTarget | null | undefined>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions
): () => void;
```
