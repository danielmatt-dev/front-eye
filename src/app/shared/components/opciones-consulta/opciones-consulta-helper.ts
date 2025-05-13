import { ValidatorHelper } from '../../utils/validator.helper';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

export class OpcionesConsultaHelper extends ValidatorHelper {

    private static instance: OpcionesConsultaHelper

    static getInstance(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ): OpcionesConsultaHelper {

        if (!OpcionesConsultaHelper.instance) {
            OpcionesConsultaHelper.instance = new OpcionesConsultaHelper(messageService, translateService, primeng)
        }

        return OpcionesConsultaHelper.instance
    }

    constructor(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ) {
        super(messageService, translateService, primeng);
    }

    validarRangoSeleccionado(rango: string, fechas: Date[]) {

        if (rango === 'Personalizado' && fechas.length === 0) {
            this.showMessage({key: 'dateRangeNotSelected'})
            return false
        }

        return true
    }

}
