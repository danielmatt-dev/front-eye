import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';
import { DoctorRequestModel } from '../../data/models/doctor.request.model';

// <>
@Injectable({ providedIn: 'root' })
export class CreateDoctor implements UseCase<DoctorResponseModel, DoctorRequestModel> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    async call(params: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        return await this.remote.postDoctor(params)
    }

}
