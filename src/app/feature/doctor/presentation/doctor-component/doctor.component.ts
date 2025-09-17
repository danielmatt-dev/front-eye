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
export class DoctorComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    /* Opciones de la tabla*/
    isLoading = true;

    /* Opciones de carga en botones */
    isCreateLoading = false;
    isUpdateLoading = false;
    isDeleteLoading = false;
    isClinicsLoading = false;

    /* Opciones de dialog */
    isUpdate = false;
    isVisible = false;

    /* Variables para opciones de consulta */
    selectedPeriod: OptionLabel | undefined;
    selectedDates: Date[] = [];

    /* Catálogo de opciones */
    genders: OptionLabel[] = [];
    states = statesMexico;
    clinics: ClinicModel[] = [];

    /* Lista de doctores y filtrado */
    allDoctors: DoctorResponseModel[] = [];
    filteredDoctors = this.allDoctors;
    selectedDoctors: DoctorResponseModel[] = [];

    /* Campos de doctor */
    doctorId?: number;
    clinicSelected?: ClinicModel = undefined;
    firstName = '';
    lastFatherName = '';
    lastMotherName = '';
    birthDate?: Date;
    gender?: string;
    phone = '';
    email = '';
    address = '';
    state?: string = undefined;
    postalCode = '';

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

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    validationHelper: BaseValidatorHelper;

    private readonly destroyRef = inject(DestroyRef);

    /* Labels */
    labelDoctor = 'doctor';
    labelDoctors = 'doctores';

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

    async ngOnInit() {
        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });

        reloadOnLangChange(this.translateService, this.destroyRef, this.loadGenders);

        await this.loadDoctors()
    }

    /* Traducciones de idioma */
    private readonly loadGenders = () => {
        this.dateFormat = this.translateLang.getDateFormat();
        this.genders = this.translateLang.getOptionsByType(TypeList.gender);
        this.translateGenders();
        this.cdr.markForCheck();
    };

    private translateGenders() {
        this.allDoctors = this.allDoctors.map((doctor) => {
            const genderOption = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: doctor.gender });
            doctor.genderOption = genderOption;
            doctor.gender = genderOption.value;
            return doctor;
        });
    }

    async loadDoctors() {
        await this.callGetAllDoctors();
        await this.callGetAllClinics();
    }

    /* Llamadas a casos de uso */
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

    /* Preparación de datos para los casos de uso */
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

    /* Filtrado de lista de doctores */
    filterDoctors(): void {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredDoctors = this.filterService.filterByPeriodo<DoctorResponseModel>(this.allDoctors, (doc) => doc.createdAt, this.selectedPeriod, this.selectedDates);
    }

    /* Exportar datos */
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

    async exportExcel() {
        await this.generateReport.generateExcel(
            new DoctorReportExcel({
                doctors: this.filteredDoctors,
                headers: this.translateLang.getHeaders(TypeList.doctor)
            }));
    }

    /* Funciones de validación del formulario del doctor */
    isFormValid(): boolean {
        this.onFormChange();
        return !(this.firstNameError ?? this.lastFatherNameError ?? this.lastMotherNameError ?? this.clinicError ?? this.birthDateError ?? this.emailError ?? this.genderError ?? this.addressError ?? this.postalCodeError ?? this.stateError);
    }

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

    onFirstNameChange() {
        this.firstNameError = this.validationHelper.validateName(this.firstName);
    }

    onLastFatherNameChange() {
        this.lastFatherNameError = this.validationHelper.validateName(this.lastFatherName);
    }

    onLastMotherNameChange() {
        this.lastMotherNameError = this.validationHelper.validateName(this.lastMotherName);
    }

    onClinicChange() {
        this.clinicError = this.validationHelper.validateSelectedClinic(this.clinicSelected);
    }

    onGenderChange() {
        this.genderError = this.validationHelper.validateSelected(this.gender);
    }

    onEmailChange() {
        this.emailError = this.validationHelper.validateEmail(this.email);
    }

    onBirtDateChange() {
        this.birthDateError = this.validationHelper.validateBirthDate(this.birthDate);
    }

    onAddressChange() {
        this.addressError = this.validationHelper.validateField(this.address);
    }

    onPostalCodeChange() {
        this.postalCodeError = this.validationHelper.validateFieldNumber(this.postalCode, 10);
    }

    onStateChange() {
        this.stateError = this.validationHelper.validateSelected(this.state);
    }

    onPeriodSelected(periodo: OptionLabel) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }

    /*  Funciones de iteración con html */
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

    async openModal() {
        this.isVisible = true;
        if (this.clinics.length === 0) {
            await this.callGetAllClinics();
        }
    }

    closeModal() {
        if (this.isUpdate) {
            this.isUpdate = false;
        }
        this.isVisible = false;
        this.clearFields();
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onKeyDown(event: KeyboardEvent) {
        console.log('Key Down:', event.key);
    }

    onKeyUp(event: KeyboardEvent) {
        console.log('Key Up:', event.key);
    }
}
