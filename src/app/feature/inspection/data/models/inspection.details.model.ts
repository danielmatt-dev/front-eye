import { InspectionReponseModel } from './inspection.reponse.model';
import { Expose, Type } from 'class-transformer';
import { DiagnosticProbabilityModel } from './inspection.request.model';
import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';

export class InspectionDetailsModel {

    @Type(() => InspectionReponseModel)
    inspection: InspectionReponseModel = new InspectionReponseModel()

    patient: PatientResponseModel = new PatientResponseModel()

    images: InspectionImageModel[] = []

    probabilities: DiagnosticProbabilityModel[] = []

    inspectionHistory: InspectionReponseModel[] = []

    constructor(partial?: Partial<InspectionDetailsModel>) {
        Object.assign(this, partial)
    }

}

export class InspectionImageModel {

    @Expose({ name: 'inspection_image_id' })
    inspectionImageId?: number

    @Expose({ name: 'image_url' })
    imageUrl: string = ''

    constructor(partial?: Partial<InspectionImageModel>) {
        Object.assign(this, partial)
    }

}
