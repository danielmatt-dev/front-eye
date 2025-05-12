import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { afecciones, patients } from '../../../../shared/utils/mocks';
import { PrimeNG } from 'primeng/config';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-nueva-inspeccion',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, InputText, SelectButton, Textarea, TranslatePipe, IconFieldModule, InputIconModule, TooltipModule, DropdownModule, FormsModule, DatePickerModule, SelectModule],
    templateUrl: './nueva-inspeccion.component.html',
    styleUrl: './nueva-inspeccion.component.scss',
    providers: [MessageService]
})
export class NuevaInspeccionComponent implements OnInit {
    // Variable para almacenar los archivos seleccionados
    files: any[] = [];
    uploadedFiles: any[] = [];
    options = ['Derecho', 'Izquierdo'];

    afecciones = afecciones.filter((afeccion) => afeccion !== 'Todas' );
    selectedAfeccion?: string = undefined
    pacientes = patients;

    doctor = 'Juan García Pérez'
    nombre = '';
    paterno = '';
    materno = ''
    fechaNacimiento = undefined;
    edad = '';
    genero = '';
    correo = ''
    telefono = ''
    ocupacion = '';
    codigoPostal = '';
    direccion = '';
    estado = '';

    patientOptions: any[] = [];
    selectedPatient: any;
    filterFields: string = 'fullName,ocupacion,estado,direccion,genero';

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.patientOptions = this.pacientes.map((patient) => ({
            ...patient,
            fullName: `${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`
        }));
    }

    getTooltip(patient: any): string {
        return `
            Nombre: ${patient.nombre} ${patient.apellidoPaterno} ${patient.apellidoMaterno}\n
            Edad: ${patient.edad} años\n
            Género: ${patient.genero}\n
            Ocupación: ${patient.ocupacion}\n
            Dirección: ${patient.direccion}, ${patient.estado}\n
            Código Postal: ${patient.codigoPostal}
        `;
    }

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

    onPatientSelect(event: any) {
        this.selectedPatient = event.value
        this.nombre = this.selectedPatient.nombre
        this.selectedPatient = event.value;
        this.nombre = this.selectedPatient.nombre || '';
        this.paterno = this.selectedPatient.apellidoPaterno || '';
        this.materno = this.selectedPatient.apellidoMaterno || '';
        this.fechaNacimiento = this.selectedPatient.fechaNacimiento
        this.edad = this.selectedPatient.edad + ' años' || '';
        this.genero = this.selectedPatient.genero || '';
        this.correo = this.selectedPatient.correo
        this.telefono = this.selectedPatient.telefono
        this.ocupacion = this.selectedPatient.ocupacion || '';
        this.codigoPostal = this.selectedPatient.codigoPostal || '';
        this.direccion = this.selectedPatient.direccion || '';
        this.estado = this.selectedPatient.estado || '';
    }
}
