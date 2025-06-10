import { Either } from 'fp-ts/Either';
import { PatientWithInspectionsModel } from '../../models/patient.with.inspections.model';

// <>
export interface PatientDatasourceRemote {

    getAllPatientsWithInspections(): Promise<Either<Error, PatientWithInspectionsModel[]>>

}
