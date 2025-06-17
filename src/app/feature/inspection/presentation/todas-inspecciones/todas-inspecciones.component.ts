import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { inspectionResponseMocks } from '../../../../shared/utils/mocks';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { GetAllInspections } from '../../domain/use_cases/getAllInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { InspectionResponseEntity } from '../../domain/entity/inspection.response.entity';
import { FilterService } from '../../../../shared/services/filter.service';
import { DatePipe, NgIf } from '@angular/common';
import {
    BaseValidatorHelper
} from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { InspectionsFilterContext } from '../../domain/filters/inspections.filter.context';
import { AllFilter } from '../../domain/filters/inspections.filter';
import { ChartData } from 'chart.js';
import { ageRanges, genders } from '../../../../shared/utils/data';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, InputText, PrimeTemplate, TableModule, FormsModule, DialogModule, TranslatePipe, OpcionesConsultaComponent, IconField, InputIcon, ToastModule, DatePipe, NgIf, Fluid, UIChart],
    providers: [MessageService],
    templateUrl: './todas-inspecciones.component.html',
    styleUrl: './todas-inspecciones.component.scss'
})
export class TodasInspeccionesComponent implements OnInit {
    /* Variables de interacción con html */
    isDoctor = true;

    /* Opciones de la tabla*/
    @ViewChild('filter') filter!: ElementRef;
    isLoading = true;

    /* Variables para opciones de consulta */
    selectedDates: Date[] = [];
    selectedPeriod = '';

    /* Lista de inspecciones y filtrado */
    allInspections: InspectionResponseEntity[] = inspectionResponseMocks;
    filteredInspections = this.allInspections;
    selectedInspections: InspectionResponseEntity[] = [];

    /* Labels */
    labelInspection = 'inspección';
    labelInspections = 'inspecciones';

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    validationHelper: BaseValidatorHelper;

    /* Variables de las gráficas */
    lineData: any;

    barData: any;

    pieData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    /* Lista de datos */
    ageRanges = ageRanges
    genders = genders

    constructor(
        private readonly primeng: PrimeNG,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly router: Router,
        private readonly local: LocalStorageService,
        private readonly getAllInspection: GetAllInspections,
        private readonly filterService: FilterService
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.validationHelper = BaseValidatorHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    async ngOnInit() {
        this.isDoctor = this.local.getRole() === 'DOCTOR';

        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });

        await this.callGetAllInspections();
        if (!this.isDoctor) {
            this.initCharts()
        }
    }

    /* Llamadas a casos de uso */
    async callGetAllInspections() {
        this.isLoading = true;
        const resultGetAllInspections = await this.getAllInspection.call(new NoParams());
        this.isLoading = false;

        if (resultGetAllInspections._tag === 'Left') {
            this.validationHelper.getToastException(resultGetAllInspections.left);
        }

        if (resultGetAllInspections._tag === 'Right') {
            //this.allInspections = resultGetAllInspections.right;
            this.filterInspections();
        }
    }

    /* Funciones de gráficas */
    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const charDataInspectionsAll = new InspectionsFilterContext(new AllFilter()).apply(this.allInspections);

        this.barData = this.groupByAgeRange()

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

        this.pieData = this.groupByGender()

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

        this.lineData = charDataInspectionsAll

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

    groupByAgeRange(): ChartData {

        // Inicializar contadores para cada combo rango + afección
        const dataMap: Record<string, number> = {};
        this.ageRanges.forEach((range) => {
            dataMap[range] = 0
        });

        function getRangoEdad(edad: number): string {
            if (edad < 30) return 'Menos de 30';
            else if (edad <= 45) return 'De 30 a 45';
            else return 'Más de 45';
        }

        this.allInspections.forEach((inspection => {
            const age = inspection.patientAge
            dataMap[getRangoEdad(age)]++
        }))

        return {
            labels: ageRanges,
            datasets: [
                {
                    label: this.validationHelper.getText('titles.distribution.byAgeRange'),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],  // Colores fijos
                    borderColor: ['#1E88E5', '#43A047', '#FB8C00'],      // Bordes fijos
                    data: this.ageRanges.map(range => dataMap[range])
                }
            ]
        }
    }

    groupByGender(): ChartData {

        const dataMap: Record<string, number> = {};
        this.genders.forEach((gender) => {
            dataMap[gender] = 0
        });

        this.allInspections.forEach(inspection => {
            if (genders.includes(inspection.patientGender)) {
                dataMap[inspection.patientGender]++
            }
        })

        return {
            labels: genders,
            datasets: [
                {
                    label: this.validationHelper.getText('titles.distribution.byGender'),
                    backgroundColor: ['#42A5F5', '#FF6384'],
                    borderColor: ['#1E88E5', '#FF6384'],
                    data: this.genders.map(gender => dataMap[gender])
                }
            ]
        }
    }

    /* Filtrado de lista de doctores */
    filterInspections() {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredInspections = this.filterService.filterByPeriodo(this.allInspections, (ins) => ins.inspectionDate, this.selectedPeriod, this.selectedDates);
    }

    /* Funciones de navegación hacia otras pantallas */
    async natigateToNewInspection() {
        await this.router.navigate(['/insights/nueva-inspeccion']);
    }

    async navigateToInspectionDetails(id?: number) {
        if (!id) {
            await this.router.navigate(['/insights/ver-detalle']);
            return;
        }

        await this.router.navigate(['/insights/ver-detalle'], { queryParams: { id } });
    }

    /*  Funciones de iteración con html */
    onPeriodSelected(periodo: string) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
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
