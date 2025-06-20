import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
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
import { PatientWithInspectionsEntity } from '../../domain/entity/patient.with.inspections.entity';
import { NoParams } from '../../../../shared/utils/usecase';
import { BaseValidatorHelper } from '../../../doctor/presentation/doctor-component/validation/baseValidatorHelper';
import { FilterService } from '../../../../shared/services/filter.service';
import { patientWithInspectionsMocks } from '../../../../shared/utils/mocks';
import { ageRanges, diseases, results } from '../../../../shared/utils/data';
import { GenerateReportImpl } from '../../../report/domain/factory/impl/generate.report.impl';
import { ReportFactoryParams } from '../../../report/domain/factory/generate.report';
import { GeographicDataReportPdf } from '../../../report/domain/template-method/pdf/impl/geographic-data.report.pdf';
import {
    GeographicDataReportExcel
} from '../../../report/domain/template-method/excel/impl/geographic-data.report.excel';

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

    /* Variables para opciones de consulta */
    selectedPeriod = '';
    selectedDates: Date[] = [];

    /*  Variables de iteración con html */
    showButtons = true;

    /* Lista de pacientes y filtrado */
    allPatientsCoordinates: PatientWithInspectionsEntity[] = patientWithInspectionsMocks;
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

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly messageService: MessageService,
        private readonly filterService: FilterService,
        private readonly generateReport: GenerateReportImpl,
        private readonly getAllPatientsWithInspections: GetAllPatientsWithInspections
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
        this.validationHelper = BaseValidatorHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    async ngOnInit() {
        //await this.callGetAllPatientsWithInspections()
    }

    ngAfterViewInit() {
        this.map = L.map('map').setView([18.8498, -97.1039], 13);
        this.setupBaseLayer();
        this.updateMarkersOnMap();
        this.buildLeafFilters();
        this.setupMapControls();
    }

    /* Llamadas a casos de uso */
    async callGetAllPatientsWithInspections() {
        const resultGetPatients = await this.getAllPatientsWithInspections.call(new NoParams());

        if (resultGetPatients._tag === 'Left') {
            this.validationHelper.getToastException(resultGetPatients.left);
        }

        if (resultGetPatients._tag === 'Right') {
            this.allPatientsCoordinates = resultGetPatients.right;
            //this.filterPatientsCoordinates()
        }
    }

    /** Aplana filters.children[].children en un solo array */
    private buildLeafFilters() {
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
            if (p.lastDisease === 'DMAE Seca') {
                iconFile = 'marker-icon-2x-gold.png';
            }

            if (p.lastDisease === 'Retinopatía Diabética') {
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

            const marker = L.marker([p.latitude, p.longitude], { icon: markerIcon }).bindPopup(`
          <b>${p.fullName}</b><br>
          Resultado: ${p.lastResult}<br>
          Afección: ${p.lastDisease}<br>
          Num. Inspecciones: ${p.inspectionCount}
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

        // ejemplo de control de filtros en árbol
        const treeControl = (L.control as any).layers.tree(null, this.filters, { collapsed: true });
        treeControl.addTo(this.map);

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

    private matchesDisease(p: PatientWithInspectionsEntity): boolean {
        const sel = this.selectedFilters.filter((f) => diseases.includes(f));
        return !sel.length || sel.includes(p.lastDisease);
    }

    private matchesAge(p: PatientWithInspectionsEntity): boolean {
        const age = p.age;
        const sel = this.selectedFilters.filter((f) => ageRanges.includes(f));
        if (!sel.length) return true;
        return sel.some((f) => (f === 'Menos de 30' && age < 30) || (f === 'De 30 a 45' && age >= 30 && age <= 45) || (f === 'Más de 45' && age > 45));
    }

    private matchesGender(p: PatientWithInspectionsEntity): boolean {
        const sel = this.selectedFilters.filter((f) => ['Hombre', 'Mujer'].includes(f));
        if (!sel.length) {
            return true;
        }
        return sel.some((f) => (f === 'Hombre' && p.gender.toLowerCase() === 'masculino') || (f === 'Mujer' && p.gender.toLowerCase() === 'femenino'));
    }

    private matchesResult(p: PatientWithInspectionsEntity): boolean {
        const sel = this.selectedFilters.filter((f) => results.includes(f));
        if (!sel.length) return true;
        return sel.includes(p.lastResult);
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

        this.filteredPatientsCoordinates = this.filterService.filterByPeriodo<PatientWithInspectionsEntity>(this.allPatientsCoordinates, (pat) => pat.lastInspectionDate, this.selectedPeriod, this.selectedDates);
        this.displayedPatients = this.filteredPatientsCoordinates;
        this.applyFilters();
        this.updateMarkersOnMap();
    }

    /* Exportar datos */
    exportPDF() {
        const params = new ReportFactoryParams({ name: 'Datos geográficos', user: 'Daniel Matt' });
        this.generateReport.generatePDF(params, new GeographicDataReportPdf({ patients: this.allPatientsCoordinates }));
    }

    async exportExcel() {
        await this.generateReport.generateExcel(new GeographicDataReportExcel({ patients: this.allPatientsCoordinates }));
    }

    /* Funciones de selección para las opciones de consulta */
    onPeriodSelected(periodo: string) {
        this.selectedPeriod = periodo;
    }

    onDateRangeSelected(fechas: Date[]) {
        this.selectedDates = fechas;
    }
}
