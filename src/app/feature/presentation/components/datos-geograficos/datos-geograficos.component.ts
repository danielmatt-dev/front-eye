import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { NgClass, NgForOf } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.featuregroup.subgroup';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import { dataPointsMocks } from '../../../../shared/utils/mocks';
import { TranslatePipe } from '@ngx-translate/core';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';

@Component({
    selector: 'app-datos-geograficos',
    imports: [Calendar, FormsModule, Button, NgForOf, NgClass, TranslatePipe, OpcionesConsultaComponent],
    templateUrl: './datos-geograficos.component.html',
    standalone: true,
    styleUrl: './datos-geograficos.component.scss'
})
export class DatosGeograficosComponent implements AfterViewInit {
    private readonly leafletMap!: L.Map;

    periodoSeleccionado = '';
    fechasSeleccionadas: Date[] = [];

    mostrarBotones: boolean = true;

    ngAfterViewInit() {
        this.initMap();
    }

    private initMap() {
        const map = L.map('map').setView([18.8498, -97.1039], 13);

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

        dataPointsMocks.forEach((p) => {
            let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';

            // Asignamos colores según la afección
            if (p.afeccion === 'DMAE Seca') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
            }

            if (p.afeccion === 'Retinopatía Diabética') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
            }

            /*
            if (p.resultado === 'Proliferativo') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
            }

            if (p.resultado === 'Moderado') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'
            }

            if (p.resultado === 'Leve') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
            }

            if (p.resultado === 'Sin Afección') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
            }
             */

            // Creamos el ícono con el color correspondiente
            let markerIcon = new L.Icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const m = L.marker([p.lat, p.lng], { icon: markerIcon }).bindPopup(`<b>${p.name}</b><br>Resultado: ${p.resultado}<br>Afección: ${p.afeccion}`);

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
                    ]
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
                        { label: 'Mujer', layer: L.layerGroup() }
                    ]
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

    // Método para escuchar el cambio de `mostrarBotones` del hijo
    onMostrarBotonesChanged(mostrar: boolean) {
        this.mostrarBotones = mostrar;
    }

    // Métodos para manejar las acciones de los botones
    onExportarExcel() {
        console.log('Exportando a Excel...');
        // Aquí puedes agregar la lógica para exportar a Excel
    }

    onDownloadPDF() {
        console.log('Exportando a PDF...');
        // Aquí puedes agregar la lógica para exportar a PDF
    }

    onPeriodoSeleccionado(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }

    onFiltrarDatos() {

    }

}
