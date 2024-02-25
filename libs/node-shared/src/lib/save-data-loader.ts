import { readFile } from 'node:fs/promises';
import { DataBuffer } from '@totk-tools/data-buffer';

export class NodeSaveDataLoader {
    private constructor() {
        /* Static class */
    }

    static async openFile(path: string): Promise<DataBuffer> {
        const buffer = await readFile(path);
        return new DataBuffer(buffer.buffer, true);
    }
}
