import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Calendar } from 'primeng/calendar';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { findPatient, generos, patients } from '../../../../shared/utils/mocks';
import { PrimeNG } from 'primeng/config';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
    standalone: true,
    selector: 'app-pacientes',
    imports: [Button, Calendar, NgForOf, NgClass, FormsModule, InputText, PrimeTemplate, TableModule, Dialog, Select, TranslatePipe, IconField, InputIcon, OpcionesConsultaComponent, ConfirmDialog, Toast, NgIf],
    providers: [MessageService, ConfirmationService],
    templateUrl: './pacientes.component.html',
    styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {
    isUpdate = false;
    visible = false;
    labelPatient = 'paciente';
    labelPatients = 'pacientes';

    periodoSeleccionado = '';
    fechasSeleccionadas: Date[] = [];

    selectedPacientes = [];

    patients = patients;
    pacientesFiltrados = this.patients;

    clave = '';
    nombre = '';
    apellidoPaterno = '';
    apellidoMaterno = '';
    correo = '';
    telefono = '';
    genero = '';
    fechaNacimiento = '';
    direccion = '';
    codigoPostal = '';
    ocupacion = '';
    estado = '';

    opcionesConsultaHelper: OpcionesConsultaHelper;

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.translateService.get('patient.singular').subscribe((res: string) => {
            this.labelPatient = res.toLowerCase();
        });

        this.translateService.get('patient.plural').subscribe((res: string) => {
            this.labelPatients = res.toLowerCase();
        });
    }

    abrirModal() {
        this.visible = true;
    }

    cerrarVentanaNotificacion() {
        this.visible = false;
    }

    async onRowSelect(event: any) {
    }

    clear(table: Table) {
        table.clear();
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

    exportExcel() {
        // Encabezados en mayúscula inicial
        const tableColumn = ['Clave', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Fecha de Nacimiento', 'Teléfono', 'Género', 'Código Postal', 'Dirección', 'Estado'];

        // Crear filas de la tabla
        const tableRows = this.pacientesFiltrados.map((patient) => [
            patient.clave,
            patient.nombre,
            patient.apellidoPaterno,
            patient.apellidoMaterno,
            patient.fechaNacimiento,
            patient.telefono,
            patient.genero,
            patient.codigoPostal,
            patient.direccion,
            patient.estado
        ]);

        // Combinar encabezados y filas
        const data = [tableColumn, ...tableRows];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

        // Ajustar el ancho de columnas y el alto de filas
        ws['!cols'] = tableColumn.map(() => ({ wch: 20 }));
        ws['!rows'] = data.map(() => ({ hpt: 20 }));

        // Crear el libro de trabajo
        const wb: XLSX.WorkBook = { Sheets: { 'Pacientes': ws }, SheetNames: ['Pacientes'] };
        XLSX.writeFile(wb, 'pacientes.xlsx');
    }

    exportPDF() {
        const doc = new jsPDF();
        doc.text('Pacientes', 10, 10);

        // Encabezados
        const tableColumn = ['Clave', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Fecha de Nacimiento', 'Teléfono', 'Género', 'Código Postal', 'Dirección', 'Estado'];

        // Crear filas de la tabla
        const tableRows = this.pacientesFiltrados.map((patient) => [
            patient.clave,
            patient.nombre,
            patient.apellidoPaterno,
            patient.apellidoMaterno,
            patient.fechaNacimiento,
            patient.telefono,
            patient.genero,
            patient.codigoPostal,
            patient.direccion,
            patient.estado
        ]);

        // Configuración de la tabla PDF
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                fontSize: 10,
                cellPadding: 1
            }
        });

        // Descargar PDF
        doc.save('pacientes.pdf');
    }

    onPeriodoSeleccionado(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }

    filtrarPacientes() {

        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        if (this.fechasSeleccionadas.length === 0 || this.periodoSeleccionado === '') {
            this.pacientesFiltrados = this.patients;
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
        this.pacientesFiltrados = this.patients.filter((paciente) => {
            const fechaAlta = new Date(paciente.fechaAlta.split('/').reverse().join('-')); // Convertir dd/MM/yyyy a yyyy-MM-dd
            return formatoFecha(fechaAlta) >= formatoFecha(fechaInicio) && formatoFecha(fechaAlta) <= formatoFecha(fechaFin);
        });

        console.log('Doctores Filtrados:', this.pacientesFiltrados);
    }

    addPaciente() {
        const paciente = {
            clave: `P${(patients.length + 1).toString().padStart(3, '0')}`,
            nombre: this.nombre,
            apellidoPaterno: this.apellidoPaterno,
            apellidoMaterno: this.apellidoMaterno,
            fechaNacimiento: this.fechaNacimiento,
            correo: this.correo,
            telefono: this.telefono,
            fechaAlta: '12/05/2025',
            ocupacion: this.ocupacion,
            genero: this.genero,
            codigoPostal: this.codigoPostal,
            direccion: this.direccion,
            estado: 'Veracruz',
            edad: this.calcularEdad(this.fechaNacimiento)
        };

        this.patients.push(paciente);
        this.pacientesFiltrados = this.patients
        this.cerrarVentanaNotificacion();
        this.limpiarCampos();
    }

    editarPaciente(clave: string) {
        this.isUpdate = true;

        const paciente = findPatient(clave);
        if (paciente) {
            // Asignar los datos del paciente a los campos correspondientes
            this.nombre = paciente.nombre;
            this.apellidoPaterno = paciente.apellidoPaterno;
            this.apellidoMaterno = paciente.apellidoMaterno;
            this.correo = `${paciente.nombre.toLowerCase()}.${this.apellidoPaterno.toLowerCase()}@hospital.com`;
            this.genero = paciente.genero;
            this.telefono = paciente.telefono;
            this.fechaNacimiento = paciente.fechaNacimiento;
            this.direccion = paciente.direccion;
            this.codigoPostal = paciente.codigoPostal;
            this.clave = clave;
            // Mostrar el modal
            this.abrirModal();
        }
    }

    actualizarPaciente(): void {
        if (!this.clave) {
            console.warn('No hay un doctor seleccionado para actualizar.');
            return;
        }

        const index = this.patients.findIndex((d) => d.clave === this.clave);
        if (index !== -1) {
            // Crear el objeto doctor actualizado
            const pacienteActualizado = {
                clave: this.clave,
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
                fechaAlta: this.patients[index].fechaAlta,
                ocupacion: this.ocupacion,
                edad: this.calcularEdad(this.fechaNacimiento)
            };

            // Actualizar el doctor en la lista
            this.patients[index] = pacienteActualizado;
            console.log('Paciente actualizado:', pacienteActualizado);

            // Cerrar el modal y limpiar los campos
            this.cerrarVentanaNotificacion();
            this.limpiarCampos();
        }
    }

    eliminarPaciente(clave: string): void {
        const paciente = findPatient(clave);

        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar al doctor ${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}?`,
            header: 'Confirmación de Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.patients = this.patients.filter((d) => d.clave !== clave);
                this.pacientesFiltrados = this.patients;
            }
        });
    }

    eliminarPacientesSeleccionados(): void {
        if (this.selectedPacientes.length === 0) {
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
                this.selectedPacientes.forEach((paciente: any) => {
                    this.patients = this.patients.filter((d) => d.clave !== paciente.clave);
                    this.pacientesFiltrados = this.patients;
                });

                this.messageService.add({ severity: 'success', summary: 'Eliminación Exitosa', detail: 'Doctores eliminados correctamente' });
                this.selectedPacientes = [];
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada' });
            }
        });
    }

    limpiarCampos() {
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.ocupacion = '';
        this.correo = '';
        this.telefono = '';
        this.genero = '';
        this.fechaNacimiento = '';
        this.direccion = '';
        this.codigoPostal = '';
        this.estado = '';
    }

    async inspeccionar(clave: string) {
        await this.router.navigate(['/insights/nueva-inspeccion'])
    }

    calcularEdad(fechaNacimiento: string): number {
        const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);
        const fechaNac = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();

        // Ajustar si el cumpleaños aún no ha pasado este año
        if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }

    sortByDate() {
        this.pacientesFiltrados.sort((a, b) => {
            const fechaA = new Date(a.fechaNacimiento.split('/').reverse().join('-')).getTime();
            const fechaB = new Date(b.fechaNacimiento.split('/').reverse().join('-')).getTime();
            return fechaA - fechaB;
        });
    }

    protected readonly generos = generos;
}
