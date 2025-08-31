import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local.storage.service';
import { ageRanges2, DICTS, diseases2, diseases3, eyes2, eyes3, genders2, genders3, labelMonths, LIST_OPTIONS, OptionLabel, periods, periods3, results2, results3 } from '../data';
import { DiseaseEntity } from '../../../feature/disease/domain/entity/disease.entity';

export type Lang = 'en' | 'es';
export enum TypeList {
    gender = 'gender',
    eye = 'eye',
    disease = 'disease',
    ageRange = 'ageRange',
    period = 'periods',
    result = 'result',
    month = 'month'
}

@Injectable({ providedIn: 'root' })
export class TranslateLang {
    constructor(private readonly local: LocalStorageService) {}

    getTranslateList({ type }: { type: TypeList }): string[] {
        let values = {};

        const isLangEs = this.isLangEs();

        switch (type) {
            case TypeList.gender:
                values = isLangEs ? genders2.es : genders2.en;
                break;
            case TypeList.eye:
                values = isLangEs ? eyes2.es : eyes2.en;
                break;
            case TypeList.disease:
                values = isLangEs ? diseases2.es : diseases2.en;
                break;
            case TypeList.ageRange:
                values = isLangEs ? ageRanges2.es : ageRanges2.en;
                break;
            case TypeList.period:
                values = isLangEs ? periods.es : periods.en;
                break;
            case TypeList.result:
                values = isLangEs ? results2.es : results2.en;
                break;
            case TypeList.month:
                values = isLangEs ? labelMonths.es : labelMonths.en;
                break;
        }

        return Object.values(values);
    }

    getOptionsByType(type: TypeList): OptionLabel[] {
        const dict = DICTS[type];
        if (!dict) return [];
        return dict[this.local.getLang()] ?? [];
    }

    translateByValue({ type, value, from, to }: { type: TypeList; value: string; from: Lang; to: Lang }): string {
        let srcDict = {};
        let dstDict = {};

        switch (type) {
            case TypeList.gender:
                srcDict = genders2[from];
                dstDict = genders2[to];
                break;
            case TypeList.eye:
                srcDict = eyes2[from];
                dstDict = eyes2[to];
                break;
            case TypeList.disease:
                srcDict = diseases2[from];
                dstDict = diseases2[to];
                break;
            case TypeList.ageRange:
                srcDict = ageRanges2[from];
                dstDict = ageRanges2[to];
                break;
            case TypeList.result:
                srcDict = results2[from];
                dstDict = results2[to];
                break;
        }

        // 1) Intento exacto
        let key = (Object.keys(srcDict) as Array<keyof typeof srcDict>).find((k) => srcDict[k] === value.trim());

        // 2) Intento case-insensitive / con trim
        if (!key) {
            const needle = value.trim().toLowerCase();
            key = (Object.keys(srcDict) as Array<keyof typeof srcDict>).find((k) => srcDict[k] === needle);
        }

        // Si no se encontró una clave para ese valor, regresamos el valor original.
        if (!key) return value;

        // Devolvemos el valor equivalente en el idioma destino.
        return dstDict[key];
    }

    translateByOptionLabel({ type, value }: { type: TypeList; value: any }): OptionLabel {
        const to = this.local.getLang();

        let dstDict: OptionLabel[] = [];

        switch (type) {
            case TypeList.gender:
                dstDict = genders3[to];
                break;
            case TypeList.period:
                dstDict = periods3[to];
                break;
            case TypeList.result:
                dstDict = results3[to];
                break;
            case TypeList.eye:
                dstDict = eyes3[to];
                break;
            case TypeList.disease:
                dstDict = diseases3[to];
                break;
        }

        let option = dstDict.find((op) => op.value === value);

        if (option) return option;

        option = LIST_OPTIONS[to].find((op) => op.label === value);

        return option ?? { label: value, value: value };
    }

    buildDiseaseOptions(diseases: DiseaseEntity[]): OptionLabel[] {
        const to = this.local.getLang();

        const dict = diseases3[to];
        const keys = dict.map((op) => op.value);

        const options: OptionLabel[] = []

        diseases.forEach((disease) => {
            if (!keys.includes(disease.diseaseId)) {
                const option = { label: disease.name, value: disease.diseaseId };
                diseases3['es'].push(option);
                diseases3['en'].push(option);
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

        return options;
    }

    translateByValueEnAndEs({ type, value }: { type: TypeList; value: string }): string {
        const isLangEs = this.isLangEs();
        const from = isLangEs ? 'en' : 'es';
        const to = isLangEs ? 'es' : 'en';

        return this.translateByValue({ type: type, value: value, from: from, to: to });
    }

    isLangEs(): boolean {
        return this.local.getLang() === 'es';
    }
}
