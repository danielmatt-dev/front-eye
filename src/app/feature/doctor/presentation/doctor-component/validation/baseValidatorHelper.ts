import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import validator from 'validator';
import { ClinicModel } from '../../../../clinic/data/models/clinic.model';

/**
 * Helper de validaciones específico para el módulo de doctores y pacientes.
 *
 * @description
 * Extiende de {@link ValidatorHelper} y agrega validaciones personalizadas
 * para campos de formulario relacionados con doctores y pacientes.
 *
 * Además, incluye métodos para enviar mensajes de éxito estandarizados
 * usando `toast notifications`.
 */
export class BaseValidatorHelper extends ValidatorHelper {
    /**
     * Envía un mensaje de éxito (toast) para operaciones CRUD de doctores o pacientes.
     *
     * @param type Tipo de operación (por ejemplo, `"createDoctor"` o `"deletePatient"`).
     * @param param Texto dinámico a reemplazar en el mensaje (por ejemplo, nombre del doctor).
     *
     * @example
     * ```ts
     * this.sendToastMessageSuccess('createDoctor', 'Dr. Juan Pérez');
     * ```
     */
    sendToastMessageSuccess(type: 'createDoctor' | 'updateDoctor' | 'deleteDoctor' | 'deleteDoctors' | 'createPatient' | 'updatePatient' | 'deletePatient' | 'deletePatients', param: string) {
        const title = this.getText(`toast.success.titles.${type}`)
        const message = this.getText(`toast.success.messages.${type}`).replace('@', param)
        this.sendToastMessage({ title: title, message: message, type: 'success' })
    }

    /**
     * Valida si se seleccionó una clínica.
     *
     * @param clinic Clínica seleccionada.
     * @returns `undefined` si es válido o un mensaje de error en caso contrario.
     */
    validateSelectedClinic(clinic?: ClinicModel): string | undefined {

        if (!clinic) {
            return this.getText(this.validationsKey + 'selectionRequired')
        }

        return undefined
    }

    /**
 * Valida el nombre de un doctor/paciente.
 *
 * - No debe estar vacío.
 * - No debe contener números ni caracteres especiales.
 *
 * @param firstName Nombre a validar.
 * @returns `undefined` si es válido o un mensaje de error en caso contrario.
 */
    validateName(firstName: string): string | undefined {

        firstName = firstName.trim()
        const message = this.validateField(firstName)
        if (message) {
            return message
        }

        const hasNumber = /\d/.test(firstName);
        if (hasNumber) {
            return this.getText(this.validationsKey + 'noNumbers');
        }

        const invalidChar = /[^A-Za-zÀ-ÿ ]/.test(firstName);
        if (invalidChar) {
            return this.getText(this.validationsKey + 'noSpecialChars');
        }

        return undefined
    }

    /**
   * Valida un campo numérico (por ejemplo, código postal).
   *
   * @param fieldNumber Valor del código postal.
   * @param maxLength Longitud máxima permitida.
   * @returns `undefined` si es válido o un mensaje de error en caso contrario.
   */
    validateFieldNumber(fieldNumber: string, maxLength: number): string | undefined {
        fieldNumber = fieldNumber.trim()
        const message = this.validateField(fieldNumber, maxLength)
        if (message) {
            return message
        }

        const invalidChar = /[^A-Za-zÀ-ÿ ]/.test(fieldNumber);
        if (!invalidChar) {
            return this.getText(this.validationsKey + 'noSpecialChars');
        }

        if (!/^\d+$/.test(fieldNumber)) {
            return this.getText(this.validationsKey + 'onlyNumbers');
        }

        return undefined
    }

    /**
   * Valida el formato de un correo electrónico.
   *
   * @param email Correo a validar.
   * @returns `undefined` si es válido o un mensaje de error en caso contrario.
   */
    validateEmail(email: string) {
        email = email.trim()
        const message = this.validateField(email)
        if (message) {
            return message
        }

        if (!validator.isEmail(email)) {
            return this.getText(this.validationsKey + 'email')
        }

        return undefined
    }

    /**
   * Valida la seguridad de una contraseña.
   *
   * Requisitos:
   * - No vacía.
   * - Longitud mínima de 8 caracteres.
   * - Al menos una minúscula, una mayúscula y un dígito.
   *
   * @param password Contraseña a validar.
   * @returns `undefined` si es válida o un mensaje de error.
   */
    validatePassword(password?: string) {

        password = password?.trim()

        if (!password || password === '') {
            return this.getText(this.validationsKey + 'required')
        }

        if (password.length < 8) {
            return this.getText(this.validationsKey + 'passwordMinLength')
        }

        if (!/[a-z]/.test(password)) {
            return this.getText(this.validationsKey + 'passwordLowercase')
        }

        if (!/[A-Z]/.test(password)) {
            return this.getText(this.validationsKey + 'passwordUppercase')
        }

        if (!/\d/.test(password)) {
            return this.getText(this.validationsKey + 'passwordDigit')
        }

        return undefined;
    }

    /**
   * Valida que la confirmación de contraseña coincida con la contraseña.
   *
   * @param confirmPassword Confirmación de la contraseña.
   * @param password Contraseña original.
   * @returns `undefined` si coinciden o un mensaje de error si no.
   */
    validateConfirmPassword(confirmPassword?: string, password?: string) {

        confirmPassword = confirmPassword?.trim()
        password = password?.trim()

        const message = this.validateField(confirmPassword)
        if (message) {
            return message
        }

        if (confirmPassword !== password) {
            return this.getText(this.validationsKey + 'passwordsNotMatch')
        }

        return undefined
    }

    /**
   * Valida que la fecha de nacimiento no esté vacía.
   *
   * @param date Fecha de nacimiento.
   * @returns `undefined` si es válida o un mensaje de error si está vacía.
   */
    validateBirthDate(date?: Date) {
        if (!date) {
            return this.getText(this.validationsKey + 'required')
        }

        return undefined
    }

    /**
 * Valida que el código postal tenga exactamente 5 dígitos.
 *
 * @param postalCode Código postal a validar.
 * @returns `undefined` si es válido o un mensaje de error en caso contrario.
 */
    validatePostalCode(postalCode: string): string | undefined {
        postalCode = postalCode.trim();

        const message = this.validateField(postalCode);
        if (message) {
            return message;
        }

        if (!/^\d+$/.test(postalCode)) {
            return this.getText(this.validationsKey + 'onlyNumbers');
        }

        if (postalCode.length !== 5) {
            return this.getText(this.validationsKey + 'postalCodeLength');
        }

        return undefined;
    }
}
