export interface IDataBuffer {
    readBytes(offset: number, length: number): number[];
    readFloat32(offset: number): number;
    readInt32(offset: number): number;
    readString(offset: number, length: number): string;
    readUInt8(offset: number): number;
    readUInt16(offset: number): number;
    readUInt32(offset: number): number;
    readUInt64(offset: number): bigint;
    size(): number;
}

export class DataBuffer implements IDataBuffer {
    private _dataView: DataView;
    private _littleEndian: boolean;
    private _size: number;

    static coerceToDataBuffer(buffer: ArrayBuffer | DataBuffer): DataBuffer {
        if (buffer instanceof DataBuffer) {
            return buffer;
        }

        return new DataBuffer(buffer, true);
    }

    constructor(buffer: ArrayBuffer, littleEndian: boolean) {
        this._dataView = new DataView(buffer);
        this._littleEndian = littleEndian;
        this._size = buffer.byteLength;
    }

    readBytes(offset: number, length: number): number[] {
        const out = new Array<number>(length);
        for (let i = 0; i < length; i++) {
            out[i] = this._dataView.getUint8(offset + i);
        }
        return out;
    }

    readFloat32(offset: number): number {
        return this._dataView.getFloat32(offset, this._littleEndian);
    }

    readInt32(offset: number): number {
        return this._dataView.getInt32(offset, this._littleEndian);
    }

    readString(offset: number, length: number): string {
        let str = '';

        // Clamp the length to the bounds of the buffer.
        length = Math.max(0, Math.min(length, this._size - offset));

        for (let i = 0; i < length; i++) {
            const char = this._dataView.getUint8(offset + i);

            if (char === 0) {
                break;
            }

            str += String.fromCharCode(char);
        }

        return str;
    }

    readUInt8(offset: number): number {
        return this._dataView.getUint8(offset);
    }

    readUInt16(offset: number): number {
        return this._dataView.getUint16(offset, this._littleEndian);
    }

    readUInt32(offset: number): number {
        return this._dataView.getUint32(offset, this._littleEndian);
    }

    readUInt64(offset: number): bigint {
        return this._dataView.getBigUint64(offset, this._littleEndian);
    }

    size() {
        return this._size;
    }
}
