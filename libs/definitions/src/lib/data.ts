export enum DataType {
    Binary = 'Binary',
    BinaryArray = 'BinaryArray',
    Bool = 'Bool',
    BoolArray = 'BoolArray',
    Enum = 'Enum',
    EnumArray = 'EnumArray',
    Float = 'Float',
    FloatArray = 'FloatArray',
    Int = 'Int',
    IntArray = 'IntArray',
    String32 = 'String32',
    String64 = 'String64',
    String64Array = 'String64Array',
    UInt = 'UInt',
    UIntArray = 'UIntArray',
    UInt64 = 'UInt64',
    UInt64Array = 'UInt64Array',
    Vector2 = 'Vector2',
    Vector2Array = 'Vector2Array',
    Vector3 = 'Vector3',
    Vector3Array = 'Vector3Array',
    WString16 = 'WString16',
    WString16Array = 'WString16Array',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DataType {
    export function isValid(type: string): type is DataType {
        switch (type) {
            case DataType.Binary:
            case DataType.BinaryArray:
            case DataType.Bool:
            case DataType.BoolArray:
            case DataType.Enum:
            case DataType.EnumArray:
            case DataType.Float:
            case DataType.FloatArray:
            case DataType.Int:
            case DataType.IntArray:
            case DataType.String32:
            case DataType.String64:
            case DataType.String64Array:
            case DataType.UInt:
            case DataType.UIntArray:
            case DataType.UInt64:
            case DataType.UInt64Array:
            case DataType.Vector2:
            case DataType.Vector2Array:
            case DataType.Vector3:
            case DataType.Vector3Array:
            case DataType.WString16:
            case DataType.WString16Array:
                return true;
            default:
                return false;
        }
    }

    export function isArrayType(type: DataType): boolean {
        switch (type) {
            case DataType.BinaryArray:
            case DataType.BoolArray:
            case DataType.EnumArray:
            case DataType.FloatArray:
            case DataType.IntArray:
            case DataType.String64Array:
            case DataType.UIntArray:
            case DataType.UInt64Array:
            case DataType.Vector2Array:
            case DataType.Vector3Array:
            case DataType.WString16Array:
                return true;
            default:
                return false;
        }
    }

    export function getArrayType(type: DataType): DataType {
        switch (type) {
            case DataType.BinaryArray:
                return DataType.Binary;
            case DataType.BoolArray:
                return DataType.Bool;
            case DataType.EnumArray:
                return DataType.Enum;
            case DataType.FloatArray:
                return DataType.Float;
            case DataType.IntArray:
                return DataType.Int;
            case DataType.String64Array:
                return DataType.String64;
            case DataType.UIntArray:
                return DataType.UInt;
            case DataType.UInt64Array:
                return DataType.UInt64;
            case DataType.Vector2Array:
                return DataType.Vector2;
            case DataType.Vector3Array:
                return DataType.Vector3;
            case DataType.WString16Array:
                return DataType.WString16;
        }

        return type;
    }
}

export type Vector2 = [x: number, y: number];
export type Vector3 = [x: number, y: number, z: number];

export interface IDataValue {
    type: string;
    value: unknown;
}

export type DataValue =
    | DataValueBinary
    | DataValueBinaryArray
    | DataValueBool
    | DataValueBoolArray
    | DataValueEnum
    | DataValueEnumArray
    | DataValueFloat
    | DataValueFloatArray
    | DataValueInt
    | DataValueIntArray
    | DataValueString32
    | DataValueString64
    | DataValueString64Array
    | DataValueUInt
    | DataValueUIntArray
    | DataValueUInt64
    | DataValueUInt64Array
    | DataValueVector2
    | DataValueVector2Array
    | DataValueVector3
    | DataValueVector3Array
    | DataValueWString16
    | DataValueWString16Array;

export interface DataValueBinary extends IDataValue {
    type: DataType.Binary;
    value: number[];
}

export interface DataValueBinaryArray extends IDataValue {
    type: DataType.BinaryArray;
    value: number[][];
}

export interface DataValueBool extends IDataValue {
    type: DataType.Bool;
    value: boolean;
}

export interface DataValueBoolArray extends IDataValue {
    type: DataType.BoolArray;
    value: boolean[];
}

export interface DataValueEnum extends IDataValue {
    type: DataType.Enum;
    value: number;
}

export interface DataValueEnumArray extends IDataValue {
    type: DataType.EnumArray;
    value: number[];
}

export interface DataValueFloat extends IDataValue {
    type: DataType.Float;
    value: number;
}

export interface DataValueFloatArray extends IDataValue {
    type: DataType.FloatArray;
    value: number[];
}

export interface DataValueInt extends IDataValue {
    type: DataType.Int;
    value: number;
}

export interface DataValueIntArray extends IDataValue {
    type: DataType.IntArray;
    value: number[];
}

export interface DataValueString32 extends IDataValue {
    type: DataType.String32;
    value: string;
}

export interface DataValueString64 extends IDataValue {
    type: DataType.String64;
    value: string;
}

export interface DataValueString64Array extends IDataValue {
    type: DataType.String64Array;
    value: string[];
}

export interface DataValueUInt extends IDataValue {
    type: DataType.UInt;
    value: number;
}

export interface DataValueUIntArray extends IDataValue {
    type: DataType.UIntArray;
    value: number[];
}

export interface DataValueUInt64 extends IDataValue {
    type: DataType.UInt64;
    value: bigint;
}

export interface DataValueUInt64Array extends IDataValue {
    type: DataType.UInt64Array;
    value: bigint[];
}

export interface DataValueVector2 extends IDataValue {
    type: DataType.Vector2;
    value: Vector2;
}

export interface DataValueVector2Array extends IDataValue {
    type: DataType.Vector2Array;
    value: Vector2[];
}

export interface DataValueVector3 extends IDataValue {
    type: DataType.Vector3;
    value: Vector3;
}

export interface DataValueVector3Array extends IDataValue {
    type: DataType.Vector3Array;
    value: Vector3[];
}

export interface DataValueWString16 extends IDataValue {
    type: DataType.WString16;
    value: string;
}

export interface DataValueWString16Array extends IDataValue {
    type: DataType.WString16Array;
    value: string[];
}
