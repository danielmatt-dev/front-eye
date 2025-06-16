import { InspectionResponseEntity } from '../entity/inspection.response.entity';
import { results } from '../../../../shared/utils/data';
import { colorByResult } from '../../../../shared/utils/functions/functions';
import { ChartData } from 'chart.js';

export abstract class InspectionsFilterStrategy {

    endDate = new Date()
    startDate?: Date = undefined
    labels: string[] = []
    dataMap: Record<string, number[]> = {}

    constructor() {
        this.initData()
    }

    initData() {
        this.labels = []
        this.dataMap = {}
        results.forEach((cat) => (this.dataMap[cat] = []));
    }

    filter(data: InspectionResponseEntity[], startDate?: Date): InspectionResponseEntity[] {
        if (!startDate) {
            return data
        }

        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(this.endDate);
        endOfDay.setHours(23, 59, 59, 999);

        return data.filter(ins =>
                ins.inspectionDateTime >= startOfDay &&
                ins.inspectionDateTime <= endOfDay
            );
    }

    abstract getDataMap(filteredData: InspectionResponseEntity[]): void

    abstract getStartDate(): Date | undefined

    getChartData(data: InspectionResponseEntity[]): ChartData {

        this.startDate = this.getStartDate()
        const filteredData = this.filter(data, this.startDate)
        this.getDataMap(filteredData)

        return {
            labels: this.labels,
            datasets: results.map((result) => ({
                label: result,
                data: this.dataMap[result],
                fill: false,
                backgroundColor: colorByResult(result),
                borderColor: colorByResult(result),
                tension: 0
            }))
        }
    }

}

export class AllFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const monthsSet = new Set<number>();
        filteredData.forEach(inspection => {
            monthsSet.add(inspection.inspectionDate.getMonth() + 1);
        });

        const months = Array.from(monthsSet).sort((a,b) => a-b);
        const labelMonths = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]

        this.labels = months.map(m => labelMonths[m-1])
        results.forEach(cat => this.dataMap[cat] = new Array(this.labels.length).fill(0));

        filteredData.forEach(inspection => {
            const mes = inspection.inspectionDate.getMonth() + 1;
            const index = months.indexOf(mes);
            if (results.includes(inspection.result) && index >= 0) {
                this.dataMap[inspection.result][index]++;
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate
    }

}

export class ThreeMonthsFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const threeMonthsAgo = new Date(this.endDate)
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        threeMonthsAgo.setHours(0, 0, 0, 0)

        // Generar arreglo con los meses en el rango (3 meses)
        // Cada mes representado por el primer día de ese mes
        const rangeMonths: Date[] = [];
        for (let i = 0; i <= 3; i++) {  // 4 meses para incluir el mes límite y el mes actual
            const month = new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth() + i, 1);
            rangeMonths.push(month);
        }

        const labelMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        // Labels tipo "Mar 2025"
        this.labels = rangeMonths.map(mes => `${labelMonths[mes.getMonth()]} ${mes.getFullYear()}`);

        results.forEach(cat => this.dataMap[cat] = new Array(this.labels.length).fill(0));

        filteredData.forEach(inspection => {
            if (!results.includes(inspection.result)) return;
            const date = inspection.inspectionDate;

            for (let i = 0; i < rangeMonths.length; i++) {
                const initialMonth = rangeMonths[i];
                const finalMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() + 1, 0); // último día mes

                if (date >= initialMonth && date <= finalMonth) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });

    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getMonth() - 3)
    }

}

export class DynamicRangeFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData();

        // 1) Normalizamos startDate y endDate a medianoche
        const start = new Date(this.startDate ?? this.endDate);
        const end   = new Date(this.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // 2) Calculamos la diferencia en milisegundos y días
        const msInDay  = 1000 * 60 * 60 * 24;
        const diffMs   = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / msInDay);

        // 3) Calculamos el número de intervalos de ~1 semana, Hasta un máximo de 8
        let n = Math.ceil(diffDays / 7);
        n = Math.max(1, Math.min(n, 8));

        // 4) Tamaño de cada intervalo en ms
        const intervalMs = diffMs / n;

        // 5) Generamos el array de fechas y etiquetas
        const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        this.labels = Array.from({ length: n }, (_, i) => {
            const from = new Date(start.getTime() + i * intervalMs);
            const to   = new Date(start.getTime() + (i + 1) * intervalMs);
            const fmt = (d: Date) =>
                `${d.getDate().toString().padStart(2, '0')} ${monthNames[d.getMonth()]}`;
            return `${fmt(from)} – ${fmt(to)}`;
        });

        // 6) Inicializamos contadores
        results.forEach(res => {
            this.dataMap[res] = new Array(n).fill(0);
        });

        // 7) Contamos cada inspección en su intervalo
        filteredData.forEach(ins => {
            if (!results.includes(ins.result)) return;
            const dt = new Date(ins.inspectionDate);
            dt.setHours(0, 0, 0, 0);
            const idx = Math.floor((dt.getTime() - start.getTime()) / intervalMs);
            if (idx >= 0 && idx < n) {
                this.dataMap[ins.result][idx]++;
            }
        });
    }

    override getStartDate(): Date | undefined {
        // Si se pasó startDate se respeta, si no, restamos 2 meses
        if (this.startDate) {
            const d = new Date(this.startDate);
            d.setHours(0, 0, 0, 0);
            return d;
        }
        const d = new Date(this.endDate);
        d.setMonth(d.getMonth() - 2);
        d.setHours(0, 0, 0, 0);
        return d;
    }
}

export class TwoMonthsFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData();

        const n = 8; // 8 intervalos (semanas aproximadas)

        // 1) Fecha de inicio: 2 meses atrás desde endDate, a medianoche
        const twoMonthsAgo = new Date(this.endDate);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        twoMonthsAgo.setHours(0, 0, 0, 0);

        // 2) Calculamos la duración total y el tamaño de cada intervalo
        const diffMs      = this.endDate.getTime() - twoMonthsAgo.getTime();
        const intervalMs  = diffMs / n;

        // 3) Helper para formatear "dd MMM"
        const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const formatDate = (d: Date) => {
            const day = d.getDate().toString().padStart(2, '0');
            const mon = monthNames[d.getMonth()];
            return `${day} ${mon}`;
        };

        // 4) Generamos los 8 rangos semanales y sus etiquetas
        const rangeWeeks: { initial: Date; final: Date }[] = [];
        for (let i = 0; i < n; i++) {
            const initial = new Date(twoMonthsAgo.getTime() + i       * intervalMs);
            const final   = new Date(twoMonthsAgo.getTime() + (i+1) * intervalMs);
            rangeWeeks.push({ initial, final });
            this.labels.push(
                `${formatDate(initial)} – ${formatDate(final)}`
            );
        }

        // 5) Inicializamos contadores por cada resultado
        results.forEach(res => {
            this.dataMap[res] = new Array(this.labels.length).fill(0);
        });

        // 6) Recorremos inspecciones y asignamos al intervalo correspondiente
        filteredData.forEach(ins => {
            if (!results.includes(ins.result)) return;
            const date = ins.inspectionDate;
            for (let i = 0; i < rangeWeeks.length; i++) {
                const { initial, final } = rangeWeeks[i];
                if (date >= initial && date <= final) {
                    this.dataMap[ins.result][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        // Si se proporcionó un startDate custom, úsalo
        if (this.startDate) {
            return this.startDate;
        }
        // Sino, calculamos endDate - 2 meses
        const d = new Date(this.endDate);
        d.setMonth(d.getMonth() - 2);
        d.setHours(0, 0, 0, 0);
        return d;
    }
}

export class OneMonthFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const n = 4

        const oneMonthAgo = new Date(this.endDate)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        oneMonthAgo.setHours(0, 0, 0, 0)

        // Calcular duración total en ms
        const diffMs = this.endDate.getTime() - oneMonthAgo.getTime();
        const intervalsMs = diffMs / n; // 4 semanas (aprox)

        // Función para formatear fechas dd MMM
        const labelMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        function formatDate(d: Date) {
            const dia = d.getDate().toString().padStart(2, '0');
            return `${dia} ${labelMonths[d.getMonth()]}`;
        }

        // Crear rangos semanales
        const rangeWeek: { initial: Date; final: Date }[] = []
        for (let i = 0; i < n; i++) {

            const initial = new Date(oneMonthAgo.getTime() + i * intervalsMs)
            const final = new Date(oneMonthAgo.getTime() + (i + 1) * intervalsMs)

            rangeWeek.push({ initial, final })
            this.labels.push(`${formatDate(initial)} - ${formatDate(final)}`)
        }

        results.forEach(cat => this.dataMap[cat] = new Array(this.labels.length).fill(0));
        filteredData.forEach(inspection => {
            if (!results.includes(inspection.result)) return;
            const date = inspection.inspectionDate;

            for (let i = 0; i < rangeWeek.length; i++) {
                const { initial, final } = rangeWeek[i];
                if (date >= initial && date <= final) {
                    this.dataMap[inspection.result][i]++;
                    return
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getMonth() - 1)
    }

}

export class RangeDaysFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData();

        const start = new Date(this.startDate ?? this.endDate);
        const end   = new Date(this.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // 2) Calculamos cuántos días hay entre ambas fechas
        const msInDay  = 1000 * 60 * 60 * 24;
        const diffDays = Math.floor((end.getTime() - start.getTime()) / msInDay);

        // Generamos un array con cada día desde hace 15 días hasta hoy (inclusive)
        const rangeDays: Date[] = [];
        for (let i = 0; i <= diffDays; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            rangeDays.push(day);
        }

        // Nombres cortos de días en español
        const labelsDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        // Preparamos las etiquetas: ejemplo "Lun 12"
        this.labels = rangeDays.map(d =>
            `${labelsDays[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}`
        );

        // Inicializamos el mapa de datos
        results.forEach(cat => {
            this.dataMap[cat] = new Array(this.labels.length).fill(0);
        });

        // Recorremos las inspecciones y las contamos en su día correspondiente
        filteredData.forEach(inspection => {
            if (!results.includes(inspection.result)) return;
            const fecha = inspection.inspectionDate;
            for (let i = 0; i < rangeDays.length; i++) {
                const day = rangeDays[i];
                if (
                    fecha.getFullYear() === day.getFullYear() &&
                    fecha.getMonth() === day.getMonth() &&
                    fecha.getDate() === day.getDate()
                ) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        // Si no hay startDate explícito, usamos endDate - 15 días
        return this.startDate ??
            new Date(this.endDate.getTime() - 15 * 24 * 60 * 60 * 1000);
    }
}

export class OneWeekFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const oneWeekAgo = new Date(this.endDate); // Incluye hoy + 6 días atrás = 7 días total
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        oneWeekAgo.setHours(0, 0, 0, 0)

        // Generar arreglo con cada día en el rango de hace una semana hasta ahora
        const rangeDays: Date[] = [];
        for (let i = 0; i < 8; i++) {
            const day = new Date(oneWeekAgo);
            day.setDate(oneWeekAgo.getDate() + i)
            rangeDays.push(day);
        }

        // Labels para día semana y formato corto
        const labelsDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

        // Labels: Ejemplo "Lun 12"
        this.labels = rangeDays.map(d => `${labelsDays[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}`);

        results.forEach((cat) => (this.dataMap[cat] = new Array(this.labels.length).fill(0)));

        filteredData.forEach((inspection) => {
            if (!results.includes(inspection.result)) return;
            const date = inspection.inspectionDate;

            for (let i = 0; i < rangeDays.length; i++) {
                const day = rangeDays[i];
                if (
                    date.getFullYear() === day.getFullYear() &&
                    date.getMonth() === day.getMonth() &&
                    date.getDate() === day.getDate()
                ) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });

    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

}

export class OneDayFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {

        this.initData()

        const initDate = new Date(this.endDate);
        initDate.setHours(0, 0, 0, 0); // medianoche de hoy

        // Calcular cuantos intervalos de 4 horas existen desde la fecha de inicio hasta ahora
        const diffMs = this.endDate.getTime() - initDate.getTime();
        const intervalsMs = 4 * 60 * 60 * 1000; // 4 horas en ms
        const intervals = Math.ceil(diffMs / intervalsMs);

        const rangeIntervals: { initial: Date; fin: Date }[] = [];

        for (let i = 0; i < intervals; i++) {
            const initial = new Date(initDate.getTime() + i * intervalsMs);
            let fin = new Date(initial.getTime() + intervalsMs - 1);

            if (fin > this.endDate) {
                fin = new Date(this.endDate);
            }

            // Formatear horas hh:mm
            const formatHours = (d: Date) => d.getHours().toString().padStart(2, '0') + ':00';

            this.labels.push(`${formatHours(initial)} - ${formatHours(fin)}`);
            rangeIntervals.push({ initial, fin });
        }

        results.forEach((result) => (this.dataMap[result] = new Array(intervals).fill(0)));

        filteredData.forEach((inspection) => {
            if (!results.includes(inspection.result)) return;

            for (let i = 0; i < rangeIntervals.length; i++) {
                const { initial, fin } = rangeIntervals[i];
                if (inspection.inspectionDateTime >= initial && inspection.inspectionDateTime <= fin) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });

    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getTime() - 24 * 60 * 60 * 1000)
    }

}
