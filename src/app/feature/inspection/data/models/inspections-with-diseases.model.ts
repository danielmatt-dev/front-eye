import { InspectionResponseModel } from './inspection.response.model';
import { Type } from 'class-transformer';
import { DiseaseModel } from '../../../disease/data/model/disease.model';

export class InspectionsWithDiseasesModel {

    @Type(() => InspectionResponseModel)
    inspections: InspectionResponseModel[] = []

    @Type(() => DiseaseModel)
    diseases: DiseaseModel[] = []

    constructor(partial?: Partial<InspectionsWithDiseasesModel>) {
        Object.assign(this, partial)
    }

}
