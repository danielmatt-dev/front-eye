import { AfterViewInit, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dataPointsMocks, findPatient } from '../../../../shared/utils/mocks';
import { OpcionesConsultaComponent } from '../../../../shared/components/opciones-consulta/opciones-consulta.component';
import { OpcionesConsultaHelper } from '../../../../shared/components/opciones-consulta/opciones-consulta-helper';
import { PrimeNG } from 'primeng/config';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as L from 'leaflet';
import 'leaflet.featuregroup.subgroup';
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';

@Component({
    selector: 'app-datos-geograficos',
    imports: [FormsModule, OpcionesConsultaComponent, Toast],
    providers: [MessageService],
    templateUrl: './datos-geograficos.component.html',
    standalone: true,
    styleUrl: './datos-geograficos.component.scss'
})
export class DatosGeograficosComponent implements AfterViewInit {
    private readonly leafletMap!: L.Map;

    map!: L.Map;
    markerClusterGroup!: L.MarkerClusterGroup;

    periodoSeleccionado = '';
    fechasSeleccionadas: Date[] = [];

    mostrarBotones: boolean = true;

    opcionesConsultaHelper: OpcionesConsultaHelper;
    dataPoints = dataPointsMocks;
    dataPointsMocksFiltrados = this.dataPoints;

    filtros: { [key: number]: string } = {
        0: 'DMAE Seca',
        1: 'DMAE Húmeda',
        2: 'Retinopatía Diabética',
        3: 'Menos de 30',
        4: 'De 30 a 45',
        5: 'Hombre',
        6: 'Mujer',
        7: 'Proliferativo',
        8: 'Moderado',
        9: 'Leve',
        10: 'Sin Afección',
    }

    filtrosSeleccionados: string[] = []

    ngAfterViewInit() {
        this.initMap();
    }

    constructor(
        private readonly primeng: PrimeNG,
        private readonly translateService: TranslateService,
        private readonly messageService: MessageService
    ) {
        this.opcionesConsultaHelper = OpcionesConsultaHelper.getInstance(this.messageService, this.translateService, this.primeng);
    }

    private initMap() {
        this.map = L.map('map').setView([18.8498, -97.1039], 13);

        // Capa base de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        this.markerClusterGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });

        this.dataPointsMocksFiltrados.forEach((p) => {
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

            const m = L.marker([p.lat, p.lng], { icon: markerIcon })
                .bindPopup(`<b>${p.name}</b><br>Resultado: ${p.resultado}<br>Afección: ${p.afeccion}<br>Num. Inspecciones: ${p.numInspecciones}`);

            this.markerClusterGroup.addLayer(m);
        });

        this.map.addLayer(this.markerClusterGroup);

        // Cuando haces clic en un cluster → spiderfy (no bug)
        this.markerClusterGroup.on('clusterclick', (e) => e.propagatedFrom.spiderfy());

        // Asegura recalcular tamaño al cambiar contenedor
        new ResizeObserver(() => this.map.invalidateSize()).observe(document.getElementById('map')!);

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
        treeControl.addTo(this.map);

        this.map.on('overlayadd', (event) => {
            const filtro = event.name;
            console.log('Filtro: ', filtro)
        });

        this.map.on('overlayremove', function(event){
            const filtro = event.name;
            console.log('Filtro: ', filtro)
        });

    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.leafletMap.invalidateSize();
    }

    onPeriodoSeleccionado(periodo: string) {
        this.periodoSeleccionado = periodo;
    }

    onRangoFechasSeleccionado(fechas: Date[]) {
        this.fechasSeleccionadas = fechas;
    }

    onFiltrarDatos() {
        if (!this.opcionesConsultaHelper.validarRangoSeleccionado(this.periodoSeleccionado, this.fechasSeleccionadas)) {
            return;
        }

        if (this.fechasSeleccionadas.length === 0 && this.periodoSeleccionado === '') {
            this.dataPointsMocksFiltrados = this.dataPoints;
            this.redibujarMapa();
            return
        }

        let fechaInicio: Date;
        let fechaFin: Date = new Date(); // Fecha de hoy

        switch (this.periodoSeleccionado) {
            case 'Mes actual':
                // Primer día del mes actual hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
                break;
            case '2 meses':
                // Primer día de hace dos meses hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 1, 1);
                break;
            case '3 meses':
                // Primer día de hace tres meses hasta hoy
                fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth() - 2, 1);
                break;
            case 'Personalizado':
                if (this.fechasSeleccionadas.length === 2) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[1]);
                }

                if (this.fechasSeleccionadas[1] === null) {
                    fechaInicio = new Date(this.fechasSeleccionadas[0]);
                    fechaFin = new Date(this.fechasSeleccionadas[0]);
                }
                break;
            default:
                return;
        }

        const formatoFecha = (fecha: Date) => fecha.toISOString().split('T')[0];

        this.dataPointsMocksFiltrados = this.dataPoints.filter((data) => {
            return formatoFecha(data.fechaCreacion) >= formatoFecha(fechaInicio) && formatoFecha(data.fechaCreacion) <= formatoFecha(fechaFin);
        });

        console.log('Datos Filtrados:', this.dataPointsMocksFiltrados);
        this.redibujarMapa();
    }

    private redibujarMapa() {
        const map = this.map; // Asegúrate de que tienes la instancia del mapa aquí

        // Limpiar los marcadores actuales
        if (this.markerClusterGroup) {
            map.removeLayer(this.markerClusterGroup); // Eliminar el grupo de marcadores
        }

        this.markerClusterGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });

        // Añadir los puntos filtrados al mapa
        this.dataPointsMocksFiltrados.forEach((p) => {
            let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';

            if (p.afeccion === 'DMAE Seca') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
            }

            if (p.afeccion === 'Retinopatía Diabética') {
                iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
            }

            let markerIcon = new L.Icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const m = L.marker([p.lat, p.lng], { icon: markerIcon }).bindPopup(`<b>${p.name}</b><br>Resultado: ${p.resultado}<br>Afección: ${p.afeccion}<br>Num. Inspecciones: ${p.numInspecciones}`);
            this.markerClusterGroup.addLayer(m);
        });

        map.addLayer(this.markerClusterGroup); // Añadir el grupo de marcadores al mapa

        // Ajustar el mapa si es necesario
        map.invalidateSize();
    }

    filtrarPuntos(filtro: any) {
        return this.dataPointsMocksFiltrados.filter(point => {
            const paciente = findPatient(point.id);
            switch (filtro) {
                case 'DMAE Seca':
                case 'DMAE Húmeda':
                case 'Retinopatía Diabética':
                    return point.afeccion === filtro;
                case 'Leve':
                case 'Moderada':
                case 'Proliferativa':
                    return point.resultado === filtro;
                case 'Menos de 30':
                    return paciente && paciente.edad < 30;
                case 'De 30 a 45':
                    return paciente && paciente.edad >= 30 && paciente.edad <= 45;
                case 'Más de 45':
                    return paciente && paciente.edad > 45;
                case 'Hombre':
                    return paciente && paciente.genero === 'Masculino';
                case 'Mujer':
                    return paciente && paciente.genero === 'Femenino';
                default:
                    return false;
            }
        });
    }

    exportPDF() {
        const doc = new jsPDF();
        doc.text('Datos geográficos', 10, 10);

        // Encabezados de la tabla
        const tableColumn = ['Paciente', 'Latitud', 'Longitud', 'Dirección'];

        // Crear las filas con los datos de los puntos
        const tableRows = this.dataPointsMocksFiltrados.map((point) => {

            const paciente = findPatient(point.id)

            return [
                point.name,
                point.lat,
                point.lng,
                paciente.direccion
            ];
        });

        // Generar la tabla con autoTable
        autoTable(doc, {
            head: [tableColumn],  // Cabecera de la tabla
            body: tableRows,      // Filas de la tabla
            startY: 20,           // Espacio desde la parte superior
            headStyles: {
                fillColor: [211, 211, 211],  // Color gris claro
                textColor: [0, 0, 0],        // Texto negro
                fontStyle: 'bold',           // Negrita
                halign: 'center'             // Centrado
            },
            styles: {
                fontSize: 10,                // Tamaño de letra
                cellPadding: 4               // Espaciado en celdas
            }
        });

        // Guardar el archivo PDF
        doc.save('datos_geograficos.pdf');
    }

    exportExcel() {
        // Encabezados de la tabla
        const tableColumn = ['Paciente', 'Latitud', 'Longitud', 'Dirección'];

        // Crear las filas con los datos de los puntos
        const tableRows = this.dataPointsMocksFiltrados.map((point) => {

            const paciente = findPatient(point.id)

            return [
                point.name,
                point.lat,
                point.lng,
                paciente.direccion
            ];
        });

        // Combinar encabezados y filas
        const data = [tableColumn, ...tableRows];

        // Crear la hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

        // Ajustar el ancho de las columnas
        ws['!cols'] = tableColumn.map(() => ({ wch: 20 }));

        // Ajustar el alto de las filas (espaciado)
        ws['!rows'] = data.map(() => ({ hpt: 20 }));

        // Aplicar estilo a los encabezados
        tableColumn.forEach((col, index) => {
            const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    fill: {
                        fgColor: { rgb: 'D3D3D3' }  // Color gris claro
                    },
                    font: {
                        bold: true,                   // Negrita
                        color: { rgb: '000000' },     // Texto negro
                        sz: 12                        // Tamaño de letra
                    },
                    alignment: {
                        horizontal: 'center',         // Centrado
                        vertical: 'center'            // Centrado vertical
                    }
                };
            }
        });

        // Crear el libro de trabajo con la hoja
        const wb: XLSX.WorkBook = { Sheets: { 'Mapa': ws }, SheetNames: ['Mapa'] };

        // Descargar el archivo Excel
        XLSX.writeFile(wb, 'mapa.xlsx');
    }

}
