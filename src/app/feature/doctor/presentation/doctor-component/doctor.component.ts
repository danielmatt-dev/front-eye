import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { estadosMexico, generos } from '../../../../shared/utils/mocks';
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
import { CreateDoctor } from '../../domain/use_cases/createDoctor';
import { GetAllDoctors } from '../../domain/use_cases/getAllDoctors';
import { UpdateDoctor, UpdateDoctorParams } from '../../domain/use_cases/updateDoctor';
import { DeleteDoctors } from '../../domain/use_cases/deleteDoctors';
import { DoctorResponseEntity } from '../../domain/entity/doctor.response.entity';
import { GetAllClinics } from '../../../clinic/domain/use_cases/getAllClinics';
import { ClinicEntity } from '../../../clinic/domain/entity/clinic.entity';
import { CalendarModule } from 'primeng/calendar';
import { NoParams } from '../../../../shared/utils/usecase';
import { DoctorComponentHelper } from './validation/doctor.component.helper';
import { DoctorRequestEntity } from '../../domain/entity/doctor.request.entity';
import { FilterService } from '../../../../shared/services/filter.service';

@Component({
    standalone: true,
    selector: 'app-doctor-component',
    imports: [FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, InputText, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ConfirmDialogModule, NgIf, Toast, CalendarModule, DatePipe, NgClass],
    providers: [ConfirmationService, MessageService],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {

    @ViewChild('filter') filter!: ElementRef;

    /* Opciones de dialog */
    isUpdate = false;
    isVisible = false;

    /* Variables para opciones de consulta */
    periodoSeleccionado = '';
    fechasSeleccionadas: Date[] = [];

    /* Catálogo de opciones */
    genders = generos;
    states = estadosMexico;
    clinics: ClinicEntity[] = [];

    /* Lista de doctores y filtrado */
    allDoctors: DoctorResponseEntity[] = [];
    filteredDoctors = this.allDoctors;
    selectedDoctores: DoctorResponseEntity[] = [];

    /* Campos de doctor */
    doctorId?: number;
    clinicSelected?: ClinicEntity = undefined
    firstName = '';
    lastFatherName = '';
    lastMotherName = '';
    birthDate?: Date;
    gender?: string;
    phone = '';
    email = '';
    address = '';
    state?: string = undefined
    postalCode = '';

    /* Campos de validación */
    firstNameError?: string
    clinicError?: string
    lastFatherNameError?: string;
    lastMotherNameError?: string;
    birthDateError?: string;
    genderError?: string;
    //phoneError?: string
    emailError?: string;
    addressError?: string;
    postalCodeError?: string;
    stateError?: string

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    doctorComponentHelper: DoctorComponentHelper;

    /* Labels */
    labelDoctor = 'doctor';
    labelDoctors = 'doctores';

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly createDoctor: CreateDoctor,
        private readonly getAllDoctors: GetAllDoctors,
        private readonly updateDoctor: UpdateDoctor,
        private readonly deleteDoctors: DeleteDoctors,
        private readonly getAllClinis: GetAllClinics,
        private readonly filterService: FilterService
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.doctorComponentHelper = DoctorComponentHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    async ngOnInit() {
        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });

        await this.getDoctors();
        await this.getClinics();
    }

    /* Llamadas a casos de uso */
    async getDoctors() {
        const resultUseCase = await this.getAllDoctors.call(new NoParams());

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            this.allDoctors = resultUseCase.right;
            this.filteredDoctors = this.allDoctors;
            this.filterDoctors()
        }
    }

    async getClinics() {
        const resultUseCase = await this.getAllClinis.call(new NoParams());

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            this.clinics = resultUseCase.right;
        }
    }

    async addDoctor() {
        const doctor = this.getDoctorRequest();
        if (!doctor) {
            return;
        }

        const resultCreateDoctor = await this.createDoctor.call(doctor);

        if (resultCreateDoctor._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultCreateDoctor.left);
            return;
        }

        if (resultCreateDoctor._tag === 'Right') {
            const doctorSuccess = resultCreateDoctor.right;
            this.doctorComponentHelper.sendToastMessageSuccess('createDoctor', `${doctorSuccess.firstName} ${doctorSuccess.lastFathName}`);
            this.allDoctors.push(doctorSuccess);
            this.filterDoctors()
        }

        this.closeModal();
        this.clearFields();
    }

    async updateDoctorRequest() {
        const doctor = this.getDoctorRequest();

        if (!doctor) {
            return;
        }

        if (!this.doctorId) {
            return;
        }

        const updateResult = await this.updateDoctor.call(new UpdateDoctorParams(doctor, this.doctorId));

        if (updateResult._tag === 'Left') {
            this.doctorComponentHelper.getToastException(updateResult.left);
            return;
        }

        if (updateResult._tag === 'Right') {
            const doctorUpdated = updateResult.right;
            this.doctorComponentHelper.sendToastMessageSuccess('updateDoctor', `${doctorUpdated.firstName} ${doctorUpdated.lastFathName}`);

            const idx = this.allDoctors.findIndex((d) => d.doctorId === doctorUpdated.doctorId);

            if (idx !== -1) {
                this.allDoctors[idx] = doctorUpdated;
            }
            this.filterDoctors()
        }

        this.closeModal();
    }

    async deleteAllDoctors() {
        const ids = this.selectedDoctores.map((d) => d.doctorId);
        if (ids.length === 0) {
            return;
        }

        const resultUseCase = await this.deleteDoctors.call(ids);

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            if (this.selectedDoctores.length === 1) {
                this.doctorComponentHelper.sendToastMessageSuccess('deleteDoctor', `${this.selectedDoctores[0].firstName} ${this.selectedDoctores[0].lastFathName}`);
            } else {
                this.doctorComponentHelper.sendToastMessageSuccess('deleteDoctors', `${ids.length}`);
            }

            this.allDoctors = this.allDoctors.filter((doctor) => !ids.includes(doctor.doctorId));

            this.selectedDoctores = [];
            this.filterDoctors()
        }
    }

    /* Preparación de datos para los casos de uso */
    getDoctorRequest(): DoctorRequestEntity | undefined {
        /* Validar campos */
        if (!this.isFormValid()) {
            this.doctorComponentHelper.showMessage({key: 'invalidForm'})
            return undefined
        }

        return new DoctorRequestEntity({
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

    async editDoctor(doctor: DoctorResponseEntity) {
        this.isUpdate = true;

        this.doctorId = doctor.doctorId;
        this.clinicSelected = this.clinics.find((c) => c.clinicId === doctor.clinicId);
        this.firstName = doctor.firstName;
        this.lastFatherName = doctor.lastFathName;
        this.lastMotherName = doctor.lastMontName;
        this.birthDate = doctor.birthDate;
        this.gender = doctor.gender;
        //this.phone = doctor.phone
        this.email = doctor.email;
        this.address = doctor.address;
        this.state = doctor.state;
        this.postalCode = doctor.postalCode;

        this.onFormChange()
        await this.openModal();
    }

    deleteDoctorConfirmation(doctor: DoctorResponseEntity): void {
        const header = this.doctorComponentHelper.getText('confirmations.deleteDoctor.header');
        const message = this.doctorComponentHelper.getText('confirmations.deleteDoctor.message');

        this.confirmationService.confirm({
            message: message.replace('{0}', `${doctor.firstName} ${doctor.lastFathName}`),
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                this.selectedDoctores.push(doctor);
                await this.deleteAllDoctors();
            }
        });
    }

    deleteDoctorsConfirmation() {
        const message = this.doctorComponentHelper.getText('confirmations.deleteSelectedDoctors.message');
        const header = this.doctorComponentHelper.getText('confirmations.deleteSelectedDoctors.message');

        this.confirmationService.confirm({
            message: message,
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                await this.deleteAllDoctors();
            }
        });
    }

    /* Filtrado de lista de doctores */
    filterDoctors(): void {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        this.filteredDoctors = this.filterService.filterByPeriodo<DoctorResponseEntity>(
            this.allDoctors,
            doc => doc.createdAt,
            this.periodoSeleccionado,
            this.fechasSeleccionadas,
        )
    }

    /* Funciones de validación del formulario del doctor */
    isFormValid(): boolean {
        this.onFormChange()
        return !(
            this.firstNameError ??
            this.lastFatherNameError ??
            this.lastMotherNameError ??
            this.clinicError ??
            this.birthDateError ??
            this.emailError ??
            this.genderError ??
            this.addressError ??
            this.postalCodeError ??
            this.stateError);
    }

    onFormChange() {
        this.onFirstNameChange()
        this.onLastFatherNameChange()
        this.onLastMotherNameChange()
        this.onClinicChange()
        this.onBirtDateChange()
        this.onEmailChange()
        this.onGenderChange()
        this.onAddressChange()
        this.onPostalCodeChange()
        this.onStateChange()
    }

    onFirstNameChange() {
        this.firstNameError = this.doctorComponentHelper.validateName(this.firstName);
    }

    onLastFatherNameChange() {
        this.lastFatherNameError = this.doctorComponentHelper.validateName(this.lastFatherName);
    }

    onLastMotherNameChange() {
        this.lastMotherNameError = this.doctorComponentHelper.validateName(this.lastMotherName);
    }

    onClinicChange() {
        this.clinicError = this.doctorComponentHelper.validateSelectedClinic(this.clinicSelected);
    }

    onGenderChange() {
        this.genderError = this.doctorComponentHelper.validateSelected(this.gender)
    }

    onEmailChange() {
        this.emailError = this.doctorComponentHelper.validateEmail(this.email)
    }

    onBirtDateChange() {
        this.birthDateError = this.doctorComponentHelper.validateBirthDate(this.birthDate)
    }

    onAddressChange() {
        this.addressError = this.doctorComponentHelper.validateField(this.address);
    }

    onPostalCodeChange() {
        this.postalCodeError = this.doctorComponentHelper.validatePostalCode(this.postalCode)
    }

    onStateChange() {
        this.stateError = this.doctorComponentHelper.validateSelected(this.state)
    }

    onPeriodSelected(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }

    /*  Funciones de iteración con html */
    clearFields() {
        this.clinicSelected = undefined;
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

        this.firstNameError = undefined
        this.clinicError = undefined
        this.lastFatherNameError = undefined
        this.lastMotherNameError = undefined
        this.emailError = undefined
        //this.phoneError = '';
        this.genderError = undefined
        this.birthDateError = undefined
        this.addressError = undefined
        this.postalCodeError = undefined
        this.stateError = undefined
    }

    async openModal() {
        this.isVisible = true;
        if (this.clinics.length === 0) {
            await this.getClinics();
        }
    }

    closeModal() {
        if (this.isUpdate) {
            this.isUpdate = false
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
