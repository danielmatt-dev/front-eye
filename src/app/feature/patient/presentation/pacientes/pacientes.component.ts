import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import { PatientResponseModel } from '../../data/models/patient.response.model';
import {
    BaseValidatorHelper
} from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { CreatePatient } from '../../domain/use_cases/createPatient';
import { GetAllPatients } from '../../domain/use_cases/getAllPatients';
import { PutPatientParams, UpdatePatient } from '../../domain/use_cases/updatePatient';
import { DeletePatients } from '../../domain/use_cases/deletePatients';
import { FilterService } from '../../../../shared/services/filter.service';
import { NoParams } from '../../../../shared/utils/usecase';
import { PatientRequestEntity } from '../../domain/entity/patient.request.entity';
import { PatientResponseEntity } from '../../domain/entity/patient.response.entity';
import { calculateAge } from '../../../../shared/utils/functions/functions';
import { DatePickerModule } from 'primeng/datepicker';
import { genders, statesMexico } from '../../../../shared/utils/data';
import { GenerateReportImpl } from '../../../report/domain/factory/impl/generate.report.impl';
import { ReportFactoryParams } from '../../../report/domain/factory/generate.report';
import { PatientReportPdf } from '../../../report/domain/template-method/pdf/impl/patient.report.pdf';
import { PatientReportExcel } from '../../../report/domain/template-method/excel/impl/patient.report.excel';
import { BadRequestException } from '../../../../shared/exceptions/exceptions';

@Component({
    standalone: true,
    selector: 'app-pacientes',
    imports: [Button, FormsModule, InputText, PrimeTemplate, TableModule, Dialog, Select, TranslatePipe, IconField, InputIcon, OpcionesConsultaComponent, ConfirmDialog, Toast, NgIf, DatePipe, NgClass, DatePickerModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {
    /* Opciones de la tabla*/
    @ViewChild('filter') filter!: ElementRef;
    isLoading = true;

    /* Opciones de dialog */
    isUpdate = false;
    visible = false;

    /* Labels */
    labelPatient = 'paciente';
    labelPatients = 'pacientes';

    /* Variables para opciones de consulta */
    selectedPeriod = '';
    selectedDates: Date[] = [];

    /* Catálogo de opciones */
    genders = genders;
    states = statesMexico;

    /* Lista de pacientes y filtrado */
    allPatients: PatientResponseEntity[] = [];
    filteredPatients = this.allPatients;
    selectedPatients: PatientResponseModel[] = [];

    /* Campos del paciente */
    patientId?: number;
    firstName = '';
    lastFatherName = '';
    lastMotherName = '';
    email = '';
    phone = '';
    gender = '';
    birthDate?: Date;
    age = 0;
    address = '';
    postalCode = '';
    occupation = '';
    state = '';

    /* Campos de validación */
    firstNameError?: string;
    lastFatherNameError?: string;
    lastMotherNameError?: string;
    birthDateError?: string;
    genderError?: string;
    phoneError?: string;
    emailError?: string;
    addressError?: string;
    postalCodeError?: string;
    stateError?: string;
    occupationError?: string;

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    validationHelper: BaseValidatorHelper;

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly createPatient: CreatePatient,
        private readonly getAllPatients: GetAllPatients,
        private readonly updatePatient: UpdatePatient,
        private readonly deletePatients: DeletePatients,
        private readonly filterService: FilterService,
        private readonly generateReport: GenerateReportImpl,
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.validationHelper = BaseValidatorHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    async ngOnInit() {
        this.translateService.get('patient.singular').subscribe((res: string) => {
            this.labelPatient = res.toLowerCase();
        });

        this.translateService.get('patient.plural').subscribe((res: string) => {
            this.labelPatients = res.toLowerCase();
        });
        await this.callGetAllPatients();
    }

    /* Llamadas a casos de uso */
    async callGetAllPatients() {
        this.isLoading = true;
        const resultUseCase = await this.getAllPatients.call(new NoParams());
        this.isLoading = false;

        if (resultUseCase._tag === 'Left') {
            this.validationHelper.getToastException(resultUseCase.left);
            return;
        }

        if (resultUseCase._tag === 'Right') {
            this.allPatients = resultUseCase.right;
            //this.filteredPatients = this.allPatients;
            this.filterPatients();
        }
    }

    async callCreatePatient() {
        const patient = this.getPatientRequest();
        if (!patient) {
            return;
        }

        const resultCreatePatient = await this.createPatient.call(patient);

        if (resultCreatePatient._tag === 'Left') {

            if (resultCreatePatient.left instanceof BadRequestException) {
                this.emailError = this.validationHelper.getText('exceptions.messages.emailAlredyRegistered')
                return
            }

            this.validationHelper.getToastException(resultCreatePatient.left);
            return;
        }

        if (resultCreatePatient._tag === 'Right') {
            const patientSuccess = resultCreatePatient.right;
            this.validationHelper.sendToastMessageSuccessPatient('createPatient', `${patientSuccess.firstName} ${patientSuccess.lastFathName}`);
            this.allPatients.push(patientSuccess);
            this.filterPatients();
        }

        this.closeModal();
        this.clearFields();
    }

    async callUpdatePatient() {
        const patient = this.getPatientRequest();
        if (!patient) {
            return;
        }

        if (!this.patientId) {
            return;
        }

        const resultCallUpdatePatient = await this.updatePatient.call(new PutPatientParams(patient, this.patientId));

        if (resultCallUpdatePatient._tag === 'Left') {

            if (resultCallUpdatePatient.left instanceof BadRequestException) {
                this.emailError = this.validationHelper.getText('exceptions.messages.emailAlredyRegistered')
                return
            }

            this.validationHelper.getToastException(resultCallUpdatePatient.left);
            return;
        }

        if (resultCallUpdatePatient._tag === 'Right') {
            const patientUpdate = resultCallUpdatePatient.right;
            this.validationHelper.sendToastMessageSuccessPatient('updatePatient', `${patientUpdate.firstName} ${patientUpdate.lastFathName}`);

            const idx = this.allPatients.findIndex((p) => p.patientId === patientUpdate.patientId);

            if (idx !== -1) {
                this.allPatients[idx] = patientUpdate;
            }
            this.filterPatients();
        }

        this.closeModal();
    }

    async callDeletePatients() {
        const ids = this.selectedPatients.map((p) => p.patientId);
        if (ids.length === 0) {
            return;
        }

        const resultCallDeletePatients = await this.deletePatients.call(ids);

        if (resultCallDeletePatients._tag === 'Left') {
            this.validationHelper.getToastException(resultCallDeletePatients.left);
            return;
        }

        if (resultCallDeletePatients._tag === 'Right') {
            if (this.selectedPatients.length === 1) {
                this.validationHelper.sendToastMessageSuccessPatient('deletePatient', `${this.selectedPatients[0].firstName} ${this.selectedPatients[0].lastFathName}`);
            } else {
                this.validationHelper.sendToastMessageSuccessPatient('deletePatients', `${ids.length}`);
            }

            this.allPatients = this.allPatients.filter((patient) => !ids.includes(patient.patientId));

            this.selectedPatients = [];
            this.filterPatients();
        }
    }

    /* Preparación de datos para los casos de uso */
    getPatientRequest(): PatientRequestEntity | undefined {
        /* Validar campos */
        if (!this.isFormValid()) {
            this.validationHelper.showMessage({ key: 'invalidForm' });
            return undefined;
        }

        return new PatientRequestEntity({
            firstName: this.firstName,
            lastFathName: this.lastFatherName,
            lastMontName: this.lastMotherName,
            email: this.email,
            phone: this.phone,
            birthDate: this.birthDate,
            gender: this.gender,
            occupation: this.occupation,
            address: this.address,
            state: this.state,
            postalCode: this.postalCode
        });
    }

    editPatient(patient: PatientResponseEntity) {
        this.isUpdate = true;

        this.patientId = patient.patientId;
        this.firstName = patient.firstName;
        this.lastFatherName = patient.lastFathName;
        this.lastMotherName = patient.lastMontName;
        this.birthDate = patient.birthDate;
        this.gender = patient.gender;
        this.phone = patient.phone;
        this.email = patient.email;
        this.occupation = patient.occupation;
        this.address = patient.address;
        this.state = patient.state;
        this.postalCode = patient.postalCode;

        this.onFormChange();
        this.openModal();
    }

    deletePatientConfirmation(patient: PatientResponseEntity) {
        const header = this.validationHelper.getText('confirmations.deletePatient.header');
        const message = this.validationHelper.getText('confirmations.deletePatient.message');

        this.confirmationService.confirm({
            message: message.replace('{0}', `${patient.firstName} ${patient.lastFathName}`),
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                this.selectedPatients.push(patient);
                await this.callDeletePatients();
            }
        });
    }

    deletePatientsConfirmation() {
        const message = this.validationHelper.getText('confirmations.deleteSelectedPatients.message');
        const header = this.validationHelper.getText('confirmations.deleteSelectedPatients.message');

        this.confirmationService.confirm({
            message: message,
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                await this.callDeletePatients();
            }
        });
    }

    /* Filtrado de lista de Patientes */
    filterPatients() {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredPatients = this.filterService.filterByPeriodo<PatientResponseEntity>(this.allPatients, (pat) => pat.createdAt, this.selectedPeriod, this.selectedDates);
    }

    /* Exportar datos */
    exportPDF() {
        const params = new ReportFactoryParams({ name: 'Pacientes', user: 'Daniel Matt' })
        this.generateReport.generatePDF(params, new PatientReportPdf({ patients: this.allPatients }))
    }

    async exportExcel() {
        await this.generateReport.generateExcel(new PatientReportExcel({ patients: this.allPatients }))
    }

    /* Funciones de validación del formulario del Patient */
    isFormValid(): boolean {
        this.onFormChange();
        return !(
            this.firstNameError ??
            this.lastFatherNameError ??
            this.lastMotherNameError ??
            this.occupationError ??
            this.birthDateError ??
            this.emailError ??
            this.phoneError ??
            this.genderError ??
            this.addressError ??
            this.postalCodeError ??
            this.stateError
        );
    }

    onFormChange() {
        this.onFirstNameChange();
        this.onLastFatherNameChange();
        this.onLastMotherNameChange();
        this.onPhoneChange();
        this.onBirtDateChange();
        this.onEmailChange();
        this.onGenderChange();
        this.onOccupationChange();
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

    onGenderChange() {
        this.genderError = this.validationHelper.validateSelected(this.gender);
    }

    onEmailChange() {
        this.emailError = this.validationHelper.validateEmail(this.email);
    }

    onPhoneChange() {
        this.phoneError = this.validationHelper.validateFieldNumber(this.phone, 20);
    }

    onBirtDateChange() {
        this.birthDateError = this.validationHelper.validateBirthDate(this.birthDate);
        if (!this.birthDateError && this.birthDate) {
            this.age = calculateAge(this.birthDate);
        }
    }

    onOccupationChange() {
        this.occupationError = this.validationHelper.validateField(this.occupation);
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

    onPeriodSelected(periodo: string) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }

    /*  Funciones de iteración con html */
    clearFields() {
        this.patientId = undefined;
        this.firstName = '';
        this.lastFatherName = '';
        this.lastMotherName = '';
        this.address = '';
        this.postalCode = '';
        this.state = '';
        this.email = '';
        this.phone = '';
        this.gender = '';
        this.birthDate = undefined;

        this.firstNameError = undefined;
        this.lastFatherNameError = undefined;
        this.lastMotherNameError = undefined;
        this.emailError = undefined;
        this.phoneError = undefined;
        this.occupationError = undefined;
        this.genderError = undefined;
        this.birthDateError = undefined;
        this.addressError = undefined;
        this.postalCodeError = undefined;
        this.stateError = undefined;
    }

    openModal() {
        this.visible = true;
    }

    closeModal() {
        if (this.isUpdate) {
            this.isUpdate = false;
        }
        this.visible = false;
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

    async natigateToNewInspection(patient: PatientResponseEntity) {
        await this.router.navigate(['/insights/nueva-inspeccion'], { state: { patient } });
    }
}
