import { Either } from 'fp-ts/lib/Either';
import { UseCase } from '../../../../shared/utils/usecase';
import { DoctorDatasourceRemoteImpl } from '../../data/datasource/remote/impl/doctor.datasource.remote.impl';
import { Injectable } from '@angular/core';
import { DoctorResponseModel } from '../../data/models/doctor.response.model';
import { DoctorRequestModel } from '../../data/models/doctor.request.model';

@Injectable({ providedIn: 'root' })
/**
 * Caso de uso para actualizar un doctor existente.
 *
 * @description
 * Implementa la interfaz genérica {@link UseCase}, donde:
 * - **Input:** {@link UpdateDoctorParams} (contiene el ID y la data a actualizar).
 * - **Output:** {@link DoctorResponseModel} con los datos actualizados del doctor.
 *
 * Este caso de uso delega la operación al datasource remoto
 * {@link DoctorDatasourceRemoteImpl.putDoctor}.
 */
export class UpdateDoctor implements UseCase<DoctorResponseModel, UpdateDoctorParams> {
    /**
     * Constructor del caso de uso.
     *
     * @param remote Implementación del datasource remoto de doctores.
     */
    constructor(private readonly remote: DoctorDatasourceRemoteImpl) { }

    /**
     * Ejecuta el caso de uso para actualizar un doctor.
     *
     * @param params Objeto con el ID del doctor y los datos a actualizar.
     * @returns Una promesa que resuelve en un `Either`:
     * - `Right<DoctorResponseModel>` si la actualización es exitosa.
     * - `Left<Error>` si ocurre un error.
     *
     * @example
     * ```ts
     * const request = new DoctorRequestModel({ firstName: "Juan", email: "nuevo@mail.com" });
     * const params = new UpdateDoctorParams(request, 101);
     * const result = await updateDoctor.call(params);
     *
     * if (result._tag === 'Right') {
     *   console.log("Doctor actualizado:", result.right);
     * } else {
     *   console.error("Error:", result.left);
     * }
     * ```
     */
    async call(params: UpdateDoctorParams): Promise<Either<Error, DoctorResponseModel>> {
        return await this.remote.putDoctor(params.doctorId, params.request)
    }

}

/**
 * Parámetros para el caso de uso {@link UpdateDoctor}.
 *
 * @description
 * Contiene la información necesaria para actualizar un doctor:
 * - El identificador del doctor a modificar.
 * - El objeto {@link DoctorRequestModel} con los nuevos datos.
 */
export class UpdateDoctorParams {
    /** Datos actualizados del doctor. */
    request: DoctorRequestModel

    /** Identificador único del doctor a actualizar. */
    doctorId: number

    /**
     * Crea una instancia de parámetros para actualizar un doctor.
     *
     * @param request Objeto con los datos actualizados.
     * @param doctorId ID del doctor a modificar.
     *
     * @example
     * ```ts
     * const params = new UpdateDoctorParams(new DoctorRequestModel({...}), 101);
     * ```
     */
    constructor(request: DoctorRequestModel, doctorId: number) {
        this.request = request
        this.doctorId = doctorId
    }

}
