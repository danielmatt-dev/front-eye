import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Calendar } from 'primeng/calendar';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-nueva-inspeccion',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, InputText, Calendar, Select, SelectButton, Textarea],
    templateUrl: './nueva-inspeccion.component.html',
    styleUrl: './nueva-inspeccion.component.scss',
    providers: [MessageService]
})
export class NuevaInspeccionComponent implements OnInit {
    // Variable para almacenar los archivos seleccionados
    files: any[] = [];
    uploadedFiles: any[] = [];
    options = ['Derecho', 'Izquierdo'];

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {}

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    choose(event: any, chooseCallback: any) {
        chooseCallback();
        this.files = event.files;
    }
}
