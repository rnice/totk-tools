import { writeFile } from 'node:fs/promises';
import { program } from 'commander';
import { SaveDataExtractor } from '@totk-tools/save-data-extractor';
import { EnumCache, FieldCache } from '@totk-tools/definitions';
import { SaveDataDiffer } from '@totk-tools/save-data-differ';
import { SaveDataPrinter } from '@totk-tools/save-data-printer';

import {
    NodeDefinitionLoader,
    NodeSaveDataLoader,
} from '@totk-tools/node-shared';
import { DumpPrinter } from './dump-printer';

program
    .name('npm run dump-tool --')
    .description('CLI to dump a TOTK save file.')
    .argument('<file>', 'Save file to dump.')
    .option('-o, --out <output>', 'Output dump to a file.')
    .showHelpAfterError();

async function main() {
    const command = await program.parseAsync();

    const argFile = command.args[0];
    const optOut = command.opts().out as string | undefined;

    console.debug('Loading enums...');
    const enums = await NodeDefinitionLoader.loadEnums();

    console.debug('Loading fields...');
    const fields = await NodeDefinitionLoader.loadFields();

    console.debug('Loading file...', argFile);
    const file1 = await NodeSaveDataLoader.openFile(argFile);

    console.debug('Creating extractor...');
    const extractor = SaveDataExtractor.create(fields);

    console.debug('Extracting file...');
    const saveData = extractor.extract(file1);

    const printer = SaveDataPrinter.create(enums, fields);

    const SEPARATOR = '\n------\n';
    const formatted = DumpPrinter.print(printer, saveData).join(SEPARATOR);

    if (saveData.size === 0) {
        console.log('No fields found.');
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

    console.log('Dump complete.');
}

main();
