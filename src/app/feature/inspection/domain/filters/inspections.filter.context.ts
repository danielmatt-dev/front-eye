import { InspectionsFilterStrategy } from './inspections.filter';
import { ChartData } from 'chart.js';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';

export class InspectionsFilterContext {

    constructor(private readonly strategy: InspectionsFilterStrategy) {}

    apply(data: InspectionResponseModel[]): ChartData {
        return this.strategy.getChartData(data);
    }

}
