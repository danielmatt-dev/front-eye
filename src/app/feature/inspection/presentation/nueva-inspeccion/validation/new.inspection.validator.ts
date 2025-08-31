import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { AiModelEntity } from '../../../../aimodel/domain/entity/aimodel.entity';
import { DiseaseEntity } from '../../../../disease/domain/entity/disease.entity';
import { PatientResponseModel } from '../../../../patient/data/models/patient.response.model';

export class NewInspectionValidator extends ValidatorHelper {

    validatePatientSelected(patient?: PatientResponseModel): string | undefined {
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
