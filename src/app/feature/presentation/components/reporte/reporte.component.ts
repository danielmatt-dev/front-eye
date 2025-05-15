import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { LayoutService } from '../../layout/service/layout.service';
import { debounceTime, Subscription } from 'rxjs';
import { DatasourceLocalImpl } from '../../../data/datasource/local/impl/datasource.local.impl';
import { afecciones, reports, resultados } from '../../../../shared/utils/mocks';
import { NgIf } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';
import { PrimeNG } from 'primeng/config';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [DropdownModule, FormsModule, TableModule, InputText, ButtonModule, Select, Fluid, UIChart, NgIf, DatePicker, TranslatePipe, IconField, InputIcon, ToastModule],
    providers: [MessageService],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.scss'
})
export class ReporteComponent implements OnInit {
    afecciones = afecciones;
    afeccionSeleccionada = 'Todas';
    resultados = resultados;
    resultadoSeleccionado = 'Todos';

    fechasSeleccionadas: Date[] = [];

    reportes = reports;
    reportesFiltrados = this.reportes;

    @ViewChild('filter') filter!: ElementRef;

    lineData: any;

    barData: any;

    pieData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    subscription: Subscription;
    localeTextProvider: LocaleTextProvider

    showGraphics = false;

    constructor(
        private readonly layoutService: LayoutService,
        private readonly local: DatasourceLocalImpl,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG
    ) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initCharts();
        });
        this.localeTextProvider = LocaleTextProvider.getInstance(this.translateService, this.primeng)
    }

    ngOnInit(): void {
        if (this.local.getRole() === 'DOCTOR') {
            this.showGraphics = true;
            this.initCharts();
        }
    }

    consultar() {
        // || <>

        this.reportesFiltrados = this.reportes.filter((reporte) => {
            const [day, month, year] = reporte.fecha.split('/').map(Number)
            const fechaReporte = new Date(year, month - 1, day)

            const filtroAfeccion = this.afeccionSeleccionada === 'Todas' || reporte.afeccion === this.afeccionSeleccionada;

            const filtroResultado = this.resultadoSeleccionado === 'Todos' || reporte.resultado === this.resultadoSeleccionado;

            const filtroFecha = this.isDateInRange(fechaReporte)

            return filtroAfeccion && filtroResultado && filtroFecha;
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const userRole = this.local.getRole()
        let primaryColor = '--p-indigo-500'

        if (userRole === 'DOCTOR') {
            primaryColor = '--p-cyan-500'
        }

        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue(primaryColor),
                    borderColor: documentStyle.getPropertyValue(primaryColor),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--p-indigo-200'),
                    borderColor: documentStyle.getPropertyValue('--p-indigo-200'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue(primaryColor), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-indigo-400'), documentStyle.getPropertyValue('--p-purple-400'), documentStyle.getPropertyValue('--p-teal-400')]
                }
            ]
        };

        this.pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        this.lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue(primaryColor),
                    borderColor: documentStyle.getPropertyValue(primaryColor),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-indigo-200'),
                    borderColor: documentStyle.getPropertyValue('--p-indigo-200'),
                    tension: 0.4
                }
            ]
        };

        this.lineOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    private isDateInRange(fechaReporte: Date): boolean {

        if (this.fechasSeleccionadas === null || this.fechasSeleccionadas.length === 0) {
            return true
        }

        if (this.fechasSeleccionadas[1] === null) {
            const fechaSeleccionada = this.fechasSeleccionadas[0]
            return fechaReporte.getDate() === fechaSeleccionada.getDate()
        }

        return (fechaReporte >= this.fechasSeleccionadas[0] && fechaReporte <= this.fechasSeleccionadas[1])
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

    exportExcel() {
        // Definir los encabezados de la tabla
        const tableColumn = ['ID', 'Fecha', 'Hora', 'Edad', 'Afección', 'Ojo', 'Resultado'];

        // Crear las filas de la tabla utilizando los datos filtrados
        const tableRows = this.reportesFiltrados.map((rep) => {
            return [
                rep.id,
                rep.fecha,
                rep.hora,
                rep.edad,
                rep.afeccion,
                rep.ojo,
                rep.resultado
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
        const wb: XLSX.WorkBook = { Sheets: { 'Reportes': ws }, SheetNames: ['Reportes'] };

        // Descargar el archivo Excel
        XLSX.writeFile(wb, 'reportes.xlsx');
    }

    exportPDF() {
        const doc = new jsPDF();
        doc.text('Reportes', 10, 10);

        // Columnas de la tabla
        const tableColumn = ['ID', 'Fecha', 'Hora', 'Edad', 'Afección', 'Ojo', 'Resultado'];

        // Filtrar los datos a exportar
        const tableRows = this.reportesFiltrados.map((report) => [
            report.id,
            report.fecha,
            report.hora,
            report.edad,
            report.afeccion,
            report.ojo,
            report.resultado
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
                cellPadding: 4               // Espaciado en celdas
            }
        });

        // Guardar el archivo PDF
        doc.save('reportes.pdf');
    }

}

