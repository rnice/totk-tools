import { Injectable } from '@angular/core';
import { EnumCache, FieldCache } from '@totk-tools/definitions';
import { DataBuffer } from '@totk-tools/data-buffer';
import {
    ExtractedSaveData,
    SaveDataExtractor,
} from '@totk-tools/save-data-extractor';
import { SaveDataPrinter } from '@totk-tools/save-data-printer';
import { SaveDataDiffer } from '@totk-tools/save-data-differ';

@Injectable({ providedIn: 'root' })
export class WebToolsService {
    private _enums: EnumCache | null;
    private _fields: FieldCache | null;
    private _extractor: SaveDataExtractor | null;
    private _printer: SaveDataPrinter | null;

    constructor() {
        this._enums = null;
        this._fields = null;
        this._extractor = null;
        this._printer = null;
    }

    async initialize(): Promise<void> {
        this._enums = EnumCache.create(await this.fetchAssetJSON('enums.json'));
        this._fields = FieldCache.create(
            await this.fetchAssetJSON('fields.json'),
        );
        this._extractor = SaveDataExtractor.create(this._fields);
        this._printer = SaveDataPrinter.create(this._enums, this._fields);
    }

    async openFile(file: File): Promise<DataBuffer> {
        const buffer = await this.readFileAsBuffer(file);
        return new DataBuffer(buffer, true);
    }

    download(content: string, filename: string, contentType: string) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    extractData(dataBuffer: DataBuffer) {
        return this._extractor!.extract(dataBuffer);
    }

    dumpData(data: ExtractedSaveData): void {
        const content: string[] = [];
        for (const [hash, field] of data) {
            content.push(
                `Field: ${this._printer!.printFieldName(
                    hash,
                )}\nValue: ${this._printer!.printData(field)}`,
            );
        }

        this.download(content.join('\n-------\n'), 'dump.txt', 'text/plain');
    }

    diffData(data1: ExtractedSaveData, data2: ExtractedSaveData): void {
        const diff = SaveDataDiffer.diff(data1, data2);

        if (diff.size === 0) {
            alert('No difference between files.');
            return;
        }

        const content: string[] = [];

        for (const [hash, entry] of diff) {
            content.push(`Field: ${this._printer!.printFieldName(hash)}
File 1: ${this._printer!.printData(entry[0])}
File 2: ${this._printer!.printData(entry[1])}`);
        }

        this.download(content.join('\n-------\n'), 'diff.txt', 'text/plain');
    }

    private async fetchAssetJSON<T>(path: string): Promise<T> {
        const response = await fetch(`./assets/${path}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    private readFileAsBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (error) => reject(error);

            reader.onload = (e) => {
                resolve(e.target!.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(file);
        });
    }
}
