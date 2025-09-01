import { ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GetAllInspections } from '../../domain/use_cases/getAllInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { colorByDisease, getRangoEdad } from '../../../../shared/utils/functions/functions';
import { AllFilter, DynamicRangeFilter, InspectionsFilterStrategy, OneDayFilter, OneMonthFilter, OneWeekFilter, RangeDaysFilter } from '../../domain/filters/inspections.filter';
import { InspectionsFilterContext } from '../../domain/filters/inspections.filter.context';
import { ValidatorHelper } from '../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { Select } from 'primeng/select';
import { NgForOf, NgIf } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SendMessage } from '../../../../shared/toast/send.message';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { OptionLabel } from '../../../../shared/utils/data';
import { DiseaseModel } from '../../../disease/data/model/disease.model';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [Fluid, UIChart, SelectButton, FormsModule, CalendarModule, DatePicker, TranslatePipe, Select, NgIf, SkeletonModule, NgForOf],
    providers: [MessageService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
    // Conteos de detecciones
    weeklyDetections = 0; // Detecciones en la última semana
    monthlyDetections = 0; // Detecciones en el último mes
    totalDetections = 0; // Detecciones totales

    // Conteos por tipo de afección
    diseaseCounts: Record<number, number> = {};

    // Conteos por género
    maleCount = 0; // Cantidad de pacientes hombres
    femaleCount = 0; // Cantidad de pacientes mujeres

    // Conteos por rango de edad
    under30Count = 0; // Pacientes menores de 30 años
    between30And45Count = 0; // Pacientes entre 30 y 45 años
    over45Count = 0; // Pacientes mayores de 45 años

    // Porcentajes por género
    malePercentage = 0; // Porcentaje de pacientes hombres
    femalePercentage = 0; // Porcentaje de pacientes mujeres

    // Porcentajes por rango de edad
    under30Percentage = 0; // Porcentaje de pacientes menores de 30 años
    between30And45Percentage = 0; // Porcentaje de pacientes entre 30 y 45 años
    over45Percentage = 0; // Porcentaje de pacientes mayores de 45 años

    // Lista de opciones
    diseasesOptions: OptionLabel[] = [];
    ageRanges: OptionLabel[] = [];

    /* Providers */
    monthlyDetectionsData: any;
    monthlyDetectionsOptions: any;
    detectionsByAgeRangeAndDiseaseData: any;
    detectionsByAgeRangeAndDiseaseOptions: any;
    detectionTrendData: any;
    detectionTrendOptions: any;

    /* Opciones para consultar */
    options: OptionLabel[] = [];
    optionSelected: OptionLabel = { label: 'Todo', value: -1 };
    selectedDates: Date[] = [];
    calendarDisabled = true;

    /* Lista de inspecciones y filtrado */
    allInspections: InspectionResponseModel[] = [];
    diseases: DiseaseModel[] = [];

    /* Variables del html */
    isMobileView: boolean = false;

    /* Variables de carga */
    isChartLoading = false;

    /* Providers */
    validator: ValidatorHelper;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly translateLang: TranslateLang,
        private readonly contextFilter: InspectionsFilterContext,
        private readonly cdr: ChangeDetectorRef,
        private readonly primeng: PrimeNG,
        private readonly getAllInpections: GetAllInspections
    ) {
        this.validator = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    async ngOnInit() {
        await this.callGetAllInspections();
        reloadOnLangChange(this.translateService, this.destroyRef, this.loadTranslate);
        this.calculateDetectionStatistics();
        this.initCharts();
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const charDataInspectionsAll = this.contextFilter.apply(this.allInspections, new AllFilter());

        this.monthlyDetectionsData = charDataInspectionsAll;

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

        this.detectionsByAgeRangeAndDiseaseData = this.getDetectionsByAgeRangeAndDisease();

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

        this.detectionTrendData = charDataInspectionsAll;

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

    /* Traducciones */
    private readonly loadTranslate = () => {
        this.diseasesOptions = this.translateLang.buildDiseaseOptions(this.diseases, false);
        this.ageRanges = this.translateLang.getOptionsByType(TypeList.ageRange);
        this.options = this.translateLang.getOptionsByType(TypeList.option);
        this.optionSelected = this.translateLang.translateByOptionLabel({
            type: TypeList.option,
            value: this.optionSelected.value
        });

        this.allInspections = this.allInspections.map((ins) => {
            const option = this.translateLang.translateByOptionLabel({
                value: ins.disease,
                type: TypeList.disease
            });
            ins.diseaseOption = option;
            ins.disease = option.value;

            const resultOption = this.translateLang.translateByOptionLabel({
                value: ins.result,
                type: TypeList.result
            });
            ins.resultOption = resultOption
            ins.result = resultOption.value
            return ins;
        });

        this.initCharts();
        this.filterInspections(true);
        this.cdr.markForCheck();
    };

    /* Llamadas a casos de uso */
    async callGetAllInspections() {
        this.isChartLoading = true;
        const resultGetAllInspections = await this.getAllInpections.call(new NoParams());
        this.isChartLoading = false;

        if (resultGetAllInspections._tag === 'Left') {
            this.validator.getToastException(resultGetAllInspections.left);
        }

        if (resultGetAllInspections._tag === 'Right') {
            this.allInspections = resultGetAllInspections.right.inspections;
            this.diseases = resultGetAllInspections.right.diseases;
        }
    }

    /* Funciones para filtrar los datos para las gráficas */
    filterInspections(reload: boolean) {
        if (this.optionSelected.value === 0) {
            this.calendarDisabled = false;
            if (reload) this.detectionTrendData = this.contextFilter.apply(this.allInspections, new RangeDaysFilter());
            return;
        }

        this.calendarDisabled = true;
        this.selectedDates = [];
        let strategy: InspectionsFilterStrategy = new AllFilter();

        switch (this.optionSelected.value) {
            case 1:
                strategy = new OneDayFilter();
                break;
            case 2:
                strategy = new OneWeekFilter();
                break;
            case 3:
                strategy = new OneMonthFilter();
                break;
            case 4:
                strategy = new DynamicRangeFilter();
                break;
        }
        this.detectionTrendData = this.contextFilter.apply(this.allInspections, strategy);
    }

    getDetectionsByAgeRangeAndDisease() {
        // Inicializar contadores para cada combo rango + afección
        const dataMap: Record<string, Record<string, number>> = {};
        this.ageRanges.forEach((ag) => {
            dataMap[ag.value] = {};
            this.diseasesOptions.forEach((op) => {
                dataMap[ag.value][op.value] = 0;
            });
        });

        for (const inspection of this.allInspections) {
            const patient = this.allInspections.find((p) => p.patientId === inspection.patientId);

            if (!patient) {
                continue;
            }

            const ageRange = getRangoEdad(patient.patientAge);
            const disease = inspection.diseaseOption?.value;
            dataMap[ageRange][disease]++;
        }

        // Construir datasets con datos agrupados por afección
        const datasets: any[] = this.diseasesOptions.map((op) => ({
            label: op.label,
            data: this.ageRanges.map((ag) => dataMap[ag.value][op.value]),
            backgroundColor: this.ageRanges.map(() => colorByDisease(op.value)),
            borderColor: this.ageRanges.map(() => colorByDisease(op.value)),
            borderWidth: 0
        }));

        return {
            labels: this.ageRanges.map((ag) => ag.label),
            datasets
        };
    }

    /* Cálculo de estadísticas de las inspecciones */
    calculateDetectionStatistics() {
        this.totalDetections = this.allInspections.length;
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
            const disease = inspection.diseaseOption?.value;

            if (inspectionDate >= sevenDaysAgo) this.weeklyDetections++;
            if (inspectionDate >= oneMonthAgo) this.monthlyDetections++;

            if (!(disease in this.diseaseCounts)) {
                this.diseaseCounts[disease] = 0;
            }
            this.diseaseCounts[disease]++;

            patientsDetected.add(inspection.patientId);
        }
        this.computeDemographicDistribution(patientsDetected);
    }

    computeDemographicDistribution(patientdIds: Set<number>) {
        // Procesar pacientes detectados para género y edad
        for (const patientId of patientdIds) {
            const patient = this.allInspections.find((p) => p.patientId === patientId);

            if (!patient) continue;

            const option = this.translateLang.translateByOptionLabel({ type: TypeList.gender, value: patient.patientGender });

            if (option.value === 'Masculino') this.maleCount++;
            else if (option.value === 'Femenino') this.femaleCount++;

            if (patient.patientAge < 30) this.under30Count++;
            else if (patient.patientAge >= 30 && patient.patientAge <= 45) this.between30And45Count++;
            else if (patient.patientAge > 45) this.over45Count++;
        }

        this.calculatePercentages(this.maleCount + this.femaleCount);
    }

    calculatePercentages(totalPatients: number) {
        // Porcentajes por género
        this.malePercentage = totalPatients ? Math.round((this.maleCount / totalPatients) * 100) : 0;
        this.femalePercentage = totalPatients ? Math.round((this.femaleCount / totalPatients) * 100) : 0;

        // Porcentajes por rango de edad
        this.under30Percentage = totalPatients ? Math.round((this.under30Count / totalPatients) * 100) : 0;
        this.between30And45Percentage = totalPatients ? Math.round((this.between30And45Count / totalPatients) * 100) : 0;
        this.over45Percentage = totalPatients ? Math.round((this.over45Count / totalPatients) * 100) : 0;
    }

    /* Función que se ejecuta al selecionar una fecha */
    onSelectedDates(dates: Date[]) {
        this.selectedDates = dates;

        if (this.selectedDates.length === 0 || this.selectedDates.length === 1) {
            return;
        }

        let strategy: InspectionsFilterStrategy = new OneDayFilter();

        const startDate = this.selectedDates[0];
        let endDate = this.selectedDates[0];
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        if (this.selectedDates[1] !== null) {
            endDate = this.selectedDates[1];
            endDate.setHours(23, 59, 59, 999);

            const msInDay = 1000 * 60 * 60 * 24;
            const diffMs = endDate.getTime() - startDate.getTime();
            const diffDays = Math.floor(diffMs / msInDay);

            // 0–22 días → “22 días”
            if (diffDays <= 29) {
                strategy = new RangeDaysFilter();
            }

            // 29–120 días → “3 meses”
            if (diffDays > 29 && diffDays <= 120) {
                strategy = new DynamicRangeFilter();
            }

            if (diffDays > 120) {
                strategy = new AllFilter();
            }
        }

        strategy.startDate = startDate;
        strategy.endDate = endDate;

        this.detectionTrendData = this.contextFilter.apply(this.allInspections, strategy);
    }

    /* Calcular tamaño de pantalla */
    checkScreenSize(): void {
        this.isMobileView = window.innerWidth < 768; // Tailwind 'md' breakpoint
    }
}
