import { writeFile } from 'node:fs/promises';
import { program } from 'commander';
import { SaveDataExtractor } from '@totk-tools/save-data-extractor';
import { EnumCache, FieldCache } from '@totk-tools/definitions';
import { SaveDataDiffer } from '@totk-tools/save-data-differ';
import { SaveDataPrinter } from '@totk-tools/save-data-printer';
import { DiffPrinter } from './diff-printer';
import {
    NodeDefinitionLoader,
    NodeSaveDataLoader,
} from '@totk-tools/node-shared';

program
    .name('npm run diff-tool --')
    .description('CLI to diff two TOTK save files.')
    .argument('<file1>', 'First of two save files to diff.')
    .argument('<file2>', 'Second of two files to diff.')
    .option('-o, --out <output>', 'Output diff to a file.')
    .showHelpAfterError();

async function main() {
    const command = await program.parseAsync();

    const argFile1 = command.args[0];
    const argFile2 = command.args[1];
    const optOut = command.opts().out as string | undefined;

    console.debug('Loading enums...');
    const enums = await NodeDefinitionLoader.loadEnums();

    console.debug('Loading fields...');
    const fields = await NodeDefinitionLoader.loadFields();

    console.debug('Loading file 1...', argFile1);
    const file1 = await NodeSaveDataLoader.openFile(argFile1);

    console.debug('Loading file 2...', argFile2);
    const file2 = await NodeSaveDataLoader.openFile(argFile2);

    console.debug('Creating extractor...');
    const extractor = SaveDataExtractor.create(fields);
    console.debug('Extracting file 1...');

    const saveData1 = extractor.extract(file1);

    console.debug('Extracting file 2...');
    const saveData2 = extractor.extract(file2);

    console.debug('Diffing save data...');
    const diff = SaveDataDiffer.diff(saveData1, saveData2);

    const printer = SaveDataPrinter.create(enums, fields);

    const SEPARATOR = '\n------\n';
    const formatted = DiffPrinter.print(printer, diff, {
        label1: 'File 1',
        label2: 'File 2',
    }).join(SEPARATOR);

    if (diff.size === 0) {
        console.log('No differences found.');
    } else {
        if (optOut) {
            console.debug('Writing output to file...', optOut);
            await writeFile(optOut, formatted);
        } else {
            console.debug('Writing output to stdout...');
            process.stdout.write(formatted);
            process.stdout.write('\n');
        }
    }

    console.log('Diff complete.');
}

main();
