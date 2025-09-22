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

/**
 * Componente para la consulta y gestión de **todas las inspecciones**.
 *
 * @description
 * Pertenece a la capa de **presentation/components** de la Clean Architecture.
 * Muestra un tablero con:
 * - Filtros por fecha, resultado y afección.
 * - Tabla con paginación, búsqueda global y navegación al detalle.
 * - Exportación de resultados a **PDF** y **Excel**.
 * - Gráficas (línea, pie, barras) de distribución cuando el usuario NO es doctor.
 *
 * Orquesta el caso de uso `GetAllInspections` (domain/use_cases), y usa
 * `InspectionsFilterContext` con la estrategia `AllFilter` para construir `ChartData`.
 */
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

    /**
     * Constructor del componente.
     *
     * @param primeng `PrimeNG` - Configuración de PrimeNG.
     * @param messageService `MessageService` - Toaster para notificaciones.
     * @param translateService `TranslateService` - Servicio de internacionalización.
     * @param contextFilter `InspectionsFilterContext` - Contexto de filtros para `ChartData`.
     * @param cdr `ChangeDetectorRef` - Detección de cambios manual.
     * @param translateLang `TranslateLang` - Utilidades para etiquetas/formatos según idioma.
     * @param router `Router` - Navegación entre pantallas.
     * @param local `LocalStorageService` - Rol del usuario, nombre y otros datos de sesión.
     * @param generateReport `GenerateReportImpl` - Fábrica para exportar reportes (PDF/Excel).
     * @param getAllInspection `GetAllInspections` - Caso de uso para obtener inspecciones y enfermedades.
     */
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

    /**
     * Hook de inicialización: determina el rol, carga traducciones y datos, y configura gráficas.
     */
    async ngOnInit() {
        // Determina si el usuario es doctor (controla UI de acciones)
        this.isDoctor = this.local.getRole() === 'DOCTOR';

        // Traducciones de etiquetas sing/plural para títulos y mensajes
        this.translateService.get('inspections.singular').subscribe((res: string) => {
            this.labelInspection = res.toLowerCase();
        });

        this.translateService.get('inspections.plural').subscribe((res: string) => {
            this.labelInspections = res.toLowerCase();
        });

        // Reaplica traducciones y re-renderiza al cambiar de idioma
        reloadOnLangChange(this.translateService, this.destroyRef, this.translatePage);

        // Carga inicial de inspecciones + catálogos
        await this.callGetAllInspections();
        // Si el usuario NO es doctor, inicializa gráficas de distribución
        if (!this.isDoctor) {
            this.initCharts();
        }
    }

    /* Traducciones de idioma */
    /**
     * Reconstruye formatos, catálogos y datasets traducidos tras un cambio de idioma.
     *
     * @private
     */
    private readonly translatePage = () => {
        this.dateFormat = this.translateLang.getDateFormat();
        this.genders = this.translateLang.getOptionsByType(TypeList.gender);
        this.ageRanges = this.translateLang.getOptionsByType(TypeList.ageRange);
        this.translateResults();
        this.translateDiseases();
        this.translateInspections(); // Normaliza labels/values de cada inspección según i18n
        this.initCharts();           // Regenera datasets para gráficos
        this.cdr.markForCheck();
    };

    /**
     * Traduce catálogo de resultados y preserva la opción seleccionada.
     */
    translateResults() {
        this.results = this.translateLang.getOptionsByType(TypeList.result);

        this.selectedResult = this.translateLang.translateByOptionLabel({
            type: TypeList.result,
            value: this.selectedResult.value
        });
    }

    /**
     * Traduce catálogo de enfermedades (OptionLabel) y preserva la selección.
     */
    translateDiseases() {
        this.diseases = this.translateLang.buildDiseaseOptions(this.originalDiseases, true);

        this.selectedDisease = this.translateLang.translateByOptionLabel({
            type: TypeList.disease,
            value: this.selectedDisease.value
        });
    }

    /**
     * Reetiqueta y normaliza propiedades de cada inspección para i18n:
     * result/resultOption, disease/diseaseOption, eye/eyeOption.
     */
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

    /* Llamadas a casos de uso */
    /**
     * Carga todas las inspecciones y el catálogo de enfermedades usando el caso de uso.
     */
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
    /**
     * Inicializa datasets y opciones de las gráficas (barras, pie, línea)
     * usando variables de tema (CSS) para colores de texto y grid.
     */
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

    /**
     * Agrupa inspecciones por rango de edad y construye `ChartData` de barras.
     *
     * @returns `ChartData` con etiquetas de rango y totales por barra.
     */
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

    /**
 * Agrupa inspecciones por género y construye `ChartData` de pie.
 *
 * @returns `ChartData` con etiquetas de género y sus totales.
 */
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

    /* Filtrado de lista de inspecciones */
    /**
     * Aplica filtros por enfermedad, resultado y rango de fechas a `allInspections`.
     * Además, regenera datasets de gráficas con la lista resultante.
     */
    filterInspections() {
        // Filtrado compuesto: enfermedad AND resultado AND fecha en rango

        this.filteredInspections = this.allInspections.filter((inspection) => {
            const diseaseFilter = this.selectedDisease.value === -1 || inspection.diseaseOption?.value === this.selectedDisease.value;

            const resultFilter = this.selectedResult?.value === -1 || inspection.resultOption?.value === this.selectedResult.value;

            const dateFilter = this.isDateInRange(inspection.inspectionDate);

            return diseaseFilter && resultFilter && dateFilter;
        });

        // Actualiza datasets de las gráficas en función del resultado filtrado
        this.barData = this.groupByAgeRange();
        this.pieData = this.groupByGender();
        this.lineData = this.contextFilter.apply(this.filteredInspections, new AllFilter());
    }

    /**
     * Verifica si una fecha cae dentro del rango seleccionado en `selectedDates`.
     *
     * @param date `Date` - Fecha de la inspección.
     * @returns `boolean` `true` si la fecha está dentro del rango o no hay filtro; `false` en caso contrario.
     */
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
    /**
     * Genera un PDF de las inspecciones filtradas usando la plantilla `InspectionReportPdf`.
     */
    exportPDF() {
        // Construcción de parámetros para el template method PDF
        this.generateReport.generatePDF(
            new InspectionReportPdf({
                inspections: this.filteredInspections,
                headers: this.translateLang.getHeaders(TypeList.inspection),
                data: this.translateLang.getHeaders(TypeList.pdf),
                username: this.local.getUsername()
            })
        );
    }

    /**
     * Genera un archivo Excel de las inspecciones filtradas usando `InspectionReportExcel`.
     */
    async exportExcel() {
        await this.generateReport.generateExcel(
            new InspectionReportExcel({
                inspections: this.filteredInspections,
                headers: this.translateLang.getHeaders(TypeList.inspection)
            })
        );
    }

    /* Funciones de navegación hacia otras pantallas */
    /**
     * Navega a la pantalla de creación de nueva inspección.
     */
    async natigateToNewInspection() {
        await this.router.navigate(['/insights/nueva-inspeccion']);
    }

    /**
    * Navega a la vista de detalle de una inspección específica.
    *
    * @param id `number | undefined` - Identificador de la inspección.
    */
    async navigateToInspectionDetails(id?: number) {
        if (!id) {
            return;
        }

        await this.router.navigate(['/insights/ver-detalle'], { queryParams: { id } });
    }

    /*  Funciones de iteración con html */
    /**
     * Limpia filtros de la tabla y el input de búsqueda global.
     *
     * @param table `Table` - Instancia de PrimeNG Table.
     */
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    /**
     * Aplica búsqueda global sobre los campos definidos en `[globalFilterFields]`.
     *
     * @param table `Table` - Tabla sobre la que se aplicará el filtro.
     * @param event `Event` - Evento de input con el término de búsqueda.
     */
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Handlers de teclado (útiles para accesibilidad o debugging de interacciones).
     *
     * @param event `KeyboardEvent`
     */
    onKeyDown(event: KeyboardEvent) {
        console.log('Key Down:', event.key);
    }

    /**
 * Handler al soltar una tecla (útil para medir latencia o auditar inputs).
 *
 * @param event `KeyboardEvent`
 */
    onKeyUp(event: KeyboardEvent) {
        console.log('Key Up:', event.key);
    }
}
