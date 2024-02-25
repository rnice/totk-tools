import {
    EnumCache,
    EnumDefinition,
    FieldCache,
    FieldDefinition,
} from '@totk-tools/definitions';
import { NodeAssetLoader } from './asset-loader';

export class NodeDefinitionLoader {
    private constructor() {
        /* Static class */
    }

    static async loadEnums(): Promise<EnumCache> {
        const definitions = await NodeAssetLoader.loadAssetJSON<
            EnumDefinition[]
        >('enums.json');

        // Sort by hash.
        definitions.sort((a, b) => a.hash - b.hash);

        return EnumCache.create(definitions);
    }

    static async loadFields(): Promise<FieldCache> {
        const definitions = await NodeAssetLoader.loadAssetJSON<
            FieldDefinition[]
        >('fields.json');

        // Collator to sort fields by name.
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            caseFirst: 'false',
            sensitivity: 'base',
            usage: 'sort',
        });

        definitions.sort((a, b) => collator.compare(a.name, b.name));

        return FieldCache.create(definitions);
    }
}
