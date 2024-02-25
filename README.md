# Ryan?'s TOTK Tools

Various tools related to TOTK. For educational purposes only.

Enums, fields, and save reading logic adapted from [marcrobledo/savegame-editors](https://github.com/marcrobledo/savegame-editors/tree/master/zelda-totk)

## Save Data Differ

Compares two save files and outputs fields that differ between the two. Writes to `stdout` by default unless a path is passed with `--out`.

### Build

```
npm install
npm run build:diff-tool
```

### Usage

```
$ npm run diff-tool -- [options] <file1> <file2>
```

```
$ npm run diff-tool -- --out diff.txt save1.sav save2.sav
npm run diff-tool -- --out diff.txt save1.sav save2.sav

> @totk-tools/source@0.0.0 diff-tool
> node ./dist/apps/node-save-diff/main.js --out diff.txt save1.sav save2.sav

Loading enums...
Loading fields...
Loading file 1... save1.sav
Loading file 2... save2.sav
Creating extractor...
Extracting file 1...
Extracting file 2...
Diffing save data...
Writing output to file... diff.txt
Diff complete.
```

```
$ npm run diff-tool -- --help
Usage: npm run diff-tool -- [options] <file1> <file2>

CLI to diff two TOTK save files.

Arguments:
  file1               First of two save files to diff.
  file2               Second of two files to diff.

Options:
  -o, --out <output>  Output diff to a file.
  -h, --help          display help for command
```

## Save Data Dumper

Dumps all fields from a save file. Writes to `stdout` by default unless a path is passed with `--out`.

### Build

```
npm install
npm run build:dump-tool
```

### Usage

```
$ npm run dump-tool -- [options] <file1> <file2>
```

```
$ npm run dump-tool -- --out dump.txt save1.sav
npm run dump-tool -- --out dump.txt save1.sav

> @totk-tools/source@0.0.0 dump-tool
> node ./dist/apps/node-save-dump/main.js --out dump.txt save1.sav

Loading enums...
Loading fields...
Loading file... saves/normal.sav
Creating extractor...
Extracting file...
Writing output to file... dump.txt
Dump complete.
```

```
$ npm run dump-tool -- --help
Usage: npm run dump-tool -- [options] <file>

CLI to dump a TOTK save file.

Arguments:
  file                Save file to dump.

Options:
  -o, --out <output>  Output dump to a file.
  -h, --help          display help for command
```

# See Also

[marcrobledo/savegame-editors/zelda-totk](https://github.com/marcrobledo/savegame-editors/tree/master/zelda-totk)
