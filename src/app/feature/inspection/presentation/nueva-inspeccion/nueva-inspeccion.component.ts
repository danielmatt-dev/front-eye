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
import { models, patientsResponseMocks, State } from '../../../../shared/utils/mocks';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { PatientResponseEntity } from '../../../patient/domain/entity/patient.response.entity';
import { colorByResult, formatDateToDDMMYYYY } from '../../../../shared/utils/functions/functions';
import { diseases, eyes, results } from '../../../../shared/utils/data';
import { PrimeNG } from 'primeng/config';
import { NewInspectionValidator } from './validation/new.inspection.validator';
import { Image } from 'primeng/image';

@Component({
    selector: 'app-nueva-inspeccion',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, InputText, SelectButton, Textarea, TranslatePipe, IconFieldModule, InputIconModule, TooltipModule, DropdownModule, FormsModule, DatePickerModule, SelectModule, Skeleton, Image],
    templateUrl: './nueva-inspeccion.component.html',
    styleUrl: './nueva-inspeccion.component.scss',
    providers: [MessageService]
})
export class NuevaInspeccionComponent implements OnInit {
    /* Variables de la inspección */
    images: File[] = []; // Almacenar la imagen de la inspección del ojo

    eyes = eyes;
    selectedEye?: string;

    afecciones = diseases;
    selectedDisease?: string = undefined;

    models = models;
    selectedModel?: string;

    /* Variables del paciente */
    allPatients: PatientResponseEntity[] = patientsResponseMocks;
    selectedPatient?: PatientResponseEntity;
    patientOptions: any[] = [];
    birthDate?: string = '';

    /* Campos del paciente */
    patientId?: number;
    firstName = '';
    lastFatherName = '';
    lastMotherName = '';
    email = '';
    phone = '';
    gender = '';
    age = 0;
    address = '';
    postalCode = '';
    occupation = '';
    statePatient = '';

    doctor = 'Jorge Ernesto Gonzalez Diaz';

    /* Campos para filtrar en el select component */
    filterFields: string = 'fullName,firstName,firstName,lastMontName,occupation,state,address,gender';
    State = State;

    /* Variables del resultado de la inspección */
    state = State.initial;
    result = '';
    colorResult = '';
    results = results;

    /* Variables para la validación de campos de la inspección */
    patientError?: string;
    eyeError?: string;
    diseaseError?: string;
    modelError?: string;
    imageError?: string;

    /* Providers */
    validator: NewInspectionValidator;

    constructor(
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly messageService: MessageService
    ) {
        this.validator = NewInspectionValidator.getInstance(this.messageService, this.translateService, this.primeng);
    }

    ngOnInit() {
        this.patientOptions = this.allPatients.map((patient) => ({
            ...patient,
            fullName: `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`
        }));
    }

    // Llamadas a casos de uso
    inspect() {
        if (!this.isFormaValid()) {
            this.validator.showMessage({ key: 'invalidForm' });
            return;
        }

        this.state = State.loading;
        setTimeout(() => {
            // Generar un resultado aleatorio, excluyendo "Todos"
            const randomResult = this.results[Math.floor(Math.random() * (this.results.length - 1)) + 1];
            this.result = randomResult;
            this.colorResult = colorByResult(randomResult);
            this.state = State.success;
        }, 5000); // Simulación de 5 segundos
    }

    // Función de validación
    isFormaValid(): boolean {
        this.onFormChange();
        return !(
            this.imageError ??
            this.patientError ??
            this.eyeError ??
            this.diseaseError ??
            this.modelError
        );
    }

    // Funciones de interacción con la interfaz
    getTooltip(patient: PatientResponseEntity): string {
        return `
            Nombre: ${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}\n
            Edad: ${patient.age} años\n
            Género: ${patient.gender}\n
            Ocupación: ${patient.occupation}\n
            Dirección: ${patient.address}, ${patient.state}\n
            Código Postal: ${patient.postalCode}
        `;
    }

    onSelect(event: any) {
        const file = event.files[0];
        this.images = [];
        this.images.push(file);
    }

    onPatientSelect(event: any) {
        this.patientId = event.value.patientId;
        this.firstName = event.value.firstName;
        this.lastFatherName = event.value.lastFathName;
        this.lastMotherName = event.value.lastMontName;
        this.email = event.value.email;
        this.phone = event.value.phone;
        this.gender = event.value.gender;
        this.age = event.value.age;
        this.address = event.value.address;
        this.postalCode = event.value.postalCode;
        this.occupation = event.value.occupation;
        this.birthDate = formatDateToDDMMYYYY(event.value.birthDate);
        this.statePatient = event.value.state;
        this.onPatientChange();
    }

    onPatientChange() {
        this.patientError = this.validator.validatePatientSelected(this.selectedPatient);
    }

    onImageChange() {
        this.imageError = this.validator.validateImageSelected(this.images)
    }

    onEyeChange() {
        this.eyeError = this.validator.validateSelected(this.selectedEye);
    }

    onDiseaseChange() {
        this.diseaseError = this.validator.validateSelected(this.selectedDisease);
    }

    onModelChange() {
        this.modelError = this.validator.validateSelected(this.selectedModel);
    }

    onFormChange() {
        this.onPatientChange();
        this.onImageChange()
        this.onEyeChange();
        this.onDiseaseChange();
        this.onModelChange();
    }

    clearFiles(clearCallback: Function): void {
        clearCallback();
        this.images = [];
    }

    clearFields() {
        this.patientId = undefined;
        this.firstName = '';
        this.lastFatherName = '';
        this.lastMotherName = '';
        this.email = '';
        this.phone = '';
        this.gender = '';
        this.age = 0;
        this.address = '';
        this.postalCode = '';
        this.occupation = '';
        this.birthDate = '';
        this.statePatient = '';

        this.selectedEye = undefined;
        this.selectedDisease = undefined;
        this.selectedModel = undefined;
        this.eyeError = undefined;
        this.diseaseError = undefined;
        this.modelError = undefined;
    }
}
