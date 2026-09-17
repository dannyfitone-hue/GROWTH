import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let logoBytes: Buffer | undefined;
let logoData: string | undefined;

/** Read the same approved asset used by the web UI, with no external requests. */
export function getCompanyLogoBytes(): Buffer {
  return logoBytes ??= readFileSync(
    join(process.cwd(), 'public', 'brand', 'growth-intelligence-llc-transparent.png')
  );
}

export function getCompanyLogoData(): string {
  return logoData ??= `data:image/png;base64,${getCompanyLogoBytes().toString('base64')}`;
}
