import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { PatientResponseEntity } from '../../../../patient/domain/entity/patient.response.entity';
import { AiModelEntity } from '../../../../aimodel/domain/entity/aimodel.entity';
import { DiseaseEntity } from '../../../../disease/domain/entity/disease.entity';

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

    validateModelSelected(model?: AiModelEntity): string | undefined {
        if (!model) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

    validateDiseaseSelected(disease?: DiseaseEntity): string | undefined {
        if (!disease) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

}
