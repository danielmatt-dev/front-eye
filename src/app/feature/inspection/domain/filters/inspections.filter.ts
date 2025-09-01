import { OptionLabel } from '../../../../shared/utils/data';
import { colorByResult } from '../../../../shared/utils/functions/functions';
import { ChartData } from 'chart.js';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { TranslateLang, TypeList } from '../../../../shared/utils/functions/translate-lang';

export abstract class InspectionsFilterStrategy {
    endDate = new Date();
    startDate?: Date = undefined;
    labels: string[] = [];
    dataMap: Record<string, number[]> = {};

    results: OptionLabel[] = [];
    values: string[] = [];

    translateLang!: TranslateLang;

    constructor() {
        this.initData();
    }

    setTranslateLang(translateLang: TranslateLang) {
        this.translateLang = translateLang;
        this.results = this.translateLang.getOptionsByType(TypeList.result, false);
        this.results.forEach((op) => (this.dataMap[op.value] = []));
        this.values = this.results.map((r) => r.value);
    }

    initData() {
        this.labels = [];
        this.dataMap = {};
    }

    filter(data: InspectionResponseModel[], startDate?: Date): InspectionResponseModel[] {
        if (!startDate) {
            return data;
        }

        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(this.endDate);
        endOfDay.setHours(23, 59, 59, 999);

        return data.filter((ins) => ins.inspectionDateTime >= startOfDay && ins.inspectionDateTime <= endOfDay);
    }

    abstract getDataMap(filteredData: InspectionResponseModel[]): void;

    abstract getStartDate(): Date | undefined;

    getChartData(data: InspectionResponseModel[]): ChartData {
        this.startDate = this.getStartDate();
        const filteredData = this.filter(data, this.startDate);
        this.getDataMap(filteredData);

        return {
            labels: this.labels,
            datasets: this.results.map((result) => ({
                label: result.label,
                data: this.dataMap[result.value],
                fill: false,
                backgroundColor: colorByResult(result.value),
                borderColor: colorByResult(result.value),
                tension: 0
            }))
        };
    }
}

export class AllFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

        const monthsSet = new Set<number>();
        filteredData.forEach((inspection) => {
            monthsSet.add(inspection.inspectionDate.getMonth() + 1);
        });

        const months = Array.from(monthsSet).sort((a, b) => a - b);
        const labelMonths = this.translateLang.getOptionsByType(TypeList.month);

        this.labels = months.map((m) => labelMonths[m - 1].label);
        this.results.forEach((op) => (this.dataMap[op.value] = new Array(this.labels.length).fill(0)));

        filteredData.forEach((inspection) => {
            const mes = inspection.inspectionDate.getMonth() + 1;
            const index = months.indexOf(mes);
            if (this.values.includes(inspection.resultOption?.value) && index >= 0) {
                this.dataMap[inspection.resultOption?.value][index]++;
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate;
    }
}

export class DynamicRangeFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

        // 1) Normalizamos startDate y endDate a medianoche
        const start = new Date(this.startDate ?? this.endDate);
        const end = new Date(this.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // 2) Calculamos la diferencia en milisegundos y días
        const msInDay = 1000 * 60 * 60 * 24;
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / msInDay);

        // 3) Calculamos el número de intervalos de ~1 semana, Hasta un máximo de 8
        let n = Math.ceil(diffDays / 7);
        n = Math.max(1, Math.min(n, 8));

        // 4) Tamaño de cada intervalo en ms
        const intervalMs = diffMs / n;

        // 5) Generamos el array de fechas y etiquetas
        const shortMonths = this.translateLang.getOptionsByType(TypeList.month);

        this.labels = Array.from({ length: n }, (_, i) => {
            const from = new Date(start.getTime() + i * intervalMs);
            const to = new Date(start.getTime() + (i + 1) * intervalMs);
            const fmt = (d: Date) => `${d.getDate().toString().padStart(2, '0')} ${shortMonths[d.getMonth()].label}`;
            return `${fmt(from)} – ${fmt(to)}`;
        });

        // 6) Inicializamos contadores
        this.results.forEach((op) => {
            this.dataMap[op.value] = new Array(n).fill(0);
        });

        this.values = this.results.map((r) => r.value);

        // 7) Contamos cada inspección en su intervalo
        filteredData.forEach((ins) => {
            if (!this.values.includes(ins.resultOption?.value)) return;
            const dt = new Date(ins.inspectionDate);
            dt.setHours(0, 0, 0, 0);
            const idx = Math.floor((dt.getTime() - start.getTime()) / intervalMs);
            if (idx >= 0 && idx < n) {
                this.dataMap[ins.resultOption?.value][idx]++;
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

export class OneMonthFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

        const n = 4;

        const oneMonthAgo = new Date(this.endDate);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        // Calcular duración total en ms
        const diffMs = this.endDate.getTime() - oneMonthAgo.getTime();
        const intervalsMs = diffMs / n; // 4 semanas (aprox)

        // Función para formatear fechas dd MMM
        const shortMonths = this.translateLang.getOptionsByType(TypeList.month);
        function formatDate(d: Date) {
            const dia = d.getDate().toString().padStart(2, '0');
            return `${dia} ${shortMonths[d.getMonth()].label}`;
        }

        // Crear rangos semanales
        const rangeWeek: { initial: Date; final: Date }[] = [];
        for (let i = 0; i < n; i++) {
            const initial = new Date(oneMonthAgo.getTime() + i * intervalsMs);
            const final = new Date(oneMonthAgo.getTime() + (i + 1) * intervalsMs);

            rangeWeek.push({ initial, final });
            this.labels.push(`${formatDate(initial)} - ${formatDate(final)}`);
        }

        this.results.forEach((op) => (this.dataMap[op.value] = new Array(this.labels.length).fill(0)));
        filteredData.forEach((inspection) => {
            if (!this.values.includes(inspection.resultOption?.value)) return;
            const date = inspection.inspectionDate;

            for (let i = 0; i < rangeWeek.length; i++) {
                const { initial, final } = rangeWeek[i];
                if (date >= initial && date <= final) {
                    this.dataMap[inspection.resultOption?.value][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getMonth() - 1);
    }
}

export class RangeDaysFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

        const start = new Date(this.startDate ?? this.endDate);
        const end = new Date(this.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // 2) Calculamos cuántos días hay entre ambas fechas
        const msInDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.floor((end.getTime() - start.getTime()) / msInDay);

        // Generamos un array con cada día desde hace 15 días hasta hoy (inclusive)
        const rangeDays: Date[] = [];
        for (let i = 0; i <= diffDays; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            rangeDays.push(day);
        }

        // Nombres cortos de días en español
        const labelsDays = this.translateLang.getOptionsByType(TypeList.day);

        // Preparamos las etiquetas: ejemplo "Lun 12"
        this.labels = rangeDays.map((d) => `${labelsDays[d.getDay()].label} ${d.getDate().toString().padStart(2, '0')}`);

        // Inicializamos el mapa de datos
        this.results.forEach((op) => {
            this.dataMap[op.value] = new Array(this.labels.length).fill(0);
        });

        // Recorremos las inspecciones y las contamos en su día correspondiente
        filteredData.forEach((inspection) => {
            if (!this.values.includes(inspection.resultOption?.value)) return;
            const fecha = inspection.inspectionDate;
            for (let i = 0; i < rangeDays.length; i++) {
                const day = rangeDays[i];
                if (fecha.getFullYear() === day.getFullYear() && fecha.getMonth() === day.getMonth() && fecha.getDate() === day.getDate()) {
                    this.dataMap[inspection.resultOption?.value][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        // Si no hay startDate explícito, usamos endDate - 15 días
        return this.startDate ?? new Date(this.endDate.getTime() - 15 * 24 * 60 * 60 * 1000);
    }
}

export class OneWeekFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

        const oneWeekAgo = new Date(this.endDate); // Incluye hoy + 6 días atrás = 7 días total
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);

        // Generar arreglo con cada día en el rango de hace una semana hasta ahora
        const rangeDays: Date[] = [];
        for (let i = 0; i < 8; i++) {
            const day = new Date(oneWeekAgo);
            day.setDate(oneWeekAgo.getDate() + i);
            rangeDays.push(day);
        }

        // Labels para día semana y formato corto
        const labelsDays = this.translateLang.getOptionsByType(TypeList.day);

        // Labels: Ejemplo "Lun 12"
        this.labels = rangeDays.map((d) => `${labelsDays[d.getDay()].label} ${d.getDate().toString().padStart(2, '0')}`);

        this.results.forEach((op) => (this.dataMap[op.value] = new Array(this.labels.length).fill(0)));

        filteredData.forEach((inspection) => {
            if (!this.values.includes(inspection.resultOption?.value)) return;
            const date = inspection.inspectionDate;

            for (let i = 0; i < rangeDays.length; i++) {
                const day = rangeDays[i];
                if (date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth() && date.getDate() === day.getDate()) {
                    this.dataMap[inspection.resultOption?.value][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
}

export class OneDayFilter extends InspectionsFilterStrategy {
    override getDataMap(filteredData: InspectionResponseModel[]): void {
        this.initData();

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

        this.results.forEach((op) => (this.dataMap[op.value] = new Array(intervals).fill(0)));

        filteredData.forEach((inspection) => {
            if (!this.values.includes(inspection.resultOption?.value)) return;

            for (let i = 0; i < rangeIntervals.length; i++) {
                const { initial, fin } = rangeIntervals[i];
                if (inspection.inspectionDateTime >= initial && inspection.inspectionDateTime <= fin) {
                    this.dataMap[inspection.resultOption?.value][i]++;
                    return;
                }
            }
        });
    }

    override getStartDate(): Date | undefined {
        return this.startDate ?? new Date(this.endDate.getTime() - 24 * 60 * 60 * 1000);
    }
}
