import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { Injectable } from '@angular/core';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';
import { DoctorRequestModel } from '../../data/models/doctor.request.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para crear un nuevo doctor.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, donde:
 * - **Input:** {@link DoctorRequestModel} con la información del doctor.
 * - **Output:** {@link DoctorResponseModel} con los datos creados.
 *
 * Este caso de uso delega la operación al datasource remoto
 * {@link DoctorDatasourceRemoteImpl.postDoctor}.
 */
export class CreateDoctor implements UseCase<DoctorResponseModel, DoctorRequestModel> {
    /**
     * Constructor del caso de uso.
     *
     * @param remote Implementación del datasource remoto de doctores.
     */
    constructor(private readonly remote: DoctorDatasourceRemoteImpl) { }
    /**
     * Ejecuta el caso de uso para crear un doctor.
     *
     * @param params Objeto {@link DoctorRequestModel} con los datos del doctor a registrar.
     * @returns Una promesa que resuelve en un `Either`:
     * - `Right<DoctorResponseModel>` si la operación es exitosa.
     * - `Left<Error>` si ocurre un error.
     *
     * @example
     * ```ts
     * const request = new DoctorRequestModel({ firstName: "Juan", email: "juan@clinica.com" });
     * const result = await createDoctor.call(request);
     *
     * if (result._tag === 'Right') {
     *   console.log("Doctor creado:", result.right);
     * } else {
     *   console.error("Error al crear doctor:", result.left);
     * }
     * ```
     */
    async call(params: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>> {
        return await this.remote.postDoctor(params)
    }

}
