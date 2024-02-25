export interface FieldDefinition {
    readonly id: string;
    readonly hash: number;
    readonly name: string;
    readonly type: string;
}

export class FieldCache {
    private _entries: ReadonlyMap<number, FieldDefinition>;

    static coerceToFieldCache(
        fields: FieldCache | readonly FieldDefinition[],
    ): FieldCache {
        if (!(fields instanceof FieldCache)) {
            fields = this.create(fields);
        }

        return fields;
    }

    static create(definitions: readonly FieldDefinition[]): FieldCache {
        const entries = new Map(definitions.map((d) => [d.hash, d]));
        return new FieldCache(entries);
    }

    constructor(entries: ReadonlyMap<number, FieldDefinition>) {
        this._entries = entries;
    }

    get(hash: number): FieldDefinition | undefined {
        return this._entries.get(hash);
    }

    has(hash: number): boolean {
        return this._entries.has(hash);
    }

    values() {
        return this._entries.values();
    }
}
