import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { ClinicEntity } from '../../../../clinic/domain/entity/clinic.entity';
import validator from 'validator';

export class BaseValidatorHelper extends ValidatorHelper {

    private static instance: BaseValidatorHelper

    static getInstance(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ): BaseValidatorHelper {

        if (!BaseValidatorHelper.instance) {
            BaseValidatorHelper.instance = new BaseValidatorHelper(messageService, translateService, primeng)
        }

        return BaseValidatorHelper.instance
    }

    sendToastMessageSuccess(type: 'createDoctor' | 'updateDoctor' | 'deleteDoctor' | 'deleteDoctors', param: string) {
        const title = this.getText(`toast.success.titles.${type}`)
        const message = this.getText(`toast.success.messages.${type}`).replace('@', param)
        this.sendToastMessage({title: title, message: message, type: 'success'})
    }

    sendToastMessageSuccessPatient(type: 'createPatient' | 'updatePatient' | 'deletePatient' | 'deletePatients', param: string) {
        const title = this.getText(`toast.success.titles.${type}`)
        const message = this.getText(`toast.success.messages.${type}`).replace('@', param)
        this.sendToastMessage({title: title, message: message, type: 'success'})
    }

    validateSelectedClinic(clinic?: ClinicEntity): string | undefined {

        if (!clinic) {
            return this.getText(this.validationsKey + 'selectionRequired')
        }

        return undefined
    }

    validateName(firstName: string): string | undefined {

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

    validateFieldNumber(postalCode: string, maxLength: number): string | undefined {
        const message = this.validateField(postalCode, maxLength)
        if (message) {
            return message
        }

        const invalidChar = /[^A-Za-zÀ-ÿ ]/.test(postalCode);
        if (!invalidChar) {
            return this.getText(this.validationsKey + 'noSpecialChars');
        }

        if (!/^\d+$/.test(postalCode)) {
            return this.getText(this.validationsKey + 'onlyNumbers');
        }

        return undefined
    }

    validateEmail(email: string) {
        const message = this.validateField(email)
        if (message) {
            return message
        }

        if (!validator.isEmail(email)) {
            return this.getText(this.validationsKey + 'email')
        }

        return undefined
    }

    validatePassword(password?: string) {

        if (!password || password.trim() === '') {
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

    validateBirthDate(date?: Date) {
        if (!date) {
            return this.getText(this.validationsKey + 'required')
        }

        const today = new Date()

        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();

        // Ajustar si aún no ha cumplido años este año
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        // 2. Verificar que tenga al menos 18 años
        if (age < 18) {
            return this.getText(this.validationsKey + 'birthDateAdult')
        }

        return undefined
    }

}
