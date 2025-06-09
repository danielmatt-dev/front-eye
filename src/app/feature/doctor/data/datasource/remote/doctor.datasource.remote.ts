import { Either } from 'fp-ts/Either';
import { DoctorResponseModel } from '../../models/doctor.response.model';

// <>
export interface DoctorDatasourceRemote {

    getAllDoctors(): Promise<Either<Error, DoctorResponseModel[]>>

}
