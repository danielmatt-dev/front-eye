import { Either } from 'fp-ts/Either';
import { DoctorResponseModel } from '../../models/doctor.response.model';
import { DoctorRequestModel } from '../../models/doctor.request.model';
import { DoctorIdRequestModel } from '../../models/doctor.id.request.model';

// <>
export interface DoctorDatasourceRemote {

    postDoctor(request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>>

    putDoctor(doctorId: number, request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>>

    getAllDoctors(): Promise<Either<Error, DoctorResponseModel[]>>

    deleteDoctors(doctorIds: DoctorIdRequestModel[]): Promise<Either<Error, boolean>>

}
