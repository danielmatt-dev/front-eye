import { InspectionReponseModel } from '../../data/models/inspection.reponse.model';

export class InspectionResponseEntity extends InspectionReponseModel {

    constructor(options: {
        inspectionId?: number
        patientId?: number
        patientBirthDate?: Date
        patientGender?: string
        inspectionDate?: Date
        inspectionTime?: string
        eye?: string
        disease?: string
        model?: string
        result?: string
        createdAt?: Date
    } = {}) {
        super({
            inspectionId: options.inspectionId,
            patientId: options.patientId,
            patientBirthDate: options.patientBirthDate,
            patientGender: options.patientGender,
            inspectionDate: options.inspectionDate,
            inspectionTime: options.inspectionTime,
            eye: options.eye,
            disease: options.disease,
            model: options.model,
            result: options.result,
            createdAt: options.createdAt
        });
    }

}
