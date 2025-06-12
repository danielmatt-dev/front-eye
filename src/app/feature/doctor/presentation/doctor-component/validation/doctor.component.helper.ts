import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

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

}
