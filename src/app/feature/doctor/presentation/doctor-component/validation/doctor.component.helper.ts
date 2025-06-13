import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { ClinicEntity } from '../../../../clinic/domain/entity/clinic.entity';

export class DoctorComponentHelper extends ValidatorHelper {

    private static instance: DoctorComponentHelper

    static getInstance(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ): DoctorComponentHelper {

        if (!DoctorComponentHelper.instance) {
            DoctorComponentHelper.instance = new DoctorComponentHelper(messageService, translateService, primeng)
        }

        return DoctorComponentHelper.instance
    }

    sendToastMessageSuccess(type: 'createDoctor' | 'updateDoctor' | 'deleteDoctor' | 'deleteDoctors', param: string) {
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

}
