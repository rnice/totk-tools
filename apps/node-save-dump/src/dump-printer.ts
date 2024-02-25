import { SaveDataPrinter } from '@totk-tools/save-data-printer';
import { ExtractedSaveData } from '@totk-tools/save-data-extractor';

export class DumpPrinter {
    private constructor() {
        /* Static class */
    }

    static print(printer: SaveDataPrinter, data: ExtractedSaveData): string[] {
        const out: string[] = [];

        for (const [hash, entry] of data) {
            const fieldName = printer.printFieldName(hash);
            out.push(this.printEntry(fieldName, printer.printData(entry)));
        }

        return out;
    }

    private static printEntry(fieldName: string, value: string): string {
        return `Field: ${fieldName}\nValue: ${value}`;
    }
}
