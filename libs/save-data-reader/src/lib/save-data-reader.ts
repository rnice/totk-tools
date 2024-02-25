import { DataBuffer } from '@totk-tools/data-buffer';
import { DataType, DataValue, Vector2, Vector3 } from '@totk-tools/definitions';

export interface ISaveDataReader {
    readAuto(type: string, offset: number): DataValue['value'];
    readBinary(offset: number): number[];
    readBinaryArray(offset: number): number[][];
    readBool(offset: number): boolean;
    readBoolArray(offset: number): boolean[];
    readEnum(offset: number): number;
    readEnumArray(offset: number): number[];
    readFloat(offset: number): number;
    readFloatArray(offset: number): number[];
    readInt(offset: number): number;
    readIntArray(offset: number): number[];
    readString32(offset: number): string;
    readString64(offset: number): string;
    readString64Array(offset: number): string[];
    readUInt(offset: number): number;
    readUIntArray(offset: number): number[];
    readUInt64(offset: number): bigint;
    readUInt64Array(offset: number): bigint[];
    readVector2(offset: number): Vector2;
    readVector2Array(offset: number): Vector2[];
    readVector3(offset: number): Vector3;
    readVector3Array(offset: number): Vector3[];
    readWString16(offset: number): string;
    readWString16Array(offset: number): string[];
}

export class SaveDataReader implements ISaveDataReader {
    private _buffer: DataBuffer;

    static create(buffer: DataBuffer | ArrayBuffer) {
        if (!(buffer instanceof DataBuffer)) {
            buffer = new DataBuffer(buffer, true);
        }

        return new SaveDataReader(buffer);
    }

    constructor(buffer: DataBuffer) {
        this._buffer = buffer;
    }

    readAuto(type: string, offset: number): DataValue['value'] {
        if (!DataType.isValid(type)) {
            throw new Error(`Unknown data type '${type}'`);
        }

        switch (type) {
            case DataType.Binary:
                return this.readBinary(offset);
            case DataType.BinaryArray:
                return this.readBinaryArray(offset);
            case DataType.Bool:
                return this.readBool(offset);
            case DataType.BoolArray:
                return this.readBoolArray(offset);
            case DataType.Enum:
                return this.readEnum(offset);
            case DataType.EnumArray:
                return this.readEnumArray(offset);
            case DataType.Float:
                return this.readFloat(offset);
            case DataType.FloatArray:
                return this.readFloatArray(offset);
            case DataType.Int:
                return this.readInt(offset);
            case DataType.IntArray:
                return this.readIntArray(offset);
            case DataType.String32:
                return this.readString32(offset);
            case DataType.String64:
                return this.readString64(offset);
            case DataType.String64Array:
                return this.readString64Array(offset);
            case DataType.UInt:
                return this.readUInt(offset);
            case DataType.UIntArray:
                return this.readUIntArray(offset);
            case DataType.UInt64:
                return this.readUInt64(offset);
            case DataType.UInt64Array:
                return this.readUInt64Array(offset);
            case DataType.Vector2:
                return this.readVector2(offset);
            case DataType.Vector2Array:
                return this.readVector2Array(offset);
            case DataType.Vector3:
                return this.readVector3(offset);
            case DataType.Vector3Array:
                return this.readVector3Array(offset);
            case DataType.WString16:
                return this.readWString16(offset);
            case DataType.WString16Array:
                return this.readWString16Array(offset);
        }
    }

    readBinary(offset: number): number[] {
        const length = this._buffer.readUInt32(offset);
        return this._buffer.readBytes(offset + 4, length);
    }

    readBinaryArray(offset: number): number[][] {
        offset = this.readDynamicOffset(offset);
        const length = this.readArrayLength(offset);
        offset += 4;
        const out = new Array<number[]>(length);
        for (let i = 0; i < length; i++) {
            const binary = this.readBinary(offset);
            offset += 4 + binary.length;
            out[i] = binary;
        }
        return out;
    }

    readBool(offset: number): boolean {
        return this._buffer.readUInt32(offset) !== 0;
    }

    readBoolArray(offset: number): boolean[] {
        offset = this.readDynamicOffset(offset);
        const length = this.readArrayLength(offset);
        const elementsOffset = offset + 4;
        const array = new Array<boolean>(length);
        for (let i = 0; i < length; i++) {
            const arrayOffset = elementsOffset + Math.floor(i / 8);
            const byte = this._buffer.readUInt8(arrayOffset);
            const value = ((byte >> i % 8) & 0x01) != 0;
            array[i] = value;
        }
        return array;
    }

    readEnum(offset: number): number {
        return this._buffer.readUInt32(offset);
    }

    readEnumArray(offset: number): number[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x04, this.readEnum);
    }

    readFloat(offset: number): number {
        return this._buffer.readFloat32(offset);
    }

    readFloatArray(offset: number): number[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x04, this.readFloat);
    }

    readInt(offset: number): number {
        return this._buffer.readUInt32(offset);
    }

    readIntArray(offset: number): number[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x04, this.readInt);
    }

    readString32(offset: number, isArray = false): string {
        if (!isArray) {
            offset = this.readDynamicOffset(offset);
        }
        return this._buffer.readString(offset, 32);
    }

    readString64(offset: number, isArray = false): string {
        if (!isArray) {
            offset = this.readDynamicOffset(offset);
        }
        return this._buffer.readString(offset, 64);
    }

    readString64Array(offset: number): string[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x40, this.readString64);
    }

    readUInt(offset: number): number {
        return this._buffer.readUInt32(offset);
    }

    readUIntArray(offset: number): number[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x04, this.readUInt);
    }

    readUInt64(offset: number): bigint {
        return this._buffer.readUInt64(offset);
    }

    readUInt64Array(offset: number): bigint[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x08, this.readUInt64);
    }

    readVector2(offset: number, isArray = false): Vector2 {
        if (!isArray) {
            offset = this.readDynamicOffset(offset);
        }
        const x = this._buffer.readFloat32(offset);
        const y = this._buffer.readFloat32(offset + 4);
        return [x, y];
    }

    readVector2Array(offset: number): Vector2[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x08, this.readVector2);
    }

    readVector3(offset: number, isArray = false): Vector3 {
        if (!isArray) {
            offset = this.readDynamicOffset(offset);
        }
        const x = this._buffer.readFloat32(offset);
        const y = this._buffer.readFloat32(offset + 4);
        const z = this._buffer.readFloat32(offset + 8);
        return [x, y, z];
    }

    readVector3Array(offset: number): Vector3[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x0c, this.readVector3);
    }

    readWString16(offset: number, isArray = false): string {
        if (!isArray) {
            offset = this.readDynamicOffset(offset);
        }
        let str = '';
        for (let i = 0; i < 0x20; i += 2) {
            const charCode = this._buffer.readUInt16(offset + i);
            if (!charCode) break;
            str += String.fromCharCode(charCode);
        }
        // eslint-disable-next-line no-control-regex
        return str.replace(/\u0000+$/, '');
    }

    readWString16Array(offset: number): string[] {
        offset = this.readDynamicOffset(offset);
        return this.readArray(offset, 0x20, this.readWString16);
    }

    private readArray<T>(
        offset: number,
        elementSize: number,
        readFn: (offset: number, isArray: boolean) => T,
    ): T[] {
        const length = this.readArrayLength(offset);
        const array = new Array<T>(length);
        const elementsOffset = offset + 4;
        for (let i = 0; i < length; i++) {
            array[i] = readFn.call(
                this,
                elementsOffset + i * elementSize,
                true,
            );
        }
        return array;
    }

    private readArrayLength(offset: number): number {
        return this._buffer.readUInt32(offset);
    }

    private readDynamicOffset(offset: number): number {
        return this._buffer.readUInt32(offset);
    }
}
