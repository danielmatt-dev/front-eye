import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { PatientResponseModel } from '../../../../patient/data/models/patient.response.model';
import { AiModelModel } from '../../../../aimodel/data/model/aimodel.model';
import { DiseaseModel } from '../../../../disease/data/model/disease.model';

/**
 * Validador para el formulario de **nueva inspección**.
 *
 * @description
 * Esta clase pertenece a la capa de **presentation/components → validation** dentro de la Clean Architecture.
 * Extiende de `ValidatorHelper` para reutilizar utilidades de internacionalización y construcción
 * de mensajes de validación (p. ej., `getText` y `validationsKey`).
 *
 * Provee validaciones puntuales para verificar que el usuario haya seleccionado:
 * - Paciente
 * - Imagen
 * - Modelo de IA
 * - Enfermedad
 *
 * Cada método retorna una cadena con el mensaje de error localizado cuando la validación
 * no se cumple, o `undefined` si la validación es exitosa.
 */
export class NewInspectionValidator extends ValidatorHelper {

    /**
     * Valida que se haya seleccionado un paciente.
     *
     * @param patient `PatientResponseModel | undefined` - Paciente seleccionado en el formulario.
     * @returns `string | undefined` Mensaje de error localizado si no hay paciente; `undefined` en caso de éxito.
     */
    validatePatientSelected(patient?: number): string | undefined {
        // Si no existe el objeto paciente, construye y retorna el mensaje localizado
        if (!patient) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        // Sin errores de validación
        return undefined
    }

        /**
     * Valida que se haya seleccionado al menos una imagen.
     *
     * @param files `File[]` - Arreglo de archivos de imagen seleccionados.
     * @returns `string | undefined` Mensaje de error localizado si no hay archivos; `undefined` en caso de éxito.
     */
    validateImageSelected(files: File[]) {
         // Si el arreglo está vacío, no se seleccionó ninguna imagen
        if (files.length === 0) {
            return this.getText(this.validationsKey + 'selectionImageRequired')
        }
        // Sin errores de validación
        return undefined
    }

    /**
     * Valida que se haya seleccionado un modelo de IA.
     *
     * @param model `AiModelModel | undefined` - Modelo de IA elegido para la inspección.
     * @returns `string | undefined` Mensaje de error localizado si no hay modelo; `undefined` en caso de éxito.
     */
    validateModelSelected(model?: AiModelModel): string | undefined {
        // Si no se eligió un modelo, retorna el mensaje de validación correspondiente
        // Nota: Se utiliza la clave de paciente requerida según configuración actual.
        if (!model) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

    /**
     * Valida que se haya seleccionado una enfermedad.
     *
     * @param disease `DiseaseModel | undefined` - Enfermedad elegida para la inspección.
     * @returns `string | undefined` Mensaje de error localizado si no hay enfermedad; `undefined` en caso de éxito.
     */
    validateDiseaseSelected(disease?: DiseaseModel): string | undefined {
        // Si no se eligió una enfermedad, retorna el mensaje de validación correspondiente
        // Nota: Se utiliza la clave de paciente requerido según configuración actual.
        if (!disease) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

}
