# react-toastline

A tiny, zero-dependency, accessible toast/notification system for React.

Unlike most toast libraries, `react-toastline` works two ways:

- **Declaratively**, via the `useToast()` hook.
- **Imperatively**, by calling `toast()` from *anywhere* — an event handler, an axios/fetch interceptor, a Redux middleware, outside any component entirely. No hook required at the call site.

Other things it does out of the box:

- Zero runtime dependencies (only `react`/`react-dom` as peers)
- Full TypeScript types
- ESM + CJS builds
- Accessible: `role="status"`/`role="alert"` + `aria-live`, keyboard-dismissible close button
- Pause-on-hover so users can read a toast before it disappears
- Respects `prefers-reduced-motion`
- ~2KB gzipped (core logic has no dependencies at all)

## Install

```bash
npm install react-toastline
```

## Quick start

Mount `<ToastProvider />` once near the root of your app:

```tsx
import { ToastProvider } from 'react-toastline';
import 'react-toastline/styles.css';

export function App() {
  return (
    <>
      <YourApp />
      <ToastProvider position="bottom-right" />
    </>
  );
}
```

Then fire toasts from anywhere:

```tsx
import { toast } from 'react-toastline';

function SaveButton() {
  async function handleSave() {
    try {
      await saveThing();
      toast.success('Saved!');
    } catch (err) {
      toast.error('Something went wrong.');
    }
  }

  return <button onClick={handleSave}>Save</button>;
}
```

It also works outside components — e.g. a fetch wrapper:

```ts
// api.ts — no React import needed
import { toast } from 'react-toastline';

export async function apiFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    toast.error(`Request failed: ${res.status}`);
    throw new Error(String(res.status));
  }
  return res.json();
}
```

## API

### `<ToastProvider />`

| Prop         | Type            | Default          | Description                          |
| ------------ | --------------- | ----------------- | ------------------------------------ |
| `position`   | `ToastPosition` | `'bottom-right'`  | Corner/edge the stack renders in     |
| `maxVisible` | `number`        | `5`               | Cap on simultaneously visible toasts |
| `container`  | `HTMLElement`   | `document.body`   | Portal mount node                    |

`ToastPosition` is one of: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`.

### `toast(message, options?)`

Also available as `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`.

```ts
interface ToastOptions {
  id?: string;        // reuse an id to update an existing toast in place
  type?: ToastType;    // 'default' | 'success' | 'error' | 'info' | 'warning'
  title?: string;
  duration?: number;   // ms; 0 = persist until dismissed
}
```

Returns the toast's `id`, which you can pass to `toast.dismiss(id)`.

### `toast.dismiss(id)` / `toast.dismissAll()`

Dismiss one toast or clear the stack.

### `useToast()`

```ts
const { toasts, toast, dismiss, dismissAll } = useToast();
```

Gives you the live array of active `ToastRecord`s, useful if you want to render your own notification UI instead of the built-in one.

## Styling

Import the default stylesheet, or write your own using the `.toastline-*` class names as a guide — they're intentionally simple and unminified. Colors are exposed as CSS variables on `.toastline-viewport` so you can theme without overriding rules:

```css
.toastline-viewport {
  --toastline-bg: #111827;
  --toastline-success: #16a34a;
}
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Publishing this package yourself

1. Update the `name`, `author`, and `repository` fields in `package.json` (the name must be unique on npm — check with `npm view <name>`).
2. `npm login`
3. `npm publish` (the `prepublishOnly` script runs typecheck + tests + build automatically)

To publish under a scope (e.g. `@yourname/react-toastline`) without making it private, keep `"publishConfig": { "access": "public" }` in `package.json`.

## License

MIT
