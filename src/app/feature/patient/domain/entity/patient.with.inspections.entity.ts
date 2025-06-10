import { PatientWithInspectionsModel } from '../../data/models/patient.with.inspections.model';

export class PatientWithInspectionsEntity extends PatientWithInspectionsModel {

    constructor(options: {
        patientId?: number
        fullName?: string
        latitude?: number
        longitude?: number
        patientCreatedAt?: Date
        lastInspectionId?: number
        lastResult?: string
        lastDisease?: string
        lastInspectionDate?: Date
        inspectionCount?: number
    } = {}) {
        super({
            patientId: options.patientId,
            fullName: options.fullName,
            latitude: options.latitude,
            longitude: options.longitude,
            patientCreatedAt: options.patientCreatedAt,
            lastInspectionId: options.lastInspectionId,
            lastResult: options.lastResult,
            lastDisease: options.lastDisease,
            lastInspectionDate: options.lastInspectionDate,
            inspectionCount: options.inspectionCount
        });
    }

}
