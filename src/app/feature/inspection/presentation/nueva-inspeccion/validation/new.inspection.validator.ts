import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { PatientResponseEntity } from '../../../../patient/domain/entity/patient.response.entity';

export class NewInspectionValidator extends ValidatorHelper {

    private static instance: NewInspectionValidator

    static getInstance(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ): NewInspectionValidator {

        if (!NewInspectionValidator.instance) {
            NewInspectionValidator.instance = new NewInspectionValidator(messageService, translateService, primeng)
        }

        return NewInspectionValidator.instance
    }

    validatePatientSelected(patient?: PatientResponseEntity): string | undefined {
        if (!patient) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

    validateImageSelected(files: File[]) {
        if (files.length === 0) {
            return this.getText(this.validationsKey + 'selectionImageRequired')
        }

        return undefined
    }

}
