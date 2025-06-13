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
import { DatePipe, NgIf } from '@angular/common';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Toast } from 'primeng/toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
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

@Component({
    standalone: true,
    selector: 'app-doctor-component',
    imports: [FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, InputText, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ConfirmDialogModule, NgIf, Toast, CalendarModule, DatePipe],
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
    states = estadosMexico
    clinics: ClinicEntity[] = []

    /* Lista de doctores y filtrado */
    allDoctors: DoctorResponseEntity[] = [];
    filteredDoctors = this.allDoctors;
    selectedDoctores: DoctorResponseEntity[] = [];

    /* Campos de doctor */
    doctorId?: number
    clinicSelected?: ClinicEntity
    firstName = ''
    lastFatherName = ''
    lastMotherName = ''
    birthDate?: Date
    gender = ''
    phone = ''
    email = ''
    address = ''
    state = ''
    postalCode = ''

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    doctorComponentHelper: DoctorComponentHelper

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
        private readonly getAllClinis: GetAllClinics
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.doctorComponentHelper = DoctorComponentHelper.getInstance(this.messageService, this.translateService, this.primeng)
    }

    async ngOnInit() {
        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });

        await this.getDoctors();
        await this.getClinics()
    }

    async getDoctors() {
        const resultUseCase = await this.getAllDoctors.call(new NoParams());

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left)
            return
        }

        if (resultUseCase._tag === 'Right') {
            this.allDoctors = resultUseCase.right
            this.filteredDoctors = this.allDoctors
        }

    }

    async getClinics() {

        const resultUseCase = await this.getAllClinis.call(new NoParams())

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left)
            return
        }

        if (resultUseCase._tag === 'Right') {
            this.clinics = resultUseCase.right
        }

    }

    async addDoctor() {

        const doctor = this.getDoctorRequest()

        const resultCreateDoctor = await this.createDoctor.call(doctor)

        if (resultCreateDoctor._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultCreateDoctor.left)
            return
        }

        if (resultCreateDoctor._tag === 'Right') {
            const doctorSuccess = resultCreateDoctor.right
            this.doctorComponentHelper.sendToastMessageSuccess('createDoctor', `${doctorSuccess.firstName} ${doctorSuccess.lastFathName}`)
            this.allDoctors.push(doctorSuccess)
        }

        this.closeModal();
        this.limpiarCampos();
    }

    getDoctorRequest(): DoctorRequestEntity {

        /* Validar campos */


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
        })
    }

    async editDoctor(doctor: DoctorResponseEntity) {
        this.isUpdate = true;

        this.doctorId = doctor.doctorId
        this.clinicSelected = this.clinics.find((c) => c.clinicId === doctor.clinicId)
        this.firstName = doctor.firstName
        this.lastFatherName = doctor.lastFathName
        this.lastMotherName = doctor.lastMontName
        this.birthDate = doctor.birthDate
        this.gender = doctor.gender
        //this.phone = doctor.phone
        this.email = doctor.email
        this.address = doctor.address
        this.state = doctor.state
        this.postalCode = doctor.postalCode

        await this.openModal()
    }

    async updateDoctorRequest() {

        const doctor = this.getDoctorRequest()

        if (!this.doctorId) {
            return
        }

        const updateResult = await this.updateDoctor.call(
            new UpdateDoctorParams(doctor, this.doctorId))

        if (updateResult._tag === 'Left') {
            this.doctorComponentHelper.getToastException(updateResult.left)
            return
        }

        if (updateResult._tag === 'Right') {
            const doctorUpdated = updateResult.right
            this.doctorComponentHelper.sendToastMessageSuccess('updateDoctor', `${doctorUpdated.firstName} ${doctorUpdated.lastFathName}`)

            const idx = this.allDoctors.findIndex(d => d.doctorId === doctorUpdated.doctorId)

            if (idx !== -1) {
                this.allDoctors[idx] = doctorUpdated
            }

        }

        this.closeModal()
    }

    eliminarDoctor(doctor: DoctorResponseEntity): void {

        const message = this.doctorComponentHelper.getText("confirmations.deleteDoctor.message")
        const header = this.doctorComponentHelper.getText("confirmations.deleteDoctor.message")

        this.confirmationService.confirm({
            message: message.replace('{0}', `${doctor.firstName} ${doctor.lastFathName}`),
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                this.selectedDoctores.push(doctor)
                await this.deleteAllDoctors()
            }
        });

    }

    eliminarDoctoresSeleccionados() {

        const message = this.doctorComponentHelper.getText("confirmations.deleteSelectedDoctors.message")
        const header = this.doctorComponentHelper.getText("confirmations.deleteSelectedDoctors.message")

        this.confirmationService.confirm({
            message: message,
            header: header,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: async () => {
                await this.deleteAllDoctors()
            },
        })
    }

    async deleteAllDoctors() {

        const ids = this.selectedDoctores.map(d => d.doctorId)
        if (ids.length === 0) {
            return
        }

        const resultUseCase = await this.deleteDoctors.call(ids)

        if (resultUseCase._tag === 'Left') {
            this.doctorComponentHelper.getToastException(resultUseCase.left)
            return
        }

        if (resultUseCase._tag === 'Right') {

            if (this.selectedDoctores.length === 1) {
                this.doctorComponentHelper.sendToastMessageSuccess('deleteDoctor', `${this.selectedDoctores[0].firstName} ${this.selectedDoctores[0].lastFathName}`)
            } else {
                this.doctorComponentHelper.sendToastMessageSuccess('deleteDoctors', `${ids.length}`)
            }

            this.allDoctors = this.allDoctors.filter(
                doctor => !ids.includes(doctor.doctorId))

            this.selectedDoctores = []
            this.filteredDoctors = this.allDoctors
        }

    }

    limpiarCampos() {
        this.clinicSelected = undefined
        this.firstName = '';
        this.lastFatherName = '';
        this.lastMotherName = '';
        this.email = '';
        this.phone = '';
        this.gender = '';
        this.birthDate = undefined
        this.address = '';
        this.postalCode = '';
        this.state = ''
    }

    async openModal() {
        this.isVisible = true
        if (this.clinics.length === 0) {
            await this.getClinics()
        }
    }

    closeModal() {
        this.isVisible = false;
        this.limpiarCampos();
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

    onPeriodoSeleccionado(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }

    filtrarDoctores(): void {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        if (this.fechasSeleccionadas.length === 0 || this.periodoSeleccionado === '') {
            this.filteredDoctors = this.allDoctors;
        }

        let fechaInicio: Date;
        let fechaFin: Date = new Date(); // Fecha de hoy

        switch (this.periodoSeleccionado) {
            case 'Mes actual':
                // Primer día del mes actual hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
                break;
            case '2 meses':
                // Primer día de hace dos meses hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 1, 1);
                break;
            case '3 meses':
                // Primer día de hace tres meses hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 2, 1);
                break;
            case 'Personalizado':
                if (this.fechasSeleccionadas.length === 2) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[1]);
                }

                if (this.fechasSeleccionadas[1] === null) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[0]);
                }
                break;
            default:
                return;
        }

        // Formato de las fechas para comparar
        const formatoFecha = (fecha: Date) => fecha.toISOString().split('T')[0];

        // Filtrar doctores en base a la fechaAlta
        this.filteredDoctors = this.allDoctors.filter((doctor) => {
            const fechaAlta = doctor.createdAt // Convertir dd/MM/yyyy a yyyy-MM-dd
            if (fechaAlta) {
                return formatoFecha(fechaAlta) >= formatoFecha(fechaInicio) && formatoFecha(fechaAlta) <= formatoFecha(fechaFin);
            } else {
                return false
            }
        });

    }

    exportExcel() {
        /*
        // Obtener los encabezados (keys) en mayúscula inicial
        const tableColumn = ['Clave', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Fecha de Nacimiento', 'Teléfono', 'Género', 'Código Postal', 'Dirección', 'Estado'];

        // Crear las filas de la tabla utilizando los datos filtrados
        const tableRows = this.doctoresFiltrados.map((doc) => {
            return [
                doc.clave,
                doc.nombre,
                doc.apellidoPaterno,
                doc.apellidoMaterno,
                doc.fechaNacimiento,
                doc.telefono,
                doc.genero,
                doc.codigoPostal,
                doc.direccion,
                doc.estado
            ];
        });

        // Combinar encabezados y filas
        const data = [tableColumn, ...tableRows];

        // Crear la hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

        // Ajustar el ancho de las columnas
        ws['!cols'] = tableColumn.map(() => ({ wch: 20 }));

        // Ajustar el alto de las filas (espaciado)
        ws['!rows'] = data.map(() => ({ hpt: 20 }));

        // Aplicar estilo a los encabezados
        tableColumn.forEach((col, index) => {
            const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    fill: {
                        fgColor: { rgb: 'D3D3D3' }  // Color gris claro
                    },
                    font: {
                        bold: true,                   // Negrita
                        color: { rgb: '000000' },     // Texto negro
                        sz: 12                        // Tamaño de letra
                    },
                    alignment: {
                        horizontal: 'center',         // Centrado
                        vertical: 'center'            // Centrado vertical
                    }
                };
            }
        });

        // Crear el libro de trabajo con la hoja
        const wb: XLSX.WorkBook = { Sheets: { 'Doctores': ws }, SheetNames: ['Doctores'] };

        // Descargar el archivo Excel
        XLSX.writeFile(wb, 'doctores.xlsx');
        */
    }

    exportPDF() {
        /*
        const doc = new jsPDF();
        doc.text('Doctores', 10, 10);

        // Columnas de la tabla
        const tableColumn = ['Clave', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Fecha de Nacimiento', 'Teléfono', 'Género', 'Código Postal', 'Dirección', 'Estado'];

        // Filtrar los datos a exportar (utilizando los datos de doctores)
        const tableRows = this.doctoresFiltrados.map((doctor) => [
            doctor.clave,                        // Clave del doctor-component
            doctor.nombre,                       // Nombre del doctor-component
            doctor.apellidoPaterno,              // Apellido Paterno
            doctor.apellidoMaterno,              // Apellido Materno
            doctor.fechaNacimiento,              // Fecha de Nacimiento
            doctor.telefono,                     // Teléfono
            doctor.genero,                       // Género
            doctor.codigoPostal,                 // Código Postal
            doctor.direccion,                    // Dirección
            doctor.estado                        // Estado
        ]);

        autoTable(doc, {
            head: [tableColumn],  // Cabecera de la tabla
            body: tableRows,      // Filas de la tabla
            startY: 20,           // Espacio desde la parte superior
            headStyles: {
                fillColor: [211, 211, 211],  // Color gris claro
                textColor: [0, 0, 0],        // Texto negro
                fontStyle: 'bold',           // Negrita
                halign: 'center'             // Centrado
            },
            styles: {
                fontSize: 10,                // Tamaño de letra
                cellPadding: 1
            }
        });

        // Guardar el archivo PDF
        doc.save('doctores.pdf');
         */
    }

}
