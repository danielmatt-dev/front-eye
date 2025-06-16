import { Component, OnInit } from '@angular/core';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { inspectionResponseMocks } from '../../../../shared/utils/mocks';
import { GetAllInspections } from '../../domain/use_cases/getAllInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { InspectionResponseEntity } from '../../domain/entity/inspection.response.entity';
import { colorByDisease } from '../../../../shared/utils/functions/functions';
import { ageRanges, diseases } from '../../../../shared/utils/data';
import {
    AllFilter, RangeDaysFilter,
    InspectionsFilterStrategy,
    OneDayFilter, OneMonthFilter,
    OneWeekFilter, DynamicRangeFilter
} from '../../domain/filters/inspections.filter';
import { InspectionsFilterContext } from '../../domain/filters/inspections.filter.context';
import { ValidatorHelper } from '../../../../shared/utils/validator.helper';
import { DashboardValidationHelper } from './validation/dashboard.validation.helper';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [Fluid, UIChart, SelectButton, FormsModule, CalendarModule, DatePicker, TranslatePipe],
    providers: [MessageService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    // Conteos de detecciones
    weeklyDetections = 0;            // Detecciones en la última semana
    monthlyDetections = 0;           // Detecciones en el último mes
    totalDetections = 0;             // Detecciones totales

    // Conteos por tipo de afección
    dryDmaeCount = 0;                // Casos de DMAE Seca
    wetDmaeCount = 0;                // Casos de DMAE Húmeda
    diabeticRetinopathyCount = 0;    // Casos de Retinopatía Diabética

    // Conteos por género
    maleCount = 0;                   // Cantidad de pacientes hombres
    femaleCount = 0;                 // Cantidad de pacientes mujeres

    // Conteos por rango de edad
    under30Count = 0;                // Pacientes menores de 30 años
    between30And45Count = 0;         // Pacientes entre 30 y 45 años
    over45Count = 0;                 // Pacientes mayores de 45 años

    // Porcentajes por género
    malePercentage = 0;              // Porcentaje de pacientes hombres
    femalePercentage = 0;            // Porcentaje de pacientes mujeres

    // Porcentajes por rango de edad
    under30Percentage = 0;           // Porcentaje de pacientes menores de 30 años
    between30And45Percentage = 0;    // Porcentaje de pacientes entre 30 y 45 años
    over45Percentage = 0;            // Porcentaje de pacientes mayores de 45 años

    // Lista de opciones
    diseases = diseases
    ageRanges = ageRanges

    /* Providers */
    monthlyDetectionsData: any;
    monthlyDetectionsOptions: any;
    detectionsByAgeRangeAndDiseaseData: any;
    detectionsByAgeRangeAndDiseaseOptions: any;
    detectionTrendData: any;
    detectionTrendOptions: any;

    /* Opciones para consultar */
    options = ['1 Día', '1 Semana', '1 Mes', '3 Meses', 'Todo', 'Rango'];
    optionSelected: string = 'Todo';
    selectedDates: Date[] = [];
    calendarDisabled = true

    /* Lista de inspecciones y filtrado */
    allInspections: InspectionResponseEntity[] = inspectionResponseMocks

    /* Providers */
    validator: ValidatorHelper

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly getAllInpections: GetAllInspections
    ) {
        this.validator = DashboardValidationHelper.getInstance(this.messageService, this.translateService, this.primeng)
    }

    async ngOnInit() {
        await this.callGetAllInspections()
        this.calculateDetectionStatistics()
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const charDataInspectionsAll = new InspectionsFilterContext(new AllFilter()).apply(this.allInspections)

        this.monthlyDetectionsData = charDataInspectionsAll

        this.monthlyDetectionsOptions = {
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

        this.detectionsByAgeRangeAndDiseaseData = this.getDetectionsByAgeRangeAndDisease()

        this.detectionsByAgeRangeAndDiseaseOptions = {
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

        this.detectionTrendData = charDataInspectionsAll

        this.detectionTrendOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    align: 'end',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        pointStyle: 'circle'
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
                    min: 0,
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

    /* Llamadas a casos de uso */
    async callGetAllInspections() {

        const resultGetAllInspections = await this.getAllInpections.call(new NoParams())

        if (resultGetAllInspections._tag === 'Left') {
            this.validator.getToastException(resultGetAllInspections.left)
        }

        if (resultGetAllInspections._tag === 'Right') {
            // this.allInspections = resultGetAllInspections.right
        }

    }

    /* Funciones para filtrar los datos para las gráficas */
    filterInspections() {

        if (this.optionSelected === 'Rango') {
            this.calendarDisabled = false
            return
        }

        this.calendarDisabled = true
        this.selectedDates = []
        let strategy: InspectionsFilterStrategy = new AllFilter();

        switch (this.optionSelected) {
            case '1 Día':
                strategy = new OneDayFilter()
                break
            case '1 Semana':
                strategy = new OneWeekFilter()
                break
            case '1 Mes':
                strategy = new OneMonthFilter()
                break
            case '3 Meses':
                strategy = new DynamicRangeFilter()
                break
        }
        this.detectionTrendData = new InspectionsFilterContext(strategy).apply(this.allInspections)
    }

    getDetectionsByAgeRangeAndDisease() {

        // Inicializar contadores para cada combo rango + afección
        const dataMap: Record<string, Record<string, number>> = {};
        this.ageRanges.forEach(rango => {
            dataMap[rango] = {};
            this.diseases.forEach(afeccion => {
                dataMap[rango][afeccion] = 0;
            });
        });

        function getRangoEdad(edad: number): string {
            if (edad < 30) return 'Menos de 30';
            else if (edad <= 45) return 'De 30 a 45';
            else return 'Más de 45';
        }

        for (const inspection of this.allInspections ) {
            const patient = this.allInspections
                .find(p => p.patientId === inspection.patientId)

            if (!patient) {
                continue
            }

            const ageRange = getRangoEdad(patient.patientAge)
            const disease = inspection.disease
            dataMap[ageRange][disease]++
        }

        // Construir datasets con datos agrupados por afección
        const datasets: any[] = this.diseases.map(afeccion => ({
            label: afeccion,
            data: this.ageRanges.map(rango => dataMap[rango][afeccion]),
            backgroundColor: this.ageRanges.map(() => colorByDisease(afeccion)),
            borderColor: this.ageRanges.map(() => colorByDisease(afeccion)),
            borderWidth: 0
        }));

        return {
            labels: this.ageRanges,
            datasets
        };
    }

    /* Cálculo de estadísticas de las inspecciones */
    calculateDetectionStatistics() {
        this.totalDetections = this.allInspections.length
        const patientsDetected = new Set<number>();

        const today = new Date();

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Mismo día del mes anterior
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Procesar detecciones
        for (const inspection of this.allInspections) {
            const inspectionDate = inspection.inspectionDate;

            if (inspectionDate >= sevenDaysAgo) this.weeklyDetections++;
            if (inspectionDate >= oneMonthAgo) this.monthlyDetections++;

            if (inspection.disease === 'DMAE Seca') this.dryDmaeCount++;
            else if (inspection.disease === 'DMAE Húmeda') this.wetDmaeCount++;
            else if (inspection.disease === 'Retinopatía Diabética') this.diabeticRetinopathyCount++;

            patientsDetected.add(inspection.patientId);
        }
        this.computeDemographicDistribution(patientsDetected)
    }

    computeDemographicDistribution(patientdIds: Set<number>) {

        // Procesar pacientes detectados para género y edad
        for (const patientId of patientdIds) {

            const patient = this.allInspections
                .find(p => p.patientId === patientId)

            if (!patient) continue;

            if (patient.patientGender.toLowerCase() === 'masculino') this.maleCount++;
            else if (patient.patientGender.toLowerCase() === 'femenino') this.femaleCount++;

            if (patient.patientAge < 30) this.under30Count++;
            else if (patient.patientAge >= 30 && patient.patientAge <= 45) this.between30And45Count++;
            else if (patient.patientAge > 45) this.over45Count++;

        }

        const totalPatients = this.maleCount + this.femaleCount;

        // Porcentajes por género
        this.malePercentage = totalPatients
            ? Math.round((this.maleCount / totalPatients) * 100)
            : 0;
        this.femalePercentage = totalPatients
            ? Math.round((this.femaleCount / totalPatients) * 100)
            : 0;

        // Porcentajes por rango de edad
        this.under30Percentage = totalPatients
            ? Math.round((this.under30Count / totalPatients) * 100)
            : 0;
        this.between30And45Percentage = totalPatients
            ? Math.round((this.between30And45Count / totalPatients) * 100)
            : 0;
        this.over45Percentage = totalPatients
            ? Math.round((this.over45Count / totalPatients) * 100)
            : 0;

    }

    /* Función que se ejecuta al selecionar una fecha */
    onSelectedDates(dates: Date[]) {
        this.selectedDates = dates

        if (this.selectedDates.length === 0 || this.selectedDates.length === 1) {
            return
        }

        let strategy: InspectionsFilterStrategy = new OneDayFilter()

        const startDate = this.selectedDates[0]
        let endDate = this.selectedDates[0]
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        if (this.selectedDates[1] !== null) {
            endDate = this.selectedDates[1]
            endDate.setHours(23, 59, 59, 999)

            const msInDay = 1000 * 60 * 60 * 24;
            const diffMs   = endDate.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffMs / msInDay);

            // 0–22 días → “22 días”
            if (diffDays <= 29) {
                strategy = new RangeDaysFilter();
            }

            // 29–120 días → “3 meses”
            if (diffDays > 30 && diffDays <= 120) {
                strategy = new DynamicRangeFilter()
            }

            if (diffDays > 120) {
                strategy = new AllFilter()
            }

        }

        strategy.startDate = startDate
        strategy.endDate = endDate

        this.detectionTrendData = new InspectionsFilterContext(strategy).apply(this.allInspections)
    }

    /*
    prepararDatosGraficaEdadGeneroSimple(inspecciones: any[]) {
        const categorias = ['Menos de 30', '30 a 45', 'Más de 45'];
        const generos = ['Masculino', 'Femenino'];

        // Inicializar contadores para cada combo rango + género
        const dataMap: Record<string, Record<string, number>> = {};
        categorias.forEach(rango => {
            dataMap[rango] = {};
            generos.forEach(gen => {
                dataMap[rango][gen] = 0;
            });
        });

        function getRangoEdad(edad: number): string {
            if (edad < 30) return 'Menos de 30';
            else if (edad <= 45) return '30 a 45';
            else return 'Más de 45';
        }

        inspecciones.forEach(ins => {
            const rango = getRangoEdad(ins.edad);

            // Buscar paciente para obtener género
            const paciente = findPatient(ins.paciente);
            if (!paciente) return;
            if (!generos.includes(paciente.genero)) return;

            const genero = paciente.genero;
            dataMap[rango][genero]++;
        });

        // Construir datasets con datos agrupados por género
        const datasets: any[] = generos.map(gen => ({
            label: gen,
            data: categorias.map(rango => dataMap[rango][gen]),
            backgroundColor: categorias.map(rango => colorByGender(gen)),
            borderColor: categorias.map(rango => colorByGender(gen)),
            borderWidth: 0
        }));

        return {
            labels: categorias,
            datasets
        };
    }
     */
}
