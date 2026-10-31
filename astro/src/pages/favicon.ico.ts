import { readFile } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve(process.cwd(), '../src/app/favicon.ico');

export const GET = async () => new Response(await readFile(source), {
  headers: { 'Content-Type': 'image/x-icon', 'Cache-Control': 'public, max-age=31536000, immutable' },
});
