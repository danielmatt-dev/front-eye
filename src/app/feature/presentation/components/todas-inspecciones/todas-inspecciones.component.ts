import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { findPatient, inspecciones } from '../../../../shared/utils/mocks';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    exportExcel() {
        // Crear las columnas de la tabla
        const tableColumn = ['Clave', 'Paciente', 'Edad', 'Fecha', 'Hora', 'Afección', 'Ojo', 'Resultado'];

        // Crear las filas de la tabla utilizando los datos filtrados
        const tableRows = this.inspeccionesFiltradas.map((ins) => {
            const paciente = findPatient(ins.paciente);

            return [
                ins.id,
                `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`,
                paciente.edad,
                ins.fecha,
                ins.hora,
                ins.afeccion,
                ins.ojo,
                ins.resultado
            ];
        });

        // Convertir el array de filas en un formato compatible para Excel
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
        const wb: XLSX.WorkBook = { Sheets: { 'Inspecciones': ws }, SheetNames: ['Inspecciones'] };

        // Descargar el archivo Excel
        XLSX.writeFile(wb, 'inspecciones.xlsx');
    }

    exportPDF() {
        const doc = new jsPDF();
        doc.text('Inspecciones', 10, 10);

        // Columnas de la tabla
        const tableColumn = ['Clave', 'Paciente', 'Edad', 'Fecha', 'Hora', 'Afección', 'Ojo', 'Resultado'];

        // Filtrar los datos a exportar (utilizando los datos de doctores)
        const tableRows = this.inspeccionesFiltradas.map((ins) => {

            const paciente = findPatient(ins.paciente)

            return [
                ins.id,
                `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`,
                paciente.edad,
                ins.fecha,
                ins.hora,
                ins.afeccion,
                ins.ojo,
                ins.resultado
            ]
        })

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
                cellPadding: 4               // Espaciado en celdas
            }
        });

        // Guardar el archivo PDF
        doc.save('inspecciones.pdf');
    }

}
