import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { doctores, generos } from '../../../../shared/utils/mocks';
import { DatePickerModule } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Toast } from 'primeng/toast';

@Component({
    standalone: true,
    selector: 'app-doctor',
    imports: [FormsModule, ButtonModule, TableModule, DialogModule, SelectModule, InputText, DatePickerModule, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ConfirmDialogModule, NgIf, Toast],
    providers: [ConfirmationService, MessageService],
    templateUrl: './doctor.component.html',
    styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    isUpdate = false;
    isVisible = false;

    periodoSeleccionado = '';
    fechasSeleccionadas: Date[] = [];

    selectedDoctores: any[] = [];

    doctores = doctores;
    doctoresFiltrados = this.doctores;

    labelDoctor = 'doctor';
    labelDoctors = 'doctores';

    claveDoctor = '';
    nombre = '';
    apellidoPaterno = '';
    apellidoMaterno = '';
    correo = '';
    telefono = '';
    genero = '';
    fechaNacimiento = '';
    direccion = '';
    codigoPostal = '';

    opcionesConsultaHelper: OpcionesConsultaHelper;

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(messageService, translateService, primeng);
    }

    ngOnInit() {
        this.translateService.use('es');
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res));

        this.translateService.get('doctor.singular').subscribe((res: string) => {
            this.labelDoctor = res.toLowerCase();
        });

        this.translateService.get('doctor.plural').subscribe((res: string) => {
            this.labelDoctors = res.toLowerCase();
        });
    }

    addDoctor() {
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
        this.cerrarVentanaNotificacion();
        this.limpiarCampos();
    }

    editarDoctor(clave: string): void {
        this.isUpdate = true;

        const doctor = this.doctores.find((d) => d.clave === clave);
        if (doctor) {
            // Asignar los datos del doctor a los campos correspondientes
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
    }

    actualizarDoctor(): void {
        if (!this.claveDoctor) {
            console.warn('No hay un doctor seleccionado para actualizar.');
            return;
        }

        const index = this.doctores.findIndex((d) => d.clave === this.claveDoctor);
        if (index !== -1) {
            // Crear el objeto doctor actualizado
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

            // Actualizar el doctor en la lista
            this.doctores[index] = doctorActualizado;
            console.log('Doctor actualizado:', doctorActualizado);

            // Cerrar el modal y limpiar los campos
            this.cerrarVentanaNotificacion();
            this.limpiarCampos();
        }
    }

    eliminarDoctor(clave: string): void {
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
                }
            });
        }
    }

    eliminarDoctoresSeleccionados(): void {
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
        this.correo = '';
        this.telefono = '';
        this.genero = '';
        this.fechaNacimiento = '';
        this.direccion = '';
        this.codigoPostal = '';
    }

    abrirModal() {
        this.isVisible = true;
    }

    cerrarVentanaNotificacion() {
        this.isVisible = false;
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
    }

    protected readonly generos = generos;
}
