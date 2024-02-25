import { ExtractedSaveData } from '@totk-tools/save-data-extractor';
import { SaveDataDiff } from './save-data-diff';

export class SaveDataDiffer {
    private constructor() {
        /* Static class */
    }

    static diff(a: ExtractedSaveData, b: ExtractedSaveData): SaveDataDiff {
        const out: SaveDataDiff = new Map();

        const keys = new Set<number>();

        for (const key of a.keys()) keys.add(key);
        for (const key of b.keys()) keys.add(key);

        for (const key of keys) {
            const aValue = a.get(key) ?? null;
            const bValue = b.get(key) ?? null;

            if (!this.deepEquals(aValue, bValue)) {
                out.set(key, [aValue, bValue]);
            }
        }

        return out;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static deepEquals(a: any, b: any): boolean {
        if (a === b) return true;

        if (
            typeof a !== 'object' ||
            typeof b !== 'object' ||
            a === null ||
            b === null
        ) {
            return false;
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!this.deepEquals(a[key], b[key])) return false;
        }

        return true;
    }
}
