import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { PatientResponseModel } from '../../../../patient/data/models/patient.response.model';
import { AiModelModel } from '../../../../aimodel/data/model/aimodel.model';
import { DiseaseModel } from '../../../../disease/data/model/disease.model';

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

    validateModelSelected(model?: AiModelModel): string | undefined {
        if (!model) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

    validateDiseaseSelected(disease?: DiseaseModel): string | undefined {
        if (!disease) {
            return this.getText(this.validationsKey + 'selectionPatientRequired')
        }

        return undefined
    }

}
