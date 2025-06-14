import { SendMessage } from '../toast/send.message';
import { LocaleTextProvider } from '../locale.text.provider';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import {
    BadCredencialsException,
    BadRequestException, ForbiddenException,
    InternalServerException, NetworkException,
    ResourceNotFoundException, TimeoutException
} from '../exceptions/exceptions';

export abstract class ValidatorHelper {
    protected sendMessage: SendMessage;
    protected localeTextProvider: LocaleTextProvider;
    protected validationsKey = 'validations.'

    protected constructor(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ) {
        this.sendMessage = SendMessage.getInstance(messageService);
        this.localeTextProvider = LocaleTextProvider.getInstance(translateService, primeng);
    }

    getText(key: string): string {
        return this.localeTextProvider.execute(key);
    }

    sendToastMessage({ title = 'Alerta', message, type = 'warn', life = 4000 }: { title?: string; message: string; type?: string; life?: number }) {
        this.sendMessage.execute({title: title, message: message, type: type, life: life})
    }

    showMessage({ key, type = 'warn', typeToast = 'toast', life = 4000 }:
                              { key: string, type?: string; typeToast?: string; life?: number }) {

        let titleMessage = ''
        let descriptionMessage = ''

        if (typeToast === 'toast') {
            titleMessage = this.getText(`toast.${type}.titles.${key}`)
            descriptionMessage = this.getText(`toast.${type}.messages.${key}`)
        }

        if (typeToast === 'ex') {
            titleMessage = this.getText(`exceptions.titles.${key}`)
            descriptionMessage = this.getText(`exceptions.messages.${key}`)
        }

        this.sendMessage.execute({ title: titleMessage, message: descriptionMessage, type: type, life: life });
    }

    getToastException(ex: Error) {

        let key = 'unknown'
        let type = 'error'

        if (ex instanceof NetworkException) {
            key = 'network'
        }

        if (ex instanceof BadCredencialsException) {
            key = 'badCredentials'
        }

        if (ex instanceof ResourceNotFoundException) {
            type = 'warn'
            key = 'resourceNotFound'
        }

        if (ex instanceof BadRequestException) {
            type = 'warn'
            key = 'badRequest'
        }

        if (ex instanceof InternalServerException) {
            key = 'internalServer'
        }

        if (ex instanceof TimeoutException) {
            key = 'timeout'
        }

        if (ex instanceof ForbiddenException) {
            key = 'forbidden'
        }

        this.showMessage({key: key, type: type, typeToast: 'ex'})
    }

    validateSelected(value?: string): string | undefined {

        if (!value || value.trim().length === 0) {
            return this.getText(this.validationsKey + 'selectionRequired')
        }

        return undefined
    }

    validateField(value?: string, maxLength: number = 100): string | undefined {

        if (!value || value.trim().length === 0) {
            return this.getText(this.validationsKey + 'required')
        }

        if (value.length > maxLength) {
            return this.getText(this.validationsKey + 'maxLength').replace('{1}', `${maxLength}}`)
        }

        return undefined
    }

}
