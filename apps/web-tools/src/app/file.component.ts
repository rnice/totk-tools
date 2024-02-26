import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExtractedSaveData } from '@totk-tools/save-data-extractor';
import { WebToolsService } from './web-tools.service';

@Component({
    standalone: true,
    imports: [FormsModule],
    selector: 'totk-tools-file',
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss',
})
export class FileComponent {
    @ViewChild('input', { read: ElementRef, static: true })
    input!: ElementRef<HTMLInputElement>;

    @Input() label!: string;

    data: ExtractedSaveData | null = null;

    constructor(private tools: WebToolsService) {}

    handleClickClear(event: Event): void {
        event.stopPropagation();
        this.input.nativeElement.value = '';
    }

    handleClickDump(event: Event): void {
        event.stopPropagation();
        if (this.data == null) {
            alert('No save data to export.');
            return;
        }

        this.tools.dumpData(this.data);
    }

    async handleFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            try {
                const buffer = await this.tools.openFile(input.files[0]);
                this.data = this.tools.extractData(buffer);
            } catch (ex) {
                alert('Error parsing save file.');
                this.data = null;
                this.input.nativeElement.value = '';
            }
        } else {
            this.data = null;
        }
    }
}
