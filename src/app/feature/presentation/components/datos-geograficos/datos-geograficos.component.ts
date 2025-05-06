import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { NgClass, NgForOf } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.featuregroup.subgroup';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree'

@Component({
    selector: 'app-datos-geograficos',
    imports: [Calendar, FormsModule, Button, NgForOf, NgClass],
    templateUrl: './datos-geograficos.component.html',
    standalone: true,
    styleUrl: './datos-geograficos.component.scss'
})
export class DatosGeograficosComponent implements AfterViewInit {

    private readonly leafletMap!: L.Map;

    fechasSeleccionadas: Date[] = [];
    calendarDisabled = true;

    categorias = [
        { label: 'Mes actual', selected: false },
        { label: '2 meses', selected: false },
        { label: '3 meses', selected: false },
        { label: 'Personalizado', selected: false }
    ];

    ngAfterViewInit() {
        this.initMap();
    }

    private initMap() {
        const map = L.map('map').setView([51.505, -0.09], 13);

        // Capa base de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        const markerClusterGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });

        const dataPoints = [
            { lat: 51.505, lng: -0.09, name: 'A' },
            { lat: 51.505, lng: -0.091, name: 'B' },
            { lat: 51.506, lng: -0.09, name: 'C' },
            { lat: 51.507, lng: -0.085, name: 'D' },
            { lat: 51.508, lng: -0.086, name: 'E' },
            { lat: 51.51, lng: -0.1, name: 'F' }
        ];

        dataPoints.forEach((p) => {
            const m = L.marker([p.lat, p.lng]).bindPopup(`<b>${p.name}</b>`);
            markerClusterGroup.addLayer(m);
        });

        map.addLayer(markerClusterGroup);

        // Cuando haces click en un cluster → spiderfy (no bug)
        markerClusterGroup.on('clusterclick', (e) => e.propagatedFrom.spiderfy());

        // Asegura recalcular tamaño al cambiar contenedor
        new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById('map')!);

        const filtros = {
                label: 'Filtros',
                children: [
                    {
                        label: 'Afección',
                        children: [
                            { label: 'DMAE Seca', layer: L.layerGroup() },
                            { label: 'DMAE Húmeda', layer: L.layerGroup() },
                            { label: 'Retinopatía Diabética', layer: L.layerGroup() }
                        ],
                    },
                    {
                        label: 'Rango de Edad',
                        children: [
                            { label: 'Menos de 30', layer: L.layerGroup() },
                            { label: 'De 30 a 45', layer: L.layerGroup() },
                            { label: 'Mas de 45', layer: L.layerGroup() }
                        ]
                    },
                    {
                        label: 'Género',
                        children: [
                            { label: 'Hombre', layer: L.layerGroup() },
                            { label: 'Mujer', layer: L.layerGroup() },
                        ],
                    },
                    {
                        label: 'Clasificación de afección',
                        children: [
                            { label: 'Leve', layer: L.layerGroup() },
                            { label: 'Moderada', layer: L.layerGroup() },
                            { label: 'Proliferativa', layer: L.layerGroup() }
                        ]
                    }
                ]
            };

        const treeControl = (L.control as any).layers.tree(null, filtros, { collapsed: true });
        treeControl.addTo(map);
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.leafletMap.invalidateSize();
    }

    seleccionarChip(categoriaSeleccionada: any) {
        this.categorias.forEach((c) => (c.selected = false));
        categoriaSeleccionada.selected = true;
        if (categoriaSeleccionada.label === 'Personalizado') {
            this.calendarDisabled = false;
        } else {
            this.calendarDisabled = true;
            this.fechasSeleccionadas = [];
        }
    }
}
