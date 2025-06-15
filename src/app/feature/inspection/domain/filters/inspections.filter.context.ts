import { InspectionsFilterStrategy } from './inspections.filter';
import { InspectionResponseEntity } from '../entity/inspection.response.entity';
import { ChartData } from 'chart.js';

export class InspectionsFilterContext {

    constructor(private readonly strategy: InspectionsFilterStrategy) {}

    apply(data: InspectionResponseEntity[]): ChartData {
        return this.strategy.getChartData(data);
    }

}
