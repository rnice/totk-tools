import { DataBuffer } from '@totk-tools/data-buffer';
import {
    DataType,
    FieldCache,
    FieldDefinition,
    IDataValue,
} from '@totk-tools/definitions';
import { SaveDataReader } from '@totk-tools/save-data-reader';

export type ExtractedSaveDataEntry = IDataValue | null;
export type ExtractedSaveData = Map<number, ExtractedSaveDataEntry>;

export interface ISaveDataExtractor {
    extract(data: ArrayBuffer | DataBuffer): ExtractedSaveData;
}

const OFFSET_START = 0x000028;
const OFFSET_END = 0x03c800;
const HASH_STOP = 0xa3db7114;

export class SaveDataExtractor implements ISaveDataExtractor {
    private _fields: FieldCache;

    static create(
        fields: FieldCache | readonly FieldDefinition[],
    ): SaveDataExtractor {
        if (!(fields instanceof FieldCache)) {
            fields = FieldCache.create(fields);
        }

        return new SaveDataExtractor(fields);
    }

    constructor(fields: FieldCache) {
        this._fields = fields;
    }

    extract(data: ArrayBuffer | DataBuffer): ExtractedSaveData {
        data = DataBuffer.coerceToDataBuffer(data);

        const saveDataReader = SaveDataReader.create(data);
        const out: ExtractedSaveData = new Map();

        // Preload all fields.
        for (const field of this._fields.values()) {
            out.set(field.hash, null);
        }

        // Read through the save file searching for hashes to extract.
        for (let offset = OFFSET_START; offset < OFFSET_END; offset += 8) {
            const hash = data.readUInt32(offset);

            if (hash === HASH_STOP) {
                break;
            }

            const field = this._fields.get(hash);

            if (field == null) {
                continue;
            }

            const value = saveDataReader.readAuto(field.type, offset + 4);
            out.set(field.hash, { type: field.type, value: value });
        }

        return out;
    }
}
