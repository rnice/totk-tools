import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileComponent } from './file.component';
import { WebToolsService } from './web-tools.service';

@Component({
    standalone: true,
    imports: [FileComponent, RouterModule],
    selector: 'totk-tools-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    @ViewChild('file1', { read: FileComponent, static: true })
    file1!: FileComponent;

    @ViewChild('file2', { read: FileComponent, static: true })
    file2!: FileComponent;

    constructor(private tools: WebToolsService) {}

    ngOnInit(): void {
        this.tools.initialize().catch((err) => {
            alert('Failed to initialize tools.');
            console.error(err);
        });
    }

    handleClickDiff(event: Event): void {
        event.stopPropagation();

        if (!this.file1.data || !this.file2.data) {
            alert('Diff requires two files.');
            return;
        }

        this.tools.diffData(this.file1.data, this.file2.data);
    }
}
