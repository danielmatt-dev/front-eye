import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { colorByResult, formatDateToDDMMYYYY } from '../../../../shared/utils/functions/functions';
import { OptionLabel, State } from '../../../../shared/utils/data';
import { PrimeNG } from 'primeng/config';
import { NewInspectionValidator } from './validation/new.inspection.validator';
import { CreateInspection } from '../../domain/use_cases/createInspection';
import { NoParams } from '../../../../shared/utils/usecase';
import { GetNewInspectionData } from '../../domain/use_cases/getNewInspectionData';
import { SendMessage } from '../../../../shared/toast/send.message';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';
import { Router } from '@angular/router';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';
import { InspectionRequestModel } from '../../data/models/inspection.request.model';
import { AiModelModel } from '../../../aimodel/data/model/aimodel.model';
import { DiseaseModel } from '../../../disease/data/model/disease.model';

@Component({
    selector: 'app-nueva-inspeccion',
    standalone: true,
    imports: [CommonModule, FileUploadModule, ToastModule, ButtonModule, InputText, SelectButton, Textarea, TranslatePipe, IconFieldModule, InputIconModule, TooltipModule, DropdownModule, FormsModule, DatePickerModule, SelectModule, Skeleton],
    templateUrl: './nueva-inspeccion.component.html',
    styleUrl: './nueva-inspeccion.component.scss',
    providers: [MessageService]
})
export class NuevaInspeccionComponent implements OnInit {
    /* Variables de la inspección */
    images: File[] = []; // Almacenar la imagen de la inspección del ojo

    eyes: OptionLabel[] = [];
    selectedEye?: OptionLabel;

    notes = '';

    /* Variables del paciente */
    allPatients: PatientResponseModel[] = [];
    selectedPatient?: PatientResponseModel;
    patientOptions: any[] = [];
    birthDate?: string = '';

    /* Lista de modelos y afecciones */
    diseaseOptions: OptionLabel[] = [];
    allDiseases: DiseaseModel[] = [];
    selectedDisease?: OptionLabel;

    allModels: AiModelModel[] = [];
    selectedModel?: AiModelModel;

    /* Campos de la inspección */
    inspectionId?: number;

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

    doctor = '';

    /* Campos para filtrar en el select component */
    filterFields: string = 'fullName,firstName,firstName,lastMontName,occupation,state,address,gender';
    State = State;

    /* Variables del resultado de la inspección */
    state = State.initial;
    result = '';
    resultOption?: OptionLabel;
    colorResult = '';

    /* Variables para la validación de campos de la inspección */
    patientError?: string;
    eyeError?: string;
    diseaseError?: string;
    modelError?: string;
    imageError?: string;

    /* Variables de carga */
    isLoadingGetData = false;

    /* Providers */
    validator: NewInspectionValidator;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly translateService: TranslateService,
        private readonly cdr: ChangeDetectorRef,
        private readonly translateLang: TranslateLang,
        private readonly primeng: PrimeNG,
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly getAllData: GetNewInspectionData,
        private readonly createInspection: CreateInspection,
        private readonly local: LocalStorageService
    ) {
        this.validator = new NewInspectionValidator(new SendMessage(this.messageService), this.translateService, this.primeng);
        this.doctor = this.local.getUsername();
    }

    async ngOnInit() {
        await this.callGetNewInspectionData();

        reloadOnLangChange(this.translateService, this.destroyRef, this.loadTranslate);

        this.patientOptions = this.allPatients.map((patient) => ({
            ...patient,
            fullName: `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`
        }));
    }

    private readonly loadTranslate = () => {
        this.eyes = this.translateLang.getOptionsByType(TypeList.eye);
        this.diseaseOptions = this.translateLang.buildDiseaseOptions(this.allDiseases, false);
        this.resultOption = this.translateLang.translateByOptionLabel({
            value: this.result,
            type: TypeList.result
        });
        this.cdr.markForCheck();
    };

    // Llamadas a casos de uso
    async callGetNewInspectionData() {
        this.isLoadingGetData = true;
        const resultGetNewInspectionData = await this.getAllData.call(new NoParams());
        this.isLoadingGetData = false;

        if (resultGetNewInspectionData._tag === 'Left') {
            this.validator.getToastException(resultGetNewInspectionData.left);
        }

        if (resultGetNewInspectionData._tag === 'Right') {
            this.allPatients = resultGetNewInspectionData.right.patients;
            this.allDiseases = resultGetNewInspectionData.right.diseases;
            this.allModels = resultGetNewInspectionData.right.models;
        }
    }

    async callCreateInspection() {
        if (!this.isFormaValid()) {
            this.validator.showMessage({ key: 'invalidForm' });
            return;
        }

        const images = await this.filesToBase64();

        this.state = State.loading;
        const resultCreateInspection = await this.createInspection.call(
            new InspectionRequestModel({
                patientId: this.patientId,
                diseaseId: this.selectedDisease?.value,
                modelId: this.selectedModel?.aiModelId,
                image: images[0],
                eye: this.selectedEye?.value,
                notes: this.notes
            })
        );

        if (resultCreateInspection._tag === 'Left') {
            this.validator.getToastException(resultCreateInspection.left);
        }

        if (resultCreateInspection._tag === 'Right') {
            this.inspectionId = resultCreateInspection.right.inspectionId;
            this.result = resultCreateInspection.right.result
            this.colorResult = colorByResult(this.result);
            this.validator.showMessage({ key: 'createInspection', type: 'success' });
            this.clearFields();
        }

        this.state = State.success;
    }

    // Conversión de file a base64
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => {
                // reader.error puede ser null, aseguramos un Error válido
                reject(new Error(reader.error?.message || 'Error al leer el archivo'));
            };
            reader.onload = () => {
                // reader.result == "data:<mime>;base64,AAAA..."
                const dataUrl = reader.result as string;
                resolve(dataUrl.split(',')[1]); // solo la parte base64
            };
            reader.readAsDataURL(file);
        });
    }

    filesToBase64(): Promise<string[]> {
        return Promise.all(this.images.map((file) => this.fileToBase64(file)));
    }

    async navigateToInspectionDetails() {
        if (!this.inspectionId) {
            return;
        }

        const id = this.inspectionId;
        await this.router.navigate(['/insights/ver-detalle'], { queryParams: { id } });
    }

    // Función de validación
    isFormaValid(): boolean {
        this.onFormChange();
        return !(this.imageError ?? this.patientError ?? this.eyeError ?? this.diseaseError ?? this.modelError);
    }

    // Funciones de interacción con la interfaz
    getTooltip(patient: PatientResponseModel): string {
        const labels = this.translateLang.getToolTips();

        return `
            ${labels.name}: ${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}\n
            ${labels.age}: ${patient.age} ${labels.years}\n
            ${labels.gender}: ${patient.gender}\n
            ${labels.occupation}: ${patient.occupation}\n
            ${labels.address}: ${patient.address}, ${patient.state}\n
            ${labels.postalCode}: ${patient.postalCode}
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
        this.imageError = this.validator.validateImageSelected(this.images);
    }

    onEyeChange() {
        this.eyeError = this.validator.validateSelected(this.selectedEye?.label);
    }

    onDiseaseChange() {
        this.diseaseError = this.validator.validateDiseaseSelected(this.selectedDisease?.value);
    }

    onModelChange() {
        this.modelError = this.validator.validateModelSelected(this.selectedModel);
    }

    onFormChange() {
        this.onPatientChange();
        this.onImageChange();
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
