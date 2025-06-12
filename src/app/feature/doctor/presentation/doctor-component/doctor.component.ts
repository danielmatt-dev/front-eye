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
import { UpdateDoctor } from '../../domain/use_cases/updateDoctor';
import { DeleteDoctors } from '../../domain/use_cases/deleteDoctors';
import { DoctorResponseEntity } from '../../domain/entity/doctor.response.entity';
import { GetAllClinics } from '../../../clinic/domain/use_cases/getAllClinics';
import { ClinicEntity } from '../../../clinic/domain/entity/clinic.entity';
import { CalendarModule } from 'primeng/calendar';
import { NoParams } from '../../../../shared/utils/usecase';

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
    doctorId = 0;
    clinicSelected?: ClinicEntity;
    firstName = '';
    lastFatherName = '';
    lastMotherName = '';
    birthDate = new Date();
    gender = '';
    phone = '';
    email = '';
    address = '';
    state = '';
    postalCode = '';

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    localeTextProvider: LocaleTextProvider;

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
    }

    async ngOnInit() {
        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });

        await this.getDoctors();
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

    addDoctor() {
        /*
        const doctor = {
            clave: `D${(doctores.length + 1).toString().padStart(3, '0')}`,
            nombre: this.nombre,
            apellidoPaterno: this.apellidoPaterno,
            apellidoMaterno: this.apellidoMaterno,
            fechaNacimiento: this.fechaNacimiento,
            telefono: this.telefono,
            fechaAlta: '12/05/2025',
            genero: this.genero,
            codigoPostal: this.codigoPostal,
            direccion: this.direccion,
            estado: 'Veracruz'
        };

        this.doctores.push(doctor);

        this.filtrarDoctores()
        this.cerrarVentanaNotificacion();
        this.limpiarCampos();
         */
    }

    editarDoctor(clave: string): void {
        this.isUpdate = true;

        /*
        const doctor = this.doctores.find((d) => d.clave === clave);

        if (doctor) {
            // Asignar los datos del doctor-component a los campos correspondientes
            this.nombre = doctor.nombre;
            this.apellidoPaterno = doctor.apellidoPaterno;
            this.apellidoMaterno = doctor.apellidoMaterno;
            this.correo = `${doctor.nombre.toLowerCase()}.${this.apellidoPaterno.toLowerCase()}@hospital.com`;
            this.genero = doctor.genero;
            this.telefono = doctor.telefono;
            this.fechaNacimiento = doctor.fechaNacimiento;
            this.direccion = doctor.direccion;
            this.codigoPostal = doctor.codigoPostal;

            // Guardar la clave para la actualización posterior
            this.claveDoctor = clave;

            // Mostrar el modal
            this.abrirModal();
        }
         */
    }

    actualizarDoctor(): void {
        /*
        if (!this.claveDoctor) {
            console.warn('No hay un doctor-component seleccionado para actualizar.');
            return;
        }

        const index = this.doctores.findIndex((d) => d.clave === this.claveDoctor);
        if (index !== -1) {
            // Crear el objeto doctor-component actualizado
            const doctorActualizado = {
                clave: this.claveDoctor,
                nombre: this.nombre,
                apellidoPaterno: this.apellidoPaterno,
                apellidoMaterno: this.apellidoMaterno,
                correo: this.correo,
                telefono: this.telefono,
                genero: this.genero,
                fechaNacimiento: this.fechaNacimiento,
                direccion: this.direccion,
                codigoPostal: this.codigoPostal,
                estado: 'Veracruz',
                fechaAlta: this.doctores[index].fechaAlta
            };

            // Actualizar el doctor-component en la lista
            this.doctores[index] = doctorActualizado;

            const indexD = this.doctoresFiltrados.findIndex((d) => d.clave === this.claveDoctor);
            this.doctoresFiltrados[indexD] = doctorActualizado;

            console.log('Doctor actualizado:', doctorActualizado);
            this.isUpdate = false

            // Cerrar el modal y limpiar los campos
            this.filtrarDoctores()
            this.cerrarVentanaNotificacion();
            this.limpiarCampos();
        }
         */
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
        this.firstName = '';
        this.lastFatherName = '';
        this.lastMotherName = '';
        this.email = '';
        this.phone = '';
        this.gender = '';
        this.birthDate = new Date();
        this.address = '';
        this.postalCode = '';
    }

    async abrirModal() {
        this.isVisible = true;
        await this.getClinics()
    }

    cerrarVentanaNotificacion() {
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
