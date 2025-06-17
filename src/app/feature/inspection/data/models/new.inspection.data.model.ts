import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';
import { DiseaseModel } from '../../../disease/data/model/disease.model';
import { AiModelModel } from '../../../aimodel/data/model/aimodel.model';
import { Type } from 'class-transformer';

export class NewInspectionDataModel {

    @Type(() => PatientResponseModel)
    patients: PatientResponseModel[] = []

    @Type(() => DiseaseModel)
    diseases: DiseaseModel[] = []

    @Type(() => AiModelModel)
    models: AiModelModel[] = []

    constructor(partial?: Partial<NewInspectionDataModel>) {
        Object.assign(this, partial)
    }

}
