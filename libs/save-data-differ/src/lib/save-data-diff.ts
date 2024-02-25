import { ExtractedSaveDataEntry } from '@totk-tools/save-data-extractor';

export type SaveDataDiffEntry = [
    ExtractedSaveDataEntry,
    ExtractedSaveDataEntry,
];
export type SaveDataDiff = Map<number, SaveDataDiffEntry>;
