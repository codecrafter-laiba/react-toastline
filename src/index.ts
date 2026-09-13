export { ToastProvider } from './ToastProvider';
export type { ToastProviderProps } from './ToastProvider';

export { useToast } from './useToast';
export type { UseToastResult } from './useToast';

export { toast } from './toast-api';

export type {
  ToastOptions,
  ToastType,
  ToastRecord,
  ToastPosition,
} from './types';

// Note: styles.css is intentionally NOT imported here. It's shipped as a
// separate file (dist/styles.css) and copied there verbatim by
// scripts/copy-css.mjs during the build, so consumers import it explicitly:
//   import 'react-toastline/styles.css'
// Bundling it through esbuild's asset pipeline risked a content-hashed
// output filename that wouldn't match the "./styles.css" export map entry.
