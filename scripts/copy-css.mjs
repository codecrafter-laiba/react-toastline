import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

mkdirSync(join(root, 'dist'), { recursive: true });
copyFileSync(join(root, 'src', 'styles.css'), join(root, 'dist', 'styles.css'));

console.log('Copied src/styles.css -> dist/styles.css');
