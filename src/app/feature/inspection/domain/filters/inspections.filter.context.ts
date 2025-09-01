import { InspectionsFilterStrategy } from './inspections.filter';
import { ChartData } from 'chart.js';
import { InspectionResponseModel } from '../../data/models/inspection.response.model';
import { Injectable } from '@angular/core';
import { TranslateLang } from '../../../../shared/utils/functions/translate-lang';

@Injectable({ providedIn: 'root' })
export class InspectionsFilterContext {

    constructor(
        private readonly translateLang: TranslateLang
    ) {}

    apply(data: InspectionResponseModel[], strategy: InspectionsFilterStrategy): ChartData {
        strategy.setTranslateLang(this.translateLang)
        return strategy.getChartData(data);
    }

}
