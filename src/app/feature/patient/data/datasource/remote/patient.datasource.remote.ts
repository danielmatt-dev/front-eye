import { Either } from 'fp-ts/Either';
import { PatientWithInspectionsModel } from '../../models/patient.with.inspections.model';
import { PatientRequestModel } from '../../models/patient.request.model';
import { PatientResponseModel } from '../../models/patient.response.model';

// <>
export interface PatientDatasourceRemote {

    postPatient(request: PatientRequestModel): Promise<Either<Error, PatientResponseModel>>

    putPatient(request: PatientRequestModel, patientId: number): Promise<Either<Error, PatientResponseModel>>

    getPatientById(patientId: number): Promise<Either<Error, PatientResponseModel>>

    getAllPatients(): Promise<Either<Error, PatientResponseModel[]>>

    deletePatients(patientIds: number[]): Promise<Either<Error, boolean>>

    getAllPatientsWithInspections(): Promise<Either<Error, PatientWithInspectionsModel[]>>

}
