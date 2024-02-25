import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export class NodeAssetLoader {
    private constructor() {
        /* Static class */
    }

    static async loadAssetJSON<T>(
        ...pathComponents: readonly string[]
    ): Promise<T> {
        const path = join(__dirname, '..', 'assets', ...pathComponents);
        const data = await readFile(path, 'utf-8');
        return JSON.parse(data);
    }
}
