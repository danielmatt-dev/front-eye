import { InspectionResponseEntity } from '../entity/inspection.response.entity';
import { results } from '../../../../shared/utils/data';
import { colorByResult } from '../../../../shared/utils/functions/functions';
import { ChartData } from 'chart.js';

export abstract class InspectionsFilterStrategy {

    today = new Date()
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

    filter(data: InspectionResponseEntity[], finalDate?: Date): InspectionResponseEntity[] {
        if (!finalDate) {
            return data
        }

        return data.filter((ins) =>
            ins.inspectionDate >= finalDate);
    }

    abstract getDataMap(filteredData: InspectionResponseEntity[]): void

    abstract getFinalDate(): Date | undefined

    getChartData(data: InspectionResponseEntity[]): ChartData {

        const finalDate = this.getFinalDate()
        const filteredData =  this.filter(data, finalDate)
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

    override getFinalDate(): Date | undefined {
        return undefined
    }

}

export class ThreeMonthsFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const threeMonthsAgo = new Date(this.today)
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
            const fecha = inspection.inspectionDate;

            for (let i = 0; i < rangeMonths.length; i++) {
                const initialMonth = rangeMonths[i];
                const finalMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() + 1, 0); // último día mes

                if (fecha >= initialMonth && fecha <= finalMonth) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });

    }

    override getFinalDate(): Date | undefined {
        return new Date(this.today.getMonth() - 3)
    }

}

export class OneMonthFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const n = 4

        const oneMonthAgo = new Date(this.today)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        oneMonthAgo.setHours(0, 0, 0, 0)

        // Calcular duración total en ms
        const diffMs = this.today.getTime() - oneMonthAgo.getTime();
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
            const final = new Date(oneMonthAgo.getTime() + (i + 1) * intervalsMs - 1)

            rangeWeek.push({ initial, final })
            this.labels.push(`${formatDate(initial)} - ${formatDate(final)}`)
        }

        results.forEach(cat => this.dataMap[cat] = new Array(this.labels.length).fill(0));
        filteredData.forEach(inspection => {
            if (!results.includes(inspection.result)) return;
            const fecha = inspection.inspectionDate;

            for (let i = 0; i < rangeWeek.length; i++) {
                const { initial, final } = rangeWeek[i];
                if (fecha >= initial && fecha <= final) {
                    this.dataMap[inspection.result][i]++;
                    return
                }
            }
        });
    }

    override getFinalDate(): Date | undefined {
        return new Date(this.today.getMonth() - 1)
    }

}

export class OneWeekFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {
        this.initData()

        const oneWeekAgo = new Date(this.today); // Incluye hoy + 6 días atrás = 7 días total
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 6)
        oneWeekAgo.setHours(0, 0, 0, 0)

        // Generar arreglo con cada día en el rango de hace una semana hasta ahora
        const rangeDays: Date[] = [];
        for (let i = 0; i < 7; i++) {
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

    override getFinalDate(): Date | undefined {
        return new Date(this.today.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

}

export class OneDayFilter extends InspectionsFilterStrategy {

    override getDataMap(filteredData: InspectionResponseEntity[]): void {

        this.initData()

        const initDate = new Date();
        initDate.setHours(0, 0, 0, 0); // medianoche de hoy

        // Calcular cuantos intervalos de 4 horas existen desde la fecha de inicio hasta ahora
        const diffMs = this.today.getTime() - initDate.getTime();
        const intervalsMs = 4 * 60 * 60 * 1000; // 4 horas en ms
        const intervals = Math.ceil(diffMs / intervalsMs);

        const rangeIntervals: { initial: Date; fin: Date }[] = [];

        for (let i = 0; i < intervals; i++) {
            const initial = new Date(initDate.getTime() + i * intervalsMs);
            let fin = new Date(initial.getTime() + intervalsMs - 1);

            if (fin > this.today) {
                fin = new Date(this.today);
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
                if (inspection.inspectionDate >= initial && inspection.inspectionDate <= fin) {
                    this.dataMap[inspection.result][i]++;
                    return;
                }
            }
        });

    }

    override getFinalDate(): Date | undefined {
        return new Date(this.today.getTime() - 24 * 60 * 60 * 1000)
    }

}
