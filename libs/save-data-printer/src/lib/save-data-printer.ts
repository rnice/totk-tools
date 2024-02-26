import {
    DataType,
    DataValueEnum,
    DataValueEnumArray,
    EnumCache,
    EnumDefinition,
    FieldCache,
    FieldDefinition,
    IDataValue,
} from '@totk-tools/definitions';

export class SaveDataPrinter {
    private _enums: EnumCache;
    private _fields: FieldCache;

    static create(
        enums: EnumCache | readonly EnumDefinition[],
        fields: FieldCache | readonly FieldDefinition[],
    ): SaveDataPrinter {
        enums = EnumCache.coerceToEnumCache(enums);
        fields = FieldCache.coerceToFieldCache(fields);
        return new SaveDataPrinter(enums, fields);
    }

    constructor(enums: EnumCache, fields: FieldCache) {
        this._enums = enums;
        this._fields = fields;
    }

    printData(data: IDataValue | null): string {
        if (data == null) {
            return this.printNull();
        }

        let value: string;

        if (data.type === DataType.Enum) {
            value = this.printDataEnum(data as DataValueEnum);
        } else if (data.type === DataType.EnumArray) {
            value = this.printDataEnumArray(data as DataValueEnumArray);
        } else {
            value = this.printValueJSON(data.value);
        }

        let typeStr = `${data.type}`;

        if (this.isDynamicallySized(data.type) && this.hasLength(data.value)) {
            const length = data.value.length;
            typeStr += `[${length}]`;
        }

        return `(${typeStr}) ${value}`;
    }

    printFieldName(hash: number): string {
        const fieldDefinition = this._fields.get(hash);
        if (fieldDefinition == null) {
            return this.printUnknown(hash);
        }
        return fieldDefinition.name;
    }

    private hasLength(value: unknown): value is { length: number } {
        return value != null && typeof (value as any).length === 'number';
    }

    private isDynamicallySized(type: string): boolean {
        if (DataType.isArrayType(type as DataType)) {
            return true;
        }

        switch (type) {
            case DataType.Binary:
            case DataType.String32:
            case DataType.String64:
            case DataType.WString16:
                return true;
            default:
                return false;
        }
    }

    private printDataEnum(data: DataValueEnum): string {
        return this.printEnumValue(data.value);
    }

    private printDataEnumArray(data: DataValueEnumArray): string {
        const elements = data.value.map((h) => this.printEnumValue(h));
        return `[${elements.join(',')}]`;
    }

    private printEnumValue(hash: number): string {
        const enumDefinition = this._enums.get(hash);
        if (enumDefinition == null) {
            return this.printUnknown(hash);
        }
        return enumDefinition.value;
    }

    private printNull(): string {
        return '<null>';
    }

    private printUnknown(hash: number): string {
        return `<Unknown (${hash})>`;
    }

    private printValueJSON(value: unknown): string {
        return JSON.stringify(value, this.jsonReplaceBigInt);
    }

    private jsonReplaceBigInt(_key: string, value: unknown): unknown {
        if (typeof value === 'bigint') {
            return `${value}`;
        }

        return value;
    }
}
