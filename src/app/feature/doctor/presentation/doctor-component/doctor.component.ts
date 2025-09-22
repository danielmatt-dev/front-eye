import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { PrimeNG } from 'primeng/config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Toast } from 'primeng/toast';
import { CreateDoctor } from '../../domain/use_cases/create-doctor';
import { GetAllDoctors } from '../../domain/use_cases/getAll-doctors';
import { UpdateDoctor, UpdateDoctorParams } from '../../domain/use_cases/update-doctor';
import { DeleteDoctors } from '../../domain/use_cases/deleteDoctors';
import { GetAllClinics } from '../../../clinic/domain/use_cases/getAllClinics';
import { NoParams } from '../../../../shared/utils/usecase';
import { BaseValidatorHelper } from './validation/baseValidatorHelper';
import { FilterService } from '../../../../shared/services/filter.service';
import { DatePickerModule } from 'primeng/datepicker';
import { OptionLabel, statesMexico } from '../../../../shared/utils/data';
import { GenerateReportImpl } from '../../../report/domain/factory/impl/generate.report.impl';
import { DoctorReportPdf } from '../../../report/domain/template-method/pdf/impl/doctor.report.pdf';
import { DoctorReportExcel } from '../../../report/domain/template-method/excel/impl/doctor.report.excel';
import { BadRequestException } from '../../../../shared/exceptions/exceptions';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';
import { SendMessage } from '../../../../shared/toast/send.message';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';
import { ClinicModel } from '../../../clinic/data/models/clinic.model';
import { DoctorRequestModel } from '../../data/models/doctor.request.model';

@Component({
    standalone: true,
    selector: 'app-doctor-component',
    imports: [FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, InputText, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ConfirmDialogModule, NgIf, Toast, DatePipe, NgClass, DatePickerModule],
    providers: [ConfirmationService, MessageService],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
/**
 * Componente de administración de doctores.
 *
 * @description
 * Muestra una tabla con doctores (filtro por período/fecha), permite crear,
 * actualizar y eliminar registros, y exportar resultados a PDF/Excel.
 * Integra validaciones, traducciones y confirmaciones.
 */
export class DoctorComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    /** Referencia al input de búsqueda global de la tabla. */
    @ViewChild('filter') filter!: ElementRef;

    /* ----------------------------- Estado UI general ----------------------------- */

    /** Indicador de carga de la tabla. */
    isLoading = true;

    /** Indicador de carga del botón crear. */
    isCreateLoading = false;
    /** Indicador de carga del botón actualizar. */
    isUpdateLoading = false;
    /** Indicador de carga del botón eliminar. */
    isDeleteLoading = false;
    /** Indicador de carga de catálogo de clínicas. */
    isClinicsLoading = false;

    /** True si el modal está en modo edición; de lo contrario, creación. */
    isUpdate = false;
    /** Visibilidad del modal de creación/edición. */
    isVisible = false;

    /* ------------------------ Filtros de opciones de consulta ------------------- */

    /** Período seleccionado (Hoy, Semana, Mes, Rango, etc.). */
    selectedPeriod: OptionLabel | undefined;
    /** Rango de fechas personalizado seleccionado. */
    selectedDates: Date[] = [];

    /* -------------------------------- Catálogos -------------------------------- */

    /** Opciones de género traducidas. */
    genders: OptionLabel[] = [];
    /** Estados de México (catálogo estático). */
    states = statesMexico;
    /** Catálogo de clínicas cargado desde backend. */
    clinics: ClinicModel[] = [];

    /* --------------------------- Datos y selección tabla ------------------------ */

    /** Lista completa de doctores (del backend). */
    allDoctors: DoctorResponseModel[] = [];
    /** Lista filtrada mostrada en tabla. */
    filteredDoctors = this.allDoctors;
    /** Filas seleccionadas en la tabla. */
    selectedDoctors: DoctorResponseModel[] = [];

    /* --------------------------- Campos de formulario --------------------------- */

    /** ID del doctor en edición. */
    doctorId?: number;
    /** Clínica seleccionada en el modal. */
    clinicSelected?: ClinicModel = undefined;
    /** Nombre del doctor. */
    firstName = '';
    /** Apellido paterno. */
    lastFatherName = '';
    /** Apellido materno. */
    lastMotherName = '';
    /** Fecha de nacimiento. */
    birthDate?: Date;
    /** Género seleccionado (valor). */
    gender?: string;
    /** Teléfono (campo opcional en UI). */
    phone = '';
    /** Email. */
    email = '';
    /** Dirección. */
    address = '';
    /** Estado (valor). */
    state?: string = undefined;
    /** Código postal. */
    postalCode = '';

    /* ---------------------------- Errores de validación ------------------------- */

    /* Campos de validación */
    firstNameError?: string;
    clinicError?: string;
    lastFatherNameError?: string;
    lastMotherNameError?: string;
    birthDateError?: string;
    genderError?: string;
    //phoneError?: string
    emailError?: string;
    addressError?: string;
    postalCodeError?: string;
    stateError?: string;

    // Fecha y hora formato
    dateFormat = 'dd/MM/yyyy';

    /* --------------------------------- Helpers --------------------------------- */

    /* Providers */
    /** Helper para filtros por período/rango. */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    /** Helper de validación y toasts. */
    validationHelper: BaseValidatorHelper;

    /** DestroyRef para gestionar subscripciones en cambios de idioma. */
    private readonly destroyRef = inject(DestroyRef);

    /* --------------------------------- Labels ---------------------------------- */
    /** Label singular traducido (e.g., "doctor"). */
    labelDoctor = 'doctor';
    /** Label plural traducido (e.g., "doctores"). */
    labelDoctors = 'doctores';

    /**
   * Constructor.
   *
   * @param primeng Configuración global PrimeNG.
   * @param translateService Servicio de traducción (ngx-translate).
   * @param cdr ChangeDetectorRef para marcar detección de cambios manual.
   * @param confirmationService Servicio de confirmación PrimeNG.
   * @param messageService Servicio de mensajes/Toast PrimeNG.
   * @param local Servicio de almacenamiento local (para username).
   * @param translateLang Utilidades de traducción para listas y headers.
   * @param createDoctor Caso de uso crear doctor.
   * @param getAllDoctors Caso de uso listar doctores.
   * @param updateDoctor Caso de uso actualizar doctor.
   * @param deleteDoctors Caso de uso eliminar doctores.
   * @param getAllClinis Caso de uso listar clínicas.
   * @param filterService Servicio de filtrado por período/fechas.
   * @param generateReport Fábrica para generar reportes PDF/Excel.
   */
    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly cdr: ChangeDetectorRef,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly local: LocalStorageService,
        private readonly translateLang: TranslateLang,
        private readonly createDoctor: CreateDoctor,
        private readonly getAllDoctors: GetAllDoctors,
        private readonly updateDoctor: UpdateDoctor,
        private readonly deleteDoctors: DeleteDoctors,
        private readonly getAllClinis: GetAllClinics,
        private readonly filterService: FilterService,
        private readonly generateReport: GenerateReportImpl
    ) {
        const sendMessage = new SendMessage(this.messageService);
        this.opcionesConsultaHelper = new OpcionesConsultaHelper(sendMessage, this.translateService, this.primeng);
        this.validationHelper = new BaseValidatorHelper(sendMessage, this.translateService, this.primeng);
    }

    /**
 * Hook de inicialización.
 *
 * - Carga labels traducidos.
 * - Configura recarga al cambiar idioma.
 * - Carga doctores y clínicas.
 */
    async ngOnInit() {
        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });

        reloadOnLangChange(this.translateService, this.destroyRef, this.loadGenders);

        await this.callGetAllDoctors();
        await this.callGetAllClinics();
    }

    /* Traducciones de idioma */
    /** Carga opciones de género y formato de fecha según idioma. */
    private readonly loadGenders = () => {
        this.dateFormat = this.translateLang.getDateFormat();
        this.genders = this.translateLang.getOptionsByType(TypeList.gender);
        this.translateGenders();
        this.cdr.markForCheck();
    };

    /** Traduce y asigna `genderOption` en cada doctor para mostrar en UI. */
    private translateGenders() {
        this.allDoctors = this.allDoctors.map((doctor) => {
            const genderOption = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: doctor.gender });
            doctor.genderOption = genderOption;
            doctor.gender = genderOption.value;
            return doctor;
        });
    }

    /* ------------------------------ Casos de uso ------------------------------- */
    /** Obtiene todos los doctores y aplica traducciones/filtros. */
    async callGetAllDoctors() {
        this.isLoading = true;
        const resultUseCase = await this.getAllDoctors.call(new NoParams());
        this.isLoading = false;

        if (resultUseCase._tag === 'Left') {
            this.validationHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            this.allDoctors = resultUseCase.right;
        }
        this.translateGenders();
        this.filterDoctors();
    }

    /** Obtiene catálogo de clínicas. */
    async callGetAllClinics() {
        const resultUseCase = await this.getAllClinis.call(new NoParams());

        if (resultUseCase._tag === 'Left') {
            this.validationHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            this.clinics = resultUseCase.right;
        }
    }

    /** Crea un doctor a partir del formulario, con validación y toasts. */
    async callCreateDoctor() {
        const doctor = this.getDoctorRequest();
        if (!doctor) {
            return;
        }

        this.isCreateLoading = true;
        const resultCreateDoctor = await this.createDoctor.call(doctor);
        this.isCreateLoading = false;

        if (resultCreateDoctor._tag === 'Left') {
            if (resultCreateDoctor.left instanceof BadRequestException) {
                this.emailError = this.validationHelper.getText('exceptions.messages.emailAlredyRegistered');
                return;
            }

            this.validationHelper.getToastException(resultCreateDoctor.left);
            return;
        }

        if (resultCreateDoctor._tag === 'Right') {
            const doctorSuccess = resultCreateDoctor.right;
            const genderOption = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: doctorSuccess.gender });
            doctorSuccess.genderOption = genderOption;
            doctorSuccess.gender = genderOption.value;
            this.validationHelper.sendToastMessageSuccess('createDoctor', `${doctorSuccess.firstName} ${doctorSuccess.lastFathName}`);
            this.allDoctors.push(doctorSuccess);
            this.filterDoctors();
        }

        this.closeModal();
        this.clearFields();
    }

    /** Actualiza un doctor existente, con validación y toasts. */
    async callUpdateDoctor() {
        const doctor = this.getDoctorRequest();

        if (!doctor) {
            return;
        }

        if (!this.doctorId) {
            return;
        }

        this.isUpdateLoading = true;
        const updateResult = await this.updateDoctor.call(new UpdateDoctorParams(doctor, this.doctorId));
        this.isUpdateLoading = false;

        if (updateResult._tag === 'Left') {
            if (updateResult.left instanceof BadRequestException) {
                this.emailError = this.validationHelper.getText('exceptions.messages.emailAlredyRegistered');
                return;
            }

            this.validationHelper.getToastException(updateResult.left);
            return;
        }

        if (updateResult._tag === 'Right') {
            const doctorUpdated = updateResult.right;
            const genderOption = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: doctorUpdated.gender });
            doctorUpdated.genderOption = genderOption;
            doctorUpdated.gender = genderOption.value;
            this.validationHelper.sendToastMessageSuccess('updateDoctor', `${doctorUpdated.firstName} ${doctorUpdated.lastFathName}`);

            const idx = this.allDoctors.findIndex((d) => d.doctorId === doctorUpdated.doctorId);

            if (idx !== -1) {
                this.allDoctors[idx] = doctorUpdated;
            }
            this.filterDoctors();
        }

        this.closeModal();
    }

    /** Elimina doctores seleccionados tras confirmación y muestra toasts. */
    async callDeleteAllDoctors() {
        const ids = this.selectedDoctors.map((d) => d.doctorId);
        if (ids.length === 0) {
            return;
        }

        this.isDeleteLoading = true;
        const resultUseCase = await this.deleteDoctors.call(ids);
        this.isDeleteLoading = false;

        if (resultUseCase._tag === 'Left') {
            this.validationHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            if (this.selectedDoctors.length === 1) {
                this.validationHelper.sendToastMessageSuccess('deleteDoctor', `${this.selectedDoctors[0].firstName} ${this.selectedDoctors[0].lastFathName}`);
            } else {
                this.validationHelper.sendToastMessageSuccess('deleteDoctors', `${ids.length}`);
            }

            this.allDoctors = this.allDoctors.filter((doctor) => !ids.includes(doctor.doctorId));

            this.selectedDoctors = [];
            this.filterDoctors();
        }
    }

    /* ----------------------- Preparación de datos (request) --------------------- */
    /**
   * Construye el {@link DoctorRequestModel} desde el formulario.
   * @returns `DoctorRequestModel` válido o `undefined` si el formulario es inválido.
   */
    getDoctorRequest(): DoctorRequestModel | undefined {
        /* Validar campos */
        if (!this.isFormValid()) {
            this.validationHelper.showMessage({ key: 'invalidForm' });
            return undefined;
        }

        return new DoctorRequestModel({
            clinicId: this.clinicSelected?.clinicId,
            firstName: this.firstName,
            lastFathName: this.lastFatherName,
            lastMontName: this.lastMotherName,
            email: this.email,
            birthDate: this.birthDate,
            gender: this.gender,
            address: this.address,
            state: this.state,
            postalCode: this.postalCode
        });
    }

    /* --------------------------- Acciones por registro -------------------------- */

    /** Prepara el formulario para editar un doctor y abre el modal. */
    async editDoctor(doctor: DoctorResponseModel) {
        this.isUpdate = true;

        this.doctorId = doctor.doctorId;
        this.clinicSelected = this.clinics.find((c) => c.clinicId === doctor.clinicId);
        this.firstName = doctor.firstName;
        this.lastFatherName = doctor.lastFathName;
        this.lastMotherName = doctor.lastMontName;
        this.birthDate = doctor.birthDate;
        this.gender = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: doctor.gender }).value;
        //this.phone = doctor.phone
        this.email = doctor.email;
        this.address = doctor.address;
        this.state = doctor.state;
        this.postalCode = doctor.postalCode;

        this.onFormChange();
        await this.openModal();
    }

    /** Pide confirmación para eliminar un doctor individual. */
    deleteDoctorConfirmation(doctor: DoctorResponseModel): void {
        const header = this.validationHelper.getText('confirmations.deleteDoctor.header');
        const message = this.validationHelper.getText('confirmations.deleteDoctor.message');

        this.confirmationService.confirm({
            message: message.replace('{0}', `${doctor.firstName} ${doctor.lastFathName}`),
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                this.selectedDoctors.push(doctor);
                await this.callDeleteAllDoctors();
            }
        });
    }

    /** Pide confirmación para eliminar doctores seleccionados. */
    deleteDoctorsConfirmation() {
        const message = this.validationHelper.getText('confirmations.deleteSelectedDoctors.message');
        const header = this.validationHelper.getText('confirmations.deleteSelectedDoctors.message');

        this.confirmationService.confirm({
            message: message,
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                await this.callDeleteAllDoctors();
            }
        });
    }

    /* --------------------------------- Filtros --------------------------------- */

    /** Aplica filtro por período/fechas a la lista de doctores. */
    filterDoctors(): void {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredDoctors = this.filterService.filterByPeriodo<DoctorResponseModel>(this.allDoctors, (doc) => doc.createdAt, this.selectedPeriod, this.selectedDates);
    }

    /* --------------------------------- Exportar -------------------------------- */

    /** Genera PDF con la lista filtrada de doctores. */
    exportPDF() {
        this.generateReport.generatePDF(
            new DoctorReportPdf({
                doctors: this.filteredDoctors,
                headers: this.translateLang.getHeaders(TypeList.doctor),
                data: this.translateLang.getHeaders(TypeList.pdf),
                username: this.local.getUsername()
            })
        );
    }

    /** Genera Excel con la lista filtrada de doctores. */
    async exportExcel() {
        await this.generateReport.generateExcel(
            new DoctorReportExcel({
                doctors: this.filteredDoctors,
                headers: this.translateLang.getHeaders(TypeList.doctor)
            }));
    }

    /* --------------------------- Validación de formulario ---------------------- */
    /** Retorna `true` si el formulario es válido. */
    isFormValid(): boolean {
        this.onFormChange();
        return !(this.firstNameError ?? this.lastFatherNameError ?? this.lastMotherNameError ?? this.clinicError ?? this.birthDateError ?? this.emailError ?? this.genderError ?? this.addressError ?? this.postalCodeError ?? this.stateError);
    }

    /** Revalida todos los campos del formulario. */
    onFormChange() {
        this.onFirstNameChange();
        this.onLastFatherNameChange();
        this.onLastMotherNameChange();
        this.onClinicChange();
        this.onBirtDateChange();
        this.onEmailChange();
        this.onGenderChange();
        this.onAddressChange();
        this.onPostalCodeChange();
        this.onStateChange();
    }

    /** Valida nombre. */
    onFirstNameChange() {
        this.firstNameError = this.validationHelper.validateName(this.firstName);
    }

    /** Valida apellido paterno. */
    onLastFatherNameChange() {
        this.lastFatherNameError = this.validationHelper.validateName(this.lastFatherName);
    }

    /** Valida apellido materno. */
    onLastMotherNameChange() {
        this.lastMotherNameError = this.validationHelper.validateName(this.lastMotherName);
    }

    /** Valida clínica seleccionada. */
    onClinicChange() {
        this.clinicError = this.validationHelper.validateSelectedClinic(this.clinicSelected);
    }

    /** Valida género. */
    onGenderChange() {
        this.genderError = this.validationHelper.validateSelected(this.gender);
    }

    /** Valida email. */
    onEmailChange() {
        this.emailError = this.validationHelper.validateEmail(this.email);
    }

    /** Valida fecha de nacimiento. */
    onBirtDateChange() {
        this.birthDateError = this.validationHelper.validateBirthDate(this.birthDate);
    }

    /** Valida dirección. */
    onAddressChange() {
        this.addressError = this.validationHelper.validateField(this.address);
    }

    /** Valida código postal (numérico, longitud). */
    onPostalCodeChange() {
        this.postalCodeError = this.validationHelper.validateFieldNumber(this.postalCode, 10);
    }

    /** Valida estado. */
    onStateChange() {
        this.stateError = this.validationHelper.validateSelected(this.state);
    }

    /** Setter del período seleccionado (desde componente de opciones). */
    onPeriodSelected(periodo: OptionLabel) {
        this.selectedPeriod = periodo;
    }

    /** Setter del rango de fechas seleccionado (desde componente de opciones). */
    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }

    /* ------------------------ Interacción con el template ---------------------- */

    /*  Funciones de iteración con html */
    /** Limpia el formulario y errores, y resetea modo/visibilidad. */
    clearFields() {
        this.clinicSelected = undefined;
        this.doctorId = undefined;
        this.firstName = '';
        this.lastFatherName = '';
        this.lastMotherName = '';
        this.email = '';
        this.phone = '';
        this.gender = '';
        this.birthDate = undefined;
        this.address = '';
        this.postalCode = '';
        this.state = '';

        this.firstNameError = undefined;
        this.clinicError = undefined;
        this.lastFatherNameError = undefined;
        this.lastMotherNameError = undefined;
        this.emailError = undefined;
        //this.phoneError = '';
        this.genderError = undefined;
        this.birthDateError = undefined;
        this.addressError = undefined;
        this.postalCodeError = undefined;
        this.stateError = undefined;
    }

    /** Abre el modal y asegura que el catálogo de clínicas esté cargado. */
    async openModal() {
        this.isVisible = true;
        if (this.clinics.length === 0) {
            await this.callGetAllClinics();
        }
    }

    /** Cierra el modal y limpia el formulario. */
    closeModal() {
        if (this.isUpdate) {
            this.isUpdate = false;
        }
        this.isVisible = false;
        this.clearFields();
    }

    /** Limpia filtros de la tabla y el input de búsqueda global. */
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    /** Aplica filtro global en la tabla. */
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /** Eventos de teclado (debug/log). */
    onKeyDown(event: KeyboardEvent) {
        console.log('Key Down:', event.key);
    }

    onKeyUp(event: KeyboardEvent) {
        console.log('Key Up:', event.key);
    }
}
