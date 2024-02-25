export interface EnumDefinition {
    readonly hash: number;
    readonly value: string;
}

export class EnumCache {
    private _entries: ReadonlyMap<number, EnumDefinition>;

    static coerceToEnumCache(
        enums: EnumCache | readonly EnumDefinition[],
    ): EnumCache {
        if (!(enums instanceof EnumCache)) {
            enums = this.create(enums);
        }

        return enums;
    }

    static create(definitions: readonly EnumDefinition[]): EnumCache {
        const entries = new Map(definitions.map((d) => [d.hash, d]));
        return new EnumCache(entries);
    }

    constructor(entries: ReadonlyMap<number, EnumDefinition>) {
        this._entries = entries;
    }

    get(hash: number): EnumDefinition | undefined {
        return this._entries.get(hash);
    }

    has(hash: number): boolean {
        return this._entries.has(hash);
    }
}
