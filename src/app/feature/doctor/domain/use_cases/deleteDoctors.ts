import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorIdRequestModel } from '../../data/models/doctor.id.request.model';

@Injectable({ providedIn: 'root' })
export class DeleteDoctors implements UseCase<boolean, number[]> {

    constructor(private readonly remote: DoctorDatasourceRemoteImpl) {}

    call(params: number[]): Promise<Either<Error, boolean>> {
        const doctorIds = params.map(id => new DoctorIdRequestModel({doctorId: id}))
        return this.remote.deleteDoctors(doctorIds)
    }

}
