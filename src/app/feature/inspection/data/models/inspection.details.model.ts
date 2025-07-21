import { InspectionResponseModel } from './inspection.response.model';
import { Expose, Type } from 'class-transformer';
import { PatientResponseModel } from '../../../patient/data/models/patient.response.model';

export class InspectionDetailsModel {

    @Type(() => InspectionResponseModel)
    inspection: InspectionResponseModel = new InspectionResponseModel()

    @Type(() => PatientResponseModel)
    patient: PatientResponseModel = new PatientResponseModel()

    @Expose({ name: 'inspection_history' })
    @Type(() => InspectionResponseModel)
    inspectionHistory: InspectionResponseModel[] = []

    constructor(partial?: Partial<InspectionDetailsModel>) {
        Object.assign(this, partial)
    }

}

export class InspectionImageModel {

    @Expose({ name: 'inspection_image_id' })
    inspectionImageId?: number

    @Expose({ name: 'image_url' })
    imageUrl: string = ''

    title: string = ''

    constructor(partial?: Partial<InspectionImageModel>) {
        Object.assign(this, partial)
    }

}
