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

        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--p-indigo-500'),
                    borderColor: documentStyle.getPropertyValue('--p-indigo-500'),
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
                    backgroundColor: [documentStyle.getPropertyValue('--p-indigo-500'), documentStyle.getPropertyValue('--p-purple-500'), documentStyle.getPropertyValue('--p-teal-500')],
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
                    backgroundColor: documentStyle.getPropertyValue('--p-indigo-500'),
                    borderColor: documentStyle.getPropertyValue('--p-indigo-500'),
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
}

