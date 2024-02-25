import { SaveDataPrinter } from '@totk-tools/save-data-printer';
import { SaveDataDiff } from '@totk-tools/save-data-differ';

export interface DiffPrinterOptions {
    label1: string;
    label2: string;
}

export class DiffPrinter {
    private constructor() {
        /* Static class */
    }

    static print(
        printer: SaveDataPrinter,
        diff: SaveDataDiff,
        options: DiffPrinterOptions,
    ): string[] {
        const out: string[] = [];

        for (const [hash, entry] of diff) {
            out.push(
                this.printEntry(
                    printer.printFieldName(hash),
                    options.label1,
                    printer.printData(entry[0]),
                    options.label2,
                    printer.printData(entry[1]),
                ),
            );
        }

        return out;
    }

    private static printEntry(
        fieldName: string,
        label1: string,
        value1: string,
        label2: string,
        value2: string,
    ): string {
        return `Field: ${fieldName}
${label1}: ${value1}
${label2}: ${value2}`;
    }
}
