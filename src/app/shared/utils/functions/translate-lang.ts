import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local.storage.service';
import {
    DICTS, diseases,
    geographicLabels, HEADERS,
    LIST_OPTIONS,
    OptionLabel,
    toolTips
} from '../data';
import { DiseaseModel } from '../../../feature/disease/data/model/disease.model';

export type Lang = 'en' | 'es';
export enum TypeList {
    gender = 'gender',
    eye = 'eye',
    disease = 'disease',
    ageRange = 'ageRange',
    period = 'period',
    result = 'result',
    month = 'month',
    option = 'option',
    day = 'day',
    doctor = 'doctor',
    patient = 'patient',
    geographic = 'geographic',
    inspection = 'inspection',
    details = 'details',
    pdf = 'pdf'
}

@Injectable({ providedIn: 'root' })
export class TranslateLang {
    constructor(private readonly local: LocalStorageService) {}

    getOptionsByType(type: TypeList, withAll: boolean = true): OptionLabel[] {
        const dict = DICTS[type];
        if (!dict) return [];

        const options = dict[this.local.getLang()]

        if (type === 'result' || type === 'disease') {
            return withAll
                ? options
                : options.filter(op => op.value !== -1);
        }

        return options;
    }

    translateByOptionLabel({ type, value }: { type: TypeList; value: any }): OptionLabel {
        const to = this.local.getLang();

        const dstDict: OptionLabel[] = DICTS[type][to];

        let option = dstDict.find((op) => op.value === value);

        if (option) return option;

        option = LIST_OPTIONS.find((op) => op.label === value);

        return option ?? { label: value, value: value };
    }

    getDateFormat(): string {
        return this.local.getLang() === 'es' ? 'dd/MM/yyyy' : 'yyyy-MM-dd'
    }

    buildDiseaseOptions(dis: DiseaseModel[], withAll: boolean): OptionLabel[] {
        const to = this.local.getLang();

        const dict = diseases[to];
        const keys = dict.map((op) => op.value);

        const options: OptionLabel[] = []

        dis.forEach((disease) => {
            if (!keys.includes(disease.diseaseId)) {
                const option = { label: disease.name, value: disease.diseaseId };
                diseases['es'].push(option);
                diseases['en'].push(option);
                options.push(option);
                return;
            }

            const option = dict.find((op) =>
                op.value === disease.diseaseId)

            if (!option) {
                return;
            }

            options.push(option)
        });

        if (withAll) {
            const all = dict.find(op => op.value === -1);
            all && options.push(all);
        }

        return options;
    }

    getGeographicLabels() {
        return geographicLabels[this.local.getLang()]
    }

    getToolTips() {
        return toolTips[this.local.getLang()]
    }

    getHeaders(type: TypeList) {
        return HEADERS[type][this.local.getLang()]
    }

}
