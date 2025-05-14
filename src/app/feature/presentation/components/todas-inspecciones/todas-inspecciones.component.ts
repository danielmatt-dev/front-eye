import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { inspecciones } from '../../../../shared/utils/mocks';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, InputText, PrimeTemplate, TableModule, FormsModule, DialogModule, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ToastModule],
    providers: [MessageService],
    templateUrl: './todas-inspecciones.component.html',
    styleUrl: './todas-inspecciones.component.scss'
})
export class TodasInspeccionesComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    fechasSeleccionadas: Date[] = [];
    periodoSeleccionado = '';

    inspections = inspecciones;
    inspeccionesFiltradas = this.inspections;

    labelInspection = 'inspección';
    labelInspections = 'inspecciones';

    selectedInspecciones = [];

    opcionesConsultaHelper: OpcionesConsultaHelper;

    constructor(
        private readonly primeng: PrimeNG,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly router: Router,
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    ngOnInit() {

        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });
    }

    async nuevaInspeccion() {
        await this.router.navigate(['/insights/nueva-inspeccion'])
    }

    async onRowSelect(event: any) {
        await this.router.navigate(['/insights/ver-detalle'])
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

    sortByDate() {
        this.inspeccionesFiltradas.sort((a, b) => {
            const fechaA = new Date(a.fecha.split('/').reverse().join('-')).getTime();
            const fechaB = new Date(b.fecha.split('/').reverse().join('-')).getTime();
            return fechaA - fechaB;
        });
    }

    sortByHour() {
        this.inspeccionesFiltradas.sort((a, b) => {
            // Convertir las horas en formato 'HH:mm' a minutos totales desde las 00:00
            const minutosA = this.convertToMinutes(a.hora);
            const minutosB = this.convertToMinutes(b.hora);
            return minutosA - minutosB;
        });
    }

    convertToMinutes(hora: string): number {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }

    filtrarInspecciones(): void {

        // Validación del rango seleccionado
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        // Si no hay fechas seleccionadas o período seleccionado, mostrar todas las inspecciones
        if (this.fechasSeleccionadas.length === 0 && this.periodoSeleccionado === '') {
            this.inspeccionesFiltradas = this.inspections;
            return;
        }

        let fechaInicio: Date;
        let fechaFin: Date = new Date(); // Fecha de hoy

        // Calcular el rango de fechas según el período seleccionado
        switch (this.periodoSeleccionado) {
            case 'Mes actual':
                // Primer día del mes actual hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
                break;
            case '2 meses':
                // Primer día del mes anterior hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 1, 1);
                break;
            case '3 meses':
                // Primer día de hace dos meses hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 2, 1);
                break;
            case 'Personalizado':

                if (this.fechasSeleccionadas.length === 2 && this.fechasSeleccionadas[1] === null) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[0]);
                }

                if (this.fechasSeleccionadas.length === 2 &&
                    this.fechasSeleccionadas[0] !== null &&
                    this.fechasSeleccionadas[1] !== null) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[1]);
                }
                break;
            default:
                console.warn('Período no válido.');
                return;
        }

        // Formato de las fechas para comparar (YYYY-MM-DD)
        const formatoFecha = (fecha: Date) => fecha.toISOString().split('T')[0];

        // Filtrar inspecciones en base a la fechaCreacion
        this.inspeccionesFiltradas = this.inspections.filter((inspeccion) => {
            const fechaCreacion = new Date(inspeccion.fecha.split('/').reverse().join('-')); // Convertir dd/MM/yyyy a yyyy-MM-dd
            return formatoFecha(fechaCreacion) >= formatoFecha(fechaInicio) && formatoFecha(fechaCreacion) <= formatoFecha(fechaFin);
        });

        console.log('Inspecciones Filtradas:', this.inspeccionesFiltradas);
    }

    onPeriodoSeleccionado(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }
}
