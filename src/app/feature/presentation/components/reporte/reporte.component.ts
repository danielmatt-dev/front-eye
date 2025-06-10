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
import { afecciones, findPatient, inspecciones, resultados } from '../../../../shared/utils/mocks';
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
import { LocalStorageService } from '../../../../shared/services/local.storage.service';

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

    reportes = inspecciones;
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
        private readonly local: LocalStorageService,
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

        this.barData = this.prepararDatosGraficaPorRangoEdad(this.reportesFiltrados)
        this.pieData = this.prepararDatosGraficaPorGenero(this.reportesFiltrados)
        this.lineData = this.prepareDynamicDetectionData(this.reportesFiltrados)
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData = this.agruparPorRangoEdad(this.reportesFiltrados)

        this.barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false,
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

        this.pieData = this.prepararDatosGraficaPorGenero(this.reportesFiltrados)

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

        this.lineData = this.prepareDynamicDetectionData(this.reportesFiltrados)

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

    agruparPorRangoEdad(reports: any[]): any {
        const categorias = ['Menos de 30', '30 a 45', 'Más de 45'];
        const dataMap: Record<string, number> = {
            'Menos de 30': 0,
            '30 a 45': 0,
            'Más de 45': 0
        };

        // Calcular la cantidad por rango de edad
        reports.forEach(report => {
            const edad = report.edad;
            if (edad < 30) {
                dataMap['Menos de 30']++;
            } else if (edad >= 30 && edad <= 45) {
                dataMap['30 a 45']++;
            } else {
                dataMap['Más de 45']++;
            }
        });

        // Crear el objeto con el formato solicitado
        return {
            labels: categorias,
            datasets: [
                {
                    label: 'Distribución por Rango de Edad',
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],  // Colores fijos
                    borderColor: ['#1E88E5', '#43A047', '#FB8C00'],      // Bordes fijos
                    data: [
                        dataMap['Menos de 30'],
                        dataMap['30 a 45'],
                        dataMap['Más de 45']
                    ]
                }
            ]
        };
    }

    prepararDatosGraficaPorGenero(inspecciones: any[]) {
        const generos = ['Masculino', 'Femenino'];

        // Inicializar el mapa de datos
        const dataMap: Record<string, number> = {
            'Masculino': 0,
            'Femenino': 0
        };

        // Recorrer las inspecciones y contar por género
        inspecciones.forEach(ins => {
            const paciente = findPatient(ins.paciente);

            if (generos.includes(paciente.genero)) {
                dataMap[paciente.genero]++;
            }
        });

        return {
            labels: generos,
            datasets: [{
                label: 'Detecciones por Género',
                data: generos.map(gen => dataMap[gen]),
                backgroundColor: ['#42A5F5', '#FF6384'],
                borderColor: ['#1E88E5', '#FF6384'],
                borderWidth: 1
            }],
            options: {
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#FFFFFF'
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        anchor: 'end',
                        align: 'top',
                        formatter: (value: number) => value.toString()
                    }
                }
            }
        };
    }

    prepararDatosGraficaPorRangoEdad(inspecciones: any[]) {
        const rangosEdad = ['Menos de 30', 'De 30 a 45', 'Más de 45'];

        // Inicializar el mapa de datos
        const dataMap: Record<string, number> = {
            'Menos de 30': 0,
            'De 30 a 45': 0,
            'Más de 45': 0
        };

        // Recorrer las inspecciones y contar por rango de edad
        inspecciones.forEach(ins => {
            if (ins.edad < 30) {
                dataMap['Menos de 30']++;
            } else if (ins.edad <= 45) {
                dataMap['De 30 a 45']++;
            } else {
                dataMap['Más de 45']++;
            }
        });

        return {
            labels: rangosEdad,
            datasets: [{
                label: '',
                data: rangosEdad.map(rango => dataMap[rango]),
                backgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
                borderColor: ['#43A047', '#FB8C00', '#E53935'],
                borderWidth: 1
            }]
        };
    }

    prepareDynamicDetectionData(inspections: any[]) {
        // Obtener los meses únicos presentes en el conjunto de datos
        const monthsSet = new Set<number>();
        inspections.forEach(ins => {
            const [day, month, year] = ins.fecha.split('/').map((x: string) => parseInt(x, 10));
            monthsSet.add(month);
        });

        // Convertir el conjunto en un arreglo ordenado
        const months = Array.from(monthsSet).sort((a, b) => a - b);
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        // Crear los labels usando los nombres de los meses presentes
        const labels = months.map(m => monthNames[m - 1]);
        const categories = ['Proliferativo', 'Moderado', 'Leve', 'Sin Afección'];
        let dataMap: Record<string, number[]> = {};
        categories.forEach(cat => dataMap[cat] = new Array(labels.length).fill(0));

        // Contar las ocurrencias por mes y resultado
        inspections.forEach(ins => {
            const [day, month, year] = ins.fecha.split('/').map((x: string) => parseInt(x, 10));
            const monthIndex = months.indexOf(month);
            if (categories.includes(ins.resultado) && monthIndex >= 0) {
                dataMap[ins.resultado][monthIndex]++;
            }
        });

        return {
            labels,
            datasets: categories.map(cat => ({
                label: cat,
                data: dataMap[cat],
                fill: false,
                backgroundColor: this.colorPorCategoria(cat),
                borderColor: this.colorPorCategoria(cat),
                tension: 0
            }))
        };
    }

    colorPorCategoria(cat: string) {
        switch (cat) {
            case 'Proliferativo': return '#f44336';
            case 'Moderado': return '#ff9800';
            case 'Leve': return '#2196f3';
            case 'Sin Afección': return '#4caf50';
            default: return '#9e9e9e';
        }
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

