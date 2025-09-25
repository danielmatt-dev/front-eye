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
import { InsightsPathRoutes } from '../../../../shared/routes/insights-path.routes';

/**
 * Componente para crear una **nueva inspección**.
 *
 * @description
 * Forma parte de la capa de **presentation/components** dentro de la Clean Architecture.
 * Orquesta la captura de datos de paciente, selección de imagen, enfermedad y modelo de IA,
 * y ejecuta los casos de uso de **domain/use_cases**:
 * - `GetNewInspectionData` para precargar pacientes, enfermedades y modelos.
 * - `CreateInspection` para enviar la inspección al backend.
 *
 * La UI se construye con PrimeNG (dropdown/select, fileupload, selectButton, toast, skeleton),
 * soporta i18n con `@ngx-translate`, y valida entradas con `NewInspectionValidator`.
 */
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
    selectedPatientId?: number;
    patientOptions: any[] = [];
    birthDate?: string = '';

    /* Lista de modelos y afecciones */
    diseaseOptions: OptionLabel[] = [];
    allDiseases: DiseaseModel[] = [];
    selectedDisease?: OptionLabel;

    allModels: AiModelModel[] = [];
    selectedModel?: AiModelModel;

    /* Campos de la inspección */
    inspectionId?: number = 2;

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

    /**
     * Constructor del componente.
     *
     * @param translateService `TranslateService` - Servicio de traducciones.
     * @param cdr `ChangeDetectorRef` - Para marcar y disparar detección de cambios.
     * @param translateLang `TranslateLang` - Utilidad para construir y traducir opciones (result, eye, disease).
     * @param primeng `PrimeNG` - Configuración global de PrimeNG.
     * @param router `Router` - Navegación a detalle de inspección.
     * @param messageService `MessageService` - Notificaciones (toasts).
     * @param getAllData `GetNewInspectionData` - Caso de uso para precargar catálogos.
     * @param createInspection `CreateInspection` - Caso de uso para crear la inspección.
     * @param local `LocalStorageService` - Obtención de datos de sesión (usuario/doctor).
     */
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

    /**
     * Hook de inicialización del componente.
     *
     * @returns `Promise<void>` cuando termina la carga inicial de catálogos y enlaza listeners de i18n.
     */
    async ngOnInit() {
        // 1) Precarga de pacientes, enfermedades y modelos desde el backend (use case)
        await this.callGetNewInspectionData();

        // 2) Reaplicar traducciones dinámicamente cuando cambie el idioma
        reloadOnLangChange(this.translateService, this.destroyRef, this.loadTranslate);

        // 3) Construir opciones del dropdown de pacientes (fullName derivado)
        this.patientOptions = this.allPatients.map((patient) => ({
            ...patient,
            fullName: `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`
        }));

        const { patient } = history.state as { patient?: PatientResponseModel };
        if (patient) {
            this.selectedPatientId = patient.patientId;   // <-- clave
            this.fillFormFromPatient(patient);
        }
    }

    /**
     * Reconfigura opciones traducidas y resultado cada vez que cambia el idioma.
     *
     * @private
     * @returns `void`
     */
    private readonly loadTranslate = () => {
        // Construye opciones de ojo y enfermedad a partir de catálogos + i18n
        this.eyes = this.translateLang.getOptionsByType(TypeList.eye);
        this.diseaseOptions = this.translateLang.buildDiseaseOptions(this.allDiseases, false);
        // Traduce la etiqueta del resultado actual (si existe)
        this.resultOption = this.translateLang.translateByOptionLabel({
            value: this.resultOption?.value,
            type: TypeList.result
        });
        this.cdr.markForCheck();
    };

    // Llamadas a casos de uso
    /**
     * Obtiene datos iniciales para la nueva inspección (pacientes, enfermedades, modelos).
     *
     * @returns `Promise<void>` que finaliza tras actualizar los catálogos y estados de carga/errores.
     */
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

    /**
     * Envía la inspección al backend usando el caso de uso `CreateInspection`.
     *
     * @returns `Promise<void>` que concluye tras mostrar toasts y actualizar estado/resultados.
     */
    async callCreateInspection() {
        // Validación previa de formulario
        if (!this.isFormaValid()) {
            this.validator.showMessage({ key: 'invalidForm' });
            return;
        }
        // Conversión de archivos a base64 (solo se envía el primero)
        const images = await this.filesToBase64();

        // Estado de carga mientras se crea la inspección
        this.state = State.loading;

        // Construcción del payload de la inspección (DTO de data layer) y ejecución del use case
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

        // Manejo de error de backend / red
        if (resultCreateInspection._tag === 'Left') {
            this.validator.getToastException(resultCreateInspection.left);
        }

        // Caso exitoso: persistimos id, pintamos resultado y notificamos
        if (resultCreateInspection._tag === 'Right') {
            this.inspectionId = resultCreateInspection.right.inspectionId;
            const result = resultCreateInspection.right.result;
            this.resultOption = this.translateLang.translateByOptionLabel({
                type: TypeList.result,
                value: result
            });
            this.colorResult = colorByResult(result);
            this.validator.showMessage({ key: 'createInspection', type: 'success' });
        }

        this.state = State.success;
    }

    // Conversión de file a base64
    /**
     * Convierte un archivo a una cadena base64 (sin encabezado data URL).
     *
     * @param file `File` - Archivo a convertir.
     * @returns `Promise<string>` con la porción **base64** del archivo.
     */
    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => {
                // reader.error puede ser null, aseguramos un Error válido
                reject(new Error(reader.error?.message ?? 'Error al leer el archivo'));
            };
            reader.onload = () => {
                // reader.result == "data:<mime>;base64,AAAA..."
                const dataUrl = reader.result as string;
                resolve(dataUrl.split(',')[1]); // solo la parte base64
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * Convierte todos los archivos seleccionados en un arreglo de cadenas base64.
     *
     * @returns `Promise<string[]>` con los contenidos base64 de `this.images`.
     */
    filesToBase64(): Promise<string[]> {
        return Promise.all(this.images.map((file) => this.fileToBase64(file)));
    }

    /**
     * Navega al detalle de la inspección creada (si existe `inspectionId`).
     *
     * @returns `Promise<void>` que concluye tras el intento de navegación.
     */
    async navigateToInspectionDetails() {
        if (!this.inspectionId) {
            return;
        }

        const id = this.inspectionId;
        await this.router.navigate([InsightsPathRoutes.pathViewDetail], { queryParams: { id } });
    }

    // Función de validación
    /**
     * Valida el formulario completo ejecutando las validaciones por campo.
     *
     * @returns `boolean` `true` si el formulario es válido; `false` en caso contrario.
     */
    isFormaValid(): boolean {
        this.onFormChange();
        return !(this.imageError ?? this.patientError ?? this.eyeError ?? this.diseaseError ?? this.modelError);
    }

    // Funciones de interacción con la interfaz
    /**
     * Construye el tooltip del paciente seleccionado (texto multilínea).
     *
     * @param patient `PatientResponseModel` - Paciente del cual se arma el resumen.
     * @returns `string` Tooltip con nombre, edad, género, ocupación y dirección.
     */
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

    private fillFormFromPatient(p: PatientResponseModel) {
        this.patientId = p.patientId;
        this.firstName = p.firstName;
        this.lastFatherName = p.lastFathName;
        this.lastMotherName = p.lastMontName;
        this.email = p.email;
        this.phone = p.phone;
        this.gender = p.gender;
        this.age = p.age;
        this.address = p.address;
        this.postalCode = p.postalCode;
        this.occupation = p.occupation;
        this.birthDate = formatDateToDDMMYYYY(p.birthDate);
        this.statePatient = p.state;
        this.onPatientChange();
    }

    /**
     * Maneja la selección de un archivo de imagen desde `p-fileupload`.
     *
     * @param event `any` - Evento de selección del componente de carga.
     * @returns `void`
     */
    onSelect(event: any) {
        const file = event.files[0];
        this.images = [];
        this.images.push(file);
    }

    /**
     * Maneja el cambio de paciente en el select y actualiza campos del formulario.
     *
     * @param event `any` - Evento del dropdown con `value` = paciente seleccionado.
     * @returns `void`
     */
    onPatientSelect(event: any) {
        const p = this.patientOptions.find(x => x.patientId === event.value);
        if (p) this.fillFormFromPatient(p);
    }

    /**
     * Ejecuta validación del paciente seleccionado y almacena el mensaje (si aplica).
     *
     * @returns `void`
     */
    onPatientChange() {
        this.patientError = this.validator.validatePatientSelected(this.selectedPatientId);
    }

    /**
     * Ejecuta validación de imagen seleccionada y almacena el mensaje (si aplica).
     *
     * @returns `void`
     */
    onImageChange() {
        this.imageError = this.validator.validateImageSelected(this.images);
    }

    /**
     * Ejecuta validación del ojo seleccionado (usa validador genérico por etiqueta).
     *
     * @returns `void`
     */
    onEyeChange() {
        this.eyeError = this.validator.validateSelected(this.selectedEye?.label);
    }

    /**
     * Ejecuta validación de enfermedad seleccionada y almacena el mensaje (si aplica).
     *
     * @returns `void`
     */
    onDiseaseChange() {
        this.diseaseError = this.validator.validateDiseaseSelected(this.selectedDisease?.value);
    }

    /**
     * Ejecuta validación del modelo seleccionado y almacena el mensaje (si aplica).
     *
     * @returns `void`
     */
    onModelChange() {
        this.modelError = this.validator.validateModelSelected(this.selectedModel);
    }

    /**
     * Dispara todas las validaciones del formulario para actualizar el estado de errores.
     *
     * @returns `void`
     */
    onFormChange() {
        this.onPatientChange();
        this.onImageChange();
        this.onEyeChange();
        this.onDiseaseChange();
        this.onModelChange();
    }

    /**
     * Limpia los archivos del uploader y el arreglo `images`.
     *
     * @param clearCallback `Function` - Callback provisto por `p-fileupload` para limpiar lista.
     * @returns `void`
     */
    clearFiles(clearCallback: Function): void {
        clearCallback();
        this.images = [];
    }

    /**
     * Limpiar campos del formulario tras una creación exitosa o reinicio del flujo.
     *
     * @returns `void`
     */
    clearFields() {

        this.selectedPatientId = undefined;
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

        this.images = [];
        this.imageError = undefined;

        this.selectedEye = undefined;
        this.eyeError = undefined;

        this.selectedDisease = undefined;
        this.diseaseError = undefined;

        this.selectedModel = undefined;
        this.modelError = undefined;

        this.notes = '';

        this.state = State.initial;

        this.resultOption = undefined;

        this.inspectionId = undefined;
    }

    async cancel() {
        await this.router.navigate([InsightsPathRoutes.pathAllInspections]);
    }

}
