import { ValidatorHelper } from '../../../../../shared/utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

export class DashboardValidationHelper extends ValidatorHelper {

    private static instance: DashboardValidationHelper

    static getInstance(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ): DashboardValidationHelper {
        if (!DashboardValidationHelper.instance) {
            DashboardValidationHelper.instance = new DashboardValidationHelper(messageService, translateService, primeng)
        }

        return DashboardValidationHelper.instance
    }

}
