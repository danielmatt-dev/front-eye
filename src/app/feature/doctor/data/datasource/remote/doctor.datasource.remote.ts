import { Either } from 'fp-ts/Either';
import { DoctorResponseModel } from '../../models/doctor.response.model';
import { DoctorRequestModel } from '../../models/doctor.request.model';
import { DoctorIdRequestModel } from '../../models/doctor.id.request.model';

/**
 * Contrato para las fuentes de datos remotas de doctores.
 *
 * @description
 * Define los métodos que deben implementar las clases responsables
 * de comunicarse con el backend para la gestión de doctores.  
 * Implementaciones como {@link DoctorDatasourceRemoteImpl} contienen
 * la lógica concreta de comunicación con los endpoints.
 */
export interface DoctorDatasourceRemote {
    /**
     * Crea un nuevo doctor en el sistema.
     *
     * @param request Datos del doctor a crear (nombre, especialidad, etc.).
     * @returns Una promesa que resuelve un `Either`:
     * - `Right<DoctorResponseModel>` si la operación es exitosa.
     * - `Left<Error>` si ocurre un error.
     */
    postDoctor(request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>>

    /**
     * Actualiza un doctor existente.
     *
     * @param doctorId Identificador único del doctor.
     * @param request Datos actualizados del doctor.
     * @returns Una promesa que resuelve un `Either`:
     * - `Right<DoctorResponseModel>` si la operación es exitosa.
     * - `Left<Error>` si ocurre un error.
     */
    putDoctor(doctorId: number, request: DoctorRequestModel): Promise<Either<Error, DoctorResponseModel>>

    /**
   * Obtiene la lista de todos los doctores registrados en el sistema.
   *
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<DoctorResponseModel[]>` con la lista de doctores.
   * - `Left<Error>` si ocurre un error en la consulta.
   */
    getAllDoctors(): Promise<Either<Error, DoctorResponseModel[]>>

    /**
   * Elimina uno o varios doctores por sus identificadores.
   *
   * @param doctorIds Lista de {@link DoctorIdRequestModel} con los IDs de doctores a eliminar.
   * @returns Una promesa que resuelve un `Either`:
   * - `Right<boolean>` → `true` si la eliminación fue exitosa.
   * - `Left<Error>` si ocurre un error.
   */
    deleteDoctors(doctorIds: DoctorIdRequestModel[]): Promise<Either<Error, boolean>>

}
