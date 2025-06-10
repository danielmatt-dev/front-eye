import { Either } from 'fp-ts/Either';
import { ClinicModel } from '../../models/clinic.model';

// <>
export interface ClinicDatasourceRemote {

    getAllClinics(): Promise<Either<Error, ClinicModel[]>>

}
