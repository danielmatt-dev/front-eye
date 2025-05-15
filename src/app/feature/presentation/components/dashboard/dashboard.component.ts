import { Component, OnInit } from '@angular/core';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';
import { Fluid } from 'primeng/fluid';
import { UIChart } from 'primeng/chart';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DatePicker } from 'primeng/datepicker';
import { mapColors } from '../../../../core/theme/colors';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { findPatient, inspecciones, patients } from '../../../../shared/utils/mocks';
import { LocaleTextProvider } from '../../../../shared/locale.text.provider';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [Fluid, UIChart, SelectButton, FormsModule, CalendarModule, DatePicker, TranslatePipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    deteccionesSemana = 0;
    deteccionesMes = 0;
    deteccionesTotales = 0;

    dmaeSeca = 0;
    dmaeHumeda = 0;
    retDiabetica = 0;

    hombres = 0;
    mujeres = 0;

    menos30 = 0;
    entre30y45 = 0;
    mas45 = 0;

    porcentajeHombres = 0
    porcentajeMujeres = 0

    porcentajeMenos30 = 0
    porcentajeEntre30y45 = 0
    porcentajeMas45 = 0

    barData1: any;
    barOptions1: any;
    barData2: any;
    barOptions2: any;
    lineData: any;
    lineOptions: any;

    options = ['1 Día', '1 Semana', '1 Mes', '3 Meses', 'Todo'];
    optionSelected: string = 'Todo';

    subscription: Subscription;
    inspeccionesFiltradas = inspecciones

    localeTextProvider: LocaleTextProvider

    constructor(
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG,
        private readonly layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initCharts();
        });
        this.localeTextProvider = LocaleTextProvider.getInstance(this.translateService, this.primeng)
        this.calcularEstadisticas(this.inspeccionesFiltradas, patients)
    }

    ngOnInit(): void {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.barData1 = this.prepararDatosGraficaDinamico(this.inspeccionesFiltradas, 'Todo')

        this.barOptions1 = {
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

        this.barData2 = this.prepararDatosGraficaEdadAfeccion(this.inspeccionesFiltradas)

        this.barOptions2 = {
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

        this.lineData = this.prepararDatosGraficaDinamico(this.inspeccionesFiltradas, this.optionSelected);

        this.lineOptions = {
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

    filtrar() {
        this.lineData = this.prepararDatosGraficaDinamico(this.inspeccionesFiltradas, this.optionSelected);
    }

    prepararDatosGraficaDinamico(inspecciones: any[], opcionSeleccionada: string) {
        const categorias = ['Proliferativo', 'Moderado', 'Leve', 'Sin Afección'];

        // Parsear fechas y horas a Date completas
        const inspeccionesConFecha = inspecciones.map(ins => {
            const [dia, mes, anio] = ins.fecha.split('/').map((x: string) => parseInt(x, 10));
            const [hora, minutos] = ins.hora.split(':').map((x: string) => parseInt(x, 10));
            return {
                ...ins,
                fechaDate: new Date(anio, mes - 1, dia, hora, minutos)
            };
        });

        // Filtrar según opción el rango máximo a mostrar
        const ahora = new Date();
        let fechaLimite: Date | null = null;

        switch (opcionSeleccionada) {
            case '1 Día':
                fechaLimite = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '1 Semana':
                fechaLimite = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '1 Mes':
                fechaLimite = new Date(ahora);
                fechaLimite.setMonth(fechaLimite.getMonth() - 1);
                break;
            case '3 Meses':
                fechaLimite = new Date(ahora);
                fechaLimite.setMonth(fechaLimite.getMonth() - 3);
                break;
            case 'Todo':
                fechaLimite = null;
                break;
        }

        // Filtrar datos dentro del rango
        let datosFiltrados = fechaLimite
            ? inspeccionesConFecha.filter(ins => ins.fechaDate >= fechaLimite)
            : inspeccionesConFecha;

        // Agrupación y labels dinámicos según opción
        let labels: string[] = [];
        let dataMap: Record<string, number[]> = {};
        categorias.forEach(cat => dataMap[cat] = []);

        if (opcionSeleccionada === '1 Día') {
            const ahora = new Date();
            const inicioDia = new Date(ahora);
            inicioDia.setHours(0, 0, 0, 0); // medianoche hoy

            // Calcular cuantos intervalos de 4h hay desde inicioDia hasta ahora
            const diffMs = ahora.getTime() - inicioDia.getTime();
            const intervaloMs = 4 * 60 * 60 * 1000; // 4 horas en ms
            const cantidadIntervalos = Math.ceil(diffMs / intervaloMs);

            // Crear labels dinámicos
            labels = [];
            const intervalosRango: { inicio: Date; fin: Date }[] = [];

            for (let i = 0; i < cantidadIntervalos; i++) {
                const inicio = new Date(inicioDia.getTime() + i * intervaloMs);
                let fin = new Date(inicio.getTime() + intervaloMs - 1);
                if (fin > ahora) fin = new Date(ahora); // no pasar de la hora actual

                // Formatear horas hh:mm
                const formatHora = (d: Date) => d.getHours().toString().padStart(2, '0') + ':00';

                labels.push(`${formatHora(inicio)} - ${formatHora(fin)}`);
                intervalosRango.push({ inicio, fin });
            }

            categorias.forEach(cat => dataMap[cat] = new Array(cantidadIntervalos).fill(0));

            datosFiltrados.forEach(ins => {
                if (!categorias.includes(ins.resultado)) return;
                const fecha = ins.fechaDate;

                for (let i = 0; i < intervalosRango.length; i++) {
                    const { inicio, fin } = intervalosRango[i];
                    if (fecha >= inicio && fecha <= fin) {
                        dataMap[ins.resultado][i]++;
                        break;
                    }
                }
            });
        }

        if (opcionSeleccionada === '1 Semana') {
            const ahora = new Date();
            const fechaLimite = new Date(ahora);
            fechaLimite.setDate(fechaLimite.getDate() - 6); // Incluye hoy + 6 días atrás = 7 días total

            // Generar arreglo con cada día en el rango de fechaLimite a ahora
            const diasRango: Date[] = [];
            for (let i = 0; i < 7; i++) {
                const dia = new Date(fechaLimite);
                dia.setDate(fechaLimite.getDate() + i);
                diasRango.push(dia);
            }

            // Mapas para día semana y formato corto
            const diasSemanaNombre = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

            // Labels: Ejemplo "Lun 12"
            labels = diasRango.map(d => `${diasSemanaNombre[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}`);

            categorias.forEach(cat => dataMap[cat] = new Array(labels.length).fill(0));

            datosFiltrados.forEach(ins => {
                if (!categorias.includes(ins.resultado)) return;
                const fecha = ins.fechaDate;

                // Buscar en qué índice de diasRango está esta fecha (solo fecha, sin hora)
                for (let i = 0; i < diasRango.length; i++) {
                    const diaRef = diasRango[i];
                    if (
                        fecha.getFullYear() === diaRef.getFullYear() &&
                        fecha.getMonth() === diaRef.getMonth() &&
                        fecha.getDate() === diaRef.getDate()
                    ) {
                        dataMap[ins.resultado][i]++;
                        break;
                    }
                }
            });
        }

        if (opcionSeleccionada === '1 Mes') {
            const ahora = new Date();
            const fechaLimite = new Date(ahora);
            fechaLimite.setMonth(fechaLimite.getMonth() - 1);

            // Calcular duración total en ms
            const diffMs = ahora.getTime() - fechaLimite.getTime();
            const intervaloMs = diffMs / 4; // 4 semanas (aprox)

            // Función para formatear fechas dd MMM
            const mesesNombre = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            function formatDate(d: Date) {
                const dia = d.getDate().toString().padStart(2, '0');
                return `${dia} ${mesesNombre[d.getMonth()]}`;
            }

            // Crear rangos semanales dinámicos
            labels = [];
            const semanasRango: { inicio: Date; fin: Date }[] = [];
            for (let i = 0; i < 4; i++) {
                const inicio = new Date(fechaLimite.getTime() + i * intervaloMs);
                const fin = new Date(fechaLimite.getTime() + (i + 1) * intervaloMs - 1); // -1 ms para no superponer

                semanasRango.push({ inicio, fin });
                labels.push(`${formatDate(inicio)} - ${formatDate(fin)}`);
            }

            categorias.forEach(cat => dataMap[cat] = new Array(labels.length).fill(0));

            datosFiltrados.forEach(ins => {
                if (!categorias.includes(ins.resultado)) return;
                const fecha = ins.fechaDate;

                for (let i = 0; i < semanasRango.length; i++) {
                    const { inicio, fin } = semanasRango[i];
                    if (fecha >= inicio && fecha <= fin) {
                        dataMap[ins.resultado][i]++;
                        break;
                    }
                }
            });
        }

        if (opcionSeleccionada === '3 Meses') {
            const ahora = new Date();
            const fechaLimite = new Date(ahora);
            fechaLimite.setMonth(fechaLimite.getMonth() - 3);

            // Generar arreglo con los meses en el rango (3 meses)
            // Cada mes representado por el primer día de ese mes
            const mesesRango: Date[] = [];
            for (let i = 0; i <= 3; i++) {  // 4 meses para incluir mes límite y actual
                const mes = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth() + i, 1);
                mesesRango.push(mes);
            }

            const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            // Labels tipo "Mar 2025"
            labels = mesesRango.map(mes => `${nombresMeses[mes.getMonth()]} ${mes.getFullYear()}`);

            categorias.forEach(cat => dataMap[cat] = new Array(labels.length).fill(0));

            datosFiltrados.forEach(ins => {
                if (!categorias.includes(ins.resultado)) return;
                const fecha = ins.fechaDate;

                for (let i = 0; i < mesesRango.length; i++) {
                    const mesInicio = mesesRango[i];
                    const mesFin = new Date(mesInicio.getFullYear(), mesInicio.getMonth() + 1, 0); // último día mes

                    if (fecha >= mesInicio && fecha <= mesFin) {
                        dataMap[ins.resultado][i]++;
                        break;
                    }
                }
            });
        }

        if (opcionSeleccionada === 'Todo') {
            // Por meses (3 meses o todo)
            // Igual que tu función actual pero con meses dinámicos
            const mesesSet = new Set<number>();
            datosFiltrados.forEach(ins => {
                mesesSet.add(ins.fechaDate.getMonth() + 1);
            });
            const meses = Array.from(mesesSet).sort((a,b) => a-b);
            const nombresMeses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            labels = meses.map(m => nombresMeses[m-1]);
            categorias.forEach(cat => dataMap[cat] = new Array(labels.length).fill(0));

            datosFiltrados.forEach(ins => {
                const mes = ins.fechaDate.getMonth() + 1;
                const index = meses.indexOf(mes);
                if (categorias.includes(ins.resultado) && index >= 0) {
                    dataMap[ins.resultado][index]++;
                }
            });
        }

        return {
            labels,
            datasets: categorias.map(cat => ({
                label: cat,
                data: dataMap[cat],
                fill: false,
                backgroundColor: this.colorPorCategoria(cat),
                borderColor: this.colorPorCategoria(cat),
                tension: 0
            }))
        };
    }

    colorPorCategoria(cat: string) {
        switch (cat) {
            case 'Proliferativo': return mapColors['red'];
            case 'Moderado': return mapColors['amber'];
            case 'Leve': return mapColors['blue'];
            case 'Sin Afección': return mapColors['green'];
            default: return 'gray';
        }
    }

    colorPorAfeccion(afec: string) {
        switch (afec) {
            case 'DMAE Seca': return '#fbc02d';
            case 'DMAE Húmeda': return '#009688';
            case 'Retinopatía Diabética': return '#9c27b0';
            default: return 'gray';
        }
    }

    prepararDatosGraficaEdadAfeccion(inspecciones: any[]) {
        const categorias = ['Menos de 30', '30 a 45', 'Más de 45'];
        const afecciones = ['DMAE Seca', 'DMAE Húmeda', 'Retinopatía Diabética'];

        // Inicializar contadores para cada combo rango + afección
        const dataMap: Record<string, Record<string, number>> = {};
        categorias.forEach(rango => {
            dataMap[rango] = {};
            afecciones.forEach(afeccion => {
                dataMap[rango][afeccion] = 0;
            });
        });

        function getRangoEdad(edad: number): string {
            if (edad < 30) return 'Menos de 30';
            else if (edad <= 45) return '30 a 45';
            else return 'Más de 45';
        }

        inspecciones.forEach(ins => {

            const paciente = findPatient(ins.paciente)
            const rango = getRangoEdad(paciente.edad);
            const afeccion = ins.afeccion;  // asumimos que aquí está la afección

            if (!afecciones.includes(afeccion)) return;

            dataMap[rango][afeccion]++;
        });

        // Construir datasets con datos agrupados por afección
        const datasets: any[] = afecciones.map(afeccion => ({
            label: afeccion,
            data: categorias.map(rango => dataMap[rango][afeccion]),
            backgroundColor: categorias.map(() => this.colorPorAfeccion(afeccion)),
            borderColor: categorias.map(() => this.colorPorAfeccion(afeccion)),
            borderWidth: 0
        }));

        return {
            labels: categorias,
            datasets
        };
    }

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
            backgroundColor: categorias.map(rango => this.colorPorGenero(gen)),
            borderColor: categorias.map(rango => this.colorPorGenero(gen)),
            borderWidth: 0
        }));

        return {
            labels: categorias,
            datasets
        };
    }

    calcularEstadisticas(detecciones: any[], pacientes: any[]) {

        this.deteccionesTotales = detecciones.length
        const pacientesDetectados = new Set<string>();

        // Función interna para parsear fecha
        function parseDate(dateStr: string): Date {
            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        const hoy = new Date();
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hoy.getDate() - 7);
        const hace30Dias = new Date(hoy);
        hace30Dias.setDate(hoy.getDate() - 30);

        // Procesar detecciones
        for (const det of detecciones) {
            const fechaDet = parseDate(det.fecha);

            if (fechaDet >= hace7Dias) this.deteccionesSemana++;
            if (fechaDet >= hace30Dias) this.deteccionesMes++;

            if (det.afeccion === 'DMAE Seca') this.dmaeSeca++;
            else if (det.afeccion === 'DMAE Húmeda') this.dmaeHumeda++;
            else if (det.afeccion === 'Retinopatía Diabética') this.retDiabetica++;

            pacientesDetectados.add(det.paciente);
        }

        // Procesar pacientes detectados para género y edad
        for (const clave of pacientesDetectados) {
            const paciente = pacientes.find(p => p.clave === clave);
            if (!paciente) continue;

            if (paciente.genero.toLowerCase() === 'masculino') this.hombres++;
            else if (paciente.genero.toLowerCase() === 'femenino') this.mujeres++;

            if (paciente.edad < 30) this.menos30++;
            else if (paciente.edad >= 30 && paciente.edad <= 45) this.entre30y45++;
            else if (paciente.edad > 45) this.mas45++;

        }

        const totalPacientes = this.hombres + this.mujeres;

        // Porcentajes
        this.porcentajeHombres = totalPacientes ? Math.round((this.hombres / totalPacientes) * 100) : 0;
        this.porcentajeMujeres = totalPacientes ? Math.round((this.mujeres / totalPacientes) * 100) : 0;

        this.porcentajeMenos30 = totalPacientes ? Math.round((this.menos30 / totalPacientes) * 100) : 0;
        this.porcentajeEntre30y45 = totalPacientes ? Math.round((this.entre30y45 / totalPacientes) * 100) : 0;
        this.porcentajeMas45 = totalPacientes ? Math.round((this.mas45 / totalPacientes) * 100) : 0;

    }

    colorPorGenero(genero: string) {
        if (genero === 'Femenino') {
            return '#e91e63'
        }

        return '#2196f3'
    }


}
