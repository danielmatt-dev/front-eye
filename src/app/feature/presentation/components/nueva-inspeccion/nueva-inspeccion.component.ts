import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { TranslatePipe } from '@ngx-translate/core';
import { afecciones, models, patients, resultados, State } from '../../../../shared/utils/mocks';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { mapColors } from '../../../../core/theme/colors';

@Component({
    selector: 'app-nueva-inspeccion',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, InputText, SelectButton, Textarea, TranslatePipe, IconFieldModule, InputIconModule, TooltipModule, DropdownModule, FormsModule, DatePickerModule, SelectModule, Skeleton],
    templateUrl: './nueva-inspeccion.component.html',
    styleUrl: './nueva-inspeccion.component.scss',
    providers: [MessageService]
})
export class NuevaInspeccionComponent implements OnInit {
    // Variable para almacenar los archivos seleccionados
    files: any[] = [];
    uploadedFiles: any[] = [];
    options = ['Derecho', 'Izquierdo'];
    selectedEye?: string = undefined;

    afecciones = afecciones.filter((afeccion) => afeccion !== 'Todas');
    models = models;
    selectedModel?: string = undefined;

    selectedAfeccion?: string = undefined;
    pacientes = patients;

    doctor = 'Jorge Ernesto Gonzalez Diaz';
    nombre = '';
    paterno = '';
    materno = '';
    fechaNacimiento = undefined;
    edad = '';
    genero = '';
    correo = '';
    telefono = '';
    ocupacion = '';
    codigoPostal = '';
    direccion = '';
    estado = '';

    patientOptions: any[] = [];
    selectedPatient: any;
    filterFields: string = 'fullName,ocupacion,estado,direccion,genero';

    state = State.initial;
    resultado = '';
    color = '';
    resultados = resultados.filter((r) => r !== 'Todos');

    constructor(private readonly messageService: MessageService) {}

    ngOnInit() {
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
        // Verificar si ya existe un archivo cargado
        if (this.uploadedFiles.length >= 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Solo se permite subir un único archivo.'
            });
            return;
        }

        // Cargar el archivo si no hay ninguno previo
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Éxito',
            detail: 'Archivo cargado correctamente.'
        });
    }

    choose(event: any, chooseCallback: any) {
        // Verificar si ya existe un archivo cargado y mostrar mensaje
        if (this.files && this.files.length >= 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Solo se permite seleccionar un único archivo.'
            });
            return;
        }

        // Si no hay archivo previo, continuar con la selección
        chooseCallback();
        this.files = event.files;
    }

    onPatientSelect(event: any) {
        this.selectedPatient = event.value;
        this.nombre = this.selectedPatient.nombre;
        this.selectedPatient = event.value;
        this.nombre = this.selectedPatient.nombre || '';
        this.paterno = this.selectedPatient.apellidoPaterno || '';
        this.materno = this.selectedPatient.apellidoMaterno || '';
        this.fechaNacimiento = this.selectedPatient.fechaNacimiento;
        this.edad = this.calcularEdad(this.selectedPatient.fechaNacimiento) + ' años';
        this.genero = this.selectedPatient.genero || '';
        this.correo = this.selectedPatient.correo;
        this.telefono = this.selectedPatient.telefono;
        this.ocupacion = this.selectedPatient.ocupacion || '';
        this.codigoPostal = this.selectedPatient.codigoPostal || '';
        this.direccion = this.selectedPatient.direccion || '';
        this.estado = this.selectedPatient.estado || '';
    }

    inspeccionar() {

        if (!this.validateSelection()){
            return
        }

        this.state = State.loading;
        setTimeout(() => {
            // Generar un resultado aleatorio, excluyendo "Todos"
            const randomResult = this.resultados[Math.floor(Math.random() * (this.resultados.length - 1)) + 1];
            this.resultado = randomResult;
            this.color = this.colorPorCategoria(randomResult);
            this.state = State.success;
        }, 5000); // Simulación de 5 segundos
    }

    colorPorCategoria(cat: string) {
        switch (cat) {
            case 'Proliferativo': return mapColors['red'];
            case 'Moderado': return mapColors['amber'];
            case 'Leve': return mapColors['blue'];
            case 'Sin Afección': return mapColors['green'];
            default: return 'gray';
        }
    }

    calcularEdad(fechaNacimiento: string): number {
        const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);
        const fechaNac = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();

        // Ajustar si el cumpleaños aún no ha pasado este año
        if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }

    validateSelection(): boolean {

        if (!this.selectedEye) {
            this.showError('Debe seleccionar el ojo.');
            return false;
        }

        if (!this.selectedAfeccion) {
            this.showError('Debe seleccionar la enfermedad.');
            return false;
        }

        if (!this.selectedModel) {
            this.showError('Debe seleccionar el modelo.');
            return false;
        }

        return !!(this.selectedEye && this.selectedModel && this.selectedAfeccion);
    }

    // Mostrar mensaje de error
    showError(message: string) {
        this.messageService.add({ severity: 'warn', summary: 'Campo requerido', detail: message });
    }

    protected readonly State = State;
}
