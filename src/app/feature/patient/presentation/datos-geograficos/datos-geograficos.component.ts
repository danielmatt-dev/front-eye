import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { PrimeNG } from 'primeng/config';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import * as L from 'leaflet';
import 'leaflet.featuregroup.subgroup';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import { GetAllPatientsWithInspections } from '../../domain/use_cases/getAllPatientsWithInspections';
import { NoParams } from '../../../../shared/utils/usecase';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { FilterService } from '../../../../shared/services/filter.service';
import { GenerateReportImpl } from '../../../report/domain/factory/impl/generate.report.impl';
import { OptionLabel } from '../../../../shared/utils/data';
import { GeographicDataReportPdf } from '../../../report/domain/template-method/pdf/impl/geographic-data.report.pdf';
import { GeographicDataReportExcel } from '../../../report/domain/template-method/excel/impl/geographic-data.report.excel';
import { LocalStorageService } from '../../../../shared/services/local.storage.service';
import { SendMessage } from '../../../../shared/toast/send.message';
import { PatientWithInspectionsModel } from '../../data/models/patient.with.inspections.model';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';
import { reloadOnLangChange } from '../../../../shared/utils/functions/i18n-refresh';
import { getRangoEdad } from '../../../../shared/utils/functions/functions';

@Component({
    selector: 'app-datos-geograficos',
    imports: [FormsModule, OpcionesConsultaComponent, Toast],
    providers: [MessageService],
    templateUrl: './datos-geograficos.component.html',
    standalone: true,
    styleUrl: './datos-geograficos.component.scss'
})
export class DatosGeograficosComponent implements AfterViewInit, OnInit {
    /* Variables de leaflet */
    map!: L.Map;
    markerClusterGroup!: L.MarkerClusterGroup;
    treeControl?: L.Control.Layers;

    /* Variables para opciones de consulta */
    selectedPeriod: OptionLabel | undefined;
    selectedDates: Date[] = [];

    /*  Variables de iteración con html */
    showButtons = true;

    /* Lista de pacientes y filtrado */
    allPatientsCoordinates: PatientWithInspectionsModel[] = [];
    filteredPatientsCoordinates = this.allPatientsCoordinates;
    displayedPatients = this.filteredPatientsCoordinates;

    /* Opciones de filtrado en el mapa */
    filters = {
        label: 'Filtros',
        children: [
            {
                label: 'Afección',
                children: [
                    { label: 'DMAE Seca', layer: L.layerGroup() },
                    { label: 'DMAE Húmeda', layer: L.layerGroup() },
                    { label: 'Retinopatía Diabética', layer: L.layerGroup() }
                ]
            },
            {
                label: 'Rango de Edad',
                children: [
                    { label: 'Menos de 30', layer: L.layerGroup() },
                    { label: 'De 30 a 45', layer: L.layerGroup() },
                    { label: 'Más de 45', layer: L.layerGroup() }
                ]
            },
            {
                label: 'Género',
                children: [
                    { label: 'Hombre', layer: L.layerGroup() },
                    { label: 'Mujer', layer: L.layerGroup() }
                ]
            },
            {
                label: 'Clasificación de afección',
                children: [
                    { label: 'Leve', layer: L.layerGroup() },
                    { label: 'Moderado', layer: L.layerGroup() },
                    { label: 'Proliferativo', layer: L.layerGroup() },
                    { label: 'Sin Afección', layer: L.layerGroup() }
                ]
            }
        ]
    };
    selectedFilters: string[] = [];
    leafFilters!: { label: string; layer: L.Layer }[];

    /* Providers */
    opcionesConsultaHelper: OpcionesConsultaHelper;
    validationHelper: BaseValidatorHelper;

    private readonly destroyRef = inject(DestroyRef);

    isReadyMap = false;

    /* Listas */
    diseases: OptionLabel[] = [];
    genders: OptionLabel[] = [];
    ageRanges: OptionLabel[] = [];
    results: OptionLabel[] = [];

    diseasesLabels: string[] = [];
    gendersLabels: string[] = [];
    ageRangesLabels: string[] = [];
    resultsLabels: string[] = [];

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly translateLang: TranslateLang,
        private readonly cdr: ChangeDetectorRef,
        private readonly messageService: MessageService,
        private readonly local: LocalStorageService,
        private readonly filterService: FilterService,
        private readonly generateReport: GenerateReportImpl,
        private readonly getAllPatientsWithInspections: GetAllPatientsWithInspections
    ) {
        this.opcionesConsultaHelper = new OpcionesConsultaHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
        this.validationHelper = new BaseValidatorHelper(new SendMessage(this.messageService), this.translateService, this.primeng);
    }

    async ngOnInit() {
        await this.callGetAllPatientsWithInspections();
        reloadOnLangChange(this.translateService, this.destroyRef, this.translate);
    }

    ngAfterViewInit() {
        this.map = L.map('map').setView([18.8498, -97.1039], 13);
        this.setupBaseLayer();
        this.updateMarkersOnMap();
        this.isReadyMap = true;
    }

    /* Traducciones */
    private readonly translate = () => {
        this.diseases = this.translateLang.getOptionsByType(TypeList.disease, false);
        this.diseasesLabels = this.diseases.map((d) => d.label);

        this.ageRanges = this.translateLang.getOptionsByType(TypeList.ageRange);
        this.ageRangesLabels = this.ageRanges.map((a) => a.label);

        this.genders = this.translateLang.getOptionsByType(TypeList.gender);
        this.gendersLabels = this.genders.map((g) => g.label);

        this.results = this.translateLang.getOptionsByType(TypeList.result, false);
        this.resultsLabels = this.results.map((r) => r.label);

        this.allPatientsCoordinates = this.allPatientsCoordinates.map((pat) => {
            pat.lastResult = this.translateLang.translateByOptionLabel({
                value: pat.lastResult,
                type: TypeList.result
            }).label;

            pat.lastDisease = this.translateLang.translateByOptionLabel({
                type: TypeList.disease,
                value: pat.lastDiseaseId
            }).label;

            pat.gender = this.translateLang.translateByOptionLabel({
                type: TypeList.gender,
                value: pat.gender
            }).label;

            return pat;
        });

        if (this.isReadyMap) {
            this.updateMarkersOnMap();
            this.buildLeafFilters();
            this.setupMapControls();
        }
        this.cdr.markForCheck();
    };

    /* Llamadas a casos de uso */
    async callGetAllPatientsWithInspections() {
        const resultGetPatients = await this.getAllPatientsWithInspections.call(new NoParams());

        if (resultGetPatients._tag === 'Left') {
            this.validationHelper.getToastException(resultGetPatients.left);
        }

        if (resultGetPatients._tag === 'Right') {
            this.allPatientsCoordinates = resultGetPatients.right;
            this.filterPatientsCoordinates();
        }
    }

    /** Aplana filters.children[].children en un solo array */
    private buildLeafFilters() {
        const labels = this.translateLang.getGeographicLabels();

        this.filters = {
            label: labels.filter,
            children: [
                {
                    label: labels.disease,
                    children: this.diseases.map((d) => {
                        return { label: d.label, layer: L.layerGroup() };
                    })
                },
                {
                    label: labels.ageRange,
                    children: this.ageRanges.map((a) => {
                        return { label: a.label, layer: L.layerGroup() };
                    })
                },
                {
                    label: labels.gender,
                    children: this.genders.map((g) => {
                        return { label: g.label, layer: L.layerGroup() };
                    })
                },
                {
                    label: labels.result,
                    children: this.results.map((r) => {
                        return { label: r.label, layer: L.layerGroup() };
                    })
                }
            ]
        };

        this.leafFilters = this.filters.children.flatMap((group) =>
            group.children
                // sólo label y layer nos importan aquí
                .map((child) => ({ label: child.label, layer: child.layer }))
        );
    }

    /* Funciones para dibujar el mapa */
    private setupBaseLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
    }

    /* Crear un MarkerClusterGroup con todos los marcadores */
    private createClusterGroup(): L.MarkerClusterGroup {
        const group = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });

        this.displayedPatients.forEach((p) => {
            const iconBase = 'assets/leaflet/images/';

            let iconFile = 'marker-icon-2x-green.png';
            if (p.lastDiseaseId === 2) {
                iconFile = 'marker-icon-2x-gold.png';
            }

            if (p.lastDiseaseId === 3) {
                iconFile = 'marker-icon-2x-violet.png';
            }

            const markerIcon = new L.Icon({
                iconUrl: `${iconBase}${iconFile}`,
                shadowUrl: `${iconBase}marker-shadow.png`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const labels = this.translateLang.getGeographicLabels();

            const resultLabel = labels.result;
            const diseaseLabel = labels.disease;
            const numInspectionsLabel = labels.numInspections;

            const marker = L.marker([p.latitude, p.longitude], { icon: markerIcon }).bindPopup(`
                  <b>${p.fullName}</b><br>
                  <b>${resultLabel}:</b> ${p.lastResult}<br>
                  <b>${diseaseLabel}:</b> ${p.lastDisease}<br>
                  <b>${numInspectionsLabel}:</b> ${p.inspectionCount}
            `);

            group.addLayer(marker);
        });

        // comportamiento de los clusters
        group.on('clusterclick', (e) => e.propagatedFrom.spiderfy());

        return group;
    }

    /* Actualizar los marcadores en el mapa */
    private updateMarkersOnMap() {
        // si ya existía un grupo, lo quitamos
        if (this.markerClusterGroup) {
            this.map.removeLayer(this.markerClusterGroup);
        }
        // creamos y añadimos el nuevo
        this.markerClusterGroup = this.createClusterGroup();
        this.map.addLayer(this.markerClusterGroup);

        // forzar recálculo de tamaño (por si cambió el contenedor)
        this.map.invalidateSize();
    }

    /* Configurar los controles de inicio */
    private setupMapControls() {
        // observador de resize
        new ResizeObserver(() => this.map.invalidateSize()).observe(document.getElementById('map')!);

        if (this.treeControl) {
            this.map.removeControl(this.treeControl);
        }

        // ejemplo de control de filtros en árbol
        this.treeControl = (L.control as any).layers.tree(null, this.filters, { collapsed: true });
        this.treeControl?.addTo(this.map);

        this.map.on('overlayadd', (e: any) => {
            const idx = parseInt(e.name, 10);
            const filtro = this.leafFilters[idx]?.label;
            if (filtro) {
                this.selectedFilters.push(filtro);
                this.applyFilters();
            }
        });

        this.map.on('overlayremove', (e: any) => {
            const idx = parseInt(e.name, 10);
            const filtro = this.leafFilters[idx]?.label;
            if (filtro) {
                this.selectedFilters = this.selectedFilters.filter((f) => f !== filtro);
                this.applyFilters();
            }
        });
    }

    /** Filtra y redibuja los marcadores */
    private applyFilters(): void {
        this.displayedPatients = this.filteredPatientsCoordinates.filter((p) => this.matchesDisease(p) && this.matchesAge(p) && this.matchesGender(p) && this.matchesResult(p));
        this.updateMarkersOnMap();
    }

    private matchesDisease(p: PatientWithInspectionsModel): boolean {
        const sel = this.selectedFilters.filter((f) => this.diseasesLabels.includes(f));
        return !sel.length || sel.includes(p.lastDisease);
    }

    private matchesAge(p: PatientWithInspectionsModel): boolean {
        const option = this.translateLang.translateByOptionLabel({
            type: TypeList.ageRange,
            value: getRangoEdad(p.age)
        });

        const sel = this.selectedFilters.filter((f) => this.ageRangesLabels.includes(f));

        return !sel.length || sel.includes(option.label);
    }

    private matchesGender(p: PatientWithInspectionsModel): boolean {
        const sel = this.selectedFilters.filter((f) => this.gendersLabels.includes(f));
        return !sel.length || sel.includes(p.gender);
    }

    private matchesResult(p: PatientWithInspectionsModel): boolean {
        const sel = this.selectedFilters.filter((f) => this.resultsLabels.includes(f));
        return !sel.length || sel.includes(p.lastResult);
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.map.invalidateSize();
    }

    /* Filtrado de lista de doctores */
    filterPatientsCoordinates() {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.selectedPeriod, this.selectedDates)) {
            return;
        }

        this.filteredPatientsCoordinates = this.filterService.filterByPeriodo<PatientWithInspectionsModel>(this.allPatientsCoordinates, (pat) => pat.lastInspectionDate, this.selectedPeriod, this.selectedDates);
        this.displayedPatients = this.filteredPatientsCoordinates;
        this.applyFilters();
        this.updateMarkersOnMap();
    }

    /* Exportar datos */
    exportPDF() {
        this.generateReport.generatePDF(
            new GeographicDataReportPdf({
                patients: this.displayedPatients,
                headers: this.translateLang.getHeaders(TypeList.geographic),
                data: this.translateLang.getHeaders(TypeList.pdf),
                username: this.local.getUsername()
            })
        );
    }

    async exportExcel() {
        await this.generateReport.generateExcel(new GeographicDataReportExcel({
            patients: this.displayedPatients,
            headers: this.translateLang.getHeaders(TypeList.geographic)
        }));
    }

    /* Funciones de selección para las opciones de consulta */
    onPeriodSelected(periodo: OptionLabel) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }
}
