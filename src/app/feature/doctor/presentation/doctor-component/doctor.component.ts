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
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';
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
    selectedDoctores: any[] = [];

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
    localeTextProvider: LocaleTextProvider;
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
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(messageService, translateService, primeng);
        this.localeTextProvider = LocaleTextProvider.getInstance(this.translateService, this.primeng);
        this.doctorComponentHelper = DoctorComponentHelper.getInstance(messageService, translateService, primeng)
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

        }

        if (resultUseCase._tag === 'Right') {
            this.allDoctors = resultUseCase.right;
            this.filteredDoctors = this.allDoctors;
        }
    }

    async getClinics() {

        const resultUseCase = await this.getAllClinis.call(new NoParams())

        if (resultUseCase._tag === 'Left') {

        }

        if (resultUseCase._tag === 'Right'){
            this.clinics = resultUseCase.right
        }

    }

    async addDoctor() {

        const doctor = this.getDoctorRequest()

        const resultCreateDoctor = await this.createDoctor.call(doctor)

        if (resultCreateDoctor._tag === 'Left') {

        }

        if (resultCreateDoctor._tag === 'Right') {
            // Mensage de éxito
            this.allDoctors.push(resultCreateDoctor.right)
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

        }

        if (updateResult._tag === 'Right') {
            // Mensaje de éxito
            const doctorUpdated = updateResult.right

            const idx = this.allDoctors.findIndex(d => d.doctorId === doctorUpdated.doctorId)

            if (idx !== -1) {
                this.allDoctors[idx] = doctorUpdated
            }

        }

        this.closeModal()
    }

    eliminarDoctor(clave: string): void {
        /*
        const doctor = this.doctores.find((d) => d.clave === clave);
        if (doctor) {
            this.confirmationService.confirm({
                message: `¿Estás seguro de eliminar al doctor ${doctor.nombre} ${doctor.apellidoPaterno} ${doctor.apellidoMaterno}?`,
                header: 'Confirmación de Eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-secondary',
                accept: () => {
                    this.doctores = this.doctores.filter((d) => d.clave !== clave);
                    this.doctoresFiltrados = this.doctores
                    this.filtrarDoctores()
                }
            });
        }
         */
    }

    eliminarDoctoresSeleccionados(): void {
        /*
        if (this.selectedDoctores.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'No hay doctores seleccionados' });
            return;
        }

        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar a los doctores seleccionados?`,
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.selectedDoctores.forEach((doctor) => {
                    const index = this.doctores.findIndex((d) => d.clave === doctor.clave);
                    if (index !== -1) {
                        this.doctores.splice(index, 1);
                        this.doctoresFiltrados = this.doctores
                    }
                });
                this.messageService.add({ severity: 'success', summary: 'Eliminación Exitosa', detail: 'Doctores eliminados correctamente' });
                this.selectedDoctores = [];
                this.filtrarDoctores()
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada' });
            }
        });
         */
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
        /*
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        if (this.fechasSeleccionadas.length === 0 || this.periodoSeleccionado === '') {
            this.doctoresFiltrados = this.doctores;
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
        this.doctoresFiltrados = this.doctores.filter((doctor) => {
            const fechaAlta = new Date(doctor.fechaAlta.split('/').reverse().join('-')); // Convertir dd/MM/yyyy a yyyy-MM-dd
            return formatoFecha(fechaAlta) >= formatoFecha(fechaInicio) && formatoFecha(fechaAlta) <= formatoFecha(fechaFin);
        });

        console.log('Doctores Filtrados:', this.doctoresFiltrados);
        */
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
