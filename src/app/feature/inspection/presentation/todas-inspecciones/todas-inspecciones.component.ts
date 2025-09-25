import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { GetAllInspections } from '../../domain/use_cases/getAllInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { DatePipe, NgIf } from '@angular/common';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { InspectionsFilterContext } from '../../domain/filters/inspections.filter.context';
import { AllFilter } from '../../domain/filters/inspections.filter';
import { ChartData } from 'chart.js';
import { OptionLabel } from '../../../../shared/utils/data';
import { GenerateReportImpl } from '../../../report/domain/factory/impl/generate.report.impl';
import { InspectionReportPdf } from '../../../report/domain/template-method/pdf/impl/inspection.report.pdf';
import { InspectionReportExcel } from '../../../report/domain/template-method/excel/impl/inspection.report.excel';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { SendMessage } from '../../../../shared/toast/send.message';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { getRangoEdad } from '../../../../shared/utils/functions/functions';
import { DiseaseModel } from '../../../disease/data/model/disease.model';
import { routes } from '../../../../shared/routes/dict-routes';

@Component({
    standalone: true,
    selector: 'app-todas-inspecciones',
    imports: [Button, InputText, PrimeTemplate, TableModule, FormsModule, DialogModule, TranslatePipe, IconField, InputIcon, ToastModule, DatePipe, NgIf, Fluid, UIChart, DatePicker, Select],
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

    /* Lista de inspecciones y filtrado */
    allInspections: InspectionResponseModel[] = [];
    filteredInspections = this.allInspections;
    selectedInspections: InspectionResponseModel[] = [];

    /* Labels */
    labelInspection = 'inspección';
    labelInspections = 'inspecciones';

    /* Providers */
    validationHelper: BaseValidatorHelper;

    /* Variables de las gráficas */
    lineData: any;

    barData: any;

    pieData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    /* Lista de datos */
    ageRanges: OptionLabel[] = [];
    genders: OptionLabel[] = [];

    originalDiseases: DiseaseModel[] = [];
    diseases: OptionLabel[] = [];
    selectedDisease: OptionLabel = { label: 'Todas', value: -1 };

    results: OptionLabel[] = [];
    selectedResult: OptionLabel = { label: 'Todos', value: -1 };

    // Fecha y hora formato
    dateFormat = 'dd/MM/yyyy';

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly primeng: PrimeNG,
        private readonly messageService: MessageService,
        private readonly translateService: TranslateService,
        private readonly contextFilter: InspectionsFilterContext,
        private readonly cdr: ChangeDetectorRef,
        private readonly translateLang: TranslateLang,
        private readonly router: Router,
        private readonly local: LocalStorageService,
        private readonly generateReport: GenerateReportImpl,
        private readonly getAllInspection: GetAllInspections
    ) {
        this.validationHelper = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    async ngOnInit() {
        this.isDoctor = this.local.getRole() === 'DOCTOR';

        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });

        reloadOnLangChange(this.translateService, this.destroyRef, this.translatePage);

        await this.loadInspections()
    }

    /* Traducciones de idioma */
    private readonly translatePage = () => {
        this.dateFormat = this.translateLang.getDateFormat();
        this.genders = this.translateLang.getOptionsByType(TypeList.gender);
        this.ageRanges = this.translateLang.getOptionsByType(TypeList.ageRange);
        this.translateResults();
        this.translateDiseases();
        this.translateInspections();
        this.initCharts();
        this.cdr.markForCheck();
    };

    translateResults() {
        this.results = this.translateLang.getOptionsByType(TypeList.result);

        this.selectedResult = this.translateLang.translateByOptionLabel({
            type: TypeList.result,
            value: this.selectedResult.value
        });
    }

    translateDiseases() {
        this.diseases = this.translateLang.buildDiseaseOptions(this.originalDiseases, true);

        this.selectedDisease = this.translateLang.translateByOptionLabel({
            type: TypeList.disease,
            value: this.selectedDisease.value
        });
    }

    translateInspections() {
        this.allInspections = this.allInspections.map((inspection) => {
            const resultOption = this.translateLang.translateByOptionLabel({
                value: inspection.result,
                type: TypeList.result
            });
            inspection.resultOption = resultOption;
            inspection.result = resultOption.value;

            const diseaseOption = this.translateLang.translateByOptionLabel({
                value: inspection.diseaseId,
                type: TypeList.disease
            });
            inspection.diseaseOption = diseaseOption;
            inspection.disease = diseaseOption.value;

            const eyeOption = this.translateLang.translateByOptionLabel({
                value: inspection.eye,
                type: TypeList.eye
            });
            inspection.eyeOption = eyeOption;
            inspection.eye = eyeOption.value;

            return inspection;
        });
    }

    async loadInspections() {
        await this.callGetAllInspections();
        if (!this.isDoctor) {
            this.initCharts();
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
            this.allInspections = resultGetAllInspections.right.inspections;
            this.originalDiseases = resultGetAllInspections.right.diseases;
            this.diseases = this.translateLang.buildDiseaseOptions(this.originalDiseases, true);
        }
        this.translateDiseases();
        this.translateInspections();
        this.filterInspections();
    }

    /* Funciones de gráficas */
    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData = this.groupByAgeRange();

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

        this.pieData = this.groupByGender();

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

        this.lineData = this.contextFilter.apply(this.filteredInspections, new AllFilter());

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
            dataMap[range.value] = 0;
        });

        this.filteredInspections.forEach((inspection) => {
            const age = inspection.patientAge;
            dataMap[getRangoEdad(age)]++;
        });

        return {
            labels: this.ageRanges.map((ran) => ran.label),
            datasets: [
                {
                    label: this.validationHelper.getText('titles.distribution.byAgeRange'),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'], // Colores fijos
                    borderColor: ['#1E88E5', '#43A047', '#FB8C00'], // Bordes fijos
                    data: this.ageRanges.map((range) => dataMap[range.value])
                }
            ]
        };
    }

    groupByGender(): ChartData {
        const dataMap: Record<string, number> = {};
        const genders: string[] = [];

        this.genders.forEach((gender) => {
            dataMap[gender.value] = 0;
            genders.push(gender.value);
        });

        this.filteredInspections.forEach((inspection) => {
            if (genders.includes(inspection.patientGender)) {
                dataMap[inspection.patientGender]++;
            }
        });

        return {
            labels: this.genders.map((gen) => gen.label),
            datasets: [
                {
                    label: this.validationHelper.getText('titles.distribution.byGender'),
                    backgroundColor: ['#42A5F5', '#FF6384'],
                    borderColor: ['#1E88E5', '#FF6384'],
                    data: this.genders.map((gender) => dataMap[gender.value])
                }
            ]
        };
    }

    /* Filtrado de lista de doctores */
    filterInspections() {
        // || <>

        this.filteredInspections = this.allInspections.filter((inspection) => {
            const diseaseFilter = this.selectedDisease.value === -1 || inspection.diseaseOption?.value === this.selectedDisease.value;

            const resultFilter = this.selectedResult?.value === -1 || inspection.resultOption?.value === this.selectedResult.value;

            const dateFilter = this.isDateInRange(inspection.inspectionDate);

            return diseaseFilter && resultFilter && dateFilter;
        });

        this.barData = this.groupByAgeRange();
        this.pieData = this.groupByGender();
        this.lineData = this.contextFilter.apply(this.filteredInspections, new AllFilter());
    }

    private isDateInRange(date: Date): boolean {
        if (this.selectedDates === null || this.selectedDates.length === 0) {
            return true;
        }

        if (this.selectedDates[1] === null) {
            const selectedDate = this.selectedDates[0];
            return date.getDay() === selectedDate.getDay() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
        }

        return date >= this.selectedDates[0] && date <= this.selectedDates[1];
    }

    /* Exportar tabla */
    exportPDF() {
        this.generateReport.generatePDF(
            new InspectionReportPdf({
                inspections: this.filteredInspections,
                headers: this.translateLang.getHeaders(TypeList.inspection),
                data: this.translateLang.getHeaders(TypeList.pdf),
                username: this.local.getUsername()
            })
        );
    }

    async exportExcel() {
        await this.generateReport.generateExcel(
            new InspectionReportExcel({
                inspections: this.filteredInspections,
                headers: this.translateLang.getHeaders(TypeList.inspection)
            })
        );
    }

    /* Funciones de navegación hacia otras pantallas */
    async natigateToNewInspection() {
        await this.router.navigate([`/insights/${routes.newInspection}`]);
    }

    async navigateToInspectionDetails(id?: number) {
        if (!id) {
            return;
        }

        await this.router.navigate([`/insights/${routes.viewDetail}`], { queryParams: { id } });
    }

    /*  Funciones de iteración con html */
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
